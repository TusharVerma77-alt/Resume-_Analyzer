export const RESUME_ANALYSIS_PROMPT_TEMPLATE = `
You are an expert ATS (Applicant Tracking System) Auditor and Senior Technical Recruiter.
Analyze the following resume against target company: {{COMPANY_NAME}} and target role: {{ROLE_TITLE}}.

Company ATS Weights:
- Keyword Match: {{KEYWORD_WEIGHT}}%
- Experience: {{EXPERIENCE_WEIGHT}}%
- Education: {{EDUCATION_WEIGHT}}%
- Skills: {{SKILLS_WEIGHT}}%
- Formatting: {{FORMATTING_WEIGHT}}%

Required Role Skills: {{REQUIRED_SKILLS}}

RESUME CONTENT:
"""
{{RESUME_TEXT}}
"""

Return a JSON evaluation with:
- overallScore (0-100)
- grade ('S', 'A', 'B', 'C', 'D', 'F')
- keywordMatchScore (0-100)
- experienceScore (0-100)
- educationScore (0-100)
- skillsScore (0-100)
- formattingScore (0-100)
- summary (2-3 concise sentences)
- strengths (3 bullet points)
- weaknesses (3 bullet points)
- improvements (3 concrete actionable suggestions)
- interviewQuestions (3 customized technical/behavioral interview questions based on gaps)
`;
