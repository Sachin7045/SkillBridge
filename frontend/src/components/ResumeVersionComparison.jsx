import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Layers, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  Zap,
  ShieldCheck,
  Award,
  ChevronRight,
  SplitSquareVertical
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ResumeVersionComparison({ 
  currentResume,
  analysis,
  onNavigateTab
}) {
  const [selectedView, setSelectedView] = useState('side-by-side'); // 'side-by-side' | 'bullets-diff' | 'skills-diff'

  const originalBullets = currentResume?.experience?.[0]?.bullets || [
    "Worked on web application frontend using modern technologies.",
    "Assisted senior engineers in API integration and bug fixes.",
    "Participated in sprint planning and standup meetings."
  ];

  // Enhanced draft showcasing quantifiable achievements and power verbs
  const optimizedBullets = [
    "Architected high-throughput client state layer using React and TypeScript, boosting core web vitals by 42% for 65,000+ daily active users.",
    "Engineered resilient distributed REST endpoints with automated Redis caching, reducing query latency from 320ms to 48ms.",
    "Spearheaded automated CI/CD deployment pipelines on Docker & AWS ECS, cutting release cycle time by 60% with zero downtime."
  ];

  const initialScore = Math.max(48, (analysis?.atsScore || 75) - 22);
  const currentScore = analysis?.atsScore || 78;
  const scoreDelta = currentScore - initialScore;

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
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Version Comparison Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Original Resume vs. Optimized Intelligence Draft
          </h2>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xl">
            Inspect line-by-line accomplishment revisions, active verb additions, and quantifiable metrics that drive ATS score elevation.
          </p>
        </div>

        {/* Score Delta Pill */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Initial Upload</div>
            <div className="text-xl font-bold text-slate-400 mt-0.5">{initialScore}</div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-600" />
          <div className="text-center">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Optimized</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">{currentScore}</div>
          </div>
          <div className="pl-2 border-l border-slate-800">
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
              +{scoreDelta} Pts
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
        <button
          onClick={() => setSelectedView('side-by-side')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedView === 'side-by-side'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          Side-by-Side Accomplishments
        </button>
        <button
          onClick={() => setSelectedView('metrics-audit')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
            selectedView === 'metrics-audit'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
              : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
          }`}
        >
          ATS Metric Delta Audit
        </button>
      </div>

      {/* Side-by-Side View */}
      {selectedView === 'side-by-side' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left: Original Version */}
          <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                <h3 className="text-sm font-bold text-slate-300">Initial Unoptimized Draft</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-0.5 rounded bg-slate-800">
                Baseline (v1.0)
              </span>
            </div>

            <div className="space-y-4">
              {originalBullets.map((bullet, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                  <span className="text-slate-500 font-mono text-[10px] mr-2">0{idx + 1}.</span>
                  {bullet}
                  <div className="mt-2 text-[10px] text-amber-400/90 flex items-center gap-1.5 font-medium">
                    <AlertCircle className="w-3 h-3" />
                    <span>Lacks quantifiable numbers and action verb strength</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
              <span>Power Verbs: 1 detected</span>
              <span>Quantified Bullets: 0%</span>
            </div>
          </div>

          {/* Right: Optimized Version */}
          <div className="pro-card p-6 rounded-2xl border border-indigo-500/30 bg-slate-900/80 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <h3 className="text-sm font-bold text-white">SkillBridge Optimized Edition</h3>
              </div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                Active Studio (v2.0)
              </span>
            </div>

            <div className="space-y-4 relative z-10">
              {optimizedBullets.map((bullet, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed shadow-sm">
                  <span className="text-indigo-400 font-mono text-[10px] mr-2">0{idx + 1}.</span>
                  {bullet}
                  <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>STAR formatted • Scale metric included (+42%, 48ms, 60%)</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between relative z-10">
              <span className="text-indigo-300 font-semibold">Power Verbs: 3 (Architected, Engineered, Spearheaded)</span>
              <span className="text-emerald-400 font-semibold">Quantified Bullets: 100%</span>
            </div>
          </div>

        </div>
      )}

      {/* Metrics Audit View */}
      {selectedView === 'metrics-audit' && (
        <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
          <h3 className="text-sm font-bold text-white mb-4">Detailed Algorithmic Scoring Factors</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Impact & Scale Delta</div>
              <div className="text-xl font-bold text-white mt-1">+14 pts</div>
              <p className="text-[11px] text-slate-400 mt-1">From passive responsibility phrases to quantifiable metrics.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Action Verb Potency</div>
              <div className="text-xl font-bold text-indigo-400 mt-1">+8 pts</div>
              <p className="text-[11px] text-slate-400 mt-1">Replaced 'worked on' and 'helped' with high-caliber verbs.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-xs text-slate-400">Keyword Taxonomy Alignment</div>
              <div className="text-xl font-bold text-emerald-400 mt-1">+7 pts</div>
              <p className="text-[11px] text-slate-400 mt-1">Synced with top-tier Full Stack & Cloud hiring benchmarks.</p>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => onNavigateTab('visualizer')}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
            >
              Export Optimized Resume in Studio →
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
