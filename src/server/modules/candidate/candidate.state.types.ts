import type {
    CandidateMistakeSummary,
    CommunicationProfile,
    SkillState,
    StrengthSummary,
    WeaknessSummary,
} from "./candidate.types";

export interface CandidateState {
    technical: Record<
        string,
        SkillState
    >;

    communication: CommunicationProfile;

    currentWeaknesses:
    WeaknessSummary[];

    currentStrengths:
    StrengthSummary[];

    previousMistakes:
    CandidateMistakeSummary[];
}