import { z } from "zod";

const trendSchema = z.enum([
    "IMPROVING",
    "STABLE",
    "DECLINING",
], {
    error: (i) => i.input === undefined ? "Trend status is required" : "Trend status must be either IMPROVING, STABLE, or DECLINING"
});

const skillStateSchema = z.object({
    score: z
        .number({
            error: (i) => i.input === undefined ? "Skill score is required" : "Skill score must be a number",
        })
        .min(0, { message: "Skill score must be at least 0" })
        .max(10, { message: "Skill score cannot exceed 10" }),

    trend: trendSchema,

    observationCount: z
        .number({
            error: (i) => i.input === undefined ? "Observation count is required" : "Observation count must be a number",
        }),

    lastEvaluatedAt: z
        .string({
            error: (i) => i.input === undefined ? "Evaluation date is required" : "Evaluation date must be a string",
        })
        .datetime({ message: "Evaluation date must be a valid ISO datetime format" }),

    evidence: z.array(
        z.string({
            error: (i) => i.input === undefined ? "Evidence item is required" : "Each evidence item must be a string"
        }),
        {
            error: (i) => i.input === undefined ? "Evidence is required" : "Evidence must be an array of strings"
        }
    ),
});

const weaknessSummarySchema = z.object({
    topic: z
        .string({
            error: (i) => i.input === undefined ? "Weakness topic is required" : "Weakness topic must be a string",
        })
        .min(1, { message: "Weakness topic cannot be empty" }),

    frequency: z
        .number({
            error: (i) => i.input === undefined ? "Weakness frequency is required" : "Weakness frequency must be a number",
        })
        .int({ message: "Weakness frequency must be an integer" })
        .min(1, { message: "Weakness frequency must be at least 1" }),

    severity: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ], {
        error: (i) => i.input === undefined ? "Weakness severity is required" : "Weakness severity must be LOW, MEDIUM, or HIGH"
    }),

    trend: trendSchema,

    firstSeenAt: z
        .string({
            error: (i) => i.input === undefined ? "First seen date is required" : "First seen date must be a string",
        })
        .datetime({ message: "First seen date must be a valid ISO datetime format" }),

    lastSeenAt: z
        .string({
            error: (i) => i.input === undefined ? "Last seen date is required" : "Last seen date must be a string",
        })
        .datetime({ message: "Last seen date must be a valid ISO datetime format" }),
});

const strengthSummarySchema = z.object({
    topic: z
        .string({
            error: (i) => i.input === undefined ? "Strength topic is required" : "Strength topic must be a string",
        })
        .min(1, { message: "Strength topic cannot be empty" }),

    description: z
        .string({
            error: (i) => i.input === undefined ? "Strength description is required" : "Strength description must be a string",
        }),

    frequency: z
        .number({
            error: (i) => i.input === undefined ? "Strength frequency is required" : "Strength frequency must be a number",
        })
        .int({ message: "Strength frequency must be an integer" })
        .min(1, { message: "Strength frequency must be at least 1" }),

    confidence: z
        .number({
            error: (i) => i.input === undefined ? "Confidence score is required" : "Confidence score must be a number",
        })
        .min(0, { message: "Confidence score must be at least 0" })
        .max(10, { message: "Confidence score cannot exceed 10" }),

    trend: trendSchema,

    lastSeenAt: z
        .string({
            error: (i) => i.input === undefined ? "Last seen date is required" : "Last seen date must be a string",
        })
        .datetime({ message: "Last seen date must be a valid ISO datetime format" }),
});

const candidateMistakeSummarySchema =
    z.object({
        topic: z
            .string({
                error: (i) => i.input === undefined ? "Mistake topic is required" : "Mistake topic must be a string",
            })
            .min(1, { message: "Mistake topic cannot be empty" }),

        description: z
            .string({
                error: (i) => i.input === undefined ? "Mistake description is required" : "Mistake description must be a string",
            })
            .min(1, { message: "Mistake description cannot be empty" }),

        severity: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ], {
            error: (i) => i.input === undefined ? "Mistake severity is required" : "Mistake severity must be LOW, MEDIUM, or HIGH"
        }),

        interviewId: z
            .string({
                error: (i) => i.input === undefined ? "Interview ID is required" : "Interview ID must be a string",
            })
            .min(1, { message: "Interview ID cannot be empty" }),

        corrected: z
            .boolean({
                error: (i) => i.input === undefined ? "Correction status is required" : "Correction status must be a boolean",
            }),

        occurredAt: z
            .string({
                error: (i) => i.input === undefined ? "Occurrence date is required" : "Occurrence date must be a string",
            })
            .datetime({ message: "Occurrence date must be a valid ISO datetime format" }),
});

const communicationProfileSchema =
    z.object({
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
            .max(10, { message: "Structure score cannot exceed 10" }),

        conciseness: z
            .number({
                error: (i) => i.input === undefined ? "Conciseness score is required" : "Conciseness score must be a number",
            })
            .min(0, { message: "Conciseness score must be at least 0" })
            .max(10, { message: "Conciseness score cannot exceed 10" }),

        trend: trendSchema,

        observationCount: z
            .number({
                error: (i) => i.input === undefined ? "Observation count is required" : "Observation count must be a number",
            }),
});

export const candidateStateSchema =
    z.object({
        technical: z.record(
            z.string({
                error: (i) => i.input === undefined ? "Skill name key is required" : "Skill name key must be a string"
            }),
            skillStateSchema,
            {
                error: (i) => i.input === undefined ? "Technical skills evaluation is required" : "Technical skills must be a record of skill states",
            }
        ),

        communication:
            communicationProfileSchema,

        currentWeaknesses:
            z.array(
                weaknessSummarySchema,
                {
                    error: (i) => i.input === undefined ? "Current weaknesses array is required" : "Current weaknesses must be an array of summaries",
                }
            ),

        currentStrengths:
            z.array(
                strengthSummarySchema,
                {
                    error: (i) => i.input === undefined ? "Current strengths array is required" : "Current strengths must be an array of summaries",
                }
            ),

        previousMistakes:
            z.array(
                candidateMistakeSummarySchema,
                {
                    error: (i) => i.input === undefined ? "Previous mistakes array is required" : "Previous mistakes must be an array of summaries",
                }
            ),
});