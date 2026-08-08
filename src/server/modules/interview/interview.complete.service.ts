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
    getInterviewState,
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
import { updateCandidateState } from "../candidate/candidate.state.service";
import { buildRuntimeSummary } from "./interview.runtime";

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
        interviewState,
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

        getInterviewState(sessionId),
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

    let interviewMetadata = 
        session.metadata &&
        typeof session.metadata === "object" &&
        !Array.isArray(session.metadata)
        ? session.metadata
        : {};

    const runtimeSummary =
        buildRuntimeSummary(
            interviewState
        );

    interviewMetadata = {
        ...interviewMetadata,

        runtimeSummary: runtimeSummary as unknown as Prisma.JsonValue
    };

    const artifact =
        await generateFinalEvaluation({
            snapshot,

            turnEvaluations,

            interviewMetadata
        });

    console.log("interview:complete, interview final evaluation artifact: ", artifact);

    const [
        _transcriptResult,
        persistedEvaluation,
        sessionResult,
    ] = await prisma.$transaction([
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
                status: "COMPLETED",

                completedAt:
                    new Date(),

                metadata:
                    interviewMetadata as unknown as Prisma.InputJsonValue,
            },
        }),
    ]);

    console.log("interview:complete, sessionResults with interview metadata ", sessionResult);

    await updateCandidateState({
        candidateProfileId:
            session.candidateId,

        evaluationId:
            persistedEvaluation.id,

        interviewId:
            sessionId,

        evaluation: artifact,
    });

    await prisma.candidateProfile.update({
        where: {
            id: session.candidateId,
        },

        data: {
            readinessScore:
                artifact.overallScore,

            interviewsTaken: {
                increment: 1,
            },
        },
    });

    await Promise.all([
        clearTranscript(sessionId),

        clearTurnEvaluations(sessionId),

        clearCandidateSnapshot(sessionId),

        clearInterviewState(sessionId),
    ]);

    return artifact;
}