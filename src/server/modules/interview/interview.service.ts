import { prisma } from "@/server/config/db";

import {
    NotFoundError,
    BadRequestError,
} from "@/server/shared/errors/errors";

import { buildCandidateSnapshot } from "./interview.snapshot";
import { buildInterviewPlan } from "./interview.plan";
import { generateOpeningQuestion } from "./question/interview.question.ai";

import {
    createInterviewState,
    storeCandidateSnapshot,
    getCandidateSnapshot,
    getInterviewState,
    updateInterviewState,
} from "./interview.redis";

import {
    CandidateSnapshot,
    InterviewState,
    SubmitAnswerDto,
} from "./interview.types";

import { INTERVIEW_CONSTANTS } from "./interview.constants";
import { Prisma } from "@prisma/client";
import { appendTranscriptMessage, getTranscript } from "./transcript/interview.transcript";
import { buildInterviewContext } from "./evaluation/interview.evaluation.context";
import { evaluateInterviewTurn } from "./evaluation/interview.evaluation.ai";
import { appendTurnEvaluation, getTurnEvaluations } from "./evaluation/interview.evaluation.redis";
import { advanceInterviewState, updateRuntimeObservations } from "./interview.runtime";

interface CreateInterviewInput {
    userId: string;

    interviewObjective: string;
}

function buildInterviewState(
    sessionId: string,
    snapshot: CandidateSnapshot
): InterviewState {
    const startedAt = new Date();

    const expiresAt = new Date(
        startedAt.getTime() +
        INTERVIEW_CONSTANTS.SESSION_TTL_SECONDS *
        1000
    );

    return {
        sessionId,

        interviewPlan:
            buildInterviewPlan(snapshot),

        currentQuestion: null,

        questionNumber: 0,

        currentTopic: null,

        difficulty:
            INTERVIEW_CONSTANTS.DEFAULT_DIFFICULTY,

        runtimeObservations: {
            repeatedMistakes: [],

            correctedMistakes: [],

            hintsGiven: 0,

            topicsCovered: [],

            skippedQuestions: 0,
        },

        startedAt:
            startedAt.toISOString(),

        expiresAt:
            expiresAt.toISOString(),
    };
}

export async function createInterview({
    userId,
    interviewObjective,
}: CreateInterviewInput) {
    const candidate =
        await prisma.candidateProfile.findUnique({
            where: {
                userId,
            },

            include: {
                currentResume: true,
            },
        });

    if (!candidate) {
        throw new NotFoundError(
            "Candidate profile not found."
        );
    }

    if (!candidate.currentResume) {
        throw new BadRequestError(
            "Candidate must upload a resume before starting an interview."
        );
    }

    const snapshot =
        buildCandidateSnapshot({
            candidate,
        });

    snapshot.interviewObjective =
        interviewObjective;

    const interviewPlan =
        buildInterviewPlan(snapshot);

    const session =
        await prisma.interviewSession.create({
            data: {
                candidateId: candidate.id,

                resumeId:
                    candidate.currentResume.id,

                status: "CREATED",

                interviewPlan: interviewPlan,

                metadata:
                    Prisma.JsonNull,
            },
        });

    const state =
        buildInterviewState(
            session.id,
            snapshot
        );

    await Promise.all([
        storeCandidateSnapshot(
            session.id,
            snapshot
        ),

        createInterviewState(
            state
        ),
    ]);

    return {
        sessionId: session.id,

        interviewPlan,

        status: session.status,
    };
}

interface StartInterviewInput {
    sessionId: string;
}

export async function startInterview({
    sessionId,
}: StartInterviewInput) {
    const [snapshot, state, session] =
        await Promise.all([
            getCandidateSnapshot(sessionId),

            getInterviewState(sessionId),

            prisma.interviewSession.findUnique({
                where: {
                    id: sessionId,
                },
            }),
        ]);

    if (!session) {
        throw new NotFoundError(
            "Interview session not found."
        );
    }

    if (!snapshot) {
        throw new BadRequestError(
            "Candidate snapshot not found."
        );
    }

    if (!state) {
        throw new BadRequestError(
            "Interview state not found."
        );
    }

    if (session.status !== "CREATED") {
        throw new BadRequestError(
            "Interview has already been started."
        );
    }

    const generatedQuestion =
        await generateOpeningQuestion(
            snapshot,
            state.interviewPlan
        );

    await prisma.interviewSession.update({
        where: {
            id: sessionId,
        },
        data: {
            status: "IN_PROGRESS",
            startedAt: new Date(),
        },
    });

    await appendTranscriptMessage({
        sessionId,

        role: "assistant",

        content: generatedQuestion.question,

        metadata: {
            topic: generatedQuestion.topic,

            difficulty: generatedQuestion.difficulty,

            expectedCompetencies:
                generatedQuestion.expectedCompetencies,
        },
    });

    state.currentQuestion =
        generatedQuestion;

    state.questionNumber = 1;

    state.currentTopic =
        generatedQuestion.topic;

    state.difficulty =
        generatedQuestion.difficulty;

    await updateInterviewState(state);

    return {
        sessionId,

        question:
            generatedQuestion.question,

        topic:
            generatedQuestion.topic,

        difficulty:
            generatedQuestion.difficulty,
    };
}

export async function submitAnswer({
    sessionId,
    answer,
}: SubmitAnswerDto) {

    const [
        snapshot,
        interviewState,
        transcript,
        evaluations,
        session,
    ] = await Promise.all([
        getCandidateSnapshot(sessionId),

        getInterviewState(sessionId),

        getTranscript(sessionId),

        getTurnEvaluations(sessionId),

        prisma.interviewSession.findUnique({
            where: {
                id: sessionId,
            },
        }),
    ]);

    if (!session) {
        throw new NotFoundError(
            "Interview session not found."
        );
    }

    if (session.status !== "IN_PROGRESS") {
        throw new BadRequestError(
            "Interview is not active."
        );
    }

    if (!snapshot) {
        throw new BadRequestError(
            "Candidate snapshot missing."
        );
    }

    if (!interviewState) {
        throw new BadRequestError(
            "Interview state missing."
        );
    }

    const userMessage = await appendTranscriptMessage({
        sessionId,

        role: "user",

        content: answer,
    });

    const latestTranscript = [
        ...transcript,
        userMessage,
    ];
    
    const context =
        buildInterviewContext({
            snapshot,

            interviewState,

            transcript:
                latestTranscript,

            evaluations,
        });

    const result =
        await evaluateInterviewTurn({
            context,

            currentAnswer:
                answer,
        });

    await appendTurnEvaluation(
        sessionId,
        result.evaluation
    );

    let nextState =
        updateRuntimeObservations(
            interviewState,
            result.evaluation
        );

    nextState =
        advanceInterviewState(
            nextState,
            result.nextQuestion
        );

    await updateInterviewState(
        nextState
    );

    await appendTranscriptMessage({
        sessionId,

        role: "assistant",

        content:
            result.nextQuestion.question,

        metadata: {
            topic:
                result.nextQuestion.topic,

            difficulty:
                result.nextQuestion.difficulty,

            expectedCompetencies:
                result.nextQuestion
                    .expectedCompetencies,
        },
    });

    return {
        evaluation:
            result.evaluation,

        nextQuestion:
            result.nextQuestion.question,

        topic:
            result.nextQuestion.topic,

        difficulty:
            result.nextQuestion
                .difficulty,
    };
}