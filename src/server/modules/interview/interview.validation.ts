import { z } from "zod";
import { InterviewStatus } from "@prisma/client";

export const createInterviewSchema = z.object({
    interviewObjective: z
        .string({
            error: (i) => i.input === undefined ? "Interview objective is required" : "Interview objective must be a string",
        })
        .trim()
        .min(5, { message: "Interview objective must be at least 5 characters long" })
        .max(10000, { message: "Interview objective cannot exceed 10000 characters" }),

    topics: z
        .array(
            z.string().trim().min(1, { message: "Topic cannot be empty" })
        )
        .optional(),
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

export const getInterviewsQuerySchema = z.object({
    page: z
        .union([z.number(), z.string()])
        .optional()
        .refine((val) => {
            if (val === undefined) return true;
            if (typeof val === "number") return Number.isInteger(val) && val >= 1;
            return /^\d+$/.test(val);
        }, { message: "Page must be a valid positive integer" })
        .transform((val) => {
            if (val === undefined) return 1;
            return typeof val === "number" ? val : parseInt(val, 10);
        }),

    limit: z
        .union([z.number(), z.string()])
        .optional()
        .refine((val) => {
            if (val === undefined) return true;
            if (typeof val === "number") return Number.isInteger(val) && val >= 1;
            return /^\d+$/.test(val);
        }, { message: "Limit must be a valid positive integer" })
        .transform((val) => {
            if (val === undefined) return 10;
            return typeof val === "number" ? val : parseInt(val, 10);
        })
        .pipe(z.number().int().min(1).max(100)),

    status: z.enum(InterviewStatus,
        {
            error: (i) => i.input === undefined ? "Difficulty is required" : "Difficulty must be easy, medium, or hard"   
        })
        .optional(),
});

export const getMessagesQuerySchema = z.object({
    page: z
        .union([z.number(), z.string()])
        .optional()
        .refine((val) => {
            if (val === undefined) return true;
            if (typeof val === "number") return Number.isInteger(val) && val >= 1;
            return /^\d+$/.test(val);
        }, { message: "Page must be a valid positive integer" })
        .transform((val) => {
            if (val === undefined) return 1;
            return typeof val === "number" ? val : parseInt(val, 10);
        }),

    limit: z
        .union([z.number(), z.string()])
        .optional()
        .refine((val) => {
            if (val === undefined) return true;
            if (typeof val === "number") return Number.isInteger(val) && val >= 1;
            return /^\d+$/.test(val);
        }, { message: "Limit must be a valid positive integer" })
        .transform((val) => {
            if (val === undefined) return 100;
            return typeof val === "number" ? val : parseInt(val, 10);
        })
        .pipe(z.number().int().min(1).max(1000)),
});