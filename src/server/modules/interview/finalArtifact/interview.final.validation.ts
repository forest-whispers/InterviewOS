import { z } from "zod";

const scoreSchema = z
    .number({
        error: (i) => i.input === undefined ? "Score is required" : "Score must be a number",
    })
    .min(0, { message: "Score must be at least 0" })
    .max(10, { message: "Score cannot exceed 10" });

const trendSchema = z.enum([
    "IMPROVING",
    "STABLE",
    "DECLINING",
], {
    error: (i) => i.input === undefined ? "Trend status is required" : "Trend status must be IMPROVING, STABLE, or DECLINING"
});

const strengthSchema = z.object({
    topic: z
        .string({
            error: (i) => i.input === undefined ? "Strength topic is required" : "Strength topic must be a string",
        }),

    description: z
        .string({
            error: (i) => i.input === undefined ? "Strength description is required" : "Strength description must be a string",
        }),

    confidence: z
        .number({
            error: (i) => i.input === undefined ? "Confidence score is required" : "Confidence score must be a number",
        })
        .min(0, { message: "Confidence score must be at least 0" })
        .max(10, { message: "Confidence score cannot exceed 10" }),
});

const weaknessSchema = z.object({
    topic: z
        .string({
            error: (i) => i.input === undefined ? "Weakness topic is required" : "Weakness topic must be a string",
        }),

    description: z
        .string({
            error: (i) => i.input === undefined ? "Weakness description is required" : "Weakness description must be a string",
        }),

    severity: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ], {
        error: (i) => i.input === undefined ? "Weakness severity is required" : "Weakness severity must be LOW, MEDIUM, or HIGH"
    }),
});

const mistakeSchema = z.object({
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

export const evaluationArtifactSchema =
    z.object({

        overallScore:
            scoreSchema,

        technicalScore:
            scoreSchema,

        communicationScore:
            scoreSchema,

        technical: z.object({

            dataStructures:
                scoreSchema,

            algorithms:
                scoreSchema,

            backend:
                scoreSchema,

            databases:
                scoreSchema,

            systemDesign:
                scoreSchema,

            problemSolving:
                scoreSchema,
        }, {
            error: (i) => i.input === undefined ? "Technical scores are required" : "Technical scores must be an object of key scores"
        }),

        communication: z.object({

            clarity:
                scoreSchema,

            structure:
                scoreSchema,

            conciseness:
                scoreSchema,
        }, {
            error: (i) => i.input === undefined ? "Communication scores are required" : "Communication scores must be an object of key scores"
        }),

        strengths:
            z.array(
                strengthSchema,
                {
                    error: (i) => i.input === undefined ? "Strengths list is required" : "Strengths must be an array of strength objects"
                }
            ),

        weaknesses:
            z.array(
                weaknessSchema,
                {
                    error: (i) => i.input === undefined ? "Weaknesses list is required" : "Weaknesses must be an array of weakness objects"
                }
            ),

        mistakes:
            z.array(
                mistakeSchema,
                {
                    error: (i) => i.input === undefined ? "Mistakes list is required" : "Mistakes must be an array of mistake objects"
                }
            ),

        behaviouralObservations:
            z.array(
                z.string({
                    error: (i) => i.input === undefined ? "Behavioural observation is required" : "Each behavioural observation must be a string"
                }),
                {
                    error: (i) => i.input === undefined ? "Behavioural observations list is required" : "Behavioural observations must be an array of strings"
                }
            ),

        recommendations:
            z.array(
                z.string({
                    error: (i) => i.input === undefined ? "Recommendation is required" : "Each recommendation must be a string"
                }),
                {
                    error: (i) => i.input === undefined ? "Recommendations list is required" : "Recommendations must be an array of strings"
                }
            ),

        interviewSummary:
            z.string({
                error: (i) => i.input === undefined ? "Interview summary is required" : "Interview summary must be a string"
            }),
});