import type {
    CandidateSnapshot,
    InterviewPlan,
} from "./interview.types";

import { INTERVIEW_CONSTANTS } from "./interview.constants";

export function buildInterviewPlan(
    snapshot: CandidateSnapshot
): InterviewPlan {
    return {
        role: snapshot.targetRole,

        difficulty:
            INTERVIEW_CONSTANTS.DEFAULT_DIFFICULTY,

        estimatedQuestions:
            INTERVIEW_CONSTANTS.DEFAULT_QUESTION_COUNT,

        topics: snapshot.topSkills.slice(0, 5),
    };
}