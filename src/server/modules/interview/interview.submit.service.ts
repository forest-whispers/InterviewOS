import { prisma } from "@/server/config/db";

import { appendTurnEvaluation, getTurnEvaluations } from "./evaluation/interview.evaluation.redis";
import { getCandidateSnapshot, getInterviewState, updateInterviewState } from "./interview.redis";
import { SubmitAnswerDto } from "./interview.types";
import { appendTranscriptMessage, getTranscript } from "./transcript/interview.transcript";
import { BadRequestError, NotFoundError } from "@/server/shared/errors/errors";
import { buildInterviewContext } from "./evaluation/interview.evaluation.context";
import { evaluateInterviewTurn } from "./evaluation/interview.evaluation.ai";
import { advanceInterviewState, updateRuntimeObservations } from "./interview.runtime";

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

    console.log("interview:submit, interview turn evaluation: ", result);

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

    console.log("interview:submit, advanced interview state: ", nextState);

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