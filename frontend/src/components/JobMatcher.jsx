import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  FileCheck,
  Zap,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeResumeApi } from '../api';

export default function JobMatcher({
  resume,
  rolesList = [],
  analysis,
  onAnalysisUpdated,
  onNavigateTab
}) {
  const [selectedRole, setSelectedRole] = useState(resume?.targetRole || 'Full Stack Developer');
  const [customJD, setCustomJD] = useState('');
  const [isMatching, setIsMatching] = useState(false);

  const matchedSkills = analysis?.jobMatch?.matchedSkills || [];
  const missingSkills = analysis?.jobMatch?.missingSkills || [];
  const matchPercentage = analysis?.jobMatch?.matchPercentage || 75;

  const handleRunMatch = async () => {
    setIsMatching(true);
    try {
      const res = await analyzeResumeApi(resume, selectedRole, customJD);
      if (res?.analysis) {
        onAnalysisUpdated(res.analysis);
        if (res.analysis.atsScore >= 80) {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsMatching(false);
    }
  };

  const sampleRoles = [
    "Full Stack Developer",
    "Frontend Engineer",
    "Backend Engineer",
    "DevOps & Cloud Engineer",
    "Data Scientist & ML",
    "Software Engineer (Generalist)"
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Banner */}
      <div className="pro-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Target Role & Custom JD Matcher</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Job Description & Keyword Gap Calibration
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Test candidate resume against actual recruiter job descriptions. Instantly detect missing competencies and keyword frequency gaps.
          </p>
        </div>

        {/* Current Match Pill */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Match Coefficient</div>
            <div className="text-2xl font-black text-cyan-400 mt-0.5">{matchPercentage}%</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 flex items-center justify-center">
            <Target className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Input Form Card */}
      <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-5">
        
        {/* Preset Roles Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Role Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleRoles.map((roleName) => (
              <button
                key={roleName}
                onClick={() => setSelectedRole(roleName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedRole === roleName
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {roleName}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Job Description Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Paste Specific Job Description (Optional)
            </label>
            <span className="text-[11px] text-slate-500">Extracts exact recruiter keywords</span>
          </div>
          <textarea
            rows={4}
            value={customJD}
            onChange={(e) => setCustomJD(e.target.value)}
            placeholder="Paste raw requirements from LinkedIn, Indeed, or company careers page..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            onClick={handleRunMatch}
            disabled={isMatching}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/25"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isMatching ? "Scanning Keywords..." : "Run Precision Match"}</span>
          </button>
        </div>
      </div>

      {/* Matched vs Missing Skill Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills */}
        <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Detected Matching Keywords</h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {matchedSkills.length} Present
            </span>
          </div>

          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Run a match scan to view verified keyword coverage.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Missing Role Competencies</h3>
            </div>
            <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {missingSkills.length} Recommended
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                >
                  + {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No critical competency omissions detected for this role profile.</p>
          )}

          <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Want to add missing skills to your learning path?</span>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition"
            >
              Open Roadmap →
            </button>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
