import {
    APICallError,
    generateText,
    Output,
} from "ai";

import { google } from "@ai-sdk/google";

import {
    InternalServerError,
} from "@/server/shared/errors/errors";

import {
    evaluationArtifactSchema,
} from "./interview.final.validation";

import {
    buildFinalEvaluationPrompt,
} from "./interview.final.prompts";

import type {
    CandidateSnapshot
} from "../interview.types";

import type {
    TurnEvaluation
} from "../evaluation/interview.evaluation.types";

import type {
    EvaluationArtifact,
} from "./interview.final.types";
import { INTERVIEW_CONSTANTS } from "../interview.constants";
import { Prisma } from "@prisma/client";

const MODEL = google(
    INTERVIEW_CONSTANTS.MODEL_NAME
);

export interface GenerateFinalEvaluationInput {
    snapshot: CandidateSnapshot;

    turnEvaluations: TurnEvaluation[];

    interviewMetadata?: Prisma.JsonValue;
}

export async function generateFinalEvaluation({
    snapshot,
    turnEvaluations,
    interviewMetadata
}: GenerateFinalEvaluationInput): Promise<EvaluationArtifact> {
    try {
        const { output } =
            await generateText({
                model: MODEL,

                output: Output.object({
                    schema:
                        evaluationArtifactSchema,
                }),

                prompt:
                    buildFinalEvaluationPrompt({
                        snapshot,
                        turnEvaluations,
                        interviewMetadata
                    }),

                temperature: 0.2,

                maxRetries: 2,
            });

        return output;
    } catch (error) {
        let actualError = error;
        if (error && typeof error === "object" && "lastError" in error) {
            actualError = (error as any).lastError;
        }
        if (
            APICallError.isInstance(actualError) &&
            actualError.statusCode === 429
        ) {
            throw new InternalServerError(
                "Interview service is temporarily unavailable."
            );
        }

        throw new InternalServerError(
            "Failed to generate final interview evaluation."
        );
    }
}