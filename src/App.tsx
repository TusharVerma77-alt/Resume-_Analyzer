import React, { useState, useEffect } from 'react';
import { INITIAL_COMPANIES } from './config/companies';
import { INITIAL_ROLES } from './config/roles';
import type { Company, JobRole, LLMProvider, AtsScoreResult, HistoryItem } from './types/resume';
import { ResumeUploader } from './components/ResumeUploader';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { ResumeJdComparison } from './components/ResumeJdComparison';
import { analyzeResumeWithLLM } from './services/llmService';
import {
  Building2,
  Briefcase,
  Cpu,
  History as HistoryIcon,
  PlusCircle,
  Play,
  Key,
  FileSearch,
  BarChart3,
  ArrowRightLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [roles] = useState<JobRole[]>(INITIAL_ROLES);

  const [selectedCompanyId, setSelectedCompanyId] = useState<string>(INITIAL_COMPANIES[0].id);
  const [selectedRoleId, setSelectedRoleId] = useState<string>(INITIAL_ROLES[0].id);

  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');

  const [provider, setProvider] = useState<LLMProvider>('mock');
  const [apiKey, setApiKey] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AtsScoreResult | null>(null);

  const [activeViewMode, setActiveViewMode] = useState<'standard' | 'comparison'>('standard');

  // History state stored in localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('ats_analysis_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Modal State for adding Company or Role dynamically
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyIndustry, setNewCompanyIndustry] = useState('');
  const [newCompanyKeywords, setNewCompanyKeywords] = useState('');

  useEffect(() => {
    localStorage.setItem('ats_analysis_history', JSON.stringify(history));
  }, [history]);

  const selectedCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];
  const selectedRole = roles.find((r) => r.id === selectedRoleId) || roles[0];

  const handleResumeLoaded = (text: string, fileName: string) => {
    setResumeText(text);
    setResumeFileName(fileName);
  };

  const runAnalysis = async () => {
    if (!resumeText) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeResumeWithLLM(resumeText, selectedCompany, selectedRole, {
        provider,
        apiKey: apiKey || undefined
      });

      setAnalysisResult(result);

      // Save to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        fileName: resumeFileName || 'Resume.txt',
        companyName: selectedCompany.name,
        roleTitle: selectedRole.title,
        overallScore: result.overallScore,
        result
      };

      setHistory((prev) => [historyItem, ...prev.slice(0, 9)]);

      if (result.overallScore >= 80) {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateCompany = () => {
    if (!newCompanyName) return;
    const newComp: Company = {
      id: newCompanyName.toLowerCase().replace(/\s+/g, '-'),
      name: newCompanyName,
      industry: newCompanyIndustry || 'Technology',
      description: 'Custom added target company profile',
      scoringWeights: {
        keywordMatchWeight: 35,
        experienceWeight: 25,
        educationWeight: 10,
        skillsWeight: 20,
        formattingWeight: 10
      },
      atsKeywords: [
        {
          category: 'Core Competencies',
          keywords: newCompanyKeywords.split(',').map((k) => k.trim()).filter(Boolean),
          weight: 9
        }
      ],
      cultureFitKeywords: ['Innovation', 'Leadership']
    };

    setCompanies((prev) => [...prev, newComp]);
    setSelectedCompanyId(newComp.id);
    setShowAddCompany(false);
    setNewCompanyName('');
    setNewCompanyKeywords('');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-100 font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25">
              <FileSearch className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                LLM ATS Resume Analyzer
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Extensible Architecture
                </span>
              </h1>
              <p className="text-[11px] text-slate-400">Modular &bull; Company Weightings &bull; Natural Language Ready</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Provider selector */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <Cpu className="w-3.5 h-3.5 text-cyan-400 ml-1.5" />
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as LLMProvider)}
                className="bg-transparent text-xs text-slate-200 focus:outline-none pr-1 cursor-pointer font-medium"
              >
                <option value="mock" className="bg-slate-900">Deterministic ATS Engine (Offline)</option>
                <option value="gemini" className="bg-slate-900">Google Gemini API</option>
                <option value="openai" className="bg-slate-900">OpenAI GPT-4o</option>
              </select>
            </div>

            {provider !== 'mock' && (
              <div className="relative">
                <input
                  type="password"
                  placeholder="Enter API Key..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl pl-7 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 w-36 font-mono"
                />
                <Key className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2" />
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Navigation Mode Bar */}
        <div className="flex justify-center border-b border-slate-800 pb-4">
          <div className="flex gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl">
            <button
              onClick={() => setActiveViewMode('standard')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeViewMode === 'standard'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Standard ATS Audit & Company Scoring
            </button>
            <button
              onClick={() => setActiveViewMode('comparison')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeViewMode === 'comparison'
                  ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" /> Resume vs Job Description (Side-by-Side)
            </button>
          </div>
        </div>

        {activeViewMode === 'comparison' ? (
          <ResumeJdComparison companies={companies} roles={roles} />
        ) : (
          <>
            {/* Controls Section: Select Company & Job Role */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Target Company Selector */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" /> Target Company & ATS Rules
              </label>
              <button
                onClick={() => setShowAddCompany(true)}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-semibold"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Add Company
              </button>
            </div>

            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-sm font-medium text-white rounded-xl p-3 focus:outline-none focus:border-cyan-500 transition-all cursor-pointer"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900">
                  {c.name} ({c.industry})
                </option>
              ))}
            </select>

            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs space-y-1">
              <p className="text-slate-300 font-semibold">{selectedCompany.name} ATS Focus:</p>
              <p className="text-slate-400">{selectedCompany.description}</p>
              <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                <span className="text-slate-400">Keyword Wt: <strong className="text-cyan-400">{selectedCompany.scoringWeights.keywordMatchWeight}%</strong></span>
                <span className="text-slate-400">Exp Wt: <strong className="text-cyan-400">{selectedCompany.scoringWeights.experienceWeight}%</strong></span>
                <span className="text-slate-400">Edu Wt: <strong className="text-cyan-400">{selectedCompany.scoringWeights.educationWeight}%</strong></span>
              </div>
            </div>
          </div>

          {/* Target Job Role Selector */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Target Job Role & Skills
              </label>
            </div>

            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 text-sm font-medium text-white rounded-xl p-3 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
            >
              {roles.map((r) => (
                <option key={r.id} value={r.id} className="bg-slate-900">
                  {r.title} ({r.level} - {r.department})
                </option>
              ))}
            </select>

            <div className="p-3 bg-slate-950/50 rounded-xl border border-slate-800/80 text-xs space-y-1">
              <p className="text-slate-300 font-semibold">Required Skills for {selectedRole.title}:</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedRole.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-indigo-950/50 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resume Input Area */}
        <section className="space-y-4">
          <ResumeUploader onResumeLoaded={handleResumeLoaded} />

          {/* Action Trigger */}
          <div className="flex justify-end">
            <button
              disabled={!resumeText || isAnalyzing}
              onClick={runAnalysis}
              className={`px-6 py-3.5 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2 transition-all ${
                !resumeText || isAnalyzing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-cyan-500/25 active:scale-95'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Analyzing ATS Score against {selectedCompany.name}...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Audit Resume for {selectedCompany.name}
                </>
              )}
            </button>
          </div>
        </section>

        {/* Dashboard Analysis Output */}
        {analysisResult && (
          <section className="pt-4 border-t border-slate-800/80">
            <AnalysisDashboard result={analysisResult} company={selectedCompany} role={selectedRole} />
          </section>
        )}

          </>
        )}

        {/* Recent Analysis History */}
        {history.length > 0 && (
          <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-xl">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <HistoryIcon className="w-4 h-4 text-cyan-400" /> Recent Resume Audits
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setAnalysisResult(item.result)}
                  className="bg-slate-950/60 border border-slate-800 hover:border-cyan-500/50 p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-white">{item.companyName} &bull; {item.roleTitle}</p>
                    <p className="text-[11px] text-slate-400">{item.fileName} ({item.date})</p>
                  </div>
                  <span className="text-sm font-extrabold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-1 rounded-lg">
                    {item.overallScore}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Add Company Modal */}
      {showAddCompany && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Target Company</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Stripe, Netflix, Goldman Sachs"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">Industry</label>
                <input
                  type="text"
                  placeholder="e.g. Fintech, Media, Banking"
                  value={newCompanyIndustry}
                  onChange={(e) => setNewCompanyIndustry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-semibold block mb-1">ATS Keywords (comma separated)</label>
                <textarea
                  placeholder="e.g. System Architecture, Payment API, Latency, Go, Postgres"
                  value={newCompanyKeywords}
                  onChange={(e) => setNewCompanyKeywords(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddCompany(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCompany}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20"
              >
                Save Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
