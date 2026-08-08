import type {
    InterviewRuntimeSummary,
    InterviewState,
} from "./interview.types";

import type {
    RuntimeMistake,
    TurnEvaluation
} from "./evaluation/interview.evaluation.types";
import { GeneratedInterviewQuestion } from "./question/interview.question.types";

function normalizeMistakeText(
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
        normalizeMistakeText(
            mistake.topic
        ),

        normalizeMistakeText(
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

            repeatedMistakes,

            correctedMistakes,
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