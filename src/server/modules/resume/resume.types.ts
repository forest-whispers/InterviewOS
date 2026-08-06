import { ExperienceLevel, SkillCategory } from "@prisma/client";

export interface ParsedResumeSkill {
    name: string;

    category?: SkillCategory;

    confidence?: number;
}

export interface ParsedResumeProject {
    name: string;

    description?: string;

    technologies: string[];
}

export interface ParsedResumeEducation {
    institution: string;

    degree?: string;

    fieldOfStudy?: string;

    graduationYear?: number;
}

export interface ParsedResume {
    summary: string;

    targetRole: string;

    experienceLevel: ExperienceLevel;

    skills: ParsedResumeSkill[];

    topSkills: string[];

    projects: ParsedResumeProject[];

    education: ParsedResumeEducation[];
}