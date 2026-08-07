import { Prisma } from "@prisma/client";

import { prisma } from "@/server/config/db";

import {
    NotFoundError,
    BadRequestError,
} from "@/server/shared/errors/errors";

import {
    clearCandidateSnapshot,
    clearInterviewState,
    getCandidateSnapshot,
} from "./interview.redis";

import {
    getTurnEvaluations,
    clearTurnEvaluations,
} from "./evaluation/interview.evaluation.redis";

import {
    generateFinalEvaluation,
} from "./finalArtifact/interview.final.ai";

import {
    getTranscriptPersistenceData,
    clearTranscript,
} from "./transcript/interview.transcript";

interface CompleteInterviewInput {
    sessionId: string;
}

export async function completeInterview({
    sessionId,
}: CompleteInterviewInput) {

    const [
        session,
        snapshot,
        turnEvaluations,
        transcriptData,
    ] = await Promise.all([
        prisma.interviewSession.findUnique({
            where: {
                id: sessionId,
            },
        }),

        getCandidateSnapshot(sessionId),

        getTurnEvaluations(sessionId),

        getTranscriptPersistenceData(
            sessionId
        ),
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

    const interviewMetadata = session.metadata ?(session.metadata) : undefined

    const artifact =
        await generateFinalEvaluation({
            snapshot,

            turnEvaluations,

            interviewMetadata
        });

    await prisma.$transaction([
        prisma.interviewMessage.createMany({
            data: transcriptData,
        }),

        prisma.interviewEvaluation.create({
            data: {
                interviewSessionId:
                    sessionId,

                overallScore:
                    artifact.overallScore,

                technicalScore:
                    artifact.technicalScore,

                communicationScore:
                    artifact.communicationScore,

                artifact:
                    artifact as unknown as Prisma.InputJsonValue,
            },
        }),

        prisma.interviewSession.update({
            where: {
                id: sessionId,
            },

            data: {
                status:
                    "COMPLETED",

                completedAt:
                    new Date(),
            },
        }),
    ]);

    await Promise.all([
        clearTranscript(sessionId),

        clearTurnEvaluations(sessionId),

        clearCandidateSnapshot(sessionId),

        clearInterviewState(sessionId),
    ]);

    return artifact;
}