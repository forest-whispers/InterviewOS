import { z } from "zod";

export const createInterviewSchema = z.object({
    interviewObjective: z
        .string({
            error: (i) => i.input === undefined ? "Interview objective is required" : "Interview objective must be a string",
        })
        .trim()
        .min(5, { message: "Interview objective must be at least 5 characters long" })
        .max(500, { message: "Interview objective cannot exceed 500 characters" }),
});

export const submitAnswerSchema = z.object({
    answer: z
        .string({
            error: (i) => i.input === undefined ? "Answer is required" : "Answer must be a string",
        })
        .trim()
        .min(1, { message: "Answer cannot be empty" })
        .max(10000, { message: "Answer cannot exceed 10000 characters" }),
});