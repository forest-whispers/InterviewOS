export type NextQuestionType =
    | "FOLLOW_UP"
    | "NEW_QUESTION"
    | "CLARIFICATION"
    | "REDIRECT";

export interface GeneratedInterviewQuestion {
    questionType: NextQuestionType;
    
    question: string;

    topic: string;

    difficulty: "easy" | "medium" | "hard";

    expectedCompetencies: string[];
}