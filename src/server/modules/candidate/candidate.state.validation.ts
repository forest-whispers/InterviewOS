import { z } from "zod";

const trendSchema = z.enum([
    "IMPROVING",
    "STABLE",
    "DECLINING",
]);

const skillStateSchema = z.object({
    score: z
        .number()
        .min(0)
        .max(10),

    trend: trendSchema,

    observationCount: z.number(),

    lastEvaluatedAt: z.string().datetime(),

    evidence: z.array(
        z.string()
    ),
});

const weaknessSummarySchema = z.object({
    topic: z.string().min(1),

    frequency: z
        .number()
        .int()
        .min(1),

    severity: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),

    trend: trendSchema,

    firstSeenAt: z.string().datetime(),

    lastSeenAt: z.string().datetime(),
});

const strengthSummarySchema = z.object({
    topic: z.string().min(1),

    frequency: z
        .number()
        .int()
        .min(1),

    confidence: z
        .number()
        .min(0)
        .max(10),

    trend: trendSchema,

    lastSeenAt: z.string().datetime(),
});

const candidateMistakeSummarySchema =
    z.object({
        topic: z.string().min(1),

        description: z.string().min(1),

        severity: z.enum([
            "LOW",
            "MEDIUM",
            "HIGH",
        ]),

        interviewId: z.string().min(1),

        corrected: z.boolean(),

        occurredAt: z.string().datetime(),
});

const communicationProfileSchema =
    z.object({
        clarity: z
            .number()
            .min(0)
            .max(10),

        structure: z
            .number()
            .min(0)
            .max(10),

        conciseness: z
            .number()
            .min(0)
            .max(10),

        trend: trendSchema,
});

export const candidateStateSchema =
    z.object({
        technical: z.record(
            z.string(),
            skillStateSchema
        ),

        communication:
            communicationProfileSchema,

        currentWeaknesses:
            z.array(
                weaknessSummarySchema
            ),

        currentStrengths:
            z.array(
                strengthSummarySchema
            ),

        previousMistakes:
            z.array(
                candidateMistakeSummarySchema
            ),
});