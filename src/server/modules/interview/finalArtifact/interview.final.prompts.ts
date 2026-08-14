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

Sometimes the current interview provides enough evidence that a historical
mistake is still present, but the current Turn Evaluations describe that
mistake more precisely or identify a meaningfully more specific
representation.

In that case, treat this as a REPRESENTATION TRANSITION, not as a correction
of the underlying mistake.

Return BOTH representations:

- Return the historical mistake using its EXACT original "topic" and EXACT
  original "description" with "corrected": true.
- Return the newer, more precise representation using its new "topic" and
  "description" with "corrected": false.

The purpose of "corrected": true on the historical representation is to tell
the backend that this historical representation is being retired/replaced.
It does NOT mean that the candidate corrected the underlying conceptual
mistake.

The backend may reduce the historical mistake's frequency and eventually
remove it when its frequency reaches zero, while the newer representation
becomes a new active mistake.

Only perform this representation transition when the newer representation
is genuinely more precise or meaningfully different in conceptual scope.
Do not perform it merely because the wording differs.

For example, if the historical mistake is:

{
  "topic": "Multi-Column B-Tree Index Traversal",
  "description": "Claimed that composite index column order does not affect lookup speed."
}

and the current interview identifies a more specific mistake:

{
  "topic": "Multi-Column B-Tree Index Traversal",
  "description": "Claimed PostgreSQL can perform direct B-Tree lookups using only a non-leading column in a composite index."
}

then return both representations, with the historical representation marked
"corrected": true and the newer representation marked "corrected": false.

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

6. ACTUAL CORRECTION

If the current interview provides positive evidence that the candidate has
actually corrected the underlying conceptual mistake, return the historical
mistake using its EXACT original "topic" and EXACT original "description"
with "corrected": true.

Do not mark a mistake as corrected merely because its representation is
being replaced by a more precise representation.

In a representation transition under rule 2, "corrected": true means only
that the OLD REPRESENTATION is being retired. The newer representation must
remain "corrected": false if the underlying mistake is still present.

Do not silently rename a historical mistake when marking an actual
correction.

Return ONLY structured JSON.
`;
}