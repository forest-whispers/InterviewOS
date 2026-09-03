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
    InterviewPlan,
    InterviewState,
} from "./interview.types";

import { INTERVIEW_CONSTANTS } from "./interview.constants";
import { Prisma } from "@prisma/client";
import { appendTranscriptMessage, appendTranscriptMessages, clearTranscript, } from "./transcript/interview.transcript";
import { TurnEvaluation } from "./evaluation/interview.evaluation.types";
import { appendTurnEvaluation, appendTurnEvaluations, clearTurnEvaluations } from "./evaluation/interview.evaluation.redis";
import { TranscriptMessage } from "./transcript/interview.transcript.types";

interface CreateInterviewInput {
    userId: string;

    interviewObjective: string;

    topics?: string[];
}

function buildInterviewState(
    sessionId: string,
    interviewPlan: InterviewPlan
): InterviewState {
    const startedAt = new Date();

    const expiresAt = new Date(
        startedAt.getTime() +
        INTERVIEW_CONSTANTS.SESSION_TTL_SECONDS *
        1000
    );

    return {
        sessionId,

        interviewPlan: interviewPlan,

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
    topics
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
        await buildCandidateSnapshot(
            candidate.id,
            interviewObjective
        );

    console.log("interview:create, candidate snapshot: ", snapshot);

    const interviewPlan =
        buildInterviewPlan(snapshot, topics);

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
            interviewPlan
        );

    console.log("interview:create, interview state: ", state);

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

    const session =
        await prisma.interviewSession.findUnique({
            where: {
                id: sessionId,
            },
        });

    if (!session) {
        throw new NotFoundError(
            "Interview session not found."
        );
    }

    /*
    * --------------------------------------------------
    * NEW INTERVIEW
    * --------------------------------------------------
    */

    if (session.status === "CREATED") {

        let [
            snapshot,
            state,
        ] = await Promise.all([
            getCandidateSnapshot(
                sessionId
            ),

            getInterviewState(
                sessionId
            ),
        ]);

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

        const generatedQuestion =
            await generateOpeningQuestion(
                snapshot,
                state.interviewPlan
            );

        const startedAt =
            new Date();

        const expiresAt =
            new Date(
                startedAt.getTime() +
                INTERVIEW_CONSTANTS
                    .SESSION_TTL_SECONDS *
                1000
            );

        await prisma.interviewSession.update({
            where: {
                id: sessionId,
            },

            data: {
                status: "IN_PROGRESS",

                startedAt,
            },
        });

        await appendTranscriptMessage({
            sessionId,

            role: "assistant",

            content:
                generatedQuestion.question,

            metadata: {
                questionType: generatedQuestion.questionType || "NEW_QUESTION",

                topic:
                    generatedQuestion.topic,

                difficulty:
                    generatedQuestion.difficulty,

                expectedCompetencies:
                    generatedQuestion.expectedCompetencies,
            },
        });

        state = {
            ...state,

            currentQuestion:
                generatedQuestion,

            questionNumber: 1,

            currentTopic:
                generatedQuestion.topic,

            difficulty:
                generatedQuestion.difficulty,

            startedAt:
                startedAt.toISOString(),

            expiresAt:
                expiresAt.toISOString(),
        };

        await updateInterviewState(
            state
        );

        return {
            sessionId,

            messages: [],

            currentQuestion: {
                question:
                    generatedQuestion.question,

                topic:
                    generatedQuestion.topic,

                difficulty:
                    generatedQuestion.difficulty,
            },
        };
    }

    /*
    * --------------------------------------------------
    * RESUME ABANDONED INTERVIEW
    * --------------------------------------------------
    */

    if (session.status === "ABANDONED") {

        const runtimeState =
            await prisma.interviewRuntimeState.findUnique({
                where: {
                    interviewSessionId:
                        sessionId,
                },
            });

        if (!runtimeState) {
            throw new BadRequestError(
                "This interview can no longer be resumed."
            );
        }

    /*
     * Restore the candidate snapshot because it was
     * intentionally removed from Redis when the
     * interview was abandoned.
     */

        let snapshot =
            await getCandidateSnapshot(
                sessionId
            );

        if (!snapshot) {
            snapshot =
                await buildCandidateSnapshot(
                    session.candidateId,

                    (
                        session.interviewPlan as {
                            objective?: string;
                        }
                    )?.objective ?? ""
                );

            await storeCandidateSnapshot(
                sessionId,
                snapshot
            );
        }

        /*
        * Restore the InterviewState from the
        * PostgreSQL checkpoint.
        */
        const metadata =
            runtimeState.metadata as unknown as {
                interviewPlan:
                InterviewState["interviewPlan"];

                currentQuestion:
                InterviewState["currentQuestion"];

                questionNumber:
                InterviewState["questionNumber"];

                currentTopic:
                InterviewState["currentTopic"];

                difficulty:
                InterviewState["difficulty"];

                runtimeObservations:
                InterviewState["runtimeObservations"];

                turnEvaluations:
                TurnEvaluation[];
            };

        if (!metadata.currentQuestion) {
            throw new BadRequestError(
                "Interview runtime state is invalid."
            );
        }

        const resumedAt =
            new Date();

        const expiresAt =
            new Date(
                resumedAt.getTime() +
                INTERVIEW_CONSTANTS
                    .SESSION_TTL_SECONDS *
                1000
            );

        const restoredState:
            InterviewState = {
            sessionId,

            interviewPlan:
                metadata.interviewPlan,

            currentQuestion:
                metadata.currentQuestion,

            questionNumber:
                metadata.questionNumber,

            currentTopic:
                metadata.currentTopic,

            difficulty:
                metadata.difficulty,

            runtimeObservations:
                metadata.runtimeObservations,

            startedAt:
                resumedAt.toISOString(),

            expiresAt:
                expiresAt.toISOString(),
        };

        /*
         * PostgreSQL already contains the complete
         * transcript from the abandonment.
         *
         * Keep the original message IDs when putting
         * those messages back into Redis.
         */
        const persistedMessages =
            await prisma.interviewMessage.findMany({
                where: {
                    interviewSessionId:
                        sessionId,
                },

                orderBy: {
                    createdAt: "asc",
                },
            });

        /*
         * The abandoned flow cleared Redis, but clearing
         * here as well makes resume idempotent if stale
         * Redis data happens to exist.
         */
        await clearTranscript(
            sessionId
        );

        // await Promise.all(
        //     persistedMessages.map(
        //         (message) =>
        //             appendTranscriptMessage({
        //                 sessionId,

        //                 id: message.id,

        //                 role:
        //                     message.role.toLowerCase() as
        //                     "assistant" | "user",

        //                 content:
        //                     message.content,

        //                 metadata:
        //                     message.metadata
        //                         ? message.metadata as any
        //                         : undefined,

        //                 createdAt:
        //                     message.createdAt.toISOString(),
        //             })
        //     )
        // );

        const restoredMessages: TranscriptMessage[] =
            persistedMessages.map(
                (message) => ({
                    id: message.id,

                    role:
                        message.role.toLowerCase() as
                        "assistant" | "user",

                    content:
                        message.content,

                    metadata:
                        message.metadata
                            ? message.metadata as any
                            : undefined,

                    createdAt:
                        message.createdAt.toISOString(),
                })
            );

        await appendTranscriptMessages(
            sessionId,
            restoredMessages
            );

        /*
         * Put the reconstructed active state back into Redis.
         */
        await updateInterviewState(
            restoredState
        );

        /*
        * The abandoned flow cleared Redis, but clearing
        * here as well makes resume idempotent if stale
        * Redis data happens to exist.
        */
        await clearTurnEvaluations(
            sessionId
        );

        // await Promise.all(
        //     (metadata.turnEvaluations ?? []).map(
        //         (evaluation) =>
        //             appendTurnEvaluation(
        //                 sessionId,
        //                 evaluation
        //             )
        //     )
        // );

        await appendTurnEvaluations(
            sessionId,
            metadata.turnEvaluations ?? []
        );

        /*
         * The PostgreSQL checkpoint has served its
         * purpose. Once the active state and transcript
         * are restored, the interview can continue
         * normally through /answer.
         */

        await prisma.$transaction(
            async (tx) => {

                await tx.interviewSession.update({
                    where: {
                        id: sessionId,
                    },

                    data: {
                        status:
                            "IN_PROGRESS",

                        startedAt:
                            resumedAt,

                        abandonedAt:
                            null,
                    },
                });

                await tx.interviewRuntimeState.delete({
                    where: {
                        interviewSessionId:
                            sessionId,
                    },
                });
            }
        );

        return {
            sessionId,

            messages:
                persistedMessages.map(
                    (message) => ({
                        id:
                            message.id,

                        role:
                            message.role
                                .toLowerCase() as
                            "assistant" | "user",

                        content:
                            message.content,

                        metadata:
                            message.metadata
                                ? message.metadata as any
                                : undefined,

                        createdAt:
                            message.createdAt
                                .toISOString(),
                    })
                ),

            currentQuestion: {
                question:
                    restoredState
                        .currentQuestion!
                        .question,

                topic:
                    restoredState
                        .currentQuestion!
                        .topic,

                difficulty:
                    restoredState
                        .currentQuestion!
                        .difficulty,
            },
        };
    }

    /*
     * --------------------------------------------------
     * COMPLETED / IN_PROGRESS / ANY OTHER STATUS
     * --------------------------------------------------
     */

    throw new BadRequestError(
        "Interview cannot be started."
    );
}