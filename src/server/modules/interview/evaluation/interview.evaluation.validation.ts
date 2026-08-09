import { z } from "zod";

import { generatedInterviewQuestionSchema } from "../question/interview.question.validation";

export const runtimeMistakeSchema =
    z.object({
        topic: z
            .string({
                error: (i) => i.input === undefined ? "Mistake topic is required" : "Mistake topic must be a string",
            }),

        description: z
            .string({
                error: (i) => i.input === undefined ? "Mistake description is required" : "Mistake description must be a string",
            }),

        severity: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ], {
            error: (i) => i.input === undefined ? "Mistake severity is required" : "Mistake severity must be LOW, MEDIUM, or HIGH"
        }),

        corrected: z
            .boolean({
                error: (i) => i.input === undefined ? "Correction status is required" : "Correction status must be a boolean",
            }),
});

export const turnEvaluationSchema =
    z.object({
        questionNumber: z
            .number({
                error: (i) => i.input === undefined ? "Question number is required" : "Question number must be a number",
            }),

        topic: z
            .string({
                error: (i) => i.input === undefined ? "Evaluation topic is required" : "Evaluation topic must be a string",
            }),

        score: z
            .number({
                error: (i) => i.input === undefined ? "Score is required" : "Score must be a number",
            })
            .min(0, { message: "Score must be at least 0" })
            .max(10, { message: "Score cannot exceed 10" }),

        correctness: z
            .number({
                error: (i) => i.input === undefined ? "Correctness score is required" : "Correctness score must be a number",
            })
            .min(0, { message: "Correctness score must be at least 0" })
            .max(10, { message: "Correctness score cannot exceed 10" }),

        strengths: z.array(
            z.string({
                error: (i) => i.input === undefined ? "Strength is required" : "Each strength must be a string"
            }),
            {
                error: (i) => i.input === undefined ? "Strengths list is required" : "Strengths must be an array of strings"
            }
        ),

        mistakes: z.array(
            runtimeMistakeSchema,
            {
                error: (i) => i.input === undefined ? "Mistakes list is required" : "Mistakes must be an array of mistake objects"
            }
        ),

        communication: z.object({
            clarity: z
                .number({
                    error: (i) => i.input === undefined ? "Clarity score is required" : "Clarity score must be a number",
                })
                .min(0, { message: "Clarity score must be at least 0" })
                .max(10, { message: "Clarity score cannot exceed 10" }),

            structure: z
                .number({
                    error: (i) => i.input === undefined ? "Structure score is required" : "Structure score must be a number",
                })
                .min(0, { message: "Structure score must be at least 0" })
                .max(10, { message: "Structure score cannot exceed 10" })
        }, {
            error: (i) => i.input === undefined ? "Communication evaluation is required" : "Communication evaluation must be an object"
        }),

        followUpRequired: z
            .boolean({
                error: (i) => i.input === undefined ? "Follow-up requirement status is required" : "Follow-up requirement status must be a boolean",
            }),

        difficultyAdjustment: z.enum([
            "increase",
            "decrease",
            "same",
        ], {
            error: (i) => i.input === undefined ? "Difficulty adjustment is required" : "Difficulty adjustment must be increase, decrease, or same"
        }),

        interviewerReasoning: z
            .string({
                error: (i) => i.input === undefined ? "Interviewer reasoning is required" : "Interviewer reasoning must be a string",
            }),
});

export const interviewTurnResultSchema =
    z.object({
        evaluation:
            turnEvaluationSchema,

        nextQuestion:
            generatedInterviewQuestionSchema,
});