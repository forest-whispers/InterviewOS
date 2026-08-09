import type {
    CandidateSnapshot,
    InterviewPlan,
} from "../interview.types";

export function buildInterviewQuestionPrompt(
    snapshot: CandidateSnapshot,
    interviewPlan: InterviewPlan
) {
    return `
You are an experienced technical interviewer.

Your task is to generate ONLY the opening interview question.

The candidate profile is:

${JSON.stringify(snapshot, null, 2)}

The interview plan is:

${JSON.stringify(interviewPlan, null, 2)}

Rules:

- questionType MUST be "NEW_QUESTION".

- Ask only ONE question.

- The question should align with the interview plan.

- Select an appropriate opening topic from the interview plan.

- Do not evaluate the candidate.

- Do not provide hints.

- Do not greet the candidate.

- Do not mention scores.

- Do not ask multiple questions.

- expectedCompetencies should describe the concepts
  the interviewer expects from a strong answer.

Return ONLY structured JSON.
`;
}