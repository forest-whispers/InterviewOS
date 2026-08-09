import type {
    CandidateSnapshot,
    InterviewPlan,
} from "./interview.types";

import { INTERVIEW_CONSTANTS } from "./interview.constants";

function normalizeTopic(
    topic: string
): string {
    return topic
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function addTopic(
    topics: string[],
    topic: string
): void {

    const normalized =
        normalizeTopic(topic);

    const exists =
        topics.some(
            (existing) =>
                normalizeTopic(existing) ===
                normalized
        );

    if (!exists) {
        topics.push(topic);
    }
}

export function buildInterviewPlan(
    snapshot: CandidateSnapshot,
    customTopics?: string[]
): InterviewPlan {
    const topics: string[] = [];

    if (customTopics && customTopics.length > 0) {
        for (const topic of customTopics) {
            addTopic(
                topics,
                topic
            );
        }
    } else {
        /*
        * Prioritize current weaknesses.
        */
        for (
            const weakness
            of snapshot.currentWeaknesses
        ) {
            addTopic(
                topics,
                weakness.topic
            );
        }

        /*
         * Then include unresolved
         * previous mistakes.
         */
        for (
            const mistake
            of snapshot.previousMistakes
        ) {
            if (!mistake.corrected) {
                addTopic(
                    topics,
                    mistake.topic
                );
            }
        }

        /*
         * Finally fill remaining slots
         * with the candidate's top skills.
         */
        for (
            const skill
            of snapshot.topSkills
        ) {
            addTopic(
                topics,
                skill
            );
       }
    }

    return {
        role:
            snapshot.targetRole,

        difficulty:
            INTERVIEW_CONSTANTS.DEFAULT_DIFFICULTY,

        estimatedQuestions:
            INTERVIEW_CONSTANTS.DEFAULT_QUESTION_COUNT,

        topics:
            customTopics?.length==0 ? topics.slice(0, 5) : topics,
    };
}