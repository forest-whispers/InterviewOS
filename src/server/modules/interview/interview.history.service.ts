import { Prisma, InterviewStatus } from "@prisma/client";
import { prisma } from "@/server/config/db";
import { NotFoundError, BadRequestError } from "@/server/shared/errors/errors";
import { InterviewPlan } from "./interview.types";
import { MessageMetadata } from "./transcript/interview.transcript.types";
import { EvaluationArtifact } from "./finalArtifact/interview.final.types";

/**
 * Safely maps database metadata JSON to the MessageMetadata type,
 * filtering out any internal runtime/persistence state.
 */
function mapMessageMetadata(dbMetadata: any): MessageMetadata | undefined {
    if (!dbMetadata || typeof dbMetadata !== "object") return undefined;

    const result: MessageMetadata = {};

    if (dbMetadata.questionType) result.questionType = dbMetadata.questionType;
    if (dbMetadata.topic) result.topic = dbMetadata.topic;
    if (dbMetadata.difficulty) result.difficulty = dbMetadata.difficulty;
    if (Array.isArray(dbMetadata.expectedCompetencies)) {
        result.expectedCompetencies = dbMetadata.expectedCompetencies.map(String);
    }

    // Map evaluation metadata if present, excluding internal properties
    if (typeof dbMetadata.score === "number") result.score = dbMetadata.score;
    if (typeof dbMetadata.correctness === "number") result.correctness = dbMetadata.correctness;
    if (dbMetadata.communication && typeof dbMetadata.communication === "object") {
        result.communication = {
            clarity: typeof dbMetadata.communication.clarity === "number" ? dbMetadata.communication.clarity : 0,
            structure: typeof dbMetadata.communication.structure === "number" ? dbMetadata.communication.structure : 0,
        };
    }
    if (Array.isArray(dbMetadata.mistakes)) {
        result.mistakes = dbMetadata.mistakes.map((m: any) => ({
            topic: String(m?.topic || ""),
            description: String(m?.description || ""),
            severity: (m?.severity === "LOW" || m?.severity === "HIGH") ? m.severity : "MEDIUM",
            corrected: typeof m?.corrected === "boolean" ? m.corrected : false,
            occurredAt: m?.occurredAt ? String(m.occurredAt) : undefined,
        }));
    }
    if (Array.isArray(dbMetadata.strengths)) {
        result.strengths = dbMetadata.strengths.map(String);
    }
    if (typeof dbMetadata.feedback === "string") result.feedback = dbMetadata.feedback;
    if (typeof dbMetadata.followUpRequired === "boolean") {
        result.followUpRequired = dbMetadata.followUpRequired;
    }

    return Object.keys(result).length > 0 ? result : undefined;
}

/**
 * Lists the authenticated candidate's interview sessions.
 */
export async function getCandidateInterviews({
    userId,
    page,
    limit,
    status,
}: {
    userId: string;
    page: number;
    limit: number;
    status?: InterviewStatus;
}) {
    const candidate = await prisma.candidateProfile.findUnique({
        where: { userId },
    });

    if (!candidate) {
        return {
            interviews: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
            },
        };
    }

    const where: Prisma.InterviewSessionWhereInput = {
        candidateId: candidate.id,
    };

    if (status) {
        where.status = status;
    }

    const total = await prisma.interviewSession.count({ where });
    const totalPages = Math.ceil(total / limit);

    const sessions = await prisma.interviewSession.findMany({
        where,
        orderBy: {
            createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
            evaluation: true,
        },
    });

    const interviews = sessions.map((session) => {
        const plan = session.interviewPlan as any;
        return {
            sessionId: session.id,
            role: plan?.role || "",
            status: session.status,
            overallScore: session.evaluation?.overallScore ?? null,
            technicalScore: session.evaluation?.technicalScore ?? null,
            communicationScore: session.evaluation?.communicationScore ?? null,
            createdAt: session.createdAt.toISOString(),
            startedAt: session.startedAt ? session.startedAt.toISOString() : null,
            completedAt: session.completedAt ? session.completedAt.toISOString() : null,
        };
    });

    return {
        interviews,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
}

/**
 * Retrieves the overview/details of one interview session belonging to the candidate.
 */
export async function getInterviewDetail({
    userId,
    sessionId,
}: {
    userId: string;
    sessionId: string;
}) {
    const candidate = await prisma.candidateProfile.findUnique({
        where: { userId },
    });

    if (!candidate) {
        throw new NotFoundError("Interview session not found.");
    }

    const session = await prisma.interviewSession.findFirst({
        where: {
            id: sessionId,
            candidateId: candidate.id,
        },
        include: {
            evaluation: true,
        },
    });

    if (!session) {
        throw new NotFoundError("Interview session not found.");
    }

    const plan = session.interviewPlan as any;
    const interviewPlan: InterviewPlan = {
        role: plan?.role || "",
        difficulty: plan?.difficulty || "medium",
        estimatedQuestions: plan?.estimatedQuestions || 0,
        topics: plan?.topics || [],
    };

    return {
        interview: {
            sessionId: session.id,
            role: interviewPlan.role,
            status: session.status,
            interviewPlan,
            overallScore: session.evaluation?.overallScore ?? null,
            technicalScore: session.evaluation?.technicalScore ?? null,
            communicationScore: session.evaluation?.communicationScore ?? null,
            createdAt: session.createdAt.toISOString(),
            startedAt: session.startedAt ? session.startedAt.toISOString() : null,
            completedAt: session.completedAt ? session.completedAt.toISOString() : null,
        },
    };
}

/**
 * Retrieves paginated persisted conversation history for one interview session.
 */
export async function getInterviewMessages({
    userId,
    sessionId,
    page,
    limit,
}: {
    userId: string;
    sessionId: string;
    page: number;
    limit: number;
}) {
    const candidate = await prisma.candidateProfile.findUnique({
        where: { userId },
    });

    if (!candidate) {
        throw new NotFoundError("Interview session not found.");
    }

    const sessionExists = await prisma.interviewSession.findFirst({
        where: {
            id: sessionId,
            candidateId: candidate.id,
        },
    });

    if (!sessionExists) {
        throw new NotFoundError("Interview session not found.");
    }

    // Build query specifying both interviewSessionId and candidate ownership via relation
    const where: Prisma.InterviewMessageWhereInput = {
        interviewSessionId: sessionId,
        interviewSession: {
            candidateId: candidate.id,
        },
        role: {
            in: ["ASSISTANT", "USER"], // filters out SYSTEM
        },
    };

    const total = await prisma.interviewMessage.count({ where });
    const totalPages = Math.ceil(total / limit);

    const dbMessages = await prisma.interviewMessage.findMany({
        where,
        orderBy: {
            createdAt: "asc",
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const messages = dbMessages.map((msg) => ({
        id: msg.id,
        role: msg.role.toLowerCase() as "assistant" | "user",
        content: msg.content,
        metadata: mapMessageMetadata(msg.metadata),
        createdAt: msg.createdAt.toISOString(),
    }));

    return {
        messages,
        pagination: {
            page,
            limit,
            total,
            totalPages,
        },
    };
}

/**
 * Retrieves the persisted final evaluation for one interview session.
 */
export async function getFinalEvaluation({
    userId,
    sessionId,
}: {
    userId: string;
    sessionId: string;
}) {
    const candidate = await prisma.candidateProfile.findUnique({
        where: { userId },
    });

    if (!candidate) {
        throw new NotFoundError("Interview evaluation not found.");
    }

    const evaluation = await prisma.interviewEvaluation.findFirst({
        where: {
            interviewSessionId: sessionId,
            interviewSession: {
                candidateId: candidate.id,
            },
        },
    });

    if (!evaluation) {
        throw new NotFoundError("Interview evaluation not found.");
    }

    return {
        evaluation: {
            overallScore: evaluation.overallScore,
            technicalScore: evaluation.technicalScore,
            communicationScore: evaluation.communicationScore,
            artifact: evaluation.artifact as unknown as EvaluationArtifact,
            createdAt: evaluation.createdAt.toISOString(),
        },
    };
}

/**
 * Deletes the interview session and relies on Prisma's configured cascade deletion behavior.
 */
export async function deleteInterview({
    userId,
    sessionId,
}: {
    userId: string;
    sessionId: string;
}) {
    const candidate = await prisma.candidateProfile.findUnique({
        where: { userId },
    });

    if (!candidate) {
        throw new NotFoundError("Interview session not found.");
    }

    const session = await prisma.interviewSession.findFirst({
        where: {
            id: sessionId,
            candidateId: candidate.id,
        },
    });

    if (!session) {
        throw new NotFoundError("Interview session not found.");
    }

    if (session.status === "IN_PROGRESS") {
        throw new BadRequestError("Cannot delete an interview session while it is in progress.");
    }

    await prisma.interviewSession.delete({
        where: {
            id: sessionId,
        },
    });

    return {
        message: "Interview deleted successfully.",
    };
}