import type {
    GeneratedInterviewQuestion,
} from "./interview.question.types";
import { CandidateSnapshot, InterviewState } from "./interview.types";
import { TranscriptMessage } from "./interview.transcript.types";

export interface RuntimeMistake {
    topic: string;

    description: string;

    severity: "LOW" | "MEDIUM" | "HIGH";
}

export interface TurnEvaluation {
    questionNumber: number;

    topic: string;

    score: number;

    correctness: number;

    strengths: string[];

    mistakes: RuntimeMistake[];

    communication: {
        clarity: number;

        structure: number;
    };

    followUpRequired: boolean;

    difficultyAdjustment:
    | "increase"
    | "decrease"
    | "same";

    interviewerReasoning: string;
}

export interface InterviewContext {
    candidate: CandidateSnapshot;

    interview: {
        objective: string;

        currentQuestion: GeneratedInterviewQuestion;

        questionNumber: number;

        runtimeObservations: InterviewState["runtimeObservations"];
    };

    history: {
        recentMessages: TranscriptMessage[];

        recentEvaluations: TurnEvaluation[];
    };
}

export interface EvaluateInterviewTurnInput {
    context: InterviewContext;

    currentAnswer: string;
}

export interface InterviewTurnResult {
    evaluation: TurnEvaluation;

    nextQuestion: GeneratedInterviewQuestion;
}