import { z } from "zod";

import { generatedInterviewQuestionSchema } from "../question/interview.question.validation";

export const runtimeMistakeSchema =
    z.object({
        topic: z.string(),

        description: z.string(),

        severity: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ]),
});

export const turnEvaluationSchema =
    z.object({
        questionNumber: z.number(),

        topic: z.string(),

        score: z.number().min(0).max(10),

        correctness: z.number().min(0).max(10),

        strengths: z.array(z.string()),

        mistakes: z.array(
            runtimeMistakeSchema
        ),

        communication: z.object({
            clarity: z.number().min(0).max(10),

            structure: z.number().min(0).max(10)
        }),

        followUpRequired:
            z.boolean(),

        difficultyAdjustment:
            z.enum([
                "increase",
                "decrease",
                "same",
            ]),

        interviewerReasoning:
            z.string(),
});

export const interviewTurnResultSchema =
    z.object({
        evaluation:
            turnEvaluationSchema,

        nextQuestion:
            generatedInterviewQuestionSchema,
});