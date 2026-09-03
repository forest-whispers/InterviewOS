export const INTERVIEW_CONSTANTS = {
    MODEL_NAME: "gemini-3.6-flash",
    // MODEL_NAME: "gemini-2.0-flash",

    DEFAULT_DIFFICULTY: "medium",

    DEFAULT_QUESTION_COUNT: 10,

    SESSION_TTL_SECONDS: 60 * 60 * 24 * 3,

    ABANDONED_STATE_TTL_SECONDS: 60 * 60 * 30 * 24,
} as const;