import { z } from "zod";

export const generatedInterviewQuestionSchema =
    z.object({
        question: z
            .string()
            .min(10)
            .max(2000),

        topic: z
            .string()
            .min(1)
            .max(100),

        difficulty: z.enum([
            "easy",
            "medium",
            "hard",
        ]),

        expectedCompetencies:
            z.array(z.string())
                .min(1)
                .max(10),
});