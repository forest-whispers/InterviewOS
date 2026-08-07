import { z } from "zod";

export const createInterviewSchema = z.object({
    interviewObjective: z
        .string()
        .trim()
        .min(5)
        .max(500),
});