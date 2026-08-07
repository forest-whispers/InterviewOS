import type {
    CandidateSnapshot,
    InterviewState,
} from "./interview.types";

import type {
    TranscriptMessage
} from "./interview.transcript.types";

import type {
    TurnEvaluation,
} from "./interview.evaluation.types";

import type {
    InterviewContext
} from "./interview.evaluation.types";

interface BuildInterviewContextInput {
    snapshot: CandidateSnapshot;

    interviewState: InterviewState;

    transcript: TranscriptMessage[];

    evaluations: TurnEvaluation[];
}

const RECENT_MESSAGE_LIMIT = 6;

const RECENT_EVALUATION_LIMIT = 2;

export function buildInterviewContext({
    snapshot,
    interviewState,
    transcript,
    evaluations,
}: BuildInterviewContextInput): InterviewContext {
    if (!interviewState.currentQuestion) {
        throw new Error(
            "Current interview question is missing."
        );
    }

    return {
        candidate: snapshot,

        interview: {
            objective:
                snapshot.interviewObjective,

            currentQuestion:
                interviewState.currentQuestion,

            questionNumber:
                interviewState.questionNumber,

            runtimeObservations:
                interviewState.runtimeObservations,
        },

        history: {
            recentMessages:
                transcript.slice(
                    -RECENT_MESSAGE_LIMIT
                ),

            recentEvaluations:
                evaluations.slice(
                    -RECENT_EVALUATION_LIMIT
                ),
        },
    };
}