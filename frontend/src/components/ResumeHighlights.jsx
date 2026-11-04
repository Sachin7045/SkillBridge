import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Star,
  Trophy,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BookOpen,
  Briefcase,
  Code2,
  User,
  ChevronDown,
  ChevronUp,
  Search,
  X,
  BarChart3,
  Layers,
  GitBranch,
  Medal,
  Flame,
  Brain,
  Shield
} from 'lucide-react';

// ─── Utility: Extract top accomplishments from resume bullets ─────────────────
function extractCareerHighlights(resume) {
  const highlights = [];
  const quantifiedPattern = /(\d+%|\$[\d,]+|\d+x|[\d,]+\s*(users|clients|team|employees|projects|bugs|commits|deploys))/i;
  (resume?.experience || []).forEach((exp) => {
    (exp.bullets || []).forEach((bullet) => {
      if (quantifiedPattern.test(bullet)) {
        highlights.push({ text: bullet, company: exp.company, role: exp.role, type: 'quantified' });
      }
    });
  });
  if (highlights.length === 0) {
    (resume?.experience || []).slice(0, 2).forEach((exp) => {
      (exp.bullets || []).slice(0, 2).forEach((bullet) => {
        highlights.push({ text: bullet, company: exp.company, role: exp.role, type: 'general' });
      });
    });
  }
  return highlights.slice(0, 5);
}

// ─── Utility: Compute strength badges ────────────────────────────────────────
function computeStrengthBadges(resume, analysis) {
  const badges = [];
  const atsScore = analysis?.atsScore || 0;
  const quantifiedRatio = analysis?.metricsSummary?.quantifiedRatio || 0;
  const powerVerbsCount = analysis?.metricsSummary?.powerVerbsCount || 0;
  const matchedSkills = analysis?.jobMatch?.matchedSkills || [];

  if (atsScore >= 80) badges.push({ id: 'ats-elite', label: 'ATS Elite', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30', desc: `${atsScore}/100 — Top tier ATS compatibility` });
  else if (atsScore >= 65) badges.push({ id: 'ats-strong', label: 'ATS Ready', icon: Shield, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', desc: `${atsScore}/100 — Strong ATS compatibility` });
  if (quantifiedRatio >= 60) badges.push({ id: 'data-driven', label: 'Data-Driven', icon: BarChart3, color: 'text-blue-400', bg: 'bg-blue-500/10 border-cyan-500/30', desc: `${quantifiedRatio}% of bullets include measurable impact` });
  if (powerVerbsCount >= 5) badges.push({ id: 'power-verbs', label: 'Power Communicator', icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', desc: `${powerVerbsCount} action leadership verbs used` });
  if (matchedSkills.length >= 8) badges.push({ id: 'skill-rich', label: 'Skill-Rich', icon: Layers, color: 'text-violet-400', bg: 'bg-violet-500/10 border-violet-500/30', desc: `${matchedSkills.length} matched role keywords` });
  if ((resume?.experience?.length || 0) >= 2) badges.push({ id: 'experienced', label: 'Experienced', icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', desc: `${resume.experience.length} documented positions` });
  if ((resume?.projects?.length || 0) >= 2) badges.push({ id: 'builder', label: 'Builder', icon: Code2, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/30', desc: `${resume.projects.length} featured technical projects` });
  if (resume?.links?.github) badges.push({ id: 'open-source', label: 'Open Source', icon: GitBranch, color: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30', desc: 'GitHub profile verified' });
  if ((resume?.certifications?.length || 0) >= 1) badges.push({ id: 'certified', label: 'Certified', icon: Medal, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30', desc: `${resume.certifications.length} professional certifications` });
  if (resume?.summary && resume.summary.length > 120) badges.push({ id: 'well-summarized', label: 'Well Summarized', icon: BookOpen, color: 'text-slate-300', bg: 'bg-slate-700/30 border-slate-600/40', desc: 'Professional summary present & detailed' });
  return badges;
}

// ─── Utility: Detect missing/weak sections ───────────────────────────────────
function detectMissingSections(resume) {
  const sections = [
    { id: 'contact', label: 'Contact Info', icon: User, check: () => Boolean(resume?.email && resume?.phone), tip: 'Add email and phone number', severity: 'high' },
    { id: 'summary', label: 'Professional Summary', icon: BookOpen, check: () => Boolean(resume?.summary && resume?.summary.length > 60), tip: 'Add a compelling 2-3 sentence professional summary', severity: 'high' },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, check: () => (resume?.experience?.length || 0) >= 1, tip: 'Add at least one work experience entry', severity: 'high' },
    {
      id: 'skills', label: 'Technical Skills', icon: Code2,
      check: () => { const s = resume?.skills || {}; return ((s.languages?.length || 0) + (s.frameworks?.length || 0)) >= 3; },
      tip: 'Add programming languages and frameworks', severity: 'medium'
    },
    {
      id: 'quantified', label: 'Quantified Bullets', icon: BarChart3,
      check: () => { const p = /(\d+%|\$[\d,]+|\d+x)/i; return (resume?.experience || []).some(exp => (exp.bullets || []).some(b => p.test(b))); },
      tip: 'Add metrics (%, $, scale numbers) to experience bullets', severity: 'medium'
    },
    { id: 'projects', label: 'Projects', icon: Layers, check: () => (resume?.projects?.length || 0) >= 1, tip: 'Add at least one featured project with tech stack', severity: 'low' },
    { id: 'education', label: 'Education', icon: BookOpen, check: () => (resume?.education?.length || 0) >= 1, tip: 'Add your educational background', severity: 'low' },
    { id: 'links', label: 'LinkedIn / GitHub', icon: GitBranch, check: () => Boolean(resume?.links?.linkedin || resume?.links?.github), tip: 'Add LinkedIn and GitHub profile links', severity: 'low' }
  ];
  return sections.map(s => ({ ...s, passed: s.check() }));
}

// ─── Exported Keyword Highlighter Helper ─────────────────────────────────────
export function highlightKeywords(text, keywords) {
  if (!keywords || keywords.length === 0) return text;
  const escaped = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = String(text).split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-amber-400/30 text-amber-200 rounded px-0.5 font-semibold border-b border-amber-400/60 not-italic">
        {part}
      </mark>
    ) : part
  );
}

// ─── Career Highlights Card ───────────────────────────────────────────────────
function CareerHighlightsCard({ resume }) {
  const [expanded, setExpanded] = useState(false);
  const highlights = useMemo(() => extractCareerHighlights(resume), [resume]);
  const visible = expanded ? highlights : highlights.slice(0, 3);

  return (
    <div className="pro-card p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-950/40 to-slate-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Executive Career Highlights
        </h3>
        <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
          Top {highlights.length} Impact Bullets
        </span>
      </div>

      {highlights.length === 0 ? (
        <p className="text-xs text-slate-500 italic">Upload a resume with experience bullets to extract highlights.</p>
      ) : (
        <>
          <div className="space-y-2">
            <AnimatePresence>
              {visible.map((h, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-blue-500/30 transition"
                >
                  <Star className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${h.type === 'quantified' ? 'text-amber-400' : 'text-slate-500'}`} />
                  <div className="min-w-0">
                    <p className="text-xs text-slate-200 leading-relaxed">{h.text}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{h.role} · {h.company}</p>
                  </div>
                  {h.type === 'quantified' && (
                    <span className="shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/25">
                      Quantified
                    </span>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {highlights.length > 3 && (
            <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-center gap-1.5 text-[11px] text-blue-400 hover:text-blue-300 font-semibold transition py-1">
              {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show Less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show {highlights.length - 3} More</>}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── Strength Badges Card ─────────────────────────────────────────────────────
function StrengthBadgesCard({ resume, analysis }) {
  const badges = useMemo(() => computeStrengthBadges(resume, analysis), [resume, analysis]);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  return (
    <div className="pro-card p-5 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/20 to-slate-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Resume Strength Badges
        </h3>
        <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
          {badges.length} Earned
        </span>
      </div>

      {badges.length === 0 ? (
        <p className="text-xs text-slate-500 italic">Run an ATS analysis to unlock badges.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.id}
                whileHover={{ scale: 1.05 }}
                onMouseEnter={() => setHoveredBadge(badge.id)}
                onMouseLeave={() => setHoveredBadge(null)}
                className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border ${badge.bg} cursor-default`}
              >
                <Icon className={`w-3.5 h-3.5 ${badge.color}`} />
                <span className={`text-[11px] font-bold ${badge.color}`}>{badge.label}</span>
                {hoveredBadge === badge.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-[10px] text-slate-200 whitespace-nowrap z-50 shadow-xl"
                  >
                    {badge.desc}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-transparent border-t-slate-700" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
      {badges.length > 0 && <p className="text-[10px] text-slate-500 italic">Hover over a badge to learn more.</p>}
    </div>
  );
}

// ─── Missing Sections Diagnostic ─────────────────────────────────────────────
function MissingSectionsDiagnostic({ resume }) {
  const sections = useMemo(() => detectMissingSections(resume), [resume]);
  const failing = sections.filter(s => !s.passed);
  const passing = sections.filter(s => s.passed);
  const [showPassing, setShowPassing] = useState(false);

  const severityOrder = { high: 0, medium: 1, low: 2 };
  const sortedFailing = [...failing].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
  const severityColor = { high: 'text-rose-400 border-rose-500/30 bg-rose-950/30', medium: 'text-amber-400 border-amber-500/30 bg-amber-950/30', low: 'text-slate-400 border-slate-600/30 bg-slate-800/30' };
  const severityLabel = { high: 'Critical', medium: 'Improve', low: 'Optional' };

  return (
    <div className="pro-card p-5 rounded-2xl border border-rose-500/20 bg-gradient-to-br from-rose-950/20 to-slate-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          Section Health Diagnostic
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">{failing.length} Issues</span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">{passing.length} ✓</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-slate-400">
          <span>Completeness</span>
          <span>{Math.round((passing.length / sections.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(passing.length / sections.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 rounded-full"
          />
        </div>
      </div>

      {sortedFailing.length > 0 ? (
        <div className="space-y-1.5">
          {sortedFailing.map(s => (
            <div key={s.id} className={`flex items-start gap-2.5 p-2.5 rounded-xl border ${severityColor[s.severity]}`}>
              <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 opacity-80" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold">{s.label}</span>
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-black/20">{severityLabel[s.severity]}</span>
                </div>
                <p className="text-[10px] opacity-75 mt-0.5 leading-snug">{s.tip}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>All key sections are complete!</span>
        </div>
      )}

      {passing.length > 0 && (
        <button onClick={() => setShowPassing(!showPassing)} className="w-full flex items-center justify-center gap-1.5 text-[11px] text-slate-400 hover:text-emerald-400 font-semibold transition py-1">
          {showPassing ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          {showPassing ? 'Hide' : `Show ${passing.length} passing sections`}
        </button>
      )}

      <AnimatePresence>
        {showPassing && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden space-y-1.5">
            {passing.map(s => (
              <div key={s.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-[11px] text-emerald-300 font-medium">{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Keyword Search Bar ───────────────────────────────────────────────────────
function KeywordSearchBar({ keywords, onKeywordsChange }) {
  const [inputValue, setInputValue] = useState('');

  const handleAdd = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !keywords.includes(trimmed)) onKeywordsChange([...keywords, trimmed]);
    setInputValue('');
  };

  return (
    <div className="pro-card p-4 rounded-2xl border border-slate-700/60 bg-slate-900/60 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          Keyword Highlighter
        </h3>
        {keywords.length > 0 && (
          <button onClick={() => onKeywordsChange([])} className="text-[10px] text-slate-500 hover:text-rose-400 transition flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Type keyword and press Enter (e.g. React, Docker)"
          className="flex-1 bg-slate-950 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 transition"
        />
        <button onClick={handleAdd} disabled={!inputValue.trim()} className="px-3.5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl transition">
          Add
        </button>
      </div>

      {keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {keywords.map((kw, idx) => (
            <span key={idx} className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-400/20 border border-amber-400/40 text-amber-200">
              {kw}
              <button onClick={() => onKeywordsChange(keywords.filter(k => k !== kw))} className="hover:text-rose-400 transition">
                <X className="w-2.5 h-2.5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <p className="text-[10px] text-slate-500 leading-relaxed">
        {keywords.length > 0 ? '✓ Keywords highlighted in Resume View → go to Resume tab to see them.' : 'Add keywords to highlight them throughout your resume for quick visual scanning.'}
      </p>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
export default function ResumeHighlights({ resume, analysis, highlightKeywords: externalKeywords, onKeywordsChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white">Resume Highlights</h2>
          <p className="text-[11px] text-slate-400">AI-powered insights, badges, and diagnostics for your resume</p>
        </div>
      </div>

      <KeywordSearchBar keywords={externalKeywords || []} onKeywordsChange={onKeywordsChange || (() => {})} />
      <StrengthBadgesCard resume={resume} analysis={analysis} />
      <CareerHighlightsCard resume={resume} />
      <MissingSectionsDiagnostic resume={resume} />
    </motion.div>
  );
}
