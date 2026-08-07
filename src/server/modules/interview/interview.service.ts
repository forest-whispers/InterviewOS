import { prisma } from "@/server/config/db";

import {
    NotFoundError,
    BadRequestError,
} from "@/server/shared/errors/errors";

import { buildCandidateSnapshot } from "./interview.snapshot";
import { buildInterviewPlan } from "./interview.plan";

import {
    createInterviewState,
    storeCandidateSnapshot,
} from "./interview.redis";

import {
    CandidateSnapshot,
    InterviewState,
} from "./interview.types";

import { INTERVIEW_CONSTANTS } from "./interview.constants";
import { Prisma } from "@prisma/client";

interface CreateInterviewInput {
    userId: string;

    interviewObjective: string;
}

function buildInterviewState(
    sessionId: string,
    snapshot: CandidateSnapshot
): InterviewState {
    const startedAt = new Date();

    const expiresAt = new Date(
        startedAt.getTime() +
        INTERVIEW_CONSTANTS.SESSION_TTL_SECONDS *
        1000
    );

    return {
        sessionId,

        interviewPlan:
            buildInterviewPlan(snapshot),

        currentQuestion: null,

        questionNumber: 0,

        currentTopic: null,

        difficulty:
            INTERVIEW_CONSTANTS.DEFAULT_DIFFICULTY,

        runtimeObservations: {
            repeatedMistakes: [],

            correctedMistakes: [],

            hintsGiven: 0,

            topicsCovered: [],

            skippedQuestions: 0,
        },

        startedAt:
            startedAt.toISOString(),

        expiresAt:
            expiresAt.toISOString(),
    };
}

export async function createInterview({
    userId,
    interviewObjective,
}: CreateInterviewInput) {
    const candidate =
        await prisma.candidateProfile.findUnique({
            where: {
                userId,
            },

            include: {
                currentResume: true,
            },
        });

    if (!candidate) {
        throw new NotFoundError(
            "Candidate profile not found."
        );
    }

    if (!candidate.currentResume) {
        throw new BadRequestError(
            "Candidate must upload a resume before starting an interview."
        );
    }

    const snapshot =
        buildCandidateSnapshot({
            candidate,
        });

    snapshot.interviewObjective =
        interviewObjective;

    const interviewPlan =
        buildInterviewPlan(snapshot);

    const session =
        await prisma.interviewSession.create({
            data: {
                candidateId: candidate.id,

                resumeId:
                    candidate.currentResume.id,

                status: "CREATED",

                interviewPlan: interviewPlan,

                metadata:
                    Prisma.JsonNull,
            },
        });

    const state =
        buildInterviewState(
            session.id,
            snapshot
        );

    await Promise.all([
        storeCandidateSnapshot(
            session.id,
            snapshot
        ),

        createInterviewState(
            state
        ),
    ]);

    return {
        sessionId: session.id,

        interviewPlan,

        status: session.status,
    };
}