import { Prisma } from "@prisma/client";

import { prisma } from "@/server/config/db";

import {
    BadRequestError,
    NotFoundError,
} from "@/server/shared/errors/errors";

import {
    getInterviewState,
    clearInterviewState,
    clearCandidateSnapshot
} from "./interview.redis";

import {
    getTranscriptPersistenceData,
    clearTranscript,
} from "./transcript/interview.transcript";

import {
    clearTurnEvaluations,
} from "./evaluation/interview.evaluation.redis";

import { INTERVIEW_CONSTANTS } from "./interview.constants";

interface AbandonInterviewInput {
    sessionId: string;
}

export async function abandonInterview({
    sessionId,
}: AbandonInterviewInput) {

    const [
        session,
        interviewState,
        transcriptData,
    ] = await Promise.all([
        prisma.interviewSession.findUnique({
            where: {
                id: sessionId,
            },
        }),

        getInterviewState(
            sessionId
        ),

        getTranscriptPersistenceData(
            sessionId
        ),
    ]);

    if (!session) {
        throw new NotFoundError(
            "Interview session not found."
        );
    }

    console.dir(session.metadata, { depth: null, colors: true });

    if (session.status !== "IN_PROGRESS") {
        throw new BadRequestError(
            "Interview is not active."
        );
    }

    if (!interviewState) {
        throw new BadRequestError(
            "Interview state missing."
        );
    }

    /*
     * InterviewState.expiresAt represents the active
     * interview session expiry.
     *
     * InterviewRuntimeState.expiresAt represents how long
     * an abandoned interview remains resumable.
     *
     * These are intentionally different lifetimes.
     */

    const runtimeStateExpiresAt =
        new Date(
            Date.now() +
            INTERVIEW_CONSTANTS.ABANDONED_STATE_TTL_SECONDS *
            1000
        );

    const runtimeStateMetadata = {
        interviewPlan:
            interviewState.interviewPlan,

        currentQuestion:
            interviewState.currentQuestion,

        questionNumber:
            interviewState.questionNumber,

        currentTopic:
            interviewState.currentTopic,

        difficulty:
            interviewState.difficulty,

        runtimeObservations:
            interviewState.runtimeObservations,
    };

    const toPrismaJson = (
        value: unknown
    ): Prisma.InputJsonValue => {
        return value as Prisma.InputJsonValue;
    };

    const runtimeStateData = {
        interviewSessionId:
            sessionId,

        startedAt:
            new Date(
                interviewState.startedAt
            ),

        expiresAt:
            runtimeStateExpiresAt,

        metadata:
            toPrismaJson(runtimeStateMetadata),
    };

    await prisma.$transaction(
        async (tx) => {

            /*
             * Redis contains the complete transcript.
             *
             * Some messages may already exist in PostgreSQL
             * because this interview could have previously
             * been resumed and abandoned again.
             *
             * Message IDs are stable, therefore duplicate
             * messages can safely be skipped.
             */
            await tx.interviewMessage.createMany({
                data: transcriptData,

                skipDuplicates: true,
            });

            /*
             * Persist the runtime checkpoint required for
             * resuming this interview later.
             */
            await tx.interviewRuntimeState.upsert({
                where: {
                    interviewSessionId:
                        sessionId,
                },

                create:
                    runtimeStateData,

                update: {
                    startedAt:
                        runtimeStateData.startedAt,

                    expiresAt:
                        runtimeStateData.expiresAt,

                    metadata:
                        runtimeStateData.metadata,
                },
            });

            /*
             * The interview is now abandoned and can no
             * longer be treated as an active interview.
             */
            await tx.interviewSession.update({
                where: {
                    id: sessionId,
                },

                data: {
                    status: "ABANDONED",
                },
            });
        }
    );

    console.log("interview:abandoned");

    /*
     * Only clear Redis after the PostgreSQL transaction
     * succeeds.
     *
     * PostgreSQL now contains everything required to
     * resume the interview.
     */
    await Promise.all([
        clearTranscript(
            sessionId
        ),

        clearTurnEvaluations(
            sessionId
        ),

        clearCandidateSnapshot(
            sessionId
        ),

        clearInterviewState(
            sessionId
        ),
    ]);

    return {
        message:
            "Interview abandoned successfully.",
    };
}