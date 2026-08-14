import { GenerateFinalEvaluationInput } from "./interview.final.ai";

export function buildFinalEvaluationPrompt({
    snapshot,
    turnEvaluations,
    interviewMetadata
}: GenerateFinalEvaluationInput) {
    return `
You are an experienced technical interviewer.

Your task is to generate the FINAL interview evaluation report.

Candidate Snapshot

${JSON.stringify(snapshot, null, 2)}

Turn Evaluations

${JSON.stringify(turnEvaluations, null, 2)}

Interview Metadata
${JSON.stringify(interviewMetadata, null, 2)}

Instructions

The turn evaluations have already evaluated each interview response.

Treat them as factual evidence.

Do NOT independently rescore every answer.

Instead,

- synthesize the interview,
- identify consistent strengths,
- identify recurring weaknesses,
- identify important mistakes,
- produce meaningful recommendations,
- produce one coherent interview summary.

Instructions for mistakes:

The Candidate Snapshot contains historical "previousMistakes". 
The Turn Evaluations contain the factual mistakes observed during this interview.

Do not infer an "updated representation" merely because the wording is different.

Use the following rules when producing the final evaluation's mistakes:

1. EXISTING MISTAKE — SAME REPRESENTATION

If a mistake observed in the current interview refers to an existing mistake
in Candidate Snapshot.previousMistakes, reuse that historical mistake's
EXACT "topic" and EXACT "description".

Do not create a new mistake merely because the Turn Evaluation uses different
wording to describe the same underlying mistake.

When reusing an existing mistake, preserve its topic and description exactly
as they appear in Candidate Snapshot.previousMistakes and update only the
appropriate fields such as severity or corrected status.

2. EXISTING MISTAKE — UPDATED REPRESENTATION

Sometimes the current interview provides enough evidence to justify a more
precise or meaningfully different topic/description for a historical mistake.

In that case, do NOT simply replace the historical mistake.

Instead:

- Return the historical mistake using its EXACT original "topic" and
  "description" and set "corrected": true.
- Also return the newly formulated mistake using its new topic and
  description with "corrected": false if the mistake remains present.

This explicitly tells the backend that the old representation should be
retired and the new representation should become the active mistake.

Only do this when the new representation is genuinely more precise or
meaningfully different. Do not do it merely because the wording differs.

3. NEW MISTAKE

If a mistake observed in the current interview does not correspond to any
historical mistake, return it as a new mistake.

4. HISTORICAL MISTAKES NOT OBSERVED

Do not output historical mistakes from Candidate Snapshot.previousMistakes
unless the current interview's Turn Evaluations provide evidence that the
mistake was discussed, repeated, corrected, or otherwise materially
addressed.

5. IDENTITY

A mistake is identified by the combination of its conceptual meaning,
topic, and description—not by topic alone.

Do not merge distinct mistakes merely because they share a broad topic such
as "React", "PostgreSQL", "Redis", or "System Design".

6. CORRECTION

If the current interview demonstrates that a historical mistake has been
corrected, return the historical mistake using its EXACT original topic and
description with "corrected": true.

Do not silently rename a corrected historical mistake.

Return ONLY structured JSON.
`;
}