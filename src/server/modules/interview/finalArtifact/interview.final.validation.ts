import { z } from "zod";

const scoreSchema = z
    .number()
    .min(0)
    .max(10);

const strengthSchema = z.object({
    topic: z.string(),

    description: z.string(),
});

const weaknessSchema = z.object({
    topic: z.string(),

    description: z.string(),

    severity: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),
});

const mistakeSchema = z.object({
    topic: z.string(),

    description: z.string(),

    severity: z.enum([
        "LOW",
        "MEDIUM",
        "HIGH",
    ]),

    corrected: z.boolean(),
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
        }),

        communication: z.object({

            clarity:
                scoreSchema,

            structure:
                scoreSchema,

            conciseness:
                scoreSchema,
        }),

        strengths:
            z.array(
                strengthSchema
            ),

        weaknesses:
            z.array(
                weaknessSchema
            ),

        mistakes:
            z.array(
                mistakeSchema
            ),

        behaviouralObservations:
            z.array(
                z.string()
            ),

        recommendations:
            z.array(
                z.string()
            ),

        interviewSummary:
            z.string(),
});