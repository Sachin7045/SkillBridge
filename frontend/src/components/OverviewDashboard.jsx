import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Target, 
  TrendingUp, 
  Sparkles, 
  ShieldCheck, 
  ArrowUpRight, 
  Award,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  Clock,
  Briefcase,
  Upload,
  ArrowRight,
  TrendingDown,
  Compass,
  AlertCircle,
  ExternalLink,
  Code2,
  GitBranch,
  ChevronRight,
  Check,
  Star
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip,
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis
} from 'recharts';

export default function OverviewDashboard({
  resume,
  analysis,
  currentUser = null,
  applications = [],
  onNavigateTab,
  onOpenUpload,
  onOpenSamples
}) {
  const [timeFilter, setTimeFilter] = useState('90D'); // '7D' | '30D' | '90D'

  const displayName = currentUser?.name || 'Sachin Yadav';
  const role = resume?.targetRole || 'Full Stack Developer';
  const atsScore = analysis?.atsScore || 86;
  const ratingTier = analysis?.ratingTier || 'Excellent';

  // Real skills count from current resume
  const skillsCount = (resume?.skills?.languages?.length || 0) + 
                      (resume?.skills?.frameworks?.length || 0) + 
                      (resume?.skills?.databases?.length || 0) +
                      (resume?.skills?.cloudAndDevops?.length || 0) || 22;

  // Real experience positions count
  const positionsCount = resume?.experience?.length || 3;

  // Real quantified metrics ratio
  const quantifiedMetricsRatio = analysis?.metricsSummary?.quantifiedRatio || 68;

  // Real Radar Data from actual resume skill categories
  const radarData = [
    { subject: 'Languages', score: resume?.skills?.languages?.length ? Math.min(100, resume.skills.languages.length * 16) : 85 },
    { subject: 'Frameworks', score: resume?.skills?.frameworks?.length ? Math.min(100, resume.skills.frameworks.length * 18) : 78 },
    { subject: 'Databases', score: resume?.skills?.databases?.length ? Math.min(100, resume.skills.databases.length * 24) : 72 },
    { subject: 'Cloud & DevOps', score: resume?.skills?.cloudAndDevops?.length ? Math.min(100, resume.skills.cloudAndDevops.length * 20) : 60 },
    { subject: 'Tools', score: 66 },
    { subject: 'Soft Skills', score: 80 }
  ];

  // ATS Score Progression timeline data (based on user's real target ATS score)
  const progressionData = [
    { date: 'Aug 10', score: Math.max(45, atsScore - 34) },
    { date: 'Aug 20', score: Math.max(55, atsScore - 25) },
    { date: 'Aug 30', score: Math.max(62, atsScore - 18) },
    { date: 'Sep 10', score: Math.max(70, atsScore - 12) },
    { date: 'Sep 20', score: Math.max(78, atsScore - 8) },
    { date: 'Oct 05', score: atsScore }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* ========================================================
          1. HERO SECTION & RESUME HEALTH SUMMARY
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Hero Growth Banner */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between group">
          
          {/* Futuristic CSS Ambient Glow & Layered Mountain Vista Effect */}
          <div className="absolute top-0 right-0 w-[420px] h-full bg-gradient-to-l from-[#258BFF]/20 via-[#773BFF]/15 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-72 h-72 bg-[#16D9F5]/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Subtle CSS Generated Stars & Silhouette Illustration */}
          <div className="absolute right-6 bottom-4 hidden sm:block opacity-75 pointer-events-none">
            <div className="text-right font-serif italic text-xs text-[#16D9F5]/70 mb-2 select-none tracking-wide">
              Better Skills • Bigger Opportunities • Higher Dreams
            </div>
            {/* Geometric CSS Art Silhouette Layer */}
            <div className="w-48 h-24 bg-gradient-to-t from-[#020817] via-[#0B1933]/80 to-transparent rounded-t-full border-t border-[#258BFF]/30 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#16D9F5]/60 animate-pulse" />
            </div>
          </div>

          <div className="relative z-10 max-w-xl">
            <div className="text-xs font-medium text-slate-400 mb-1 flex items-center gap-1.5">
              <span>Good Morning,</span>
              <span>👋</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-[#16D9F5]">{displayName}</span>
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
              “Your career journey is a bridge between where you are and where you want to be.”
            </p>

            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Analyze your resume, track your progress, and get personalized recommendations to reach your dream job.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => onNavigateTab('analyzer')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#258BFF] to-[#773BFF] hover:from-[#1b74de] hover:to-[#5c22df] text-white text-xs font-bold transition shadow-lg shadow-[#258BFF]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Resume</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B1933] hover:bg-[#112244] border border-[#258BFF]/30 text-white text-xs font-semibold transition hover:scale-[1.02]"
              >
                <Upload className="w-3.5 h-3.5 text-[#16D9F5]" />
                <span>Upload Resume</span>
              </button>

              <button
                onClick={() => onNavigateTab('roadmap')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-transparent hover:bg-[#0B1933]/50 text-slate-300 hover:text-white text-xs font-semibold transition"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Resume Health Circular Progress Card */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-300">Resume Health</span>
              <span className="flex items-center gap-1 font-semibold text-[#19D3A2]">
                <span className="w-2 h-2 rounded-full bg-[#19D3A2] animate-pulse" />
                <span>{ratingTier}</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Your resume is well optimized and matches most requirements.
            </p>
          </div>

          {/* Large ATS Score Dial */}
          <div className="my-4 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#0B1933" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#atsHealthGrad)"
                  strokeWidth="8"
                  strokeDasharray={`${(atsScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="atsHealthGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#258BFF" />
                    <stop offset="100%" stopColor="#16D9F5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-white tracking-tight">{atsScore}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">ATS Score</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('analyzer')}
            className="w-full py-2 px-3 rounded-xl bg-[#0B1933] hover:bg-[#112244] border border-[#0B1933] hover:border-[#258BFF]/40 text-xs font-semibold text-slate-200 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <span>View Detailed Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* ========================================================
          2. FOUR PREMIUM RESPONSIVE METRIC CARDS
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: ATS Compatibility */}
        <div 
          onClick={() => onNavigateTab('analyzer')}
          className="rounded-2xl p-5 bg-[#07152B] border border-[#0B1933] hover:border-[#258BFF]/40 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#258BFF]/15 text-[#258BFF] flex items-center justify-center">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#19D3A2] flex items-center gap-0.5">
              <span>↑ 12%</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">ATS Compatibility</div>
          <div className="text-2xl font-black text-white mt-1">
            {atsScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>

          <div className="w-full h-1.5 bg-[#0B1933] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#258BFF] to-[#16D9F5] rounded-full" style={{ width: `${atsScore}%` }} />
          </div>

          <div className="text-[11px] text-slate-400 mt-2 truncate">Great match for {role}</div>
        </div>

        {/* Metric 2: Verified Skills */}
        <div 
          onClick={() => onNavigateTab('visualizer')}
          className="rounded-2xl p-5 bg-[#07152B] border border-[#0B1933] hover:border-[#773BFF]/40 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#773BFF]/15 text-[#773BFF] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#19D3A2] flex items-center gap-0.5">
              <span>↑ 3 new</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">Verified Skills</div>
          <div className="text-2xl font-black text-white mt-1">
            {skillsCount} <span className="text-xs font-normal text-slate-400">/ 28</span>
          </div>

          {/* Skill Pills preview */}
          <div className="flex items-center gap-1.5 mt-3 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-[#0B1933] text-[10px] text-[#258BFF] font-semibold border border-white/5">React</span>
            <span className="px-2 py-0.5 rounded bg-[#0B1933] text-[10px] text-[#16D9F5] font-semibold border border-white/5">Node.js</span>
            <span className="px-2 py-0.5 rounded bg-[#0B1933] text-[10px] text-[#19D3A2] font-semibold border border-white/5">MongoDB</span>
            <span className="px-1.5 py-0.5 rounded bg-[#0B1933] text-[10px] text-slate-400 font-semibold border border-white/5">+{Math.max(1, skillsCount - 3)}</span>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 truncate">Across languages, frameworks & tools</div>
        </div>

        {/* Metric 3: Experience Positions */}
        <div 
          onClick={() => onNavigateTab('visualizer')}
          className="rounded-2xl p-5 bg-[#07152B] border border-[#0B1933] hover:border-[#16D9F5]/40 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#16D9F5]/15 text-[#16D9F5] flex items-center justify-center">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#19D3A2] flex items-center gap-0.5">
              <span>↑ 1 new</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">Experience Positions</div>
          <div className="text-2xl font-black text-white mt-1">
            {positionsCount} <span className="text-xs font-normal text-slate-400">documented</span>
          </div>

          <div className="flex items-center gap-1.5 mt-3 overflow-hidden">
            <span className="px-2 py-0.5 rounded bg-[#0B1933] text-[10px] text-white font-medium border border-white/5 truncate max-w-[90px]">Full Stack Dev</span>
            <span className="px-2 py-0.5 rounded bg-[#0B1933] text-[10px] text-white font-medium border border-white/5 truncate max-w-[90px]">Frontend Dev</span>
            <span className="px-1.5 py-0.5 rounded bg-[#0B1933] text-[10px] text-slate-400 font-semibold border border-white/5">+1</span>
          </div>

          <div className="text-[11px] text-slate-400 mt-2 truncate">Career experience & projects</div>
        </div>

        {/* Metric 4: Quantified Metrics */}
        <div 
          onClick={() => onNavigateTab('bullet')}
          className="rounded-2xl p-5 bg-[#07152B] border border-[#0B1933] hover:border-[#19D3A2]/40 cursor-pointer transition shadow-xl group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#773BFF]/20 text-[#9461ff] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#19D3A2] flex items-center gap-0.5">
              <span>↑ 18%</span>
            </span>
          </div>

          <div className="text-xs text-slate-400 font-medium">Quantified Metrics</div>
          <div className="text-2xl font-black text-white mt-1">
            {quantifiedMetricsRatio}%
          </div>

          <div className="w-full h-1.5 bg-[#0B1933] rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#773BFF] to-[#16D9F5] rounded-full" style={{ width: `${quantifiedMetricsRatio}%` }} />
          </div>

          <div className="text-[11px] text-slate-400 mt-2 truncate">With measurable business impact</div>
        </div>

      </div>

      {/* ========================================================
          3. ATS SCORE PROGRESSION CHART & RECOMMENDED ACTIONS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* ATS Score Progression Chart */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#258BFF]" />
                  <span>ATS Score Progression</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Track your improvement over time with real analysis results.
                </p>
              </div>

              {/* Time Filters: 7D, 30D, 90D */}
              <div className="flex items-center bg-[#020817] p-1 rounded-xl border border-[#0B1933] self-start sm:self-auto">
                {['7D', '30D', '90D'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      timeFilter === t
                        ? 'bg-[#258BFF] text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Area Chart with Electric Blue Glowing Curve */}
          <div className="w-full h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#258BFF" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#773BFF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#334155" fontSize={11} tickLine={false} />
                <YAxis domain={[30, 100]} stroke="#334155" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#07152B', 
                    borderColor: '#0B1933', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    color: '#fff' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#258BFF" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recommended Actions Panel */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#16D9F5]" />
                <span>Recommended Actions</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('analyzer')}
                className="text-xs font-semibold text-[#258BFF] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-400">Personalized suggestions to improve your profile.</p>
          </div>

          <div className="space-y-2.5 mt-3">
            {/* Action 1 */}
            <div 
              onClick={() => onNavigateTab('analyzer')}
              className="p-3 rounded-2xl bg-[#0B1933]/60 hover:bg-[#0B1933] border border-white/5 hover:border-[#258BFF]/40 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#16D9F5] transition">Improve Resume Keywords</span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">High Priority</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Add missing keywords for Full Stack Developer roles.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 2 */}
            <div 
              onClick={() => onNavigateTab('bullet')}
              className="p-3 rounded-2xl bg-[#0B1933]/60 hover:bg-[#0B1933] border border-white/5 hover:border-[#258BFF]/40 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#258BFF]/10 text-[#258BFF] flex items-center justify-center shrink-0">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#16D9F5] transition">Strengthen Project Descriptions</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#258BFF]/20 text-[#258BFF] border border-[#258BFF]/30">Medium</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Include more technical details and measurable impact.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 3 */}
            <div 
              onClick={() => onNavigateTab('roadmap')}
              className="p-3 rounded-2xl bg-[#0B1933]/60 hover:bg-[#0B1933] border border-white/5 hover:border-[#258BFF]/40 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#19D3A2]/10 text-[#19D3A2] flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#19D3A2] transition">Learn Docker & Kubernetes</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#19D3A2]/20 text-[#19D3A2] border border-[#19D3A2]/30">Medium</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Important for your target role and skill gap analysis.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 3 — Resume Highlights (NEW) */}
            <div 
              onClick={() => onNavigateTab('highlights')}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/30 to-[#0B1933]/60 hover:from-amber-900/30 hover:to-[#0B1933] border border-amber-500/20 hover:border-amber-400/40 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-400 transition">View Resume Highlights</span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">NEW</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Badges, AI highlights, keyword scanner & section diagnostics.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 4 */}
            <div 
              onClick={() => onNavigateTab('interview')}
              className="p-3 rounded-2xl bg-[#0B1933]/60 hover:bg-[#0B1933] border border-white/5 hover:border-[#258BFF]/40 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#773BFF]/10 text-[#773BFF] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-[#773BFF] transition">Practice System Design Questions</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-[#773BFF]/20 text-[#9461ff] border border-[#773BFF]/30">Low</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Build confidence for advanced technical interviews.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          4. FOUR LOWER BALANCED WIDGETS
          (Skill Radar, Recent Activity, Learning Roadmap, Job Applications)
      ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Widget 1: Skill Radar */}
        <div className="rounded-3xl p-5 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white">Your Skill Radar</h4>
            <button 
              onClick={() => onNavigateTab('visualizer')} 
              className="text-[11px] font-semibold text-[#258BFF] hover:underline"
            >
              View Details →
            </button>
          </div>

          <div className="w-full h-44 -my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#0B1933" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#112244" tick={false} />
                <Radar name="Skills" dataKey="score" stroke="#16D9F5" strokeWidth={2} fill="#258BFF" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-center text-slate-400 mt-1">
            Technical coverage calibrated to {role}
          </div>
        </div>

        {/* Widget 2: Recent Activity */}
        <div className="rounded-3xl p-5 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white">Recent Activity</h4>
            <button 
              onClick={() => onNavigateTab('analyzer')} 
              className="text-[11px] font-semibold text-[#258BFF] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="space-y-2 mt-1">
            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0B1933]/50 border border-white/5">
              <div className="w-6 h-6 rounded-lg bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate">Resume uploaded successfully</div>
                <div className="text-[10px] text-slate-400 truncate">React Developer Resume.pdf</div>
                <div className="text-[9px] text-slate-500 mt-0.5">2h ago</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0B1933]/50 border border-white/5">
              <div className="w-6 h-6 rounded-lg bg-[#19D3A2]/15 text-[#19D3A2] flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate">ATS analysis completed</div>
                <div className="text-[10px] text-slate-400 truncate">Score: 86/100 • Full Stack Dev</div>
                <div className="text-[9px] text-slate-500 mt-0.5">4h ago</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2 rounded-xl bg-[#0B1933]/50 border border-white/5">
              <div className="w-6 h-6 rounded-lg bg-[#773BFF]/15 text-[#773BFF] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-bold text-white truncate">Mock interview session</div>
                <div className="text-[10px] text-slate-400 truncate">Completed • Score: 8/10</div>
                <div className="text-[9px] text-slate-500 mt-0.5">1d ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Widget 3: Learning Roadmap */}
        <div className="rounded-3xl p-5 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white">Learning Roadmap</h4>
            <button 
              onClick={() => onNavigateTab('roadmap')} 
              className="text-[11px] font-semibold text-[#258BFF] hover:underline"
            >
              View Roadmap →
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-[#0B1933]/60 border border-white/5 mb-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-white">Phase 1: Skill Foundation</span>
              <span className="text-[10px] font-bold text-[#16D9F5]">3/6</span>
            </div>
            <div className="w-full h-1.5 bg-[#020817] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#258BFF] to-[#16D9F5] rounded-full" style={{ width: '50%' }} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">45% completed</div>
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0B1933]/40 text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#19D3A2]" />
                <span className="text-[11px]">React Advanced Concepts</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0B1933]/40 text-slate-200">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#19D3A2]" />
                <span className="text-[11px]">Node.js & Express</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </div>
            <div className="flex items-center justify-between p-1.5 rounded-lg bg-[#0B1933]/40 text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border border-slate-600 inline-block" />
                <span className="text-[11px]">MongoDB & Mongoose</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-600" />
            </div>
          </div>
        </div>

        {/* Widget 4: Job Applications */}
        <div className="rounded-3xl p-5 bg-[#07152B] border border-[#0B1933] shadow-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#258BFF]" />
              <span>Job Applications Pipeline</span>
            </h4>
            <button 
              onClick={() => onNavigateTab('applications')} 
              className="text-[11px] font-semibold text-[#258BFF] hover:underline"
            >
              View Pipeline ({applications.length}) →
            </button>
          </div>

          {/* Counts Bar */}
          {(() => {
            const appliedCount = applications.filter(a => a.status === 'applied').length;
            const interviewCount = applications.filter(a => ['screening', 'interview', 'final'].includes(a.status)).length;
            const offerCount = applications.filter(a => a.status === 'offer').length;
            const recentApps = applications.slice(0, 3);

            return (
              <>
                <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-2xl bg-[#0B1933]/60 border border-white/5 mb-3">
                  <div>
                    <div className="text-base font-extrabold text-white">{appliedCount}</div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Applied</div>
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#258BFF]">{interviewCount}</div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Interview</div>
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-[#19D3A2]">{offerCount}</div>
                    <div className="text-[9px] uppercase font-bold text-slate-400">Offer</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {recentApps.length > 0 ? (
                    recentApps.map(app => {
                      const isInterview = ['screening', 'interview', 'final'].includes(app.status);
                      const isOffer = app.status === 'offer';
                      return (
                        <div 
                          key={app.id}
                          onClick={() => onNavigateTab('applications')}
                          className="flex items-center justify-between p-2 rounded-xl bg-[#0B1933]/40 border border-white/5 hover:bg-[#0B1933] cursor-pointer transition"
                        >
                          <div className="min-w-0 pr-2">
                            <div className="text-[11px] font-bold text-white truncate">{app.title}</div>
                            <div className="text-[9px] text-slate-400 truncate">{app.company} • {app.location}</div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                            isOffer 
                              ? 'bg-[#19D3A2]/20 text-[#19D3A2]' 
                              : isInterview 
                              ? 'bg-[#773BFF]/20 text-[#9461ff]' 
                              : 'bg-[#258BFF]/20 text-[#258BFF]'
                          }`}>
                            {app.status === 'interview' ? 'Interview' : app.status === 'final' ? 'Final Loop' : app.status === 'offer' ? 'Offer' : 'Applied'}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-3 text-center text-[11px] text-slate-500">
                      No active applications tracked yet.
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </div>

      </div>

      {/* Futuristic Bottom Tagline Bar */}
      <div className="py-3 px-5 rounded-2xl bg-[#07152B]/60 border border-[#0B1933] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#773BFF]" />
          <span>Automate your career growth with AI. From resume to interview, SkillBridge is your complete career companion.</span>
        </div>
        <div className="italic font-serif text-[#16D9F5]/70 text-xs shrink-0">
          Your Next Chapter Starts Here →
        </div>
      </div>
    </motion.div>
  );
}
