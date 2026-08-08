import {
    APICallError,
    generateText,
    Output,
} from "ai";

import { google } from "@ai-sdk/google";

import { INTERVIEW_CONSTANTS } from "../interview.constants";

import {
    InternalServerError,
} from "@/server/shared/errors/errors";

import {
    buildInterviewQuestionPrompt,
} from "./interview.question.prompts";

import {
    generatedInterviewQuestionSchema,
} from "./interview.question.validation";

import type {
    CandidateSnapshot,
    InterviewPlan,
} from "../interview.types";

import type {
    GeneratedInterviewQuestion
} from "./interview.question.types";

const MODEL = google(
    INTERVIEW_CONSTANTS.MODEL_NAME
);

export async function generateOpeningQuestion(
    snapshot: CandidateSnapshot,
    interviewPlan: InterviewPlan
): Promise<GeneratedInterviewQuestion> {
    try {
        const { output } =
            await generateText({
                model: MODEL,

                output: Output.object({
                    schema:
                        generatedInterviewQuestionSchema,
                }),

                prompt:
                    buildInterviewQuestionPrompt(
                        snapshot,
                        interviewPlan
                    ),

                temperature: 0.3,

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
            "Failed to generate interview question."
        );
    }
}