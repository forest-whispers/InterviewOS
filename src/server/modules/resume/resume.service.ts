import { Prisma } from "@prisma/client";

import { prisma } from "@/server/config/db";

import { uploadFileToCloudinary } from "@/server/shared/utils/uploadToCloudinary";
import { extractPdfText } from "@/server/shared/utils/extractPdfText";
import { normalizeText } from "./resume.normalize";

import { parseResume } from "./resume.ai";

import {
    BadRequestError,
    InternalServerError,
    NotFoundError,
} from "@/server/shared/errors/errors";

export interface UploadedFile {
    fieldName: string;
    
    originalName: string;

    mimeType: string;

    size: number;

    buffer: Buffer;
}

interface UploadResumeInput {
    userId: string;

    file: UploadedFile;
}

function buildResumeSkillCreates(
    skills: Awaited<ReturnType<typeof parseResume>>["skills"]
): Prisma.ResumeSkillCreateWithoutResumeInput[] {
    return skills.map((skill) => ({
        name: skill.name,

        category: skill.category,

        confidence: skill.confidence,
    }));
}

function buildResumeProjectCreates(
    projects: Awaited<ReturnType<typeof parseResume>>["projects"]
): Prisma.ResumeProjectCreateWithoutResumeInput[] {
    return projects.map((project) => ({
        name: project.name,

        description: project.description,

        technologies: project.technologies,
    }));
}

function buildResumeEducationCreates(
    education: Awaited<ReturnType<typeof parseResume>>["education"]
): Prisma.ResumeEducationCreateWithoutResumeInput[] {
    return education.map((item) => ({
        institution: item.institution,

        degree: item.degree,

        fieldOfStudy: item.fieldOfStudy,

        graduationYear: item.graduationYear,
    }));
}

export async function uploadResume({
    userId,
    file,
}: UploadResumeInput) {
    if (!file) {
        throw new BadRequestError("Resume file is required.");
    }

    const candidate = await prisma.candidateProfile.upsert({
        where: {
            userId,
        },
        update: {},
        create: {
            userId,
        },
    });

    if (!candidate) {
        throw new NotFoundError("Candidate profile not found.");
    }

    /*
     * Extract raw text.
    */

    const rawText = await extractPdfText(file);

    const normalizedText = normalizeText(rawText);

    /*
     * AI parsing.
    */

    const parsedResume = await parseResume(normalizedText);

    console.log("Resume Parsed, summary: ", parsedResume.summary);

    /*
     * Upload to Cloudinary.
     * We upload only after successfully parsing
     * the PDF to avoid orphaned files.
    */

    const uploadedFile = await uploadFileToCloudinary(
        file,
        candidate.userId
    );

    if (!uploadedFile?.secure_url) {
        throw new InternalServerError(
            "Failed to upload resume."
        );
    }

    /*
     * Persist everything atomically.
    */

    const result = await prisma.$transaction(async (tx) => {
        const resume = await tx.resume.create({
            data: {
                candidateId: candidate.id,

                fileUrl: uploadedFile.secure_url,

                publicId: uploadedFile.public_id,

                fileName: file.originalName,

                rawText: normalizedText,

                summary: parsedResume.summary,

                status: "READY",

                skills: {
                    create: buildResumeSkillCreates(
                        parsedResume.skills
                    ),
                },

                projects: {
                    create: buildResumeProjectCreates(
                        parsedResume.projects
                    ),
                },

                educations: {
                    create: buildResumeEducationCreates(
                        parsedResume.education
                    ),
                },
            },
        });

        await tx.candidateProfile.update({
            where: {
                id: candidate.id,
            },

            data: {
                currentResumeId: resume.id,

                resumeSummary: parsedResume.summary,

                topSkills: parsedResume.topSkills,

                targetRole: parsedResume.targetRole,

                experienceLevel:
                    parsedResume.experienceLevel,
            },
        });

        return {
            resume,

            parsedResume,
        };
    });

    return {
        resumeId: result.resume.id,

        fileUrl: result.resume.fileUrl,

        summary: result.parsedResume.summary,

        targetRole:
            result.parsedResume.targetRole,

        experienceLevel:
            result.parsedResume.experienceLevel,

        topSkills:
            result.parsedResume.topSkills,

        skills: result.parsedResume.skills,

        projects: result.parsedResume.projects,

        educations: result.parsedResume.education,
    };
}