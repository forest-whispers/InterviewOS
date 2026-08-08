import { prisma } from "@/server/config/db";

import {
    CandidateSnapshot,
} from "./interview.types";
import { BadRequestError, NotFoundError } from "@/server/shared/errors/errors";
import { getCandidateState } from "../candidate/candidate.state.service";

export async function buildCandidateSnapshot(
    candidateProfileId: string,
    interviewObjective: string
): Promise<CandidateSnapshot> {

    const candidateProfile =
        await prisma.candidateProfile.findUnique({
            where: {
                id: candidateProfileId,
            },
            include: {
                currentResume: true,
            },
        });

    if (!candidateProfile) {
        throw new NotFoundError(
            "Candidate profile not found."
        );
    }

    if (
        !candidateProfile.targetRole ||
        !candidateProfile.experienceLevel
    ) {
        throw new BadRequestError(
            "Candidate profile is incomplete."
        );
    }

    const candidateState =
        await getCandidateState(
            candidateProfileId
        );

    return {
        candidateId:
            candidateProfile.id,

        targetRole:
            candidateProfile.targetRole,

        experienceLevel:
            candidateProfile.experienceLevel,

        resumeSummary:
            candidateProfile.resumeSummary ?? "",

        topSkills:
            Array.isArray(
                candidateProfile.topSkills
            )
                ? candidateProfile.topSkills as string[]
                : [],

        currentWeaknesses:
            candidateState?.currentWeaknesses ?? [],

        currentStrengths:
            candidateState?.currentStrengths ?? [],

        previousMistakes:
            candidateState?.previousMistakes ?? [],

        communicationProfile:
            candidateState?.communication ?? {
                clarity: 0,
                structure: 0,
                conciseness: 0,
                trend: "STABLE",
            },

        interviewObjective,
    };
}