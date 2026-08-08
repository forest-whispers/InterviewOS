import { Strength } from "../interview/finalArtifact/interview.final.types";

export type Trend =
    | "IMPROVING"
    | "STABLE"
    | "DECLINING";

export type SkillState = {
    score: number;

    trend: Trend;

    observationCount: number;

    lastEvaluatedAt: string;

    evidence: string[];
};

export type WeaknessSummary = {
    topic: string;

    frequency: number;

    severity: "LOW" | "MEDIUM" | "HIGH";

    trend: Trend;

    firstSeenAt: string;

    lastSeenAt: string;
};

export type StrengthSummary = Strength;

export type CandidateMistakeSummary = {
    topic: string;

    description: string;

    severity: "LOW" | "MEDIUM" | "HIGH";

    interviewId: string;

    corrected: boolean;

    occurredAt: string;
};

export type CommunicationProfile = {
    clarity: number;

    structure: number;

    conciseness: number;

    trend: Trend;
};