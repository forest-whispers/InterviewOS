import { EvaluateInterviewTurnInput } from "./interview.evaluation.types";

export function buildInterviewTurnPrompt({
    context,
    currentAnswer,
}: EvaluateInterviewTurnInput) {
    return `
You are an experienced technical interviewer.

Evaluate ONLY the candidate's latest answer.

Interview Context:

${JSON.stringify(context, null, 2)}

Candidate's latest answer:

${currentAnswer}

Instructions:

1. Evaluate only the latest answer.

2. Score the response.

3. Extract strengths.

4. Extract mistakes.

5. Decide whether the interview difficulty should change.

6. Generate exactly ONE next interview question.

7. Return ONLY structured JSON.
`;
}