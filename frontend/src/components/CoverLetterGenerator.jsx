import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Download, 
  Building2, 
  Briefcase, 
  FileText,
  Zap,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateCoverLetterApi } from '../api';

export default function CoverLetterGenerator({ 
  resume, 
  rolesList, 
  apiKey,
  initialCompany = '',
  initialRole = '',
  initialJobDescription = ''
}) {
  const [companyName, setCompanyName] = useState(initialCompany || 'Google');
  const [targetRole, setTargetRole] = useState(initialRole || resume.targetRole || "Full Stack Developer");
  const [jobDescription, setJobDescription] = useState(initialJobDescription || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (initialCompany) setCompanyName(initialCompany);
    if (initialRole) setTargetRole(initialRole);
    if (initialJobDescription) setJobDescription(initialJobDescription);
  }, [initialCompany, initialRole, initialJobDescription]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await generateCoverLetterApi(resume, companyName, targetRole, jobDescription, apiKey);
      setCoverLetterData(res.coverLetter);
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetterData?.letter) return;
    navigator.clipboard.writeText(coverLetterData.letter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!coverLetterData?.letter) return;
    const blob = new Blob([coverLetterData.letter], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Cover_Letter_${(resume.name || 'Candidate').replace(/\s+/g, '_')}_${companyName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Mail className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Targeted Cover Letter Studio</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold">
              Resume-Grounded
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Generates tailored, high-converting cover letters by intertwining your authentic resume achievements with target company goals.
          </p>
        </div>
      </div>

      {/* Configuration Box */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Target Company Name
            </label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Stripe, Google, Datadog, Netflix"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              Target Role
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-blue-500"
            >
              {(rolesList || ["Full Stack Developer", "Frontend Engineer", "Backend Engineer", "DevOps / Cloud Engineer", "Data Scientist / AI Engineer"]).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-slate-400" />
            Specific Job Requirements / JD snippet (Optional)
          </label>
          <textarea
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste specific mission, tech stack, or qualifications from the job posting to deeply personalize the cover letter..."
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans resize-none"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !companyName.trim()}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-600/30 transition"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                <span>Crafting Cover Letter...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                <span>Generate Tailored Cover Letter</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Cover Letter Document */}
      {coverLetterData && (
        <div className="space-y-4 animate-fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  Customized for {coverLetterData.company}
                </span>
                <h3 className="text-base font-bold text-white">
                  Application for {coverLetterData.targetRole}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    isCopied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Letter</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Key Highlights Chips */}
            {coverLetterData.keyHighlights && (
              <div className="flex flex-wrap items-center gap-2 text-xs py-1">
                <span className="text-[11px] font-semibold text-slate-400">Emphasized:</span>
                {coverLetterData.keyHighlights.map((hl, idx) => (
                  <span key={idx} className="bg-slate-950 text-blue-300 border border-blue-500/20 px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-blue-400" />
                    {hl}
                  </span>
                ))}
              </div>
            )}

            {/* Letter Text Document */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-950/80 border border-slate-800/80 font-sans text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-blue-500">
              {coverLetterData.letter}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
