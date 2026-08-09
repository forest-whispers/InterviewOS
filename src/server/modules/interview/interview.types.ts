import {
    ExperienceLevel,
    Prisma,
} from "@prisma/client";
import { GeneratedInterviewQuestion } from "./question/interview.question.types";
import { CandidateMistakeSummary, CommunicationProfile, StrengthSummary, WeaknessSummary } from "../candidate/candidate.types";
import { RuntimeMistake } from "./evaluation/interview.evaluation.types";

// export interface WeaknessSummary {
//     topic: string;

//     severity: "LOW" | "MEDIUM" | "HIGH";

//     frequency: number;

//     trend: "IMPROVING" | "STABLE" | "DECLINING";
// }

// export interface StrengthSummary {
//     topic: string;

//     confidence: number;
// }

// export interface CandidateMistakeSummary {
//     topic: string;

//     description: string;

//     severity: "LOW" | "MEDIUM" | "HIGH";

//     corrected: boolean;
// }

export interface CandidateSnapshot {
    candidateId: string;

    targetRole: string;

    experienceLevel: ExperienceLevel;

    resumeSummary: string;

    topSkills: string[];

    currentWeaknesses: WeaknessSummary[];

    currentStrengths: StrengthSummary[];

    previousMistakes: CandidateMistakeSummary[];

    communicationProfile: CommunicationProfile;

    interviewObjective: string;
}

export type InterviewPlan = Prisma.JsonObject & {
    role: string;
    difficulty: "easy" | "medium" | "hard";
    estimatedQuestions: number;
    topics: string[];
};

export interface InterviewRuntimeSummary {
    hintsGiven: number;

    skippedQuestions: number;

    topicsCovered: string[];

    repeatedMistakes: RuntimeMistake[];

    correctedMistakes: RuntimeMistake[];
}

export interface InterviewState {
    sessionId: string;

    interviewPlan: InterviewPlan;

    currentQuestion: GeneratedInterviewQuestion | null;

    questionNumber: number;

    currentTopic: string | null;

    difficulty: "easy" | "medium" | "hard";

    runtimeObservations: InterviewRuntimeSummary;

    startedAt: string;

    expiresAt: string;
}

export interface SubmitAnswerDto {
    sessionId: string;

    answer: string;
}