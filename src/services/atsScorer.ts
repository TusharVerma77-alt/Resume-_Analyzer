import type { Company, JobRole, AtsScoreResult, SectionMatch, MissingKeywordCategory } from '../types/resume';

export function calculateAtsScore(
  resumeText: string,
  company: Company,
  role: JobRole
): AtsScoreResult {
  const textLower = resumeText.toLowerCase();

  // 1. Calculate Keyword Matches by Company Categories
  const matchedKeywords: string[] = [];
  const missingKeywordsByCategory: MissingKeywordCategory[] = [];

  let totalWeightedCategoryScore = 0;
  let totalCategoryMaxWeight = 0;

  company.atsKeywords.forEach((cat) => {
    const catMissing: string[] = [];
    let catMatches = 0;

    cat.keywords.forEach((kw) => {
      if (textLower.includes(kw.toLowerCase())) {
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
        }
        catMatches++;
      } else {
        catMissing.push(kw);
      }
    });

    const matchRatio = cat.keywords.length > 0 ? catMatches / cat.keywords.length : 1;
    totalWeightedCategoryScore += matchRatio * cat.weight;
    totalCategoryMaxWeight += cat.weight;

    if (catMissing.length > 0) {
      missingKeywordsByCategory.push({
        category: cat.category,
        missingKeywords: catMissing,
        importance: cat.weight >= 9 ? 'High' : cat.weight >= 7 ? 'Medium' : 'Low'
      });
    }
  });

  const keywordMatchScore = Math.round(
    totalCategoryMaxWeight > 0 ? (totalWeightedCategoryScore / totalCategoryMaxWeight) * 100 : 70
  );

  // 2. Role Required Skills score
  let matchedRequired = 0;
  role.requiredSkills.forEach((skill) => {
    if (textLower.includes(skill.toLowerCase())) {
      matchedRequired++;
    }
  });

  const skillsScore = Math.round(
    role.requiredSkills.length > 0 ? (matchedRequired / role.requiredSkills.length) * 100 : 75
  );

  // 3. Section Breakdown (Skills, Experience, Education, Projects, Certifications)
  const sections = [
    { name: 'Technical Skills', keywords: role.sectionKeywords.skills },
    { name: 'Work Experience', keywords: role.sectionKeywords.experience },
    { name: 'Education & Degree', keywords: role.sectionKeywords.education },
    { name: 'Projects & Portfolio', keywords: role.sectionKeywords.projects },
    { name: 'Certifications', keywords: role.sectionKeywords.certifications }
  ];

  const sectionBreakdown: SectionMatch[] = sections.map((sec) => {
    const secMatched: string[] = [];
    const secMissing: string[] = [];

    sec.keywords.forEach((kw) => {
      if (textLower.includes(kw.toLowerCase())) {
        secMatched.push(kw);
      } else {
        secMissing.push(kw);
      }
    });

    const score = sec.keywords.length > 0 ? Math.round((secMatched.length / sec.keywords.length) * 100) : 80;

    return {
      sectionName: sec.name,
      score: Math.max(30, score),
      totalKeywords: sec.keywords.length,
      matchedKeywords: secMatched,
      missingKeywords: secMissing
    };
  });

  const experienceSection = sectionBreakdown.find((s) => s.sectionName === 'Work Experience');
  const educationSection = sectionBreakdown.find((s) => s.sectionName === 'Education & Degree');

  const experienceScore = Math.min(100, Math.max(45, experienceSection ? experienceSection.score + 15 : 70));
  const educationScore = Math.min(100, Math.max(50, educationSection ? educationSection.score + 20 : 80));

  // Check formatting heuristics (bullet points, email, phone, word count)
  let formattingScore = 85;
  if (!textLower.includes('@')) formattingScore -= 15;
  if (!/\d{10}|\(\d{3}\)/.test(resumeText)) formattingScore -= 10;
  if (resumeText.length < 300) formattingScore -= 25;
  if (resumeText.length > 8000) formattingScore -= 10;
  formattingScore = Math.max(40, formattingScore);

  // Weighted Overall ATS Score
  const weights = company.scoringWeights;
  const totalWeightSum =
    weights.keywordMatchWeight +
    weights.experienceWeight +
    weights.educationWeight +
    weights.skillsWeight +
    weights.formattingWeight;

  const overallScore = Math.round(
    (keywordMatchScore * weights.keywordMatchWeight +
      experienceScore * weights.experienceWeight +
      educationScore * weights.educationWeight +
      skillsScore * weights.skillsWeight +
      formattingScore * weights.formattingWeight) /
      totalWeightSum
  );

  let grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  if (overallScore >= 90) grade = 'S';
  else if (overallScore >= 80) grade = 'A';
  else if (overallScore >= 70) grade = 'B';
  else if (overallScore >= 60) grade = 'C';
  else if (overallScore >= 50) grade = 'D';
  else grade = 'F';

  // Dynamic strengths & weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const improvements: string[] = [];

  if (keywordMatchScore >= 75) {
    strengths.push(`High keyword alignment with ${company.name}'s specific tech stack & culture.`);
  } else {
    weaknesses.push(`Lacks essential ${company.name} ATS keywords like: ${missingKeywordsByCategory[0]?.missingKeywords.slice(0, 3).join(', ') || 'key tech'}.`);
    improvements.push(`Incorporate target keywords naturally into your experience bullet points.`);
  }

  if (skillsScore >= 80) {
    strengths.push(`Strong coverage of core skills required for ${role.title}.`);
  } else {
    weaknesses.push(`Missing core role competencies like ${role.requiredSkills.filter(s => !textLower.includes(s.toLowerCase())).slice(0, 3).join(', ')}.`);
    improvements.push(`Explicitly highlight projects where you used ${role.requiredSkills.slice(0, 2).join(' and ')}.`);
  }

  if (formattingScore >= 80) {
    strengths.push('Clean contact details and ATS-friendly section layout.');
  } else {
    weaknesses.push('Potential ATS parsing issue (missing standard contact info or irregular length).');
    improvements.push('Ensure standard email, phone number, and bulleted project achievements are clearly formatted.');
  }

  const interviewQuestions = [
    `How have you applied ${matchedKeywords[0] || role.requiredSkills[0]} to solve scaling or business challenges in your recent projects?`,
    `Can you walk us through a scenario where you had to quickly pick up ${missingKeywordsByCategory[0]?.missingKeywords[0] || role.preferredSkills[0]} under tight deadlines?`,
    `How do your past experience metrics align with ${company.name}'s core values like "${company.cultureFitKeywords[0] || 'Leadership'}"?`
  ];

  return {
    overallScore,
    grade,
    keywordMatchScore,
    experienceScore,
    educationScore,
    skillsScore,
    formattingScore,
    sectionBreakdown,
    missingKeywordsByCategory,
    matchedKeywords,
    summary: `Your resume scores ${overallScore}/100 for the ${role.title} position at ${company.name}. Key match areas include ${matchedKeywords.slice(0, 3).join(', ')}, while key missing targets include ${missingKeywordsByCategory[0]?.missingKeywords.slice(0, 2).join(', ') || 'advanced domain terms'}.`,
    strengths,
    weaknesses,
    improvements,
    interviewQuestions
  };
}
