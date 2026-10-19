import React, { useState, useEffect } from 'react';
import { 
  GitFork, 
  Target, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  FolderGit2, 
  ExternalLink, 
  RefreshCw, 
  Sparkles,
  BookMarked,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateRoadmapApi } from '../api';

export default function SkillBridgeRoadmap({ resume, rolesList, apiKey }) {
  const [targetRole, setTargetRole] = useState(resume?.targetRole || "Full Stack Developer");
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Persistent progress tracking per candidate & role
  const storageKey = `skillbridge_roadmap_progress_${resume?.id || 'default'}_${targetRole.replace(/\s+/g, '_')}`;
  const [completedSkills, setCompletedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Re-sync progress when targetRole or resume changes
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      setCompletedSkills(saved ? JSON.parse(saved) : {});
    } catch {
      setCompletedSkills({});
    }
  }, [storageKey]);

  useEffect(() => {
    fetchRoadmap();
  }, [resume, targetRole]);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const res = await generateRoadmapApi(resume, targetRole, apiKey);
      setRoadmap(res.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSkill = (skillName) => {
    setCompletedSkills(prev => {
      const next = { ...prev, [skillName]: !prev[skillName] };
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save roadmap progress:', e);
      }
      const totalChecked = Object.values(next).filter(Boolean).length;
      if (totalChecked > 0 && totalChecked % 3 === 0) {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GitFork className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">Skill Bridge Learning Roadmap</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-semibold">
              Personalized Gap Closer
            </span>
          </div>
          <p className="text-xs text-slate-400">
            A milestone-based pathway closing identified skill gaps between your current resume and your dream role.
          </p>
        </div>

        {/* Role Selector & Refresh */}
        <div className="flex items-center gap-2">
          <select
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            {(rolesList || ["Full Stack Developer", "Frontend Engineer", "Backend Engineer", "DevOps / Cloud Engineer", "Data Scientist / AI Engineer"]).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <button
            onClick={fetchRoadmap}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs text-slate-300 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-300">
            Mapping career milestones and analyzing competency gaps for {targetRole}...
          </p>
        </div>
      ) : roadmap ? (
        <div className="space-y-6">
          
          {/* Readiness & Timeline Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-white">{roadmap.readinessScore}%</div>
              <div className="text-xs text-slate-400 mt-1">Current Role Readiness</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${roadmap.readinessScore}%` }} />
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-cyan-400">{roadmap.estimatedWeeks} Weeks</div>
              <div className="text-xs text-slate-400 mt-1">Estimated Bridge Duration</div>
              <div className="text-[10px] text-slate-500 mt-3">~10-15 hrs/week recommended</div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 text-center">
              <div className="text-2xl font-black text-emerald-400">
                {Object.values(completedSkills).filter(Boolean).length} Done
              </div>
              <div className="text-xs text-slate-400 mt-1">Interactive Milestones Mastered</div>
              <div className="text-[10px] text-emerald-500/80 mt-3">Click checkboxes below as you learn!</div>
            </div>
          </div>

          {/* Phased Roadmap Timeline */}
          <div className="space-y-6">
            {(roadmap.phases || []).map((phase, idx) => (
              <div
                key={phase.phase || idx}
                className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-slate-700 transition"
              >
                {/* Phase Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-black text-sm text-indigo-400">
                      P{phase.phase}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{phase.title}</h3>
                      <p className="text-xs text-slate-400">{phase.focus}</p>
                    </div>
                  </div>

                  <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 self-start sm:self-auto">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    {phase.duration}
                  </span>
                </div>

                {/* Skills Checkboxes */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                    Target Competencies to Acquire:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {(phase.skills || []).map((skill, sIdx) => {
                      const isChecked = Boolean(completedSkills[skill]);
                      return (
                        <div
                          key={sIdx}
                          onClick={() => toggleSkill(skill)}
                          className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer select-none transition ${
                            isChecked
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300'
                          }`}
                        >
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <span className={`text-xs font-medium ${isChecked ? 'line-through opacity-80' : ''}`}>
                            {skill}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Objectives */}
                {phase.objectives && (
                  <div className="space-y-1 text-xs text-slate-400">
                    <span className="font-semibold text-slate-300">Phase Objectives:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-slate-400">
                      {phase.objectives.map((obj, oIdx) => (
                        <li key={oIdx}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Hands-On Project & Resources */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Project */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-cyan-400">
                      <FolderGit2 className="w-3.5 h-3.5" />
                      <span>Portfolio Flagship Project</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {phase.handsOnProject}
                    </p>
                  </div>

                  {/* Resources */}
                  <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-400">
                      <BookMarked className="w-3.5 h-3.5" />
                      <span>Curated Learning Guides</span>
                    </div>
                    <div className="space-y-1">
                      {(phase.recommendedResources || []).map((res, rIdx) => (
                        <div key={rIdx} className="flex items-center justify-between text-xs text-slate-300">
                          <span className="truncate pr-2">{res.title}</span>
                          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 shrink-0">
                            {res.type}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      ) : null}

    </div>
  );
}
