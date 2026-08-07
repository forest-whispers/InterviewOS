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

1. Evaluate ONLY the candidate's latest answer.

2. Score the response using these rules:
   - correctness: 0–10 (technical accuracy only)
   - score: 0–10 (overall performance)

3. Extract strengths and mistakes.

4. Decide whether the interview difficulty should change.

5. Determine followUpRequired using these rules:

Set followUpRequired = true if ANY of the following are true:
- correctness < 7
- any HIGH severity mistake exists
- two or more MEDIUM severity mistakes exist
- the candidate explicitly expresses uncertainty
- the current question's primary competency was not demonstrated

Otherwise set followUpRequired = false.

6. If followUpRequired is true:
- Ask exactly ONE follow-up question.
- The follow-up MUST stay on the SAME topic.
- The follow-up MUST directly address the candidate's mistakes or missing concepts.
- DO NOT introduce a new topic.

7. If followUpRequired is false:
- Ask exactly ONE new question from the next topic in the interview plan.
- Gradually increase or decrease difficulty based on previous performance.

8. The interview should prioritize depth before breadth. Do not move to a new topic until the candidate demonstrates sufficient understanding of the current topic.

9. Return ONLY structured JSON matching the required schema.
`;
}