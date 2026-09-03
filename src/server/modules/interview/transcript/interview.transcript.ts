import { createId } from "@paralleldrive/cuid2";

import {
    appendToList,
    getList,
    deleteList,
} from "@/server/shared/redis/list";

import { TTL } from "@/server/shared/redis/ttl";

import type {
    TranscriptMessage
} from "./interview.transcript.types";
import { Prisma } from "@prisma/client";
import { transcriptKey } from "./interview.transcript.redis";

interface AppendTranscriptInput {
    sessionId: string;

    role: "assistant" | "user";

    content: string;

    metadata?: TranscriptMessage["metadata"];

    id?: string;

    createdAt?: string;
}

export async function appendTranscriptMessage({
    sessionId,
    role,
    content,
    metadata,
    id,
    createdAt
}: AppendTranscriptInput) {
    const message: TranscriptMessage = {
        id: id ?? createId(),

        role,

        content,

        metadata,

        // createdAt: createdAt ? createdAt : new Date().toISOString(),
        createdAt: createdAt ?? new Date().toISOString(),
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

export async function getTranscriptPersistenceData(
    sessionId: string
): Promise<
    Prisma.InterviewMessageCreateManyInput[]
> {
    const transcript =
        await getTranscript(sessionId);

    return transcript.map(
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
    );
}