import { ExperienceLevel, SkillCategory } from "@prisma/client";
import { z } from "zod";

export const parsedResumeSchema = z.object({
    summary: z
        .string({
            error: (i) => i.input === undefined ? "Summary is required" : "Summary must be a string",
        }),

    targetRole: z
        .string({
            error: (i) => i.input === undefined ? "Target role is required" : "Target role must be a string",
        }),

    experienceLevel: z.enum(ExperienceLevel, {
        error: (i) => i.input === undefined ? "Experience level is required" : "Invalid experience level"
    }),

    skills: z.array(
        z.object({
            name: z
                .string({
                    error: (i) => i.input === undefined ? "Skill name is required" : "Skill name must be a string",
                }),

            category: z.enum(SkillCategory, {
                error: (i) => i.input === undefined ? "Skill category is required" : "Invalid skill category"
            }),

            confidence: z
                .number({
                    error: (i) => i.input === undefined ? "Confidence score is required" : "Confidence score must be a number",
                })
                .min(0, { message: "Confidence score must be at least 0" })
                .max(1, { message: "Confidence score cannot exceed 1" })
                .optional(),
        }),
        {
            error: (i) => i.input === undefined ? "Skills array is required" : "Skills must be an array of skill objects"
        }
    ),

    topSkills: z.array(
        z.string({
            error: (i) => i.input === undefined ? "Top skill is required" : "Each top skill must be a string"
        }),
        {
            error: (i) => i.input === undefined ? "Top skills list is required" : "Top skills must be an array of strings"
        }
    ).max(10, { message: "Top skills list cannot exceed 10 items" }),

    projects: z.array(
        z.object({
            name: z
                .string({
                    error: (i) => i.input === undefined ? "Project name is required" : "Project name must be a string",
                }),

            description: z
                .string({
                    error: (i) => i.input === undefined ? "Project description is required" : "Project description must be a string",
                })
                .optional(),

            technologies: z.array(
                z.string({
                    error: (i) => i.input === undefined ? "Technology is required" : "Each technology must be a string"
                }),
                {
                    error: (i) => i.input === undefined ? "Technologies list is required" : "Technologies must be an array of strings"
                }
            ),
        }),
        {
            error: (i) => i.input === undefined ? "Projects list is required" : "Projects must be an array of project objects"
        }
    ),

    education: z.array(
        z.object({
            institution: z
                .string({
                    error: (i) => i.input === undefined ? "Institution name is required" : "Institution name must be a string",
                }),

            degree: z
                .string({
                    error: (i) => i.input === undefined ? "Degree is required" : "Degree must be a string",
                })
                .optional(),

            fieldOfStudy: z
                .string({
                    error: (i) => i.input === undefined ? "Field of study is required" : "Field of study must be a string",
                })
                .optional(),

            graduationYear: z
                .number({
                    error: (i) => i.input === undefined ? "Graduation year is required" : "Graduation year must be a number",
                })
                .optional(),
        }),
        {
            error: (i) => i.input === undefined ? "Education history is required" : "Education history must be an array of education objects"
        }
    ),
});