import { makeKey } from "@/server/shared/redis/keys";

function transcriptKey(
    sessionId: string
) {
    return makeKey(
        "interview",
        sessionId,
        "transcript"
    );
}