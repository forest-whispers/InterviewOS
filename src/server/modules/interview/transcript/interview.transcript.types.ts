import { MessageEvaluationMetadata } from "../evaluation/interview.evaluation.types";

export type MessageMetadata = {
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