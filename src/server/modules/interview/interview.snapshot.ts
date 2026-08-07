import { CandidateProfile } from "@prisma/client";

import {
    CandidateSnapshot,
} from "./interview.types";

type BuildCandidateSnapshotInput = {
    candidate: CandidateProfile;
};

export function buildCandidateSnapshot({
    candidate,
}: BuildCandidateSnapshotInput): CandidateSnapshot {
    return {
        candidateId: candidate.id,

        targetRole:
            candidate.targetRole ?? "Software Engineer",

        experienceLevel:
            candidate.experienceLevel ?? "STUDENT",

        resumeSummary:
            candidate.resumeSummary ?? "",

        topSkills:
            (candidate.topSkills as string[]) ?? [],

        currentWeaknesses: [],

        currentStrengths: [],

        previousMistakes: [],

        communicationProfile: {
            clarity: 0,

            structure: 0,

            edgeCaseThinking: 0,
        },

        interviewObjective:
            "Evaluate technical knowledge and communication.",
    };
}