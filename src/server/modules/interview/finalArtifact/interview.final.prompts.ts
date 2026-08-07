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

Return ONLY structured JSON.
`;
}