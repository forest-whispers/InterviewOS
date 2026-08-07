import {
    ExperienceLevel,
    Prisma,
} from "@prisma/client";
import { GeneratedInterviewQuestion } from "./interview.question.types";

export interface WeaknessSummary {
    topic: string;

    severity: "LOW" | "MEDIUM" | "HIGH";

    frequency: number;

    trend: "IMPROVING" | "STABLE" | "DECLINING";
}

export interface StrengthSummary {
    topic: string;

    confidence: number;
}

export interface CandidateMistakeSummary {
    topic: string;

    description: string;

    severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface CommunicationProfile {
    clarity: number;

    structure: number;

    edgeCaseThinking: number;
}

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

// export interface InterviewPlan {
//     role: string;

//     difficulty: "easy" | "medium" | "hard";

//     estimatedQuestions: number;

//     topics: string[];
// }

export type InterviewPlan = Prisma.JsonObject & {
    role: string;
    difficulty: "easy" | "medium" | "hard";
    estimatedQuestions: number;
    topics: string[];
};

export interface RuntimeMistake {
    topic: string;

    description: string;
}

export interface InterviewState {
    sessionId: string;

    interviewPlan: InterviewPlan;

    currentQuestion: GeneratedInterviewQuestion | null;

    questionNumber: number;

    currentTopic: string | null;

    difficulty: "easy" | "medium" | "hard";

    runtimeObservations: {
        repeatedMistakes: RuntimeMistake[];

        correctedMistakes: RuntimeMistake[];

        hintsGiven: number;

        topicsCovered: string[];

        skippedQuestions: number;
    };

    startedAt: string;

    expiresAt: string;
}

export interface SubmitAnswerDto {
    sessionId: string;

    answer: string;
}