import type {
    CandidateState,
} from "./candidate.state.types";

import type {
    EvaluationArtifact
} from "../interview/finalArtifact/interview.final.types";

import type {
    CandidateMistakeSummary,
    SkillState,
    StrengthSummary,
    WeaknessSummary,
} from "./candidate.types";

const TREND_THRESHOLD = 0.5;

function calculateTrend(
    previousScore: number,
    currentScore: number
) {
    const difference =
        currentScore - previousScore;

    if (difference >= TREND_THRESHOLD) {
        return "IMPROVING" as const;
    }

    if (difference <= -TREND_THRESHOLD) {
        return "DECLINING" as const;
    }

    return "STABLE" as const;
}

function calculateAverage(
    previousScore: number,
    observationCount: number,
    newScore: number
) {
    return (
        (
            previousScore * observationCount +
            newScore
        ) /
        (observationCount + 1)
    );
}

function aggregateTechnicalScores(
    previousState: CandidateState | null,
    evaluation: EvaluationArtifact,
    evaluationId: string,
    evaluatedAt: string
): Record<string, SkillState> {
    const previousTechnical =
        previousState?.technical ?? {};

    const nextTechnical: Record<
        string,
        SkillState
    > = {
        ...previousTechnical,
    };

    const scores = evaluation.technical;

    for (const [skill, newScore] of Object.entries(scores)) {
        const previous =
            previousTechnical[skill];

        if (!previous) {
            nextTechnical[skill] = {
                score: newScore,

                trend: "STABLE",

                observationCount: 1,

                lastEvaluatedAt:
                    evaluatedAt,

                evidence: [
                    evaluationId,
                ],
            };

            continue;
        }

        const nextScore =
            calculateAverage(
                previous.score,
                previous.observationCount,
                newScore
            );

        nextTechnical[skill] = {
            score: Number(
                nextScore.toFixed(2)
            ),

            trend: calculateTrend(
                previous.score,
                newScore
            ),

            observationCount:
                previous.observationCount + 1,

            lastEvaluatedAt:
                evaluatedAt,

            evidence: [
                ...previous.evidence,
                evaluationId,
            ],
        };
    }

    return nextTechnical;
}

function aggregateCommunication(
    previousState: CandidateState | null,
    evaluation: EvaluationArtifact
) {
    const previous =
        previousState?.communication;

    const current =
        evaluation.communication;

    if (!previous) {
        return {
            clarity: current.clarity,

            structure: current.structure,

            conciseness:
                current.conciseness,

            trend: "STABLE" as const,
        };
    }

    const previousAverage =
        (
            previous.clarity +
            previous.structure +
            previous.conciseness
        ) / 3;

    const currentAverage =
        (
            current.clarity +
            current.structure +
            current.conciseness
        ) / 3;

    return {
        clarity: Number(
            (
                (previous.clarity + current.clarity) /
                2
            ).toFixed(2)
        ),

        structure: Number(
            (
                (previous.structure + current.structure) /
                2
            ).toFixed(2)
        ),

        conciseness: Number(
            (
                (
                    previous.conciseness +
                    current.conciseness
                ) / 2
            ).toFixed(2)
        ),

        trend: calculateTrend(
            previousAverage,
            currentAverage
        ),
    };
}

function normalizeTopic(
    topic: string
) {
    return topic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function aggregateWeaknesses(
    previousState: CandidateState | null,
    evaluation: EvaluationArtifact,
    occurredAt: string
): WeaknessSummary[] {
    const existing =
        previousState?.currentWeaknesses ?? [];

    const weaknesses = [
        ...existing,
    ];

    for (const weakness of evaluation.weaknesses) {
        const normalizedTopic =
            normalizeTopic(
                weakness.topic
            );

        const existingIndex =
            weaknesses.findIndex(
                (item) =>
                    normalizeTopic(
                        item.topic
                    ) === normalizedTopic
            );

        if (existingIndex === -1) {
            weaknesses.push({
                topic: weakness.topic,

                frequency: 1,

                severity:
                    weakness.severity,

                trend: "STABLE",

                firstSeenAt:
                    occurredAt,

                lastSeenAt:
                    occurredAt,
            });

            continue;
        }

        const existingWeakness =
            weaknesses[existingIndex];

        const previousFrequency =
            existingWeakness.frequency;

        weaknesses[existingIndex] = {
            ...existingWeakness,

            frequency:
                previousFrequency + 1,

            severity:
                weakness.severity === "HIGH"
                    ? "HIGH"
                    : existingWeakness.severity,

            trend: "STABLE",

            lastSeenAt:
                occurredAt,
        };
    }

    return weaknesses;
}

function aggregateStrengths(
    previousState: CandidateState | null,
    evaluation: EvaluationArtifact,
    occurredAt: string
): StrengthSummary[] {
    const existing =
        previousState?.currentStrengths ?? [];

    const strengths = [
        ...existing,
    ];

    for (const strength of evaluation.strengths) {
        const normalizedTopic =
            normalizeTopic(
                strength.topic
            );

        const existingIndex =
            strengths.findIndex(
                (item) =>
                    normalizeTopic(
                        item.topic
                    ) === normalizedTopic
            );

        if (existingIndex === -1) {
            strengths.push({
                topic: strength.topic,

                frequency: 1,

                confidence: strength.confidence,

                trend: "STABLE",

                lastSeenAt:
                    occurredAt,
            });

            continue;
        }

        const existingStrength =
            strengths[existingIndex];

        strengths[existingIndex] = {
            ...existingStrength,

            frequency:
                existingStrength.frequency + 1,

            trend: "STABLE",

            lastSeenAt:
                occurredAt,
        };
    }

    return strengths;
}

function aggregateMistakes(
    previousState: CandidateState | null,
    evaluation: EvaluationArtifact,
    interviewId: string,
    occurredAt: string
): CandidateMistakeSummary[] {
    const existing =
        previousState?.previousMistakes ?? [];

    const newMistakes =
        evaluation.mistakes.map(
            (mistake) => ({
                topic: mistake.topic,

                description:
                    mistake.description,

                severity:
                    mistake.severity,

                interviewId,

                corrected:
                    mistake.corrected,

                occurredAt,
            })
        );

    return [
        ...existing,
        ...newMistakes,
    ];
}

export function aggregateCandidateState(
    previousState: CandidateState | null,
    evaluation: EvaluationArtifact,
    evaluationId: string,
    interviewId: string,
    evaluatedAt = new Date().toISOString()
): CandidateState {
    return {
        technical:
            aggregateTechnicalScores(
                previousState,
                evaluation,
                evaluationId,
                evaluatedAt
            ),

        communication:
            aggregateCommunication(
                previousState,
                evaluation
            ),

        currentWeaknesses:
            aggregateWeaknesses(
                previousState,
                evaluation,
                evaluatedAt
            ),

        currentStrengths:
            aggregateStrengths(
                previousState,
                evaluation,
                evaluatedAt
            ),

        previousMistakes:
            aggregateMistakes(
                previousState,
                evaluation,
                interviewId,
                evaluatedAt
            ),
    };
}