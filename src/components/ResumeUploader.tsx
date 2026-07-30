import React, { useState } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumeUploaderProps {
  onResumeLoaded: (text: string, fileName: string) => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onResumeLoaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rawText, setRawText] = useState<string>('');
  const [isParsing, setIsParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const parsePdf = async (file: File) => {
    setIsParsing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        text += pageText + '\n';
      }
      setRawText(text);
      setFileName(file.name);
      onResumeLoaded(text, file.name);
    } catch (err) {
      console.warn('PDF parsing error, reading as plain text fallback:', err);
      const text = await file.text();
      setRawText(text);
      setFileName(file.name);
      onResumeLoaded(text, file.name);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        parsePdf(file);
      } else {
        file.text().then((text) => {
          setRawText(text);
          setFileName(file.name);
          onResumeLoaded(text, file.name);
        });
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        parsePdf(file);
      } else {
        file.text().then((text) => {
          setRawText(text);
          setFileName(file.name);
          onResumeLoaded(text, file.name);
        });
      }
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setRawText(val);
    setFileName('Pasted Resume');
    onResumeLoaded(val, 'Pasted Resume');
  };

  const loadSampleResume = () => {
    const sample = `Alex Mercer
alex.mercer@email.com | (555) 019-2834 | San Francisco, CA | linkedin.com/in/alexmercer

SUMMARY
Senior Software Engineer with 6+ years of experience building high-throughput distributed systems and cloud infrastructure. Specialized in React, TypeScript, Node.js, Python, and AWS microservices. Passionate about developer tools and scalable Web applications.

EXPERIENCE
Senior Software Engineer | TechScale Inc. | 2022 - Present
- Architected real-time analytics streaming engine using React, TypeScript, Kafka, and Redis, reducing dashboard latency by 45%.
- Led a team of 5 engineers delivering microservices on AWS (Lambda, ECS, DynamoDB, S3) with 99.99% uptime.
- Optimized GraphQL & REST APIs serving over 5M daily active requests.

Software Engineer | CloudSphere Labs | 2019 - 2022
- Developed responsive web interfaces using React, Redux Toolkit, and TailwindCSS.
- Built CI/CD pipelines in Jenkins and Docker for automated testing and zero-downtime deployment.
- Mentored junior engineers and conducted code reviews adhering to clean architecture.

EDUCATION
B.S. in Computer Science | University of California, Berkeley | 2015 - 2019

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, Go, SQL, HTML5, CSS3
Frameworks: React, Next.js, Node.js, Express, Spring Boot
Cloud & DevOps: AWS, Docker, Kubernetes, CI/CD, Git, Redis, PostgreSQL`;

    setRawText(sample);
    setFileName('Sample Developer Resume.txt');
    onResumeLoaded(sample, 'Sample Developer Resume.txt');
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          Resume Input
        </h3>
        <button
          onClick={loadSampleResume}
          className="text-xs px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all flex items-center gap-1.5 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" /> Load Sample Resume
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-950/60 rounded-xl mb-4 border border-slate-800/80">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Upload PDF / TXT
        </button>
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'paste'
              ? 'bg-slate-800 text-cyan-400 shadow-sm border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Paste Plain Text
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all flex flex-col items-center justify-center min-h-[200px] ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20'
              : fileName
              ? 'border-emerald-500/40 bg-emerald-950/10'
              : 'border-slate-800 hover:border-slate-700 bg-slate-950/40'
          }`}
        >
          <input
            type="file"
            accept=".pdf,.txt,.doc,.docx"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />

          {isParsing ? (
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-sm font-medium text-slate-300">Extracting text from document...</p>
            </div>
          ) : fileName ? (
            <div className="flex flex-col items-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10 mb-2 drop-shadow-md" />
              <p className="text-sm font-semibold text-white mb-1">{fileName}</p>
              <p className="text-xs text-slate-400">Ready for ATS Analysis ({rawText.length} characters loaded)</p>
              <span className="mt-3 text-xs text-cyan-400 underline">Click or drag to replace file</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mb-3 text-cyan-400 shadow-inner">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-200 mb-1">
                Drag & Drop your Resume here or <span className="text-cyan-400 underline font-semibold">Browse</span>
              </p>
              <p className="text-xs text-slate-400">Supports PDF, TXT, DOCX files</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col">
          <textarea
            value={rawText}
            onChange={handleTextChange}
            placeholder="Paste your resume contents here (Experience, Skills, Education)..."
            rows={8}
            className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all font-mono"
          />
          <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
            <span>{rawText.length} characters</span>
            {rawText.length < 100 && rawText.length > 0 && (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Short resume text may affect ATS accuracy
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
