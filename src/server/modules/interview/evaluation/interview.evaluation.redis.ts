import {
    appendToList,
    getList,
    deleteList,
} from "@/server/shared/redis/list";

import { makeKey } from "@/server/shared/redis/keys";
import { TTL } from "@/server/shared/redis/ttl";

import type {
    TurnEvaluation,
} from "./interview.evaluation.types";

function evaluationKey(
    sessionId: string
) {
    return makeKey(
        "interview",
        sessionId,
        "evaluations"
    );
}

export async function appendTurnEvaluation(
    sessionId: string,
    evaluation: TurnEvaluation
) {
    await appendToList(
        evaluationKey(sessionId),
        evaluation,
        TTL.DAY
    );
}

export async function getTurnEvaluations(
    sessionId: string
) {
    return getList<TurnEvaluation>(
        evaluationKey(sessionId)
    );
}

export async function clearTurnEvaluations(
    sessionId: string
) {
    await deleteList(
        evaluationKey(sessionId)
    );
}