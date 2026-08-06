import { ExperienceLevel, SkillCategory } from "@prisma/client";
import { z } from "zod";

export const parsedResumeSchema = z.object({
    summary: z.string(),

    targetRole: z.string(),

    experienceLevel: z.enum(ExperienceLevel),

    skills: z.array(
        z.object({
            name: z.string(),

            category: z.enum(SkillCategory),

            confidence: z.number().min(0).max(1).optional(),
        })
    ),

    topSkills: z.array(z.string()).max(10),

    projects: z.array(
        z.object({
            name: z.string(),

            description: z.string().optional(),

            technologies: z.array(z.string()),
        })
    ),

    education: z.array(
        z.object({
            institution: z.string(),

            degree: z.string().optional(),

            fieldOfStudy: z.string().optional(),

            graduationYear: z.number().optional(),
        })
    ),
});