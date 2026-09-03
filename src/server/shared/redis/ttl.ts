export const TTL = {
    SHORT: 60 * 5,

    MEDIUM: 60 * 30,

    LONG: 60 * 60,

    DAY: 60 * 60 * 24,

    THREE_DAYS:
        60 * 60 * 24 * 3,
} as const;

export const INTERVIEW_TTL = {
    TRANSCRIPT:
        60 * 60 * 24 * 3,

    TURN_EVALUATIONS:
        60 * 60 * 24 * 3,

    STATE:
        60 * 60 * 24 * 3,

    SNAPSHOT:
        60 * 60 * 24 * 3,
} as const;