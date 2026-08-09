import { z } from "zod";

export const generatedInterviewQuestionSchema =
    z.object({
        question: z
            .string({
                error: (i) => i.input === undefined ? "Question text is required" : "Question text must be a string",
            })
            .min(10, { message: "Question text must be at least 10 characters long" })
            .max(2000, { message: "Question text cannot exceed 2000 characters" }),

        topic: z
            .string({
                error: (i) => i.input === undefined ? "Topic is required" : "Topic must be a string",
            })
            .min(1, { message: "Topic cannot be empty" })
            .max(100, { message: "Topic cannot exceed 100 characters" }),

        difficulty: z.enum([
            "easy",
            "medium",
            "hard",
        ], {
            error: (i) => i.input === undefined ? "Difficulty is required" : "Difficulty must be easy, medium, or hard"
        }),

        expectedCompetencies:
            z.array(
                z.string({
                    error: (i) => i.input === undefined ? "Competency is required" : "Each expected competency must be a string"
                }),
                {
                    error: (i) => i.input === undefined ? "Expected competencies are required" : "Expected competencies must be an array of strings"
                }
            )
            .min(1, { message: "At least one expected competency is required" })
            .max(10, { message: "Expected competencies cannot exceed 10 items" }),
});