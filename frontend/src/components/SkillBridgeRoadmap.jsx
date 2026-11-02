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
  Award,
  Download,
  Copy,
  Check,
  Plus,
  Filter,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateRoadmapApi } from '../api';

export default function SkillBridgeRoadmap({ resume, rolesList, apiKey }) {
  const [targetRole, setTargetRole] = useState(resume?.targetRole || "Full Stack Developer");
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterMode, setFilterMode] = useState('all'); // 'all', 'pending', 'completed'
  const [newSkillText, setNewSkillText] = useState('');
  const [addingPhaseIdx, setAddingPhaseIdx] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Persistent progress tracking per candidate & role
  const storageKey = `skillbridge_roadmap_progress_${resume?.id || 'default'}_${targetRole.replace(/\s+/g, '_')}`;
  const customSkillsKey = `skillbridge_roadmap_custom_${resume?.id || 'default'}_${targetRole.replace(/\s+/g, '_')}`;

  const [completedSkills, setCompletedSkills] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [customSkills, setCustomSkills] = useState(() => {
    try {
      const saved = localStorage.getItem(customSkillsKey);
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
      const savedCustom = localStorage.getItem(customSkillsKey);
      setCustomSkills(savedCustom ? JSON.parse(savedCustom) : {});
    } catch {
      setCompletedSkills({});
      setCustomSkills({});
    }
  }, [storageKey, customSkillsKey]);

  useEffect(() => {
    fetchRoadmap();
  }, [resume, targetRole]);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const res = await generateRoadmapApi(resume || {}, targetRole, apiKey);
      setRoadmap(res.roadmap);
    } catch (err) {
      console.error('Roadmap generation error:', err);
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

  const handleAddCustomSkill = (phaseIdx) => {
    if (!newSkillText.trim()) return;
    const skillName = newSkillText.trim();
    setCustomSkills(prev => {
      const list = prev[phaseIdx] || [];
      if (list.includes(skillName)) return prev;
      const updated = { ...prev, [phaseIdx]: [...list, skillName] };
      try { localStorage.setItem(customSkillsKey, JSON.stringify(updated)); } catch (e) {}
      return updated;
    });
    setNewSkillText('');
    setAddingPhaseIdx(null);
  };

  // Compile all skills across phases
  const getAllPhaseSkills = (phase, pIdx) => {
    const defaultSkills = phase.skills || [];
    const custom = customSkills[pIdx] || [];
    return [...defaultSkills, ...custom];
  };

  const allSkillsList = roadmap?.phases ? roadmap.phases.flatMap((p, idx) => getAllPhaseSkills(p, idx)) : [];
  const completedCount = allSkillsList.filter(s => completedSkills[s]).length;
  const totalSkillsCount = allSkillsList.length;
  const progressPercent = totalSkillsCount > 0 ? Math.round((completedCount / totalSkillsCount) * 100) : 0;

  const handleExportRoadmap = () => {
    if (!roadmap) return;
    const md = `# SkillBridge Learning Roadmap: ${targetRole}
Candidate: ${resume?.name || 'Engineer'}
Role Readiness: ${roadmap.readinessScore}% | Estimated Duration: ${roadmap.estimatedWeeks} Weeks
Milestone Completion: ${completedCount}/${totalSkillsCount} (${progressPercent}%)

${(roadmap.phases || []).map((p, pIdx) => {
  const skills = getAllPhaseSkills(p, pIdx);
  return `## Phase ${p.phase}: ${p.title} (${p.duration})
Focus: ${p.focus}

### Target Competencies:
${skills.map(s => `- [${completedSkills[s] ? 'x' : ' '}] ${s}`).join('\n')}

### Objectives:
${(p.objectives || []).map(o => `- ${o}`).join('\n')}

### Flagship Portfolio Project:
${p.handsOnProject}

### Recommended Learning Resources:
${(p.recommendedResources || []).map(r => `- ${r.title} (${r.type})`).join('\n')}
`;
}).join('\n---\n\n')}`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SkillBridge-Career-Roadmap-${targetRole.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyRoadmap = () => {
    if (!roadmap) return;
    const summary = `SkillBridge Career Roadmap: ${targetRole}\nReadiness: ${roadmap.readinessScore}% | Duration: ${roadmap.estimatedWeeks} Weeks\nProgress: ${completedCount}/${totalSkillsCount} Skills Mastered (${progressPercent}%)`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            A milestone-based pathway closing identified skill gaps between your current resume and your target role.
          </p>
        </div>

        {/* Role Selector & Actions */}
        <div className="flex flex-wrap items-center gap-2">
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
            title="Recalculate Roadmap against latest resume"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {roadmap && (
            <>
              <button
                onClick={handleExportRoadmap}
                className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 rounded-xl text-xs text-indigo-200 hover:text-white transition"
                title="Download Roadmap as Markdown study guide"
              >
                <Download className="w-3.5 h-3.5 text-cyan-300" />
                <span className="hidden sm:inline">Export Plan</span>
              </button>

              <button
                onClick={handleCopyRoadmap}
                className="flex items-center gap-1 px-2.5 py-2 bg-slate-900 border border-slate-700 hover:border-slate-600 rounded-xl text-xs text-slate-300 transition"
                title="Copy Quick Summary"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="p-16 text-center space-y-3 glass-panel rounded-3xl border border-slate-800">
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
                {completedCount} / {totalSkillsCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">Milestones Mastered ({progressPercent}%)</div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <span className="px-2 text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                <Filter className="w-3 h-3" /> Filter:
              </span>
              <button
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg font-medium transition ${filterMode === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All ({totalSkillsCount})
              </button>
              <button
                onClick={() => setFilterMode('pending')}
                className={`px-3 py-1 rounded-lg font-medium transition ${filterMode === 'pending' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Pending ({totalSkillsCount - completedCount})
              </button>
              <button
                onClick={() => setFilterMode('completed')}
                className={`px-3 py-1 rounded-lg font-medium transition ${filterMode === 'completed' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Mastered ({completedCount})
              </button>
            </div>

            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Click checkboxes as you study to track progress!
            </span>
          </div>

          {/* Phased Roadmap Timeline */}
          <div className="space-y-6">
            {(roadmap.phases || []).map((phase, pIdx) => {
              const allPhaseSkills = getAllPhaseSkills(phase, pIdx);
              const visibleSkills = allPhaseSkills.filter(skill => {
                const isDone = Boolean(completedSkills[skill]);
                if (filterMode === 'completed') return isDone;
                if (filterMode === 'pending') return !isDone;
                return true;
              });

              const phaseDoneCount = allPhaseSkills.filter(s => completedSkills[s]).length;
              const isPhaseComplete = allPhaseSkills.length > 0 && phaseDoneCount === allPhaseSkills.length;

              return (
                <div
                  key={phase.phase || pIdx}
                  className={`glass-panel p-6 rounded-3xl border transition space-y-4 ${
                    isPhaseComplete ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Phase Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm border ${
                        isPhaseComplete 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' 
                          : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'
                      }`}>
                        P{phase.phase}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-white">{phase.title}</h3>
                          {isPhaseComplete && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              Phase Completed ✓
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400">{phase.focus}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800">
                        {phaseDoneCount} / {allPhaseSkills.length} done
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                        {phase.duration}
                      </span>
                    </div>
                  </div>

                  {/* Skills Checkboxes */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">
                        Target Competencies ({visibleSkills.length}):
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => setAddingPhaseIdx(addingPhaseIdx === pIdx ? null : pIdx)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Custom Skill</span>
                      </button>
                    </div>

                    {/* Inline Add Skill Form */}
                    {addingPhaseIdx === pIdx && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-indigo-500/40">
                        <input
                          type="text"
                          value={newSkillText}
                          onChange={(e) => setNewSkillText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddCustomSkill(pIdx); }}
                          placeholder="e.g., GraphQL Federation, Kafka Streams..."
                          className="flex-1 bg-transparent text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomSkill(pIdx)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition"
                        >
                          Add
                        </button>
                        <button
                          type="button"
                          onClick={() => { setAddingPhaseIdx(null); setNewSkillText(''); }}
                          className="px-2 py-1 text-slate-400 hover:text-white text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {visibleSkills.map((skill, sIdx) => {
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
                            <span className={`text-xs font-medium truncate ${isChecked ? 'line-through opacity-80' : ''}`}>
                              {skill}
                            </span>
                          </div>
                        );
                      })}
                      {visibleSkills.length === 0 && (
                        <p className="text-xs text-slate-500 col-span-3 py-2 italic">
                          No skills match the current filter in this phase.
                        </p>
                      )}
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
                      <div className="space-y-1.5">
                        {(phase.recommendedResources || []).map((res, rIdx) => (
                          <div key={rIdx} className="flex items-center justify-between text-xs text-slate-300">
                            <span className="truncate pr-2">{res.title}</span>
                            {res.url ? (
                              <a
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] bg-slate-900 hover:bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-slate-800 shrink-0 flex items-center gap-1"
                              >
                                <span>{res.type}</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-slate-400 shrink-0">
                                {res.type}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : null}

    </div>
  );
}
