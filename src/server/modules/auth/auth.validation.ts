import { z } from "zod";

export const signUpSchema = z.object({
    name: z
        .string({
            error: (i) => i.input === undefined ? "Name is required" : "Name must be a string",
        })
        .trim()
        .min(2, { message: "Name must be at least 2 characters long" })
        .max(100, { message: "Name cannot exceed 100 characters" }),

    email: z
        .string({
            error: (i) => i.input === undefined ? "Email is required" : "Email must be a string",
        })
        .trim()
        .email({ message: "Please enter a valid email address" }),

    password: z
        .string({
            error: (i) => i.input === undefined ? "Password is required" : "Password must be a string",
        })
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(100, { message: "Password cannot exceed 100 characters" }),
});

export const loginSchema = z.object({
    email: z
        .string({
            error: (i) => i.input === undefined ? "Email is required" : "Email must be a string",
        })
        .trim()
        .email({ message: "Please enter a valid email address" }),

    password: z
        .string({
            error: (i) => i.input === undefined ? "Password is required" : "Password must be a string",
        })
        .min(1, { message: "Password is required" }),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;