import React, { useState } from 'react';
import type { AtsScoreResult, Company, JobRole } from '../types/resume';
import { AtsGauge } from './AtsGauge';
import {
  CheckCircle2,
  XCircle,
  TrendingUp,
  HelpCircle,
  Briefcase,
  Building2,
  Award,
  Layers,
  Sparkles,
  Download,
  AlertTriangle
} from 'lucide-react';

interface AnalysisDashboardProps {
  result: AtsScoreResult;
  company: Company;
  role: JobRole;
}

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ result, company, role }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'keywords' | 'sections' | 'interview'>('overview');

  const exportReport = () => {
    const reportText = `ATS ANALYSIS REPORT
===================
Target Company: ${company.name} (${company.industry})
Target Role: ${role.title} (${role.level})
Overall ATS Score: ${result.overallScore}/100 (Grade: ${result.grade})

SCORES BREAKDOWN:
- Keyword Match: ${result.keywordMatchScore}%
- Experience Match: ${result.experienceScore}%
- Education Match: ${result.educationScore}%
- Required Skills: ${result.skillsScore}%
- Formatting Score: ${result.formattingScore}%

EXECUTIVE SUMMARY:
${result.summary}

STRENGTHS:
${result.strengths.map((s) => `- ${s}`).join('\n')}

WEAKNESSES:
${result.weaknesses.map((w) => `- ${w}`).join('\n')}

ACTIONABLE IMPROVEMENTS:
${result.improvements.map((i) => `- ${i}`).join('\n')}

CUSTOMIZED INTERVIEW QUESTIONS:
${result.interviewQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
`;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ATS_Report_${company.name}_${role.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Company/Role Metadata */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-6">
          <AtsGauge score={result.overallScore} grade={result.grade} size={150} />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {company.industry}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {role.level} Level
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-400" />
              {company.name} &bull; {role.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl line-clamp-2">{result.summary}</p>
          </div>
        </div>

        <button
          onClick={exportReport}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 self-stretch md:self-auto justify-center"
        >
          <Download className="w-4 h-4" /> Export Audit Report
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 space-x-4">
        {[
          { id: 'overview', label: 'Overview & Insights', icon: TrendingUp },
          { id: 'keywords', label: 'Missing Keywords by Category', icon: Layers },
          { id: 'sections', label: 'Section Match Breakdown', icon: Award },
          { id: 'interview', label: 'Tailored Interview Qs', icon: HelpCircle }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                isActive
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Overview */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sub Score Metrics */}
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: 'Keyword Match', score: result.keywordMatchScore },
              { label: 'Experience Score', score: result.experienceScore },
              { label: 'Education Score', score: result.educationScore },
              { label: 'Required Skills', score: result.skillsScore },
              { label: 'Formatting ATS', score: result.formattingScore }
            ].map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 text-center backdrop-blur-md"
              >
                <p className="text-[11px] text-slate-400 font-medium">{m.label}</p>
                <p className="text-xl font-extrabold text-white mt-1">{m.score}%</p>
                <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.score >= 75 ? 'bg-cyan-400' : m.score >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                    }`}
                    style={{ width: `${m.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Strengths */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Strong Match Points
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 bg-emerald-950/20 border border-emerald-900/30 p-2.5 rounded-lg">
                  <span className="text-emerald-400 font-bold">&bull;</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-rose-400 mb-3 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Gaps & Weaknesses
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.weaknesses.map((w, i) => (
                <li key={i} className="flex items-start gap-2 bg-rose-950/20 border border-rose-900/30 p-2.5 rounded-lg">
                  <span className="text-rose-400 font-bold">&bull;</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actionable Improvements */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> High-Impact Action Items
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {result.improvements.map((imp, i) => (
                <li key={i} className="flex items-start gap-2 bg-cyan-950/20 border border-cyan-900/30 p-2.5 rounded-lg">
                  <span className="text-cyan-400 font-bold">{i + 1}.</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tab Content 2: Missing Keywords by Category */}
      {activeTab === 'keywords' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-white">Missing Keywords Grouped by Category</h4>
            <span className="text-xs text-slate-400">
              Matched Keywords: <strong className="text-emerald-400">{result.matchedKeywords.length}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.missingKeywordsByCategory.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-xs font-bold text-slate-200">{cat.category}</h5>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      cat.importance === 'High'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : cat.importance === 'Medium'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {cat.importance} Priority
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {cat.missingKeywords.map((kw, kIdx) => (
                    <span
                      key={kIdx}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-950 border border-rose-500/30 text-rose-300 flex items-center gap-1 font-mono"
                    >
                      <AlertTriangle className="w-3 h-3 text-rose-400" /> {kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Matched Chips */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mt-4">
            <h5 className="text-xs font-semibold text-emerald-400 mb-2">Successfully Detected Keywords</h5>
            <div className="flex flex-wrap gap-1.5">
              {result.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-mono"
                >
                  &check; {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 3: Section Breakdown */}
      {activeTab === 'sections' && (
        <div className="space-y-3">
          {result.sectionBreakdown.map((sec, i) => (
            <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-cyan-400" />
                  {sec.sectionName}
                </span>
                <span className="text-xs font-extrabold text-cyan-400">{sec.score}% Match</span>
              </div>

              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-500"
                  style={{ width: `${sec.score}%` }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                  <p className="text-[11px] text-emerald-400 font-semibold mb-1">Found ({sec.matchedKeywords.length})</p>
                  <p className="text-slate-300 font-mono">{sec.matchedKeywords.join(', ') || 'None detected'}</p>
                </div>
                <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                  <p className="text-[11px] text-rose-400 font-semibold mb-1">Missing ({sec.missingKeywords.length})</p>
                  <p className="text-slate-400 font-mono">{sec.missingKeywords.join(', ') || 'All matched!'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content 4: Interview Questions */}
      {activeTab === 'interview' && (
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <h4 className="text-sm font-semibold text-cyan-400 mb-1 flex items-center gap-2">
              <HelpCircle className="w-4 h-4" /> AI-Generated Interview Preparation Questions
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              These questions are generated based on the specific gaps between your resume and {company.name}'s requirements.
            </p>

            <div className="space-y-3">
              {result.interviewQuestions.map((q, idx) => (
                <div key={idx} className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl">
                  <span className="text-xs font-bold text-cyan-400 block mb-1">Question {idx + 1}</span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">{q}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
