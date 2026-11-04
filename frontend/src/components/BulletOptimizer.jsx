import React, { useState } from 'react';
import { 
  Wand2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  ShieldCheck,
  Award,
  Layers,
  CheckCircle2,
  FileText,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { optimizeBulletApi } from '../api';

export default function BulletOptimizer({ apiKey, onApplyToResume = null, currentResume = null }) {
  const [bullet, setBullet] = useState('');
  const [contextTech, setContextTech] = useState('');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [appliedIndex, setAppliedIndex] = useState(null);
  const [activeStarTab, setActiveStarTab] = useState(null);

  const sampleWeakBullets = [
    { text: "Worked on frontend with React and fixed bugs.", tech: "React, Redux, Jest" },
    { text: "Helped backend team with database queries and API endpoints.", tech: "Node.js, PostgreSQL, Redis" },
    { text: "Responsible for Docker deployments on AWS.", tech: "AWS ECS, Docker, GitHub Actions" },
    { text: "Built UI components and collaborated with designers.", tech: "TypeScript, Tailwind CSS, Figma" }
  ];

  // Extract bullets from current candidate resume
  const resumeBullets = (currentResume?.experience || []).flatMap(exp => 
    (exp.bullets || []).map(b => ({
      text: b,
      company: exp.company || 'Current Role',
      role: exp.role || 'Software Engineer'
    }))
  );

  const handleOptimize = async (customBullet = null, customTech = null) => {
    const textToUse = customBullet || bullet;
    const techToUse = customTech !== null ? customTech : contextTech;
    if (!textToUse.trim()) return;

    setIsOptimizing(true);
    try {
      const res = await optimizeBulletApi(textToUse, techToUse, apiKey);
      setResult(res.result);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (err) {
      console.error(err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">STAR Bullet Point Polisher</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-blue-400 border border-cyan-500/20 font-semibold">
              Situation • Task • Action • Result
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Convert weak, passive responsibilities into high-impact, quantified accomplishments tailored for executive ATS screening.
          </p>
        </div>

        {currentResume && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>Active Resume: <strong>{currentResume.name || 'Candidate'}</strong></span>
          </div>
        )}
      </div>

      {/* Main Input Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-5">
        
        {/* Resume Bullet Quick-Picks (if candidate has experience) */}
        {resumeBullets.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-blue-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Pick an existing bullet from your resume to enhance:
            </span>
            <div className="flex flex-wrap gap-2">
              {resumeBullets.slice(0, 6).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setBullet(item.text);
                    handleOptimize(item.text, contextTech);
                  }}
                  className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/80 hover:border-blue-500 text-slate-300 hover:text-white transition truncate max-w-sm text-left"
                  title={`${item.role} @ ${item.company}: "${item.text}"`}
                >
                  <span className="text-slate-500 mr-1.5">[{item.company}]</span>
                  "{item.text.length > 60 ? item.text.substring(0, 60) + '...' : item.text}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sample Quick-Picks */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-400">Or test with common weak statements:</span>
          <div className="flex flex-wrap gap-2">
            {sampleWeakBullets.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setBullet(sample.text);
                  setContextTech(sample.tech);
                  handleOptimize(sample.text, sample.tech);
                }}
                className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-blue-500/40 text-slate-300 hover:text-white transition truncate max-w-xs"
              >
                "{sample.text}"
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Your Current Resume Bullet / Accomplishment Draft
            </label>
            <textarea
              rows={3}
              value={bullet}
              onChange={(e) => setBullet(e.target.value)}
              placeholder="e.g., Handled backend API performance, wrote unit tests, and resolved database bugs..."
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-sans resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technologies / Frameworks Used (Optional Context)
              </label>
              <input
                type="text"
                value={contextTech}
                onChange={(e) => setContextTech(e.target.value)}
                placeholder="e.g., React, TypeScript, Redis, PostgreSQL, AWS, Docker"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-4">
              <button
                onClick={() => handleOptimize()}
                disabled={isOptimizing || !bullet.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-xl shadow-lg shadow-blue-600/30 transition"
              >
                {isOptimizing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                    <span>Optimizing with STAR...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-300" />
                    <span>Transform Bullet Point</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Results Variations */}
      {result && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Strength Comparison Gauge */}
          {result.originalScore && (
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center font-black text-amber-400 text-sm">
                  {result.originalScore}%
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Original Impact Rating</div>
                  <div className="text-[11px] text-slate-400">Lacked power verbs and measurable quantitative proof</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-blue-400 font-bold text-xs self-center">
                <span>STAR Transformation</span>
                <ArrowRight className="w-4 h-4 text-blue-400" />
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-black text-emerald-400 text-sm">
                  {result.targetScore || 95}%
                </div>
                <div>
                  <div className="text-xs font-bold text-emerald-300">Executive ATS Rating</div>
                  <div className="text-[11px] text-slate-400">Quantified outcomes, scale & active engineering leadership</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              High-Impact STAR Variations ({result.variations?.length || 3})
            </h3>
            <span className="text-xs text-blue-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 1-Click Copy Ready
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(result.variations || []).map((variation, idx) => {
              const isCopied = copiedIndex === idx;
              const hasStar = Boolean(variation.star);
              return (
                <div
                  key={idx}
                  className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{variation.style}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {variation.badge}
                      </span>
                      {variation.score && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {variation.score} pts
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {onApplyToResume && (
                        <button
                          type="button"
                          onClick={() => {
                            onApplyToResume(variation.text);
                            setAppliedIndex(idx);
                            setTimeout(() => setAppliedIndex(null), 2500);
                          }}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                            appliedIndex === idx
                              ? 'bg-emerald-600 text-white'
                              : 'bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40'
                          }`}
                          title="Apply this accomplishment bullet directly to your primary resume experience"
                        >
                          {appliedIndex === idx ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied!</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Apply to Resume</span>
                            </>
                          )}
                        </button>
                      )}

                      <button
                        onClick={() => handleCopy(variation.text, idx)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
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
                            <span>Copy Bullet</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                    • {variation.text}
                  </p>

                  {/* STAR Method Breakdown Pill Grid */}
                  {hasStar && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                        <span className="font-bold text-amber-400 block mb-0.5">S & T (Situation/Task):</span>
                        <span className="text-slate-400">{variation.star.situation || variation.star.task}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                        <span className="font-bold text-blue-400 block mb-0.5">A (Action Execution):</span>
                        <span className="text-slate-300 font-medium">{variation.star.action}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/50 border border-slate-800">
                        <span className="font-bold text-emerald-400 block mb-0.5">R (Quantified Result):</span>
                        <span className="text-slate-200 font-semibold">{variation.star.result}</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                    <Zap className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span><strong className="text-slate-300">Why this works:</strong> {variation.rationale}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Verb Cheat Sheet */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-400" />
          High-Impact Action Verb Bank (Click to Prepend)
        </span>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            "Architected", "Spearheaded", "Engineered", "Orchestrated", "Implemented",
            "Optimized", "Scaled", "Automated", "Pioneered", "Accelerated",
            "Revamped", "Streamlined", "Maximized", "Overhauled", "Deployed",
            "Benchmarked", "Containerized", "Refactored"
          ].map((verb, idx) => (
            <span
              key={idx}
              onClick={() => setBullet(prev => prev ? `${verb} ${prev}` : `${verb} `)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-blue-300 hover:border-cyan-500/30 cursor-pointer transition select-none"
              title="Click to prepend to bullet"
            >
              {verb}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
