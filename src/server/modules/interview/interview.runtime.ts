import type {
    InterviewState,
} from "./interview.types";

import type {
    TurnEvaluation,
} from "./interview.evaluation.types";
import { GeneratedInterviewQuestion } from "./interview.question.types";

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
        if (
            !repeatedMistakes.some(
                (m) => m.topic === mistake.topic
            )
        ) {
            repeatedMistakes.push(mistake);
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