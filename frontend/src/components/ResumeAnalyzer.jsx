import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Sparkles, 
  Target, 
  TrendingUp, 
  Zap, 
  HelpCircle,
  FileCheck,
  ShieldCheck,
  Search,
  ArrowRight,
  Download,
  Info,
  Check,
  Award,
  Layers,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeResumeApi } from '../api';

export default function ResumeAnalyzer({ 
  analysis, 
  resume, 
  rolesList, 
  onAnalysisUpdated, 
  onNavigateToRoadmap,
  onNavigateToOptimizer
}) {
  const [targetRole, setTargetRole] = useState(resume?.targetRole || "Full Stack Developer");
  const [jobDescription, setJobDescription] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillbridge_saved_analyses') || '[]');
    } catch {
      return [];
    }
  });

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      const res = await analyzeResumeApi(resume, targetRole, jobDescription);
      onAnalysisUpdated(res.analysis);
      if (res.analysis.atsScore >= 80) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuditing(false);
    }
  };

  const handleSaveCurrentAudit = () => {
    if (!analysis) return;
    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      role: targetRole,
      atsScore: analysis.atsScore,
      ratingTier: analysis.ratingTier,
      hasCustomJD: Boolean(jobDescription.trim())
    };
    const updated = [newEntry, ...savedAnalyses.slice(0, 4)];
    setSavedAnalyses(updated);
    localStorage.setItem('skillbridge_saved_analyses', JSON.stringify(updated));
    alert('Analysis report saved to local audit history.');
  };

  const handleDownloadSummary = () => {
    if (!analysis) return;
    const textReport = `================================================
SKILLBRIDGE ATS & JOB DESCRIPTION AUDIT REPORT
Candidate: ${resume?.name || 'Candidate'}
Target Role: ${targetRole}
Overall Compatibility Score: ${analysis.atsScore}/100 (${analysis.ratingTier})
Generated: ${new Date().toLocaleString()}
================================================

1. SCORING BREAKDOWN (100 Point Transparent Model):
- Contact & Identity: ${analysis.subScores?.contactScore?.current}/${analysis.subScores?.contactScore?.max} pts
- Section Completeness: ${analysis.subScores?.sectionScore?.current}/${analysis.subScores?.sectionScore?.max} pts
- Quantified Impact: ${analysis.subScores?.metricsScore?.current}/${analysis.subScores?.metricsScore?.max} pts
- Action Verbs: ${analysis.subScores?.verbScore?.current}/${analysis.subScores?.verbScore?.max} pts
- Role Skill Alignment: ${analysis.subScores?.skillCoverageScore?.current}/${analysis.subScores?.skillCoverageScore?.max} pts

2. KEYWORD SUMMARY:
- Matched Skills: ${(analysis.jobMatch?.matchedSkills || []).join(', ')}
- Missing Critical Skills: ${(analysis.jobMatch?.missingSkills || []).join(', ')}

3. ACTIONABLE STRENGTHS:
${(analysis.strengths || []).map(s => `- ${s}`).join('\n')}

4. PRIORITY IMPROVEMENTS:
${(analysis.improvements || []).map(i => `- ${i}`).join('\n')}

DISCLAIMER:
${analysis.scoringDisclaimer || 'Scoring is calculated via transparent heuristic rules and does not guarantee interview calls.'}
`;
    const blob = new Blob([textReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge-ATS-Audit-${(resume?.name || 'Resume').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!analysis) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading ATS analysis...
      </div>
    );
  }

  const { atsScore, ratingTier, badgeColor, subScores, metricsSummary, jobMatch, strengths, improvements, sectionAudits, scoringDisclaimer, recommendedBullets } = analysis;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & ATS Score Hero */}
      <div className="pro-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Score Circular Gauge */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-5 bg-slate-950/70 rounded-2xl border border-slate-800">
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-800"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className={`${
                    atsScore >= 80 ? 'stroke-emerald-400' : atsScore >= 65 ? 'stroke-indigo-400' : 'stroke-amber-400'
                  } transition-all duration-1000 ease-out`}
                  strokeWidth="8"
                  strokeDasharray={`${(atsScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black tracking-tight text-white">{atsScore}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">ATS Score</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${badgeColor}`}>
                {ratingTier}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={handleDownloadSummary}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-700/80 rounded-xl transition shadow-sm"
                title="Download Summary Report"
              >
                <Download className="w-3 h-3 text-cyan-400" />
                <span>Export Report</span>
              </button>
              <button
                onClick={handleSaveCurrentAudit}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-500/30 rounded-xl transition"
                title="Save Audit to History"
              >
                <span>Save</span>
              </button>
            </div>
          </div>

          {/* Quick Sub-Scores */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  ATS Readiness Breakdown
                </h2>
                <span className="text-xs text-slate-400 font-semibold bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                  Target: {targetRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Evaluated against transparent Applicant Tracking System heuristics across measurable impact, section completeness, active verbs, and keyword alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Quantified Impact & Numbers</span>
                  <span className="text-indigo-400 font-bold">{subScores.metricsScore.current} / {subScores.metricsScore.max} pts</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${subScores.metricsScore.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{metricsSummary.quantifiedRatio}% of bullets include metrics (%, $, scale)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Power Action Verbs</span>
                  <span className="text-cyan-400 font-bold">{subScores.verbScore.current} / {subScores.verbScore.max} pts</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${subScores.verbScore.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{metricsSummary.powerVerbsCount} assertive leadership verbs used</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Role Skill Alignment</span>
                  <span className="text-emerald-400 font-bold">{subScores.skillCoverageScore.current} / {subScores.skillCoverageScore.max} pts</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${subScores.skillCoverageScore.percentage}%` }} />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">{jobMatch.matchedSkills.length} verified matching keywords</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Contact & Section Integrity</span>
                  <span className="text-amber-400 font-bold">{(subScores.contactScore.current + subScores.sectionScore.current)} / 35 pts</span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full" 
                    style={{ width: `${((subScores.contactScore.current + subScores.sectionScore.current) / 35) * 100}%` }} 
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Summary, Experience, Education & Portfolio</p>
              </div>
            </div>

            {/* Transparent Scoring Formula Notice */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2 leading-relaxed">
              <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>
                <strong>Scoring Formula:</strong> 25 pts (Quantified Metrics) + 25 pts (Role Skills) + 20 pts (Section Architecture) + 15 pts (Power Verbs) + 15 pts (Contact Details). {scoringDisclaimer}
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Target Job Matcher Section */}
      <div className="pro-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Target Role & Custom Job Description Matcher
            </h3>
            <p className="text-xs text-slate-400">
              Benchmark your resume against pre-calibrated roles or paste a specific job description to extract exact keywords.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 text-xs text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-indigo-500 font-medium"
            >
              {(rolesList || ["Full Stack Developer", "Frontend Engineer", "Backend Engineer", "DevOps & Cloud Engineer", "Data Scientist & ML"]).map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-2">
          <textarea
            rows={3}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target Job Description here (e.g. requirements for Docker, PostgreSQL, React, Next.js, Redis, AWS...)"
            className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono resize-none leading-relaxed"
          />
          <div className="flex justify-end">
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 rounded-xl shadow-lg shadow-indigo-600/25 transition"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-300" />
              <span>{isAuditing ? 'Auditing Resume...' : 'Analyze Match & Keywords'}</span>
            </button>
          </div>
        </div>

        {/* Keyword Match Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Matched Keywords */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Matched Role Keywords ({jobMatch.matchedSkills.length})
              </span>
              <span className="text-[10px] text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-semibold">
                {jobMatch.matchPercentage || 75}% Coverage
              </span>
            </div>
            
            <div className="flex flex-wrap gap-1.5 pt-1">
              {jobMatch.matchedSkills.length > 0 ? (
                jobMatch.matchedSkills.map((sk, idx) => (
                  <span 
                    key={idx} 
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-medium"
                  >
                    {sk}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500 italic">No exact role keywords matched</span>
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-rose-900/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Missing Critical Competencies ({jobMatch.missingSkills.length})
              </span>
              {jobMatch.missingSkills.length > 0 && (
                <button
                  onClick={onNavigateToRoadmap}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 hover:underline"
                >
                  <span>Generate Roadmap</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {jobMatch.missingSkills.length > 0 ? (
                jobMatch.missingSkills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-[11px] rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 font-medium">
                    + {sk}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400 font-medium">Zero missing critical skills! Outstanding coverage.</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Suggested Truthful Bullet Improvements */}
      {recommendedBullets && recommendedBullets.length > 0 && (
        <div className="pro-card p-6 rounded-3xl border border-indigo-500/30 bg-slate-900/70 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-300" />
              Truthful STAR Formulation Recommendation
            </h3>
            <button
              onClick={onNavigateToOptimizer}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Open STAR Optimizer →
            </button>
          </div>

          {recommendedBullets.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400">
                <span className="font-semibold text-slate-500">Original Claim:</span> {item.original}
              </div>
              <div className="text-white font-medium bg-indigo-950/30 p-2.5 rounded-xl border border-indigo-500/20">
                <span className="text-cyan-400 font-bold block mb-1">STAR Enhanced:</span>
                {item.suggested}
              </div>
              <p className="text-[10px] text-slate-500 italic">{item.rationale}</p>
            </div>
          ))}
        </div>
      )}

      {/* Strengths and Actionable Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Strengths Card */}
        <div className="pro-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Verified Resume Strengths
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {strengths.map((s, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Priority Fixes */}
        <div className="pro-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              High-Impact Recommendations
            </h3>
            <button
              onClick={onNavigateToOptimizer}
              className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>STAR Optimizer</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </button>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {improvements.map((imp, idx) => (
              <li key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{imp}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Section Audits Table */}
      <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-cyan-400" />
          <span>Section Integrity & Layout Diagnostic</span>
        </h3>

        <div className="divide-y divide-slate-800/80 text-xs">
          {sectionAudits.map((item, idx) => (
            <div key={idx} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                {item.status === 'pass' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {item.status === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
                {item.status === 'fail' && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                <span className="font-semibold text-slate-200">{item.section}</span>
              </div>
              <span className="text-slate-400 text-right">{item.note}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
