export function buildResumeParsingPrompt(
    resumeText: string
) {
    return `
You are an expert technical recruiter.

Your task is to extract structured information from a candidate's resume.

Rules:

- Only extract information explicitly supported by the resume.
- Do not hallucinate.
- Do not infer technologies not mentioned.
- topSkills should contain the candidate's strongest demonstrated skills, not every technology listed.
- targetRole should represent the role the resume is primarily optimized for.
- Experience level should be one of:
  STUDENT
  FRESHER
  JUNIOR
  MID
  SENIOR

Return ONLY structured JSON.

Resume:

${resumeText}
`;
}