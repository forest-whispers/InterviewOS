import { createId } from "@paralleldrive/cuid2";

import {
    appendToList,
    getList,
    deleteList,
} from "@/server/shared/redis/list";

import { makeKey } from "@/server/shared/redis/keys";

import { TTL } from "@/server/shared/redis/ttl";

import { prisma } from "@/server/config/db";

import type {
    TranscriptMessage
} from "./interview.transcript.types";
import { Prisma } from "@prisma/client";

function transcriptKey(
    sessionId: string
) {
    return makeKey(
        "interview",
        sessionId,
        "transcript"
    );
}

interface AppendTranscriptInput {
    sessionId: string;

    role: "assistant" | "user";

    content: string;

    metadata?: TranscriptMessage["metadata"];
}

export async function appendTranscriptMessage({
    sessionId,
    role,
    content,
    metadata,
}: AppendTranscriptInput) {
    const message: TranscriptMessage = {
        id: createId(),

        role,

        content,

        metadata,

        createdAt:
            new Date().toISOString(),
    };

    await appendToList(
        transcriptKey(sessionId),
        message,
        TTL.LONG
    );

    return message;
}

export async function getTranscript(
    sessionId: string
) {
    return getList<TranscriptMessage>(
        transcriptKey(sessionId)
    );
}

export async function clearTranscript(
    sessionId: string
) {
    await deleteList(
        transcriptKey(sessionId)
    );
}

export async function persistTranscript(
    sessionId: string
) {
    const transcript =
        await getTranscript(sessionId);

    if (!transcript.length) {
        return;
    }

    await prisma.interviewMessage.createMany({
        data: transcript.map(
            (message) => ({
                id: message.id,

                interviewSessionId:
                    sessionId,

                role:
                    message.role ===
                        "assistant"
                        ? "ASSISTANT"
                        : "USER",

                content:
                    message.content,

                metadata: message.metadata
                    ? (message.metadata as Prisma.InputJsonValue)
                    : undefined,

                createdAt:
                    new Date(
                        message.createdAt
                    ),
            })
        ),
    });

    await clearTranscript(
        sessionId
    );
}