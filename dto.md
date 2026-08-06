**The LLM should not generate the Evaluation Artifact only at the end.**

Instead, there are **two kinds of evaluations**.

1. **Turn Evaluation** (after each answer) → ephemeral, stored in Redis, influences the next question.
2. **Final Evaluation Artifact** (after interview completion) → persistent, stored in PostgreSQL, becomes part of candidate evolution.

That gives us adaptive interviews without permanently updating the candidate after every answer.

---

# Overall Flow

```text
Candidate
        │
        ▼
Candidate Snapshot
        │
        ▼
Interview Session (Redis)
        │
        ▼
Turn Evaluations (Redis)
        │
        ▼
Interview Ends
        │
        ▼
Final Evaluation Artifact
        │
        ▼
Candidate State Aggregator
        │
        ▼
Candidate State
```

---

# Candidate Snapshot (Immutable)

Built once at interview start.

```ts
type CandidateSnapshot = {
    candidateId: string;

    targetRole: string;

    experienceLevel: ExperienceLevel;

    resumeSummary: string;

    topSkills: string[];

    currentWeaknesses: string[];

    currentStrengths: string[];

    previousMistakes: CandidateMistakeSummary[];

    communicationProfile: {
        clarity: number;
        structure: number;
        edgeCaseThinking: number;
    };

    interviewObjective: string;
}
```

This never changes during the interview.

---

# Interview State (Mutable)

Lives only in Redis.

```ts
type InterviewState = {
    sessionId: string;

    interviewPlan: InterviewPlan;

    currentQuestion: Question;

    questionNumber: number;

    currentTopic: string;

    difficulty: "easy" | "medium" | "hard";

    turnEvaluations: TurnEvaluation[];

    askedTopics: string[];

    runtimeObservations: {
        repeatedMistakes: string[];

        correctedMistakes: string[];

        hintsGiven: number;
    };

    startedAt: Date;

    expiresAt: Date;
}
```

Notice

Runtime observations exist **only for this interview**.

---

# Why runtime observations?

Example

Question 2

```text
Forgot event loop.
```

Question 6

User repeats the same mistake.

The interviewer can naturally say:

> Earlier you also confused the event loop. Can you rethink this?

Looks much more intelligent.

These observations disappear once the interview ends.

The Final Evaluation decides what actually becomes permanent.

---

# Turn Evaluation (Every Answer)

Returned by the LLM after every answer.

```ts
type TurnEvaluation = {
    questionId: string;

    score: number;

    correctness: number;

    communication: {
        clarity: number;

        structure: number;
    };

    mistakes: RuntimeMistake[];

    strengths: string[];

    confidence: "low" | "medium" | "high";

    followUpRequired: boolean;

    nextTopic: string;

    difficultyAdjustment:
        | "increase"
        | "decrease"
        | "same";

    interviewerReasoning: string;
}
```

This is stored only in Redis.

---

# Final Evaluation Artifact

Generated after interview completion.

```ts
type EvaluationArtifact = {
    interviewId: string;

    overallScore: number;

    technicalScores: {
        react: number;

        node: number;

        databases: number;

        problemSolving: number;
    };

    communication: {
        clarity: number;

        structure: number;

        conciseness: number;
    };

    behaviouralObservations: string[];

    strengths: Strength[];

    weaknesses: Weakness[];

    extractedMistakes: Mistake[];

    recommendations: string[];

    interviewSummary: string;
}
```

Immutable.

Never edited.

---

# Candidate State

Not stored manually.

Computed.

```ts
type CandidateState = {
    technical: {
        react: SkillState;

        node: SkillState;

        sql: SkillState;
    };

    communication: CommunicationState;

    behaviour: BehaviourState;

    currentWeaknesses: WeaknessSummary[];

    currentStrengths: StrengthSummary[];

    interviewStatistics: {
        totalInterviews: number;

        averageScore: number;

        lastInterviewAt: Date;
    };
}
```

This can always be regenerated.

---

# Skill State

Instead of just

```text
React: 7.5
```

Store

```ts
{
    score: 7.5,

    trend: "improving",

    lastEvaluatedAt: Date,

    evidence: [
        interview4,
        interview7
    ]
}
```

Now every score is explainable.

---

# Mistake

Concrete.

```ts
{
    topic: "React",

    description:
        "Forgot cleanup in useEffect",

    severity: "medium",

    interviewId: "...",

    corrected: false
}
```

---

# Weakness

Derived.

```ts
{
    topic: "React",

    frequency: 5,

    trend: "improving",

    severity: "medium"
}
```

Notice

Weaknesses are aggregated.

Mistakes are facts.

---

# LLM Input

I'd send

```ts
{
    candidateSnapshot,

    interviewState,

    currentQuestion,

    currentAnswer,

    recentTurnEvaluation,

    interviewObjective
}
```

Notice

We **don't** send every previous message.

The interview state already contains the useful runtime information.

---

# LLM Output (Turn)

```ts
{
    score,

    technical,

    communication,

    mistakes,

    strengths,

    interviewerFeedback,

    followUpQuestion,

    nextTopic,

    difficultyAdjustment,

    runtimeObservations
}
```

Everything structured.

---

# LLM Output (Final)

Different prompt.

```ts
{
    overallEvaluation,

    strengths,

    weaknesses,

    communication,

    behaviour,

    recommendations,

    interviewSummary
}
```

No follow-up question.

No next topic.

---

# PostgreSQL (Conceptually)

```text
User
        │
Candidate
        │
Resume
        │
InterviewSession
        │
Transcript
        │
EvaluationArtifact
        │
────────────────────
Mistakes
Weaknesses
Strengths
Reports
```

Everything below `EvaluationArtifact` can even be normalized later if needed.

---

# The piece I think will make InterviewOS feel genuinely intelligent

I would introduce a **Candidate Evolution Engine**.

It isn't an LLM.

It's deterministic business logic.

```text
Evaluation Artifact

+

Previous Candidate State

↓

Aggregation Rules

↓

Updated Candidate State
```

Examples:

* A single mistake does **not** immediately create a weakness.
* Repeating the same mistake across three interviews increases its severity.
* Correcting a long-standing mistake gradually reduces its frequency and trend.
* Strong performance in a topic over multiple interviews increases mastery but doesn't instantly erase historical evidence.

This engine becomes the "memory" of the platform. The LLM generates observations, but **your application decides how the candidate evolves**. I think that's one of the strongest architectural distinctions InterviewOS can have, because it keeps long-term intelligence deterministic, explainable, and independent of whichever LLM you use in the future.