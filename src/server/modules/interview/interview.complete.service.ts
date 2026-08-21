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
    storeCandidateSnapshot,
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
import { buildCandidateSnapshot } from "./interview.snapshot";

interface CompleteInterviewInput {
    sessionId: string;
}

export async function completeInterview({
    sessionId,
}: CompleteInterviewInput) {

    let [
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

    if (!interviewState) {
        throw new BadRequestError(
            "Interview state missing."
        );
    }

    if (!snapshot) {
        // Reconstruct dynamically from SQL DB 
        snapshot = await buildCandidateSnapshot(
            session.candidateId,
            (session.interviewPlan as any)?.objective ?? ""
        );
        // Re-cache it to avoid repeating this check
        await storeCandidateSnapshot(sessionId, snapshot);
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

    const { sessionResult } =
        await prisma.$transaction(
            async (tx) => {

                await tx.interviewMessage.createMany({
                    data: transcriptData,
                    
                    skipDuplicates: true,
                });

                const evaluation =
                    await tx.interviewEvaluation.create({
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
                    });

                const sessionResult =
                    await tx.interviewSession.update({
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
                    });

                await updateCandidateState({
                    tx,
                    candidateProfileId:
                        session.candidateId,

                    evaluationId:
                        evaluation.id,

                    interviewId:
                        sessionId,

                    evaluation:
                        artifact,
                }
                );

                await tx.candidateProfile.update({
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

                return {
                    sessionResult
                };
            }
        );

    console.log("interview:complete, sessionResults with interview metadata ", sessionResult);

    await Promise.all([
        clearTranscript(sessionId),

        clearTurnEvaluations(sessionId),

        clearCandidateSnapshot(sessionId),

        clearInterviewState(sessionId),
    ]);

    return artifact;
}