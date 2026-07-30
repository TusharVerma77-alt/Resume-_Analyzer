export type LLMProvider = 'gemini' | 'openai' | 'claude' | 'mock';

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  industry: string;
  atsKeywords: {
    category: string;
    keywords: string[];
    weight: number; // 1-10
  }[];
  scoringWeights: {
    keywordMatchWeight: number;
    experienceWeight: number;
    educationWeight: number;
    skillsWeight: number;
    formattingWeight: number;
  };
  cultureFitKeywords: string[];
  description: string;
}

export interface JobRole {
  id: string;
  title: string;
  department: string;
  level: 'Junior' | 'Mid' | 'Senior' | 'Lead' | 'Executive';
  requiredSkills: string[];
  preferredSkills: string[];
  sectionKeywords: {
    skills: string[];
    experience: string[];
    education: string[];
    projects: string[];
    certifications: string[];
  };
}

export interface MissingKeywordCategory {
  category: string;
  missingKeywords: string[];
  importance: 'High' | 'Medium' | 'Low';
}

export interface SectionMatch {
  sectionName: string;
  score: number; // 0-100
  totalKeywords: number;
  matchedKeywords: string[];
  missingKeywords: string[];
}

export interface AtsScoreResult {
  overallScore: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  keywordMatchScore: number;
  experienceScore: number;
  educationScore: number;
  skillsScore: number;
  formattingScore: number;
  sectionBreakdown: SectionMatch[];
  missingKeywordsByCategory: MissingKeywordCategory[];
  matchedKeywords: string[];
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  interviewQuestions: string[];
}

export interface ResumeData {
  id: string;
  fileName: string;
  uploadDate: Date;
  rawText: string;
  parsedSections: {
    contact?: string;
    summary?: string;
    experience?: string;
    education?: string;
    skills?: string;
    projects?: string;
    certifications?: string;
  };
}

export interface HistoryItem {
  id: string;
  date: string;
  fileName: string;
  companyName: string;
  roleTitle: string;
  overallScore: number;
  result: AtsScoreResult;
}
