import type { LLMProvider, Company, JobRole, AtsScoreResult } from '../types/resume';
import { calculateAtsScore } from './atsScorer';
import { RESUME_ANALYSIS_PROMPT_TEMPLATE } from '../config/prompts';

export interface AnalysisOptions {
  provider: LLMProvider;
  apiKey?: string;
  customPrompt?: string;
}

export async function analyzeResumeWithLLM(
  resumeText: string,
  company: Company,
  role: JobRole,
  options: AnalysisOptions
): Promise<AtsScoreResult> {
  const baseResult = calculateAtsScore(resumeText, company, role);

  // If mock or no API key, return enriched deterministic baseResult
  if (options.provider === 'mock' || !options.apiKey) {
    // Simulate brief latency for realism
    await new Promise((resolve) => setTimeout(resolve, 800));
    return baseResult;
  }

  // Construct prompt from template
  const prompt = (options.customPrompt || RESUME_ANALYSIS_PROMPT_TEMPLATE)
    .replace('{{COMPANY_NAME}}', company.name)
    .replace('{{ROLE_TITLE}}', role.title)
    .replace('{{KEYWORD_WEIGHT}}', company.scoringWeights.keywordMatchWeight.toString())
    .replace('{{EXPERIENCE_WEIGHT}}', company.scoringWeights.experienceWeight.toString())
    .replace('{{EDUCATION_WEIGHT}}', company.scoringWeights.educationWeight.toString())
    .replace('{{SKILLS_WEIGHT}}', company.scoringWeights.skillsWeight.toString())
    .replace('{{FORMATTING_WEIGHT}}', company.scoringWeights.formattingWeight.toString())
    .replace('{{REQUIRED_SKILLS}}', role.requiredSkills.join(', '))
    .replace('{{RESUME_TEXT}}', resumeText);

  try {
    if (options.provider === 'gemini') {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${options.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' }
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const textOutput = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textOutput) {
        const parsed = JSON.parse(textOutput);
        return {
          ...baseResult,
          ...parsed,
          sectionBreakdown: baseResult.sectionBreakdown,
          missingKeywordsByCategory: baseResult.missingKeywordsByCategory,
          matchedKeywords: baseResult.matchedKeywords
        };
      }
    } else if (options.provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${options.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API Error: ${response.statusText}`);
      }

      const data = await response.json();
      const textOutput = data.choices?.[0]?.message?.content;
      if (textOutput) {
        const parsed = JSON.parse(textOutput);
        return {
          ...baseResult,
          ...parsed,
          sectionBreakdown: baseResult.sectionBreakdown,
          missingKeywordsByCategory: baseResult.missingKeywordsByCategory,
          matchedKeywords: baseResult.matchedKeywords
        };
      }
    }
  } catch (error) {
    console.warn('LLM API Call failed, falling back to ATS Scorer engine:', error);
  }

  return baseResult;
}
