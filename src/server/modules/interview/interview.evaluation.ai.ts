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
    interviewTurnResultSchema,
} from "./interview.evaluation.validation";

import {
    buildInterviewTurnPrompt,
} from "./interview.evaluation.prompts";

import type {
    EvaluateInterviewTurnInput,
    InterviewTurnResult,
} from "./interview.evaluation.types";
import { INTERVIEW_CONSTANTS } from "./interview.constants";

const MODEL = google(
    INTERVIEW_CONSTANTS.MODEL_NAME
);

export async function evaluateInterviewTurn({
    context,
    currentAnswer
}: EvaluateInterviewTurnInput): Promise<InterviewTurnResult> {
    try {
        const { output } =
            await generateText({
                model: MODEL,

                output: Output.object({
                    schema:
                        interviewTurnResultSchema,
                }),

                prompt:
                    buildInterviewTurnPrompt({
                        context,
                        currentAnswer,
                    }),

                temperature: 0.2,

                maxRetries: 2,
            });

        return output;
    } catch (error) {
        if (
            APICallError.isInstance(error) &&
            error.statusCode === 429
        ) {
            throw new InternalServerError(
                "Interview service is temporarily unavailable."
            );
        }

        throw new InternalServerError(
            "Failed to evaluate interview turn."
        );
    }
}