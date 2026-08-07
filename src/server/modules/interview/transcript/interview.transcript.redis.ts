import { makeKey } from "@/server/shared/redis/keys";

export function transcriptKey(
    sessionId: string
) {
    return makeKey(
        "interview",
        sessionId,
        "transcript"
    );
}