import {
    getJSON,
    setJSON,
    deleteKey,
} from "@/server/shared/redis/cache";

import { makeKey } from "@/server/shared/redis/keys";

import { TTL } from "@/server/shared/redis/ttl";

import type {
    CandidateSnapshot,
    InterviewState,
} from "./interview.types";

function stateKey(
    sessionId: string
) {
    return makeKey(
        "interview",
        sessionId,
        "state"
    );
}

function snapshotKey(
    sessionId: string
) {
    return makeKey(
        "interview",
        sessionId,
        "snapshot"
    );
}

export async function createInterviewState(
    state: InterviewState
) {
    await setJSON(
        stateKey(state.sessionId),
        state,
        TTL.LONG
    );
}

export async function updateInterviewState(
    state: InterviewState
) {
    await setJSON(
        stateKey(state.sessionId),
        state,
        TTL.LONG
    );
}

export async function getInterviewState(
    sessionId: string
) {
    return getJSON<InterviewState>(
        stateKey(sessionId)
    );
}

export async function clearInterviewState(
    sessionId: string
) {
    await deleteKey(
        stateKey(sessionId)
    );
}

export async function storeCandidateSnapshot(
    sessionId: string,
    snapshot: CandidateSnapshot
) {
    await setJSON(
        snapshotKey(sessionId),
        snapshot,
        TTL.DAY
    );
}

export async function getCandidateSnapshot(
    sessionId: string
) {
    return getJSON<CandidateSnapshot>(
        snapshotKey(sessionId)
    );
}

export async function clearCandidateSnapshot(
    sessionId: string
) {
    await deleteKey(
        snapshotKey(sessionId)
    );
}