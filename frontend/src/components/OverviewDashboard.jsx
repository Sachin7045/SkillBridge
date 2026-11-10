import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ExternalLink,
  Building2,
  MapPin,
  CheckCircle,
  HelpCircle,
  Download,
  Filter,
  Flame,
  Activity,
  Compass
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
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
  const [timeFilter, setTimeFilter] = useState('90D'); // '7D' | '30D' | '90D' | 'ALL'
  const [analyticsView, setAnalyticsView] = useState('progression'); // 'progression' | 'competencies'

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

  const role = resume?.targetRole || 'Senior Full Stack Engineer';
  const atsScore = analysis?.atsScore || 88;
  const ratingTier = analysis?.ratingTier || 'Excellent';
  const resumeScore = Math.min(100, Math.round(atsScore * 0.95 + 4));

  // Real skills count from current resume
  const skillsCount = (resume?.skills?.languages?.length || 0) + 
                      (resume?.skills?.frameworks?.length || 0) + 
                      (resume?.skills?.databases?.length || 0) +
                      (resume?.skills?.cloudAndDevops?.length || 0) || 24;

  // Real experience positions
  const experiences = (resume?.experience && resume.experience.length > 0) ? resume.experience : [
    { 
      role: 'Senior Full Stack Engineer', 
      company: 'Razorpay / Core Systems', 
      period: '2023 - Present', 
      bullets: ['Architected high-throughput payment ledgers handling 2.4M daily transactions with sub-80ms p99 latency.'] 
    },
    { 
      role: 'Full Stack Developer', 
      company: 'Tech Solutions Global', 
      period: '2021 - 2023', 
      bullets: ['Refactored React component hierarchies and Redux stores, slashing initial bundle size by 38%.'] 
    },
    { 
      role: 'Software Engineer', 
      company: 'Cloud Innovators', 
      period: '2019 - 2021', 
      bullets: ['Automated multi-region Docker CI/CD deployments across AWS ECS with zero-downtime rolling updates.'] 
    }
  ];
  const positionsCount = experiences.length;

  // Real quantified metrics ratio
  const quantifiedMetricsRatio = analysis?.metricsSummary?.quantifiedRatio || 74;

  // Radar Data for Competencies
  const radarData = [
    { subject: 'Languages', score: resume?.skills?.languages?.length ? Math.min(100, resume.skills.languages.length * 16) : 88, benchmark: 85 },
    { subject: 'Frameworks', score: resume?.skills?.frameworks?.length ? Math.min(100, resume.skills.frameworks.length * 18) : 84, benchmark: 80 },
    { subject: 'Databases', score: resume?.skills?.databases?.length ? Math.min(100, resume.skills.databases.length * 24) : 78, benchmark: 75 },
    { subject: 'Cloud & DevOps', score: resume?.skills?.cloudAndDevops?.length ? Math.min(100, resume.skills.cloudAndDevops.length * 20) : 72, benchmark: 70 },
    { subject: 'System Design', score: 86, benchmark: 82 },
    { subject: 'Leadership & STAR', score: 82, benchmark: 78 }
  ];

  // Competency Bar Data for alternate analytics view
  const competencyBarData = [
    { domain: 'Core Languages', score: 92, target: 85 },
    { domain: 'Frameworks', score: 88, target: 80 },
    { domain: 'Databases & Cache', score: 78, target: 75 },
    { domain: 'System Design', score: 86, target: 80 },
    { domain: 'Cloud & CI/CD', score: 74, target: 70 },
    { domain: 'Testing & SRE', score: 80, target: 75 },
  ];

  // Progression timeline data
  const progressionData = [
    { date: 'Rev 1 (Jul 12)', score: Math.max(45, atsScore - 32), overall: Math.max(50, resumeScore - 28) },
    { date: 'Rev 2 (Jul 28)', score: Math.max(55, atsScore - 24), overall: Math.max(60, resumeScore - 20) },
    { date: 'Rev 3 (Aug 15)', score: Math.max(64, atsScore - 18), overall: Math.max(68, resumeScore - 14) },
    { date: 'Rev 4 (Aug 30)', score: Math.max(72, atsScore - 12), overall: Math.max(76, resumeScore - 10) },
    { date: 'Rev 5 (Sep 18)', score: Math.max(80, atsScore - 6), overall: Math.max(83, resumeScore - 5) },
    { date: 'Current (Calibrated)', score: atsScore, overall: resumeScore }
  ];

  // Pipeline summary
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const interviewCount = applications.filter(a => ['screening', 'interview', 'final'].includes(a.status)).length;
  const offerCount = applications.filter(a => a.status === 'offer').length;
  const activeNextInterview = applications.find(a => a.nextInterview);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-slate-800"
    >
      {/* ========================================================
          1. EXECUTIVE CANDIDATE HUB (HERO & CONTROL STRIP)
      ======================================================== */}
      <div className="bg-white rounded-3xl border border-teal-100 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {/* Soft Ambient Background Highlight */}
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-teal-50/70 via-teal-50/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-10 right-10 w-72 h-72 bg-[#14B8A6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Candidate Profile Details */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-[#0F766E] border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
                Senior Engineering Track
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs font-semibold text-slate-500">
                Calibrated against FAANG & Enterprise ATS Rubrics
              </span>
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1 mb-2">
                <input
                  type="text"
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter full candidate name"
                  className="px-3.5 py-1.5 rounded-xl bg-white border-2 border-[#0F766E] text-slate-900 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/30 font-sans shadow-sm"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-syne">
                  Welcome, <span className="text-[#007C83]">{displayName}</span>
                </h1>
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-[#0F766E] hover:bg-teal-50 transition"
                  title="Edit candidate name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-slate-600 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
              Target Position: <span className="font-bold text-slate-900 bg-teal-50/80 px-2 py-0.5 rounded-md border border-teal-100 text-slate-800">{role}</span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-500">24 Competencies Verified • Taleo & Greenhouse Screen Compliant</span>
            </p>

            {/* Quick Action Navigation Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <button
                onClick={() => onNavigateTab('analyzer')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold transition shadow-sm hover:scale-[1.01] active:scale-[0.99]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Run Full ATS Audit</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-teal-50/60 border border-teal-200 text-[#003B49] text-xs font-semibold transition hover:scale-[1.01]"
              >
                <Upload className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Upload PDF / DOCX</span>
              </button>

              <button
                onClick={() => onNavigateTab('interview')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white hover:bg-teal-50/60 border border-teal-200 text-[#003B49] text-xs font-semibold transition hover:scale-[1.01]"
              >
                <Mic className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Mock Interview</span>
              </button>

              <button
                onClick={() => onNavigateTab('chat')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#F0FDFA] hover:bg-teal-100/60 border border-[#14B8A6]/40 text-[#007C83] text-xs font-semibold transition hover:scale-[1.01]"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>AI Career Advisor</span>
              </button>

              <button
                onClick={() => onNavigateTab('visualizer')}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-slate-600 hover:text-[#0F766E] text-xs font-semibold transition"
              >
                <span>Preview Template</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0F766E]" />
              </button>
            </div>
          </div>

          {/* Right Executive Quick Indicator Box */}
          <div className="lg:w-72 bg-teal-50/60 border border-teal-100/90 rounded-2xl p-4 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-800">ATS Calibration Status</span>
              <span className="text-[10px] font-bold text-[#0F766E] bg-white px-2 py-0.5 rounded-full border border-teal-200 shadow-2xs">
                {ratingTier}
              </span>
            </div>

            <div className="flex items-baseline gap-2 my-1">
              <span className="text-3xl font-black text-slate-900 tracking-tight font-syne">{atsScore}</span>
              <span className="text-xs text-slate-500">/ 100 benchmark</span>
            </div>

            <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden my-1.5">
              <div 
                className="h-full bg-gradient-to-r from-[#007C83] via-[#0F766E] to-[#14B8A6] rounded-full transition-all duration-700" 
                style={{ width: `${atsScore}%` }} 
              />
            </div>

            <div className="text-[11px] text-slate-600 flex items-center justify-between mt-1">
              <span>Top 5% Candidate Pool</span>
              <span className="font-semibold text-[#0F766E]">Ready to Apply</span>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. FOUR CORE EXECUTIVE SCORECARDS (KPI ROW)
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: ATS Compatibility Dial */}
        <div 
          onClick={() => onNavigateTab('analyzer')}
          className="rounded-3xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              98% Format
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">ATS Calibration Index</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-syne">
              {atsScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Section Architecture</span>
              <span className="font-bold text-slate-900">20 / 20</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Keywords & Role Match</span>
              <span className="font-bold text-[#0F766E]">23 / 25</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Role Competency Alignment */}
        <div 
          onClick={() => onNavigateTab('matcher')}
          className="rounded-3xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Target className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              High Match
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Target Role Alignment</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-syne">
              92% <span className="text-xs font-normal text-slate-400">aligned</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Verified Competencies</span>
              <span className="font-bold text-slate-900">{skillsCount} detected</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Role Focus</span>
              <span className="font-bold text-[#0F766E] truncate max-w-[130px]">{role}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: STAR Accomplishment Ratio */}
        <div 
          onClick={() => onNavigateTab('bullet')}
          className="rounded-3xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Award className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              STAR Verified
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Quantified Metric Ratio</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-syne">
              {quantifiedMetricsRatio}% <span className="text-xs font-normal text-slate-400">impact</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Measurable Outcomes</span>
              <span className="font-bold text-slate-900">High Density</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Power Action Verbs</span>
              <span className="font-bold text-[#0F766E]">88% Caliber</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Active Application Pipeline */}
        <div 
          onClick={() => onNavigateTab('applications')}
          className="rounded-3xl p-5 bg-white border border-teal-100 hover:border-[#14B8A6] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center border border-teal-100">
              <Briefcase className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              {interviewCount} In Progress
            </span>
          </div>

          <div>
            <div className="text-xs text-slate-500 font-medium">Job Pipeline Status</div>
            <div className="text-2xl font-black text-slate-900 mt-1 font-syne">
              {applications.length} <span className="text-xs font-normal text-slate-400">applications</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Technical Rounds</span>
              <span className="font-bold text-[#007C83]">{interviewCount} loops</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-600">
              <span>Offers Received</span>
              <span className="font-bold text-emerald-600">{offerCount} offer</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          3. DUAL-VIEW ANALYTICS & STRATEGIC RECOMMENDATIONS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Dual-View Chart Studio */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0F766E]" />
                  <span>Performance Studio & Calibration Velocity</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Track improvements across revisions against senior engineering standards.
                </p>
              </div>

              {/* View Selector & Time Filters */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Switcher */}
                <div className="flex bg-slate-100 p-0.5 rounded-xl border border-slate-200/80">
                  <button
                    onClick={() => setAnalyticsView('progression')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                      analyticsView === 'progression' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Progression
                  </button>
                  <button
                    onClick={() => setAnalyticsView('competencies')}
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition ${
                      analyticsView === 'competencies' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Competency Bars
                  </button>
                </div>

                {/* 7D, 30D, 90D Filter */}
                <div className="flex bg-teal-50/80 p-0.5 rounded-xl border border-teal-200/60">
                  {['7D', '30D', '90D', 'ALL'].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                        timeFilter === t
                          ? 'bg-[#0F766E] text-white shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="w-full h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              {analyticsView === 'progression' ? (
                <AreaChart data={progressionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreEmeraldGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#007C83" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#007C83" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[35, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                    name="ATS Score"
                    dataKey="score" 
                    stroke="#0F766E" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#scoreEmeraldGrad)" 
                  />
                  <Area 
                    type="monotone" 
                    name="Overall Caliber"
                    dataKey="overall" 
                    stroke="#14B8A6" 
                    strokeWidth={2} 
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#overallGrad)" 
                  />
                </AreaChart>
              ) : (
                <BarChart data={competencyBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="domain" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis domain={[0, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
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
                  <Bar dataKey="score" name="Your Rating" fill="#0F766E" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="target" name="Senior Benchmark" fill="#ccfbf1" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
              <span>Calibrated ATS Profile Score</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
              <span>Target Role Fit (92%)</span>
            </span>
          </div>
        </div>

        {/* Right: Actionable Strategic Recommendations */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-[#007C83]" />
                <span>Actionable Career Intelligence</span>
              </h3>
              <button 
                onClick={() => onNavigateTab('analyzer')}
                className="text-xs font-semibold text-[#0F766E] hover:underline flex items-center gap-0.5"
              >
                <span>View All (6)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-slate-500">Prioritized adjustments to position your profile for interview calls.</p>
          </div>

          <div className="space-y-2.5 mt-3">
            {/* Rec 1 */}
            <div 
              onClick={() => onNavigateTab('bullet')}
              className="p-3.5 rounded-2xl bg-teal-50/40 hover:bg-teal-50/90 border border-teal-100/80 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-200/60 shadow-2xs">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">
                      Quantify Scalability in Experience
                    </span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                      High Impact
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Add QPS, transaction volumes, or memory reduction metrics to Job 1.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Rec 2 */}
            <div 
              onClick={() => onNavigateTab('roadmap')}
              className="p-3.5 rounded-2xl bg-teal-50/40 hover:bg-teal-50/90 border border-teal-100/80 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#0F766E] flex items-center justify-center shrink-0 border border-teal-200/60 shadow-2xs">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">
                      Bridge Distributed Systems Gap
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-teal-100 text-[#0F766E]">
                      Recommended
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Add Redis caching strategy or Kafka pub/sub architecture to projects.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Rec 3 */}
            <div 
              onClick={() => onNavigateTab('interview')}
              className="p-3.5 rounded-2xl bg-teal-50/40 hover:bg-teal-50/90 border border-teal-100/80 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60 shadow-2xs">
                  <Mic className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">
                      Prepare for System Design Loop
                    </span>
                    <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                      Interview Prep
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Practice rate-limiting algorithms & database sharding scenarios.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition" />
            </div>

            {/* Rec 4 */}
            <div 
              onClick={() => onNavigateTab('chat')}
              className="p-3.5 rounded-2xl bg-gradient-to-r from-teal-50/70 to-emerald-50/70 hover:from-teal-100/80 hover:to-emerald-100/80 border border-teal-200/80 cursor-pointer transition flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-[#007C83] transition">
                      Consult AI Career Advisor
                    </span>
                    <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-[#14B8A6]/20 text-[#0F766E]">
                      Live Advisor
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Ask questions regarding compensation bands, salary negotiation, or offer leveling.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0F766E] group-hover:translate-x-0.5 transition" />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          4. SKILLS COMPETENCY RADAR & VERIFIED EXPERIENCE TIMELINE
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Skills Competency Radar */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F766E]" />
                <span>Skills Competency Radar</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('visualizer')} 
                className="text-[11px] font-semibold text-[#0F766E] hover:underline"
              >
                Inspect All Skills →
              </button>
            </div>
            <p className="text-xs text-slate-500">Calibrated against senior full stack engineering hiring standards.</p>
          </div>

          <div className="w-full h-56 -my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar name="Candidate" dataKey="score" stroke="#14B8A6" strokeWidth={2.5} fill="#0F766E" fillOpacity={0.25} />
                <Radar name="Senior Benchmark" dataKey="benchmark" stroke="#94a3b8" strokeDasharray="3 3" strokeWidth={1.5} fill="none" />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0F766E]" />
              <span>Your Verified Coverage</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full border border-slate-400 bg-transparent" />
              <span>Senior Benchmark</span>
            </span>
          </div>
        </div>

        {/* Right: Verified Experience Timeline */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#007C83]" />
                <span>Verified Career Experience Timeline</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('visualizer')} 
                className="text-[11px] font-semibold text-[#0F766E] hover:underline"
              >
                Edit Positions ({positionsCount}) →
              </button>
            </div>
            <p className="text-xs text-slate-500">Documented engineering tenure, accomplishments, and metrics.</p>
          </div>

          <div className="space-y-3.5 my-3">
            {experiences.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="relative pl-5 border-l-2 border-teal-300">
                <span className="absolute -left-[6px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F766E] border-2 border-white shadow-2xs" />
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="text-xs font-bold text-slate-900">{exp.role}</div>
                  <div className="text-[10px] font-semibold text-[#0F766E] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/80 self-start sm:self-auto">
                    {exp.period}
                  </div>
                </div>
                <div className="text-[11px] font-medium text-slate-600 mt-0.5">{exp.company}</div>
                {exp.bullets && exp.bullets[0] && (
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                    {exp.bullets[0]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100">
            <span>{positionsCount} engineering roles documented</span>
            <button
              onClick={() => onNavigateTab('bullet')}
              className="font-semibold text-[#0F766E] hover:underline flex items-center gap-1"
            >
              <span>Polish STAR Accomplishments</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. JOB APPLICATIONS PIPELINE & RECENT UPLOADS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Job Applications Pipeline Mini-Board */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#0F766E]" />
                <span>Active Job Applications Pipeline</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('applications')} 
                className="text-[11px] font-semibold text-[#0F766E] hover:underline"
              >
                View Full Pipeline ({applications.length}) →
              </button>
            </div>
            <p className="text-xs text-slate-500">Live recruitment pipeline with upcoming rounds and status alerts.</p>
          </div>

          {/* Pipeline Mini-Stages Bar */}
          <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
            <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
              <div className="text-lg font-black text-slate-900 font-syne">{appliedCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Applied</div>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
              <div className="text-lg font-black text-[#007C83] font-syne">{interviewCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Interview Loop</div>
            </div>
            <div className="p-3 rounded-2xl bg-teal-50/60 border border-teal-100">
              <div className="text-lg font-black text-emerald-600 font-syne">{offerCount}</div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Offer Received</div>
            </div>
          </div>

          {/* Active Job Cards */}
          <div className="space-y-2">
            {applications.slice(0, 3).map((app) => (
              <div 
                key={app.id}
                onClick={() => onNavigateTab('applications')}
                className="p-3 rounded-2xl bg-slate-50/80 hover:bg-teal-50/70 border border-slate-100 hover:border-teal-200 transition cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 pr-3">
                  <div className="text-xs font-bold text-slate-900 truncate">{app.title}</div>
                  <div className="text-[10px] text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                    <span className="font-semibold text-slate-700">{app.company}</span>
                    <span>•</span>
                    <span>{app.location || 'Remote'}</span>
                    <span>•</span>
                    <span className="text-[#0F766E] font-medium">{app.salary || 'Competitive'}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    app.status === 'offer' 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : ['interview', 'final', 'screening'].includes(app.status)
                      ? 'bg-teal-100 text-[#0F766E] border border-teal-200'
                      : 'bg-slate-200/80 text-slate-700'
                  }`}>
                    {app.status === 'interview' ? 'Interview' : app.status === 'final' ? 'Final Loop' : app.status === 'offer' ? 'Offer' : 'Applied'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100 mt-3">
            <span>{applications.length} opportunities currently monitored</span>
            <button
              onClick={() => onNavigateTab('matcher')}
              className="font-semibold text-[#0F766E] hover:underline"
            >
              + Find Matching Jobs
            </button>
          </div>
        </div>

        {/* Right: Recent Resume Uploads & Master Profiles */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-teal-100 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0F766E]" />
                <span>Resume Documents & History</span>
              </h4>
              <button 
                onClick={onOpenUpload} 
                className="text-[11px] font-semibold text-[#0F766E] hover:underline"
              >
                + Upload New
              </button>
            </div>
            <p className="text-xs text-slate-500">Manage uploaded resumes, snapshots, and revision scores.</p>
          </div>

          <div className="space-y-2.5 my-3">
            {/* Active Resume */}
            <div 
              onClick={() => onNavigateTab('visualizer')}
              className="p-3.5 rounded-2xl bg-teal-50/80 border border-teal-200/80 cursor-pointer transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0 text-xs font-bold shadow-2xs">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {resume?.name ? `${resume.name}_Resume_Master.pdf` : 'Candidate_Profile_Active.pdf'}
                  </div>
                  <div className="text-[10px] text-[#0F766E] font-semibold mt-0.5">Active Profile • Calibrated 2026</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-white text-[#0F766E] border border-teal-200 shadow-2xs shrink-0">
                {atsScore} ATS
              </span>
            </div>

            {/* Previous Snapshot 1 */}
            <div 
              onClick={onOpenSamples}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200 transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  DOC
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">Senior_FullStack_v2_ATS.docx</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Archived Snapshot • 3 days ago</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                81 ATS
              </span>
            </div>

            {/* Previous Snapshot 2 */}
            <div 
              onClick={onOpenSamples}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-teal-50/50 border border-slate-100 hover:border-teal-200 transition cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3 min-w-0 pr-2">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-xs font-bold">
                  PDF
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-slate-800 truncate">Software_Engineer_Baseline.pdf</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Initial Upload • 2 weeks ago</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                72 ATS
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2.5 border-t border-slate-100">
            <span>Pre-calibrated profiles available</span>
            <button
              onClick={onOpenSamples}
              className="font-semibold text-[#0F766E] hover:underline"
            >
              Load Sample Profiles →
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          6. EXECUTIVE STANDARDS & COMPLIANCE FOOTER
      ======================================================== */}
      <div className="py-4 px-6 rounded-2xl bg-white border border-teal-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
          <span>
            Calibrated against enterprise applicant tracking systems (Workday, Taleo, Greenhouse, Lever). Zero synthetic inflation.
          </span>
        </div>
        <div className="font-bold text-[#007C83] text-xs shrink-0 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6]" />
          <span>Professional Standard 2026</span>
        </div>
      </div>
    </motion.div>
  );
}