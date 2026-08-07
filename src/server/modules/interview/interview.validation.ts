import { z } from "zod";

export const createInterviewSchema = z.object({
    interviewObjective: z
        .string()
        .trim()
        .min(5)
        .max(500),
});

export const submitAnswerSchema = z.object({
    answer: z
        .string()
        .trim()
        .min(1, "Answer is required.")
        .max(10000),
});