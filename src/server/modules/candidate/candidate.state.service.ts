import { prisma } from "@/server/config/db";

import {
    NotFoundError,
} from "@/server/shared/errors/errors";

import {
    candidateStateSchema,
} from "./candidate.state.validation";

import {
    aggregateCandidateState,
} from "./candidate.state.aggregator";

import type {
    CandidateState,
} from "./candidate.state.types";

import type {
    EvaluationArtifact
} from "../interview/finalArtifact/interview.final.types";

export async function getCandidateState(
    candidateProfileId: string
): Promise<CandidateState | null> {
    const candidateState =
        await prisma.candidateState.findUnique({
            where: {
                candidateProfileId,
            },
        });

    if (!candidateState) {
        return null;
    }

    return candidateStateSchema.parse(
        candidateState.state
    );
}

export async function updateCandidateState({
    candidateProfileId,
    evaluationId,
    interviewId,
    evaluation,
}: {
    candidateProfileId: string;

    evaluationId: string;

    interviewId: string;

    evaluation: EvaluationArtifact;
}): Promise<CandidateState> {
    const candidateProfile =
        await prisma.candidateProfile.findUnique({
            where: {
                id: candidateProfileId,
            },
        });

    if (!candidateProfile) {
        throw new NotFoundError(
            "Candidate profile not found."
        );
    }

    const existingState =
        await getCandidateState(
            candidateProfileId
        );

    const nextState =
        aggregateCandidateState(
            existingState,
            evaluation,
            evaluationId,
            interviewId
        );

    const validatedState =
        candidateStateSchema.parse(
            nextState
        );

    await prisma.candidateState.upsert({
        where: {
            candidateProfileId,
        },

        create: {
            candidateProfileId,

            state: validatedState,
        },

        update: {
            state: validatedState,
        },
    });

    return validatedState;
}