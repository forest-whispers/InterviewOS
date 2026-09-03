import {
    appendToList,
    getList,
    deleteList,
    appendManyToList,
} from "@/server/shared/redis/list";

import { makeKey } from "@/server/shared/redis/keys";
import { INTERVIEW_TTL } from "@/server/shared/redis/ttl";

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
        INTERVIEW_TTL.TURN_EVALUATIONS
    );
}

export async function appendTurnEvaluations(
    sessionId: string,
    evaluations: TurnEvaluation[]
) {
    await appendManyToList(
        evaluationKey(sessionId),
        evaluations,
        INTERVIEW_TTL.TURN_EVALUATIONS
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