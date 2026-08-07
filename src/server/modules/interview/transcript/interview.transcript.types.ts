export interface TranscriptMessage {
    id: string;

    role: "assistant" | "user";

    content: string;

    metadata?: {
        topic?: string;

        difficulty?: "easy" | "medium" | "hard";

        expectedCompetencies?: string[];
    };

    createdAt: string;
}