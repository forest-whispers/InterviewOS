import { generateText, Output, APICallError } from "ai";
import { google } from "@ai-sdk/google";

import { parsedResumeSchema } from "./resume.validation";

import { buildResumeParsingPrompt } from "./resume.prompts";

import { RESUME_CONSTANTS } from "./resume.constants";

import type { ParsedResume } from "./resume.types";

import {
    InternalServerError,
} from "@/server/shared/errors/errors";

const MODEL = google(
    RESUME_CONSTANTS.PARSER_MODEL_NAME
);

export async function parseResume(
    resumeText: string
): Promise<ParsedResume> {
    try {
        const { output } =
            await generateText({
                model: MODEL,

                output: Output.object({
                    schema: parsedResumeSchema,
                }),

                prompt:
                    buildResumeParsingPrompt(
                        resumeText
                    ),

                temperature:
                    RESUME_CONSTANTS.TEMPERATURE,

                maxRetries:
                    RESUME_CONSTANTS.MAX_RETRIES,
            });

        return output;
    } catch (error) {
        if (
            APICallError.isInstance(error) &&
            error.statusCode === 429
        ) {
            throw new InternalServerError(
                "Resume parser is temporarily unavailable."
            );
        }

        throw new InternalServerError(
            "Failed to parse resume."
        );
    }
}