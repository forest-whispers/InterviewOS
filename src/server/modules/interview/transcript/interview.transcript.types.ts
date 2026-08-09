import { MessageEvaluationMetadata } from "../evaluation/interview.evaluation.types";
import { NextQuestionType } from "../question/interview.question.types";

export type MessageMetadata = {
    questionType?: NextQuestionType;
    topic?: string;
    difficulty?: "easy" | "medium" | "hard";
    expectedCompetencies?: string[];
} & Partial<MessageEvaluationMetadata>;

export interface TranscriptMessage {
    id: string;

    role: "assistant" | "user";

    content: string;

    metadata?: MessageMetadata;

    createdAt: string;
}