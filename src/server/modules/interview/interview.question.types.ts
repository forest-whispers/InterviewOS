export interface GeneratedInterviewQuestion {
    question: string;

    topic: string;

    difficulty: "easy" | "medium" | "hard";

    expectedCompetencies: string[];
}