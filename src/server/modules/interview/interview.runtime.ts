import type {
    InterviewRuntimeSummary,
    InterviewState,
} from "./interview.types";

import type {
    RuntimeMistake,
    TurnEvaluation
} from "./evaluation/interview.evaluation.types";
import { GeneratedInterviewQuestion } from "./question/interview.question.types";

function normalizeText(
    value: string
): string {
    return value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function getMistakeKey(
    mistake: RuntimeMistake
): string {
    return [
        normalizeText(
            mistake.topic
        ),

        normalizeText(
            mistake.description
        ),
    ].join(":");
}

export function buildRuntimeSummary(
    state: InterviewState
): InterviewRuntimeSummary {
    return {
        hintsGiven:
            state.runtimeObservations.hintsGiven,

        skippedQuestions:
            state.runtimeObservations.skippedQuestions,

        topicsCovered:
            [
                ...state.runtimeObservations.topicsCovered,
            ],

        repeatedMistakes:
            [
                ...state.runtimeObservations
                    .repeatedMistakes,
            ],

        correctedMistakes:
            [
                ...state.runtimeObservations
                    .correctedMistakes,
            ],
    };
}

export function updateRuntimeObservations(
    interviewState: InterviewState,
    evaluation: TurnEvaluation
): InterviewState {

    const repeatedMistakes = [
        ...interviewState.runtimeObservations.repeatedMistakes,
    ];

    const correctedMistakes = [
        ...interviewState.runtimeObservations.correctedMistakes,
    ];

    const topicsCovered = [
        ...interviewState.runtimeObservations.topicsCovered,
    ];

    for (const mistake of evaluation.mistakes) {

        const mistakeKey =
            getMistakeKey(mistake);

        const repeatedIndex =
            repeatedMistakes.findIndex(
                (existing) =>
                    getMistakeKey(existing) ===
                    mistakeKey
            );

        const correctedIndex =
            correctedMistakes.findIndex(
                (existing) =>
                    getMistakeKey(existing) ===
                    mistakeKey
            );

        if (mistake.corrected) {

            if (repeatedIndex !== -1) {
                repeatedMistakes.splice(
                    repeatedIndex,
                    1
                );
            }

            if (correctedIndex === -1) {
                correctedMistakes.push(
                    mistake
                );
            } else {
                correctedMistakes[
                    correctedIndex
                ] = mistake;
            }

            continue;
        }

        if (correctedIndex !== -1) {
            correctedMistakes.splice(
                correctedIndex,
                1
            );
        }

        if (repeatedIndex === -1) {
            repeatedMistakes.push(
                mistake
            );
        } else {
            repeatedMistakes[
                repeatedIndex
            ] = mistake;
        }
    }

    const alreadyCovered = topicsCovered.some(
        (topic) =>
            normalizeText(topic) ===
            normalizeText(evaluation.topic)
    );

    if (!alreadyCovered) {
        topicsCovered.push(evaluation.topic);
    }

    return {
        ...interviewState,

        difficulty:
            evaluation.difficultyAdjustment ===
                "increase"
                ? "hard"
                : evaluation.difficultyAdjustment ===
                    "decrease"
                    ? "easy"
                    : interviewState.difficulty,

        runtimeObservations: {
            ...interviewState.runtimeObservations,

            topicsCovered,

            repeatedMistakes,

            correctedMistakes,

            hintsGiven:
                interviewState.runtimeObservations.hintsGiven,

            skippedQuestions:
                interviewState.runtimeObservations.skippedQuestions,
        },
    };
}

export function advanceInterviewState(
    interviewState: InterviewState,
    nextQuestion: GeneratedInterviewQuestion
): InterviewState {

    return {
        ...interviewState,

        currentQuestion: nextQuestion,

        currentTopic:
            nextQuestion.topic,

        difficulty:
            nextQuestion.difficulty,

        questionNumber:
            interviewState.questionNumber + 1,
    };
}