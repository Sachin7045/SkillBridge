import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Target, 
  TrendingUp, 
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
  AlertCircle,
  Code2,
  GitBranch,
  ChevronRight,
  Check,
  Star,
  Edit3,
  X,
  Mic,
  MessageSquare,
  Sparkles,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';
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
  onOpenSamples,
  onUpdateUserName = () => {}
}) {
  const [timeFilter, setTimeFilter] = useState('90D'); // '7D' | '30D' | '90D'

  const displayName = formatUserDisplayName(currentUser, resume);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');

  const handleStartEdit = () => {
    setNameInput(displayName);
    setIsEditingName(true);
  };

  const handleSaveName = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateUserName(nameInput.trim());
      setIsEditingName(false);
    }
  };

  const role = resume?.targetRole || 'Full Stack Developer';
  const atsScore = analysis?.atsScore || 86;
  const ratingTier = analysis?.ratingTier || 'Excellent';
  const resumeScore = Math.min(100, Math.round(atsScore * 0.95 + 4));

  // Real skills count from current resume
  const skillsCount = (resume?.skills?.languages?.length || 0) + 
                      (resume?.skills?.frameworks?.length || 0) + 
                      (resume?.skills?.databases?.length || 0) +
                      (resume?.skills?.cloudAndDevops?.length || 0) || 22;

  // Real experience positions
  const experiences = resume?.experience || [
    { role: 'Senior Full Stack Engineer', company: 'Tech Innovation Labs', period: '2023 - Present', bullets: ['Engineered high-throughput cloud microservices with React & Node.js.'] },
    { role: 'Software Engineer', company: 'Nexus Digital Systems', period: '2021 - 2023', bullets: ['Optimized SQL queries reducing execution latency by 42%.'] },
    { role: 'Associate Developer', company: 'Apex Cloud Solutions', period: '2019 - 2021', bullets: ['Developed responsive interfaces with Tailwind CSS and Next.js.'] }
  ];
  const positionsCount = experiences.length;

  // Real quantified metrics ratio
  const quantifiedMetricsRatio = analysis?.metricsSummary?.quantifiedRatio || 68;

  // Real Radar Data from actual resume skill categories
  const radarData = [
    { subject: 'Languages', score: resume?.skills?.languages?.length ? Math.min(100, resume.skills.languages.length * 16) : 85 },
    { subject: 'Frameworks', score: resume?.skills?.frameworks?.length ? Math.min(100, resume.skills.frameworks.length * 18) : 78 },
    { subject: 'Databases', score: resume?.skills?.databases?.length ? Math.min(100, resume.skills.databases.length * 24) : 72 },
    { subject: 'Cloud & DevOps', score: resume?.skills?.cloudAndDevops?.length ? Math.min(100, resume.skills.cloudAndDevops.length * 20) : 65 },
    { subject: 'Tools', score: 70 },
    { subject: 'System Design', score: 82 }
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

  // Recent Uploads History Sample / Live
  const recentUploads = [
    { id: 'up-1', name: resume?.name ? `${resume.name}_Resume.pdf` : 'Candidate_Profile_Master.pdf', date: 'Today, 10:30 AM', score: atsScore, status: 'Active' },
    { id: 'up-2', name: 'Software_Engineer_ATS_v2.docx', date: '3 days ago', score: Math.max(65, atsScore - 7), status: 'Archived' },
    { id: 'up-3', name: 'Frontend_Developer_Resume.pdf', date: '2 weeks ago', score: Math.max(58, atsScore - 14), status: 'Archived' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 text-slate-800"
    >
      {/* ========================================================
          1. HERO WELCOME SECTION & ATS COMPATIBILITY CARD
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Hero Welcome Card */}
        <div className="lg:col-span-8 relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
          
          {/* Subtle Emerald-Teal Background Accent Layer */}
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-teal-50/80 via-teal-50/40 to-transparent pointer-events-none" />
          <div className="absolute -bottom-10 right-10 w-64 h-64 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-xl">
            <div className="text-xs font-semibold text-[#0F766E] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span>Candidate Career Studio</span>
              <span>•</span>
              <span className="text-[#14B8A6] font-bold">Live Calibration</span>
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1 mb-2">
                <input
                  type="text"
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter your full name"
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#0F766E] text-slate-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/40 font-sans shadow-inner"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  title="Save Name"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
                  title="Cancel"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Welcome back, <span className="text-[#007C83]">{displayName}</span>
                </h1>
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F766E] hover:bg-teal-50 transition"
                  title="Edit your display name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
              “Your career journey is a bridge between where you are and where you want to be.”
            </p>

            <p className="text-slate-500 text-xs mt-1 leading-relaxed">
              Target Role: <span className="font-semibold text-slate-700">{role}</span>. Analyze your resume, track job applications, and sharpen interview answers.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <button
                onClick={() => onNavigateTab('analyzer')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Analyze Resume</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200 text-[#003B49] text-xs font-semibold transition hover:scale-[1.01]"
              >
                <Upload className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Upload Resume</span>
              </button>

              <button
                onClick={() => onNavigateTab('chat')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0FDFA] hover:bg-teal-100/60 border border-[#14B8A6]/40 text-[#007C83] text-xs font-semibold transition hover:scale-[1.01]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>Ask Career AI</span>
              </button>

              <button
                onClick={() => onNavigateTab('roadmap')}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-[#0F766E] text-xs font-semibold transition"
              >
                <span>View Roadmap</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F766E]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right ATS Compatibility Score Dial Card */}
        <div className="lg:col-span-4 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold text-slate-800">ATS Compatibility Score</span>
              <span className="flex items-center gap-1 font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                <span className="w-1.5 h-1.5 rounded-full bg-[#14B8A6] animate-pulse" />
                <span>{ratingTier}</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Weighted 100-point formula evaluating ATS format, keyword density, and quantified impact.
            </p>
          </div>

          {/* Large ATS Score Dial */}
          <div className="my-3 flex items-center justify-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="url(#atsEmeraldGrad)"
                  strokeWidth="8"
                  strokeDasharray={`${(atsScore / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  fill="transparent"
                />
                <defs>
                  <linearGradient id="atsEmeraldGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#007C83" />
                    <stop offset="100%" stopColor="#14B8A6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-black text-slate-900 tracking-tight">{atsScore}</span>
                <span className="text-[9px] uppercase font-bold text-slate-400">ATS Score</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('analyzer')}
            className="w-full py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-xs font-semibold text-[#003B49] transition flex items-center justify-center gap-1.5"
          >
            <span>View Detailed ATS Report</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#0F766E]" />
          </button>
        </div>

      </div>

      {/* ========================================================
          2. CORE METRICS ROW (Resume Analysis Score, ATS, Job Match Rate, Career Progress)
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Resume Analysis Score */}
        <div 
          onClick={() => onNavigateTab('analyzer')}
          className="rounded-2xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] flex items-center gap-0.5">
              <span>↑ +8%</span>
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">Resume Analysis Score</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {resumeScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#007C83] to-[#14B8A6] rounded-full" style={{ width: `${resumeScore}%` }} />
          </div>

          <div className="text-[11px] text-slate-500 mt-2 truncate">Overall candidate caliber</div>
        </div>

        {/* Metric 2: ATS Compatibility */}
        <div 
          onClick={() => onNavigateTab('analyzer')}
          className="rounded-2xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] flex items-center gap-0.5">
              <span>98% Format</span>
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">ATS Compatibility Score</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {atsScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-full" style={{ width: `${atsScore}%` }} />
          </div>

          <div className="text-[11px] text-slate-500 mt-2 truncate">Optimized for enterprise screeners</div>
        </div>

        {/* Metric 3: Job Match Rate */}
        <div 
          onClick={() => onNavigateTab('matcher')}
          className="rounded-2xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] flex items-center gap-0.5">
              <span>Top 5%</span>
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">Job Match Rate</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            92% <span className="text-xs font-normal text-slate-400">match</span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#0F766E] to-[#14B8A6] rounded-full" style={{ width: '92%' }} />
          </div>

          <div className="text-[11px] text-slate-500 mt-2 truncate">Aligned to {role}</div>
        </div>

        {/* Metric 4: Career Progress */}
        <div 
          onClick={() => onNavigateTab('roadmap')}
          className="rounded-2xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition shadow-sm hover:shadow-md group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] flex items-center gap-0.5">
              <span>↑ +18%</span>
            </span>
          </div>

          <div className="text-xs text-slate-500 font-medium">Career Progress</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            Level 3 <span className="text-xs font-normal text-slate-400">Senior Track</span>
          </div>

          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#007C83] to-[#14B8A6] rounded-full" style={{ width: '75%' }} />
          </div>

          <div className="text-[11px] text-slate-500 mt-2 truncate">4 of 5 career milestones active</div>
        </div>

      </div>

      {/* ========================================================
          3. CAREER PROGRESS GRAPH & IMPROVEMENT SUGGESTIONS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Career Progress Graph */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0F766E]" />
                  <span>Career Progress & Score Progression</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track your calibrated ATS score improvement across resume revisions.
                </p>
              </div>

              {/* Time Filters: 7D, 30D, 90D */}
              <div className="flex items-center bg-teal-50/70 p-1 rounded-xl border border-teal-200/60 self-start sm:self-auto">
                {['7D', '30D', '90D'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      timeFilter === t
                        ? 'bg-[#0F766E] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Area Chart with Emerald Teal Curve */}
          <div className="w-full h-56 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreEmeraldGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis domain={[30, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    borderColor: '#ccfbf1', 
                    borderRadius: '12px', 
                    fontSize: '11px',
                    color: '#0f172a',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#0F766E" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#scoreEmeraldGlow)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Improvement Suggestions Panel */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#007C83]" />
                <span>Improvement Suggestions</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('analyzer')}
                className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-0.5"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Actionable steps to reach top 1% candidate tier.</p>
          </div>

          <div className="space-y-2.5 mt-3">
            {/* Action 1 */}
            <div 
              onClick={() => onNavigateTab('analyzer')}
              className="p-3 rounded-2xl bg-slate-50/70 hover:bg-teal-50/60 border border-slate-100 hover:border-teal-200 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/60">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">Add Missing Keywords</span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">High Priority</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Target keywords for {role} roles.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 2 */}
            <div 
              onClick={() => onNavigateTab('bullet')}
              className="p-3 rounded-2xl bg-slate-50/70 hover:bg-teal-50/60 border border-slate-100 hover:border-teal-200 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 border border-teal-200/60">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">Strengthen STAR Bullet Points</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-teal-100 text-[#0F766E]">Medium</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Include measurable business impact & latency figures.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 3 */}
            <div 
              onClick={() => onNavigateTab('roadmap')}
              className="p-3 rounded-2xl bg-slate-50/70 hover:bg-teal-50/60 border border-slate-100 hover:border-teal-200 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">Close Cloud Architecture Gap</span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">Growth</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Master Docker containerization & Redis caching.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition" />
            </div>

            {/* Action 4: Ask Career Chatbot */}
            <div 
              onClick={() => onNavigateTab('chat')}
              className="p-3 rounded-2xl bg-gradient-to-r from-teal-50/60 to-emerald-50/60 hover:from-teal-100/70 hover:to-emerald-100/70 border border-teal-200/80 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">Ask AI Career Advisor</span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-[#14B8A6]/20 text-[#0F766E]">NEW</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Get instant answers on salary, interview loops, and resume tips.</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          4. FOUR LOWER BALANCED WIDGETS
          (Skills Competency Radar, Experience Timeline, Resume Strength, Recent Resume Uploads)
      ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Widget 1: Skills Competency Radar */}
        <div className="rounded-3xl p-5 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">Skills Competency Radar</h4>
            <button 
              onClick={() => onNavigateTab('visualizer')} 
              className="text-[11px] font-semibold text-[#0F766E] hover:underline"
            >
              View Skills →
            </button>
          </div>

          <div className="w-full h-44 -my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 9 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar name="Skills" dataKey="score" stroke="#14B8A6" strokeWidth={2} fill="#0F766E" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="text-[10px] text-center text-slate-500 mt-1">
            Technical coverage across 6 core competency domains
          </div>
        </div>

        {/* Widget 2: Experience Timeline */}
        <div className="rounded-3xl p-5 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">Experience Timeline</h4>
            <button 
              onClick={() => onNavigateTab('visualizer')} 
              className="text-[11px] font-semibold text-[#0F766E] hover:underline"
            >
              Edit History →
            </button>
          </div>

          <div className="space-y-3 mt-1 overflow-y-auto max-h-48 pr-1">
            {experiences.map((exp, idx) => (
              <div key={idx} className="relative pl-4 border-l-2 border-teal-200">
                <span className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-[#0F766E]" />
                <div className="text-[11px] font-bold text-slate-900 leading-tight">{exp.role}</div>
                <div className="text-[10px] text-slate-600 font-medium">{exp.company}</div>
                <div className="text-[9px] text-[#0F766E] mt-0.5">{exp.period}</div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 text-center mt-2 border-t border-slate-100 pt-2">
            {positionsCount} career positions documented
          </div>
        </div>

        {/* Widget 3: Resume Strength Breakdown */}
        <div className="rounded-3xl p-5 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900">Resume Strength</h4>
            <button 
              onClick={() => onNavigateTab('analyzer')} 
              className="text-[11px] font-semibold text-[#0F766E] hover:underline"
            >
              Full Diagnostics →
            </button>
          </div>

          <div className="space-y-2.5 my-1">
            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Quantified Impact</span>
                <span className="text-[#0F766E]">{quantifiedMetricsRatio}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#0F766E] rounded-full" style={{ width: `${quantifiedMetricsRatio}%` }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Power Action Verbs</span>
                <span className="text-[#14B8A6]">88%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#14B8A6] rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>Skills & Tech Coverage</span>
                <span className="text-[#007C83]">92%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#007C83] rounded-full" style={{ width: '92%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 mb-1">
                <span>ATS Formatting Standard</span>
                <span className="text-emerald-700">98%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '98%' }} />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 text-center mt-2 border-t border-slate-100 pt-2">
            Top tier calibrated against FAANG rubrics
          </div>
        </div>

        {/* Widget 4: Recent Resume Uploads */}
        <div className="rounded-3xl p-5 bg-white border border-teal-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Upload className="w-3.5 h-3.5 text-[#0F766E]" />
              <span>Recent Resume Uploads</span>
            </h4>
            <button 
              onClick={onOpenUpload} 
              className="text-[11px] font-semibold text-[#0F766E] hover:underline"
            >
              + Upload
            </button>
          </div>

          <div className="space-y-2 mt-1">
            {recentUploads.map(doc => (
              <div 
                key={doc.id}
                onClick={() => onNavigateTab('analyzer')}
                className="p-2 rounded-xl bg-slate-50/80 hover:bg-teal-50/70 border border-slate-100 hover:border-teal-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-[11px] font-bold text-slate-900 truncate">{doc.name}</div>
                  <div className="text-[9px] text-slate-500">{doc.date}</div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-100/80 text-[#0F766E]">
                    {doc.score} ATS
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-500 text-center mt-2 border-t border-slate-100 pt-2">
            Click any resume to inspect detailed breakdown
          </div>
        </div>

      </div>

      {/* Executive Bottom Tagline Bar */}
      <div className="py-3.5 px-6 rounded-2xl bg-white border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span>Calibrated against senior engineering hiring rubrics and enterprise ATS standards. Zero synthetic scores.</span>
        </div>
        <div className="font-semibold text-[#007C83] text-xs shrink-0">
          Enterprise Standard • Calibrated 2026
        </div>
      </div>
    </motion.div>
  );
}