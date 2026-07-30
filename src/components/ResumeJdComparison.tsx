import React, { useState } from 'react';
import type { Company, JobRole, AtsScoreResult } from '../types/resume';
import { calculateAtsScore } from '../services/atsScorer';
import { FileText, ArrowRightLeft, Sparkles, CheckCircle2, AlertTriangle, Briefcase } from 'lucide-react';

interface ResumeJdComparisonProps {
  companies: Company[];
  roles: JobRole[];
}

export const ResumeJdComparison: React.FC<ResumeJdComparisonProps> = ({ companies, roles }) => {
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [comparisonResult, setComparisonResult] = useState<{
    atsResult: AtsScoreResult;
    jdKeywords: string[];
    matchedJdKeywords: string[];
    missingJdKeywords: string[];
    jdMatchPercentage: number;
  } | null>(null);

  const handleCompare = () => {
    if (!resumeText || !jobDescription) return;

    const resumeLower = resumeText.toLowerCase();

    // Extract key technical & business terms from custom JD (words length >= 4 or specific patterns)
    const rawTokens = jobDescription
      .replace(/[^\w\s\+\#\.]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length >= 3);

    // Frequency filter for meaningful terms
    const termMap: Record<string, number> = {};
    rawTokens.forEach((token) => {
      const clean = token.trim();
      const lower = clean.toLowerCase();
      // Filter out common english stop words
      const stopWords = ['and', 'the', 'for', 'with', 'you', 'will', 'that', 'this', 'have', 'from', 'your', 'are', 'work', 'team', 'must', 'should', 'with', 'about'];
      if (!stopWords.includes(lower) && !/^\d+$/.test(lower)) {
        termMap[clean] = (termMap[clean] || 0) + 1;
      }
    });

    // Top 20 extracted keywords from JD
    const jdKeywords = Object.entries(termMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([term]) => term);

    const matchedJdKeywords: string[] = [];
    const missingJdKeywords: string[] = [];

    jdKeywords.forEach((kw) => {
      if (resumeLower.includes(kw.toLowerCase())) {
        matchedJdKeywords.push(kw);
      } else {
        missingJdKeywords.push(kw);
      }
    });

    const jdMatchPercentage = jdKeywords.length > 0 ? Math.round((matchedJdKeywords.length / jdKeywords.length) * 100) : 0;

    // Also run full company/role ATS engine on resume
    const atsResult = calculateAtsScore(resumeText, companies[0], roles[0]);

    setComparisonResult({
      atsResult,
      jdKeywords,
      matchedJdKeywords,
      missingJdKeywords,
      jdMatchPercentage
    });
  };

  const loadSamplePair = () => {
    const sampleResume = `Alex Mercer
alex.mercer@email.com | (555) 019-2834 | San Francisco, CA

SUMMARY
Senior Software Engineer with 6+ years of experience building scalable Web applications and cloud services using React, TypeScript, Node.js, Python, PostgreSQL, and AWS (Lambda, ECS, S3).

EXPERIENCE
Senior Software Engineer | TechScale Inc. | 2022 - Present
- Architected real-time streaming analytics engine with React, TypeScript, Kafka, and Redis.
- Managed AWS infrastructure with Terraform, Docker, and Kubernetes (EKS).
- Integrated REST APIs and GraphQL endpoints for customer web applications.

TECHNICAL SKILLS
JavaScript, TypeScript, Python, React, Next.js, Node.js, Express, Docker, Kubernetes, AWS, SQL, PostgreSQL, GraphQL, Git`;

    const sampleJd = `Senior Full Stack Cloud Engineer - NextGen Systems

We are looking for a Senior Full Stack Engineer to build next-generation AI powered web applications.

Key Responsibilities:
- Build high-performance frontend interfaces using React, TypeScript, Next.js, and TailwindCSS.
- Develop scalable backend microservices using Node.js, Python, GraphQL, and PostgreSQL.
- Orchestrate cloud deployments on AWS using Terraform, Docker, Kubernetes, and CI/CD pipelines.
- Implement security best practices, OAuth2 authentication, and Redis caching.

Requirements:
- 5+ years of software development experience with React, TypeScript, Python, and AWS.
- Hands-on experience with Next.js, TailwindCSS, Kubernetes, and Redis.
- Strong knowledge of microservice architecture and CI/CD workflows.`;

    setResumeText(sampleResume);
    setJobDescription(sampleJd);
  };

  return (
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-cyan-400" />
            Resume vs Custom Job Description (Side-by-Side)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Compare candidate resume against custom Job Description text to identify direct keyword overlaps & gaps.
          </p>
        </div>
        <button
          onClick={loadSamplePair}
          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-1 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" /> Load Sample Pair
        </button>
      </div>

      {/* Side-by-Side Text Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Resume Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-cyan-400" /> Candidate Resume
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste candidate resume here..."
            rows={10}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 font-mono transition-all"
          />
          <span className="text-[11px] text-slate-400">{resumeText.length} characters</span>
        </div>

        {/* Right: Job Description Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-indigo-400" /> Target Job Description (JD)
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste job posting / responsibilities / requirements here..."
            rows={10}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 font-mono transition-all"
          />
          <span className="text-[11px] text-slate-400">{jobDescription.length} characters</span>
        </div>
      </div>

      {/* Compare Trigger Button */}
      <div className="flex justify-end">
        <button
          disabled={!resumeText || !jobDescription}
          onClick={handleCompare}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-2 transition-all ${
            !resumeText || !jobDescription
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/20 active:scale-95'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Run Side-by-Side Match Analysis
        </button>
      </div>

      {/* Side-by-Side Comparison Output */}
      {comparisonResult && (
        <div className="pt-6 border-t border-slate-800 space-y-6">
          {/* Comparison Score Header */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">JD Keyword Match Rate</span>
              <p className="text-2xl font-extrabold text-cyan-400 mt-1">{comparisonResult.jdMatchPercentage}%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {comparisonResult.matchedJdKeywords.length} of {comparisonResult.jdKeywords.length} extracted JD terms found
              </p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">Overall ATS Fit Score</span>
              <p className="text-2xl font-extrabold text-emerald-400 mt-1">{comparisonResult.atsResult.overallScore}/100</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Grade: {comparisonResult.atsResult.grade}</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl text-center">
              <span className="text-xs text-slate-400 font-medium">Missing Critical Terms</span>
              <p className="text-2xl font-extrabold text-rose-400 mt-1">{comparisonResult.missingJdKeywords.length}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Key gaps to address</p>
            </div>
          </div>

          {/* Matched vs Missing Chips Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Matched JD Keywords */}
            <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4">
              <h4 className="text-xs font-bold text-emerald-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Matched Keywords Found in Resume ({comparisonResult.matchedJdKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {comparisonResult.matchedJdKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono"
                  >
                    &check; {kw}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing JD Keywords */}
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-4">
              <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> Missing Keywords from Job Description ({comparisonResult.missingJdKeywords.length})
              </h4>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {comparisonResult.missingJdKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-300 font-mono"
                  >
                    &times; {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
