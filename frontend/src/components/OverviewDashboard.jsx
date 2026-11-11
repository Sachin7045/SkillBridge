import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ShieldCheck, 
  Briefcase, 
  Trophy, 
  Rocket, 
  Sparkles, 
  TrendingUp, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Clock, 
  Calendar, 
  Eye, 
  Download, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  AlertCircle, 
  ChevronRight, 
  Mic, 
  Search, 
  Wand2, 
  GitBranch, 
  Building2, 
  Zap, 
  Flame,
  Award
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
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
  savedResumes = [],
  onNavigateTab,
  onOpenUpload,
  onOpenSamples,
  onDeleteSavedResume = () => {},
  onUpdateUserName = () => {}
}) {
  const [timeFilter, setTimeFilter] = useState('6M'); // '7D' | '30D' | '90D' | '6M'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // User display name & inline editing
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

  // Real data calculations
  const role = resume?.targetRole || resume?.title || 'Senior Full Stack Engineer';
  const atsScore = analysis?.atsScore || 88;
  const resumeScore = Math.min(100, Math.round(atsScore * 0.96 + 3));
  const jobMatchRate = analysis?.matchScore || 86;
  const careerProgress = Math.min(100, Math.round((atsScore + resumeScore + jobMatchRate) / 3));

  // Skills count from actual resume
  const langCount = resume?.skills?.languages?.length || 5;
  const frameCount = resume?.skills?.frameworks?.length || 4;
  const dbCount = resume?.skills?.databases?.length || 3;
  const cloudCount = resume?.skills?.cloudAndDevops?.length || 2;
  const toolsCount = resume?.skills?.tools?.length || 4;
  const totalSkillsCount = langCount + frameCount + dbCount + cloudCount + toolsCount;

  // Real experience from resume
  const experiences = (resume?.experience && resume.experience.length > 0) ? resume.experience : [
    { 
      role: 'Senior Full Stack Engineer', 
      company: 'Razorpay / Core Systems', 
      period: '2023 - Present', 
      current: true,
      duration: '2 yrs 4 mos',
      bullets: ['Architected high-throughput payment ledgers handling 2.4M daily transactions with sub-80ms p99 latency.'] 
    },
    { 
      role: 'Full Stack Developer', 
      company: 'Tech Solutions Global', 
      period: '2021 - 2023', 
      current: false,
      duration: '2 yrs',
      bullets: ['Refactored React component hierarchies and Redux stores, slashing initial bundle size by 38%.'] 
    },
    { 
      role: 'Software Engineer', 
      company: 'Cloud Innovators', 
      period: '2019 - 2021', 
      current: false,
      duration: '2 yrs 1 mo',
      bullets: ['Automated multi-region Docker CI/CD deployments across AWS ECS with zero-downtime rolling updates.'] 
    }
  ];

  // Radar Data for Skills Competency
  const radarData = [
    { subject: 'Languages', score: Math.min(100, Math.max(65, langCount * 17)), benchmark: 85 },
    { subject: 'Frameworks', score: Math.min(100, Math.max(60, frameCount * 18)), benchmark: 80 },
    { subject: 'Databases', score: Math.min(100, Math.max(55, dbCount * 26)), benchmark: 78 },
    { subject: 'Cloud/DevOps', score: Math.min(100, Math.max(55, cloudCount * 25)), benchmark: 74 },
    { subject: 'Tools', score: Math.min(100, Math.max(60, toolsCount * 18)), benchmark: 80 },
    { subject: 'Soft Skills', score: 88, benchmark: 80 },
  ];

  // 6-Month Career Progress Overview Data
  const progressHistoryData = {
    '7D': [
      { month: 'Mon', resumeScore: Math.max(50, resumeScore - 4), atsScore: Math.max(45, atsScore - 5), matchRate: 82 },
      { month: 'Tue', resumeScore: Math.max(50, resumeScore - 3), atsScore: Math.max(45, atsScore - 4), matchRate: 83 },
      { month: 'Wed', resumeScore: Math.max(50, resumeScore - 2), atsScore: Math.max(45, atsScore - 3), matchRate: 83 },
      { month: 'Thu', resumeScore: Math.max(50, resumeScore - 2), atsScore: Math.max(45, atsScore - 2), matchRate: 84 },
      { month: 'Fri', resumeScore: Math.max(50, resumeScore - 1), atsScore: Math.max(45, atsScore - 1), matchRate: 85 },
      { month: 'Sat', resumeScore: Math.max(50, resumeScore - 1), atsScore: Math.max(45, atsScore), matchRate: 85 },
      { month: 'Sun', resumeScore: resumeScore, atsScore: atsScore, matchRate: jobMatchRate }
    ],
    '30D': [
      { month: 'Week 1', resumeScore: Math.max(50, resumeScore - 16), atsScore: Math.max(45, atsScore - 18), matchRate: 70 },
      { month: 'Week 2', resumeScore: Math.max(50, resumeScore - 11), atsScore: Math.max(45, atsScore - 12), matchRate: 76 },
      { month: 'Week 3', resumeScore: Math.max(50, resumeScore - 6), atsScore: Math.max(45, atsScore - 7), matchRate: 81 },
      { month: 'Week 4', resumeScore: resumeScore, atsScore: atsScore, matchRate: jobMatchRate }
    ],
    '90D': [
      { month: 'Month 1', resumeScore: Math.max(50, resumeScore - 22), atsScore: Math.max(45, atsScore - 25), matchRate: 64 },
      { month: 'Month 2', resumeScore: Math.max(50, resumeScore - 10), atsScore: Math.max(45, atsScore - 12), matchRate: 78 },
      { month: 'Month 3', resumeScore: resumeScore, atsScore: atsScore, matchRate: jobMatchRate }
    ],
    '6M': [
      { month: 'Month 1', resumeScore: Math.max(45, resumeScore - 28), atsScore: Math.max(40, atsScore - 32), matchRate: 58 },
      { month: 'Month 2', resumeScore: Math.max(50, resumeScore - 22), atsScore: Math.max(45, atsScore - 26), matchRate: 66 },
      { month: 'Month 3', resumeScore: Math.max(55, resumeScore - 16), atsScore: Math.max(52, atsScore - 19), matchRate: 72 },
      { month: 'Month 4', resumeScore: Math.max(62, resumeScore - 11), atsScore: Math.max(60, atsScore - 13), matchRate: 78 },
      { month: 'Month 5', resumeScore: Math.max(70, resumeScore - 5), atsScore: Math.max(70, atsScore - 6), matchRate: 82 },
      { month: 'Month 6', resumeScore: resumeScore, atsScore: atsScore, matchRate: jobMatchRate }
    ]
  };

  const currentChartData = progressHistoryData[timeFilter] || progressHistoryData['6M'];

  // Sparkline mini data
  const sparklineData = [
    { v: 50 }, { v: 62 }, { v: 58 }, { v: 74 }, { v: 69 }, { v: 84 }, { v: 91 }
  ];

  // Pipeline count
  const appliedCount = applications.filter(a => a.status === 'applied').length;
  const interviewCount = applications.filter(a => ['screening', 'interview', 'final'].includes(a.status)).length;
  const offerCount = applications.filter(a => a.status === 'offer').length;

  // Recent resumes list: combine user's saved resumes or active + sample resumes
  const displayResumes = savedResumes.length > 0 ? savedResumes : [
    {
      id: 'active-master',
      fileName: resume?.name ? `${resume.name.replace(/\s+/g, '_')}_Master_Resume.pdf` : 'Candidate_FullStack_Resume.pdf',
      uploadDate: 'Today (Active)',
      status: 'ATS Calibrated',
      score: atsScore,
      isActive: true
    },
    {
      id: 'archive-v2',
      fileName: 'Senior_FullStack_Engineer_v2.docx',
      uploadDate: '3 days ago',
      status: 'Analyzed',
      score: Math.max(60, atsScore - 7),
      isActive: false
    },
    {
      id: 'archive-v1',
      fileName: 'FullStack_Baseline_Original.pdf',
      uploadDate: '2 weeks ago',
      status: 'Archived',
      score: Math.max(50, atsScore - 16),
      isActive: false
    }
  ];

  const handleDownloadActiveResume = () => {
    if (!resume) return;
    const blob = new Blob([JSON.stringify(resume, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${displayName.replace(/\s+/g, '_')}_Resume_SkillBridge.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 text-[#102A43]"
    >
      {/* ========================================================
          1. DASHBOARD WELCOME SECTION (HERO BANNER)
      ======================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#031B35] via-[#004B63] to-[#006B83] text-white p-6 sm:p-8 shadow-xl overflow-hidden border border-[#00E5FF]/20">
        {/* Futuristic glowing ambient accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 right-48 w-64 h-64 bg-[#00C9A7]/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Welcome Text & Candidate Info */}
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#00E5FF] animate-pulse" />
                Senior Career Acceleration Track
              </span>
              <span className="text-xs text-cyan-200/50">•</span>
              <span className="text-xs font-semibold text-cyan-100/80">
                Calibrated with FAANG & Enterprise Rubrics
              </span>
            </div>

            {/* Headline and Personalized Greeting */}
            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-2 mt-1 mb-2">
                <input
                  type="text"
                  autoFocus
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter candidate name"
                  className="px-3.5 py-1.5 rounded-xl bg-white text-[#102A43] text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#00E5FF] font-sans shadow-lg"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-xl bg-[#00C9A7] hover:bg-[#00B092] text-[#031B35] text-xs font-bold transition flex items-center gap-1 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-3 flex-wrap">
                <div className="w-10 h-10 rounded-2xl bg-[#006B83] border border-[#00E5FF]/40 flex items-center justify-center font-black text-lg text-[#00E5FF] shadow-inner">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-syne flex items-center gap-2">
                  <span>Welcome back,</span>
                  <span className="text-[#00E5FF]">{displayName}</span>
                </h1>
                <button
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-cyan-200/70 hover:text-[#00E5FF] hover:bg-white/10 transition"
                  title="Edit Candidate Name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Prompt exact headlines */}
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-3 tracking-tight font-syne">
              Dream Big, Build Better Career
            </h2>
            <p className="text-cyan-100/90 text-xs sm:text-sm mt-1 font-medium leading-relaxed">
              Let's accelerate your career journey with SkillBridge. Target Role: <span className="font-bold text-white bg-white/15 px-2 py-0.5 rounded-md border border-white/20">{role}</span>
            </p>

            {/* Quick Action Navigation Bar */}
            <div className="flex flex-wrap items-center gap-2.5 mt-5">
              <button
                onClick={() => onNavigateTab('analyzer')}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00C9A7] hover:brightness-105 text-[#031B35] text-xs font-extrabold transition shadow-lg shadow-[#00E5FF]/20 hover:scale-[1.01] active:scale-[0.99]"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Run Full ATS Audit</span>
              </button>

              <button
                onClick={onOpenUpload}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition backdrop-blur-md hover:scale-[1.01]"
              >
                <Upload className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>Upload PDF / DOCX</span>
              </button>

              <button
                onClick={() => onNavigateTab('interview')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition backdrop-blur-md hover:scale-[1.01]"
              >
                <Mic className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>AI Mock Interview</span>
              </button>

              <button
                onClick={() => onNavigateTab('matcher')}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white text-xs font-semibold transition backdrop-blur-md hover:scale-[1.01]"
              >
                <Search className="w-3.5 h-3.5 text-[#00C9A7]" />
                <span>Explore Jobs</span>
              </button>
            </div>
          </div>

          {/* Right Rocket Illustration & Stats Badges */}
          <div className="flex flex-col items-center justify-center shrink-0 lg:pl-6">
            <div className="relative group">
              {/* Outer decorative neon rings */}
              <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-[#006B83] via-[#004B63] to-[#031B35] border-2 border-[#00E5FF]/40 flex items-center justify-center shadow-[0_0_30px_rgba(0,229,255,0.25)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,229,255,0.3),transparent_70%)]" />
                <Rocket className="w-16 h-16 text-[#00E5FF] transform -rotate-45 group-hover:scale-110 group-hover:-translate-y-1 transition duration-300 drop-shadow-[0_0_12px_#00E5FF]" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#00C9A7] text-[#031B35] text-[10px] font-black uppercase shadow-md">
                Accelerating
              </div>
            </div>

            <div className="text-center mt-3">
              <span className="text-[11px] font-bold text-cyan-200">24 Competencies Mapped</span>
              <div className="text-[10px] text-cyan-100/60">Taleo & Greenhouse Compliant</div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================
          2. FOUR CORE ANALYTICS CARDS (KPI ROW)
      ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* CARD 1: Resume Analysis Score */}
        <div 
          onClick={() => onNavigateTab('analyzer')}
          className="rounded-3xl p-5 bg-white border border-[#DCEAF5] hover:border-[#006B83] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF8FF] text-[#006B83] flex items-center justify-center border border-[#DCEAF5] group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5 text-[#006B83]" />
            </div>
            <span className="text-[11px] font-extrabold text-[#006B83] bg-[#EFF8FF] px-2.5 py-1 rounded-lg border border-[#DCEAF5] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#00C9A7]" />
              <span>+14% mo</span>
            </span>
          </div>

          <div>
            <div className="text-xs text-[#64748B] font-semibold">Resume Analysis Score</div>
            <div className="text-2xl font-black text-[#102A43] mt-1 font-syne">
              {resumeScore} <span className="text-xs font-normal text-[#64748B]">/ 100</span>
            </div>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-9 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="sparkGrad1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006B83" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#006B83" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#006B83" strokeWidth={2} fill="url(#sparkGrad1)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2.5 border-t border-[#DCEAF5] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Content Quality</span>
            <span className="font-bold text-[#006B83]">Top 5% Candidate</span>
          </div>
        </div>

        {/* CARD 2: ATS Compatibility */}
        <div 
          onClick={() => onNavigateTab('ats')}
          className="rounded-3xl p-5 bg-white border border-[#DCEAF5] hover:border-[#00C9A7] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF8FF] text-[#00C9A7] flex items-center justify-center border border-[#DCEAF5] group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5 text-[#00C9A7]" />
            </div>
            <span className="text-[11px] font-extrabold text-[#00C9A7] bg-[#EFF8FF] px-2.5 py-1 rounded-lg border border-[#DCEAF5] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#00C9A7]" />
              <span>+8% trend</span>
            </span>
          </div>

          <div>
            <div className="text-xs text-[#64748B] font-semibold">ATS Compatibility</div>
            <div className="text-2xl font-black text-[#102A43] mt-1 font-syne">
              {atsScore}% <span className="text-xs font-normal text-[#64748B]">passing rate</span>
            </div>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-9 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="sparkGrad2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00C9A7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#00C9A7" strokeWidth={2} fill="url(#sparkGrad2)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2.5 border-t border-[#DCEAF5] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Parsing Safety</span>
            <span className="font-bold text-[#00C9A7]">100% Machine Safe</span>
          </div>
        </div>

        {/* CARD 3: Job Match Rate */}
        <div 
          onClick={() => onNavigateTab('matcher')}
          className="rounded-3xl p-5 bg-white border border-[#DCEAF5] hover:border-[#006B83] cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF8FF] text-[#006B83] flex items-center justify-center border border-[#DCEAF5] group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5 text-[#006B83]" />
            </div>
            <span className="text-[11px] font-extrabold text-[#006B83] bg-[#EFF8FF] px-2.5 py-1 rounded-lg border border-[#DCEAF5] flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-[#00C9A7]" />
              <span>+18% fit</span>
            </span>
          </div>

          <div>
            <div className="text-xs text-[#64748B] font-semibold">Job Match Rate</div>
            <div className="text-2xl font-black text-[#102A43] mt-1 font-syne">
              {jobMatchRate}% <span className="text-xs font-normal text-[#64748B]">relevance</span>
            </div>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-9 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="sparkGrad3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#006B83" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#006B83" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#006B83" strokeWidth={2} fill="url(#sparkGrad3)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2.5 border-t border-[#DCEAF5] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Target Match</span>
            <span className="font-bold text-[#006B83] truncate max-w-[130px]">{role}</span>
          </div>
        </div>

        {/* CARD 4: Career Progress */}
        <div 
          onClick={() => onNavigateTab('roadmap')}
          className="rounded-3xl p-5 bg-white border border-[#DCEAF5] hover:border-amber-400 cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF8FF] text-amber-500 flex items-center justify-center border border-[#DCEAF5] group-hover:scale-105 transition-transform">
              <Trophy className="w-5 h-5 text-amber-500" />
            </div>
            <span className="text-[11px] font-extrabold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Milestone 4</span>
            </span>
          </div>

          <div>
            <div className="text-xs text-[#64748B] font-semibold">Career Progress</div>
            <div className="text-2xl font-black text-[#102A43] mt-1 font-syne">
              {careerProgress}% <span className="text-xs font-normal text-[#64748B]">growth</span>
            </div>
          </div>

          {/* Mini Sparkline Chart */}
          <div className="h-9 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData}>
                <defs>
                  <linearGradient id="sparkGrad4" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#f59e0b" strokeWidth={2} fill="url(#sparkGrad4)" isAnimationActive={true} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-2.5 border-t border-[#DCEAF5] flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Roadmap Level</span>
            <span className="font-bold text-amber-600">Senior Track Ready</span>
          </div>
        </div>

      </div>

      {/* ========================================================
          3. CAREER PROGRESS OVERVIEW (INTERACTIVE LINE CHART)
      ======================================================== */}
      <div className="rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#006B83]" />
              <span>Career Progress Overview</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Historical trajectory of your Resume Analysis, ATS Compatibility, and Job Match Rate.
            </p>
          </div>

          {/* Date Range Selector: 7D, 30D, 90D, 6M */}
          <div className="flex bg-[#EFF8FF] p-1 rounded-xl border border-[#DCEAF5]">
            {['7D', '30D', '90D', '6M'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeFilter(range)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                  timeFilter === range
                    ? 'bg-[#006B83] text-white shadow-sm'
                    : 'text-[#64748B] hover:text-[#102A43]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Chart Container */}
        <div className="w-full h-64 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="overviewResumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006B83" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#006B83" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="overviewAtsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00C9A7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#00C9A7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis domain={[30, 100]} stroke="#94a3b8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  borderColor: '#DCEAF5', 
                  borderRadius: '12px', 
                  fontSize: '11px',
                  color: '#102A43',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)'
                }} 
              />
              <Area 
                type="monotone" 
                name="Resume Score"
                dataKey="resumeScore" 
                stroke="#006B83" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#overviewResumeGrad)" 
              />
              <Area 
                type="monotone" 
                name="ATS Compatibility"
                dataKey="atsScore" 
                stroke="#00C9A7" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#overviewAtsGrad)" 
              />
              <Line 
                type="monotone" 
                name="Job Match Rate"
                dataKey="matchRate" 
                stroke="#00E5FF" 
                strokeWidth={2} 
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#00E5FF' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#64748B] mt-3 pt-3 border-t border-[#DCEAF5]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#006B83]" />
              <span>Resume Analysis Score ({resumeScore}/100)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]" />
              <span>ATS Compatibility ({atsScore}%)</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
              <span>Job Match Rate ({jobMatchRate}%)</span>
            </span>
          </div>

          <button 
            onClick={() => onNavigateTab('analyzer')}
            className="text-[#006B83] font-bold hover:underline flex items-center gap-1"
          >
            <span>Run Benchmark Recalibration</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ========================================================
          4. SKILLS COMPETENCY RADAR & RESUME STRENGTH ANALYSIS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Skills Competency Radar (6 Categories) */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#006B83]" />
                <span>Skills Competency Radar</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('visualizer')} 
                className="text-[11px] font-semibold text-[#006B83] hover:underline"
              >
                Inspect All Skills ({totalSkillsCount}) →
              </button>
            </div>
            <p className="text-xs text-[#64748B]">
              6 competency dimensions evaluated against senior engineering benchmarks.
            </p>
          </div>

          <div className="w-full h-64 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#DCEAF5" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#102A43', fontSize: 11, fontWeight: 600 }} />
                <PolarRadiusAxis domain={[0, 100]} stroke="#cbd5e1" tick={false} />
                <Radar name="Candidate Competency" dataKey="score" stroke="#00E5FF" strokeWidth={2.5} fill="#006B83" fillOpacity={0.25} />
                <Radar name="Senior Benchmark" dataKey="benchmark" stroke="#00C9A7" strokeDasharray="3 3" strokeWidth={1.5} fill="none" />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#DCEAF5]">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] border border-[#006B83]" />
              <span>Verified Skill Score</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00C9A7]" />
              <span>Senior Target Benchmark</span>
            </span>
          </div>
        </div>

        {/* Right: Resume Strength Analysis (Circular Gauge & Dimensions) */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <Award className="w-4 h-4 text-[#006B83]" />
                <span>Resume Strength Analysis</span>
              </h4>
              <span className="px-2.5 py-0.5 rounded-full bg-[#00C9A7]/15 text-[#006B83] text-[10px] font-bold border border-[#00C9A7]/30">
                Top Tier Profile
              </span>
            </div>
            <p className="text-xs text-[#64748B]">
              Comprehensive evaluation of technical depth, experience quality, and formatting.
            </p>
          </div>

          {/* Strength Gauge & Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-3">
            
            {/* Circular Gauge Display */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5]">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#DCEAF5"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="52"
                    stroke="#006B83"
                    strokeWidth="10"
                    strokeDasharray={326.7}
                    strokeDashoffset={326.7 - (326.7 * resumeScore) / 100}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-[#102A43] font-syne">{resumeScore}%</span>
                  <span className="text-[10px] font-bold text-[#006B83] uppercase">Strength</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#102A43] mt-2">Strong Resume Caliber</span>
            </div>

            {/* Dimension Breakdown Bars */}
            <div className="sm:col-span-7 space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#102A43]">Strong Skills Section</span>
                  <span className="text-[#006B83] font-bold">92%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EFF8FF] overflow-hidden">
                  <div className="h-full rounded-full bg-[#006B83]" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#102A43]">Experience Quality & Metrics</span>
                  <span className="text-[#00C9A7] font-bold">88%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EFF8FF] overflow-hidden">
                  <div className="h-full rounded-full bg-[#00C9A7]" style={{ width: '88%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#102A43]">Resume Formatting & ATS Readability</span>
                  <span className="text-[#006B83] font-bold">95%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EFF8FF] overflow-hidden">
                  <div className="h-full rounded-full bg-[#006B83]" style={{ width: '95%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#102A43]">Improvement Areas</span>
                  <span className="text-amber-600 font-bold">74%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#EFF8FF] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: '74%' }} />
                </div>
              </div>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#DCEAF5]">
            <span>Calibrated with real candidate taxonomy</span>
            <button
              onClick={() => onNavigateTab('visualizer')}
              className="font-bold text-[#006B83] hover:underline flex items-center gap-1"
            >
              <span>Edit Resume Sections</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. EXPERIENCE TIMELINE & AI IMPROVEMENT SUGGESTIONS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Professional Vertical Experience Timeline */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#006B83]" />
                <span>Experience Timeline</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('visualizer')} 
                className="text-[11px] font-semibold text-[#006B83] hover:underline"
              >
                Edit Timeline ({experiences.length}) →
              </button>
            </div>
            <p className="text-xs text-[#64748B]">
              Chronological engineering tenure read directly from your active resume.
            </p>
          </div>

          {/* Vertical Timeline */}
          <div className="space-y-4 my-3 pl-2">
            {experiences.slice(0, 3).map((exp, idx) => (
              <div key={idx} className="relative pl-6 border-l-2 border-[#DCEAF5]">
                {/* Node indicator */}
                <span className={`absolute -left-[7px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                  exp.current || exp.period?.toLowerCase().includes('present')
                    ? 'bg-[#00C9A7] ring-2 ring-[#00C9A7]/30 animate-pulse'
                    : 'bg-[#006B83]'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="text-xs font-bold text-[#102A43] flex items-center gap-2">
                    <span>{exp.role}</span>
                    {(exp.current || exp.period?.toLowerCase().includes('present')) && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-[#00C9A7]/20 text-[#006B83] uppercase">
                        Current
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] font-semibold text-[#006B83] bg-[#EFF8FF] px-2 py-0.5 rounded-md border border-[#DCEAF5] self-start sm:self-auto">
                    {exp.period}
                  </div>
                </div>

                <div className="text-[11px] font-semibold text-[#64748B] mt-0.5 flex items-center gap-2">
                  <span>{exp.company}</span>
                  {exp.duration && (
                    <>
                      <span>•</span>
                      <span>{exp.duration}</span>
                    </>
                  )}
                </div>

                {exp.bullets && exp.bullets[0] && (
                  <p className="text-[11px] text-[#64748B] mt-1 leading-snug line-clamp-2">
                    {exp.bullets[0]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2.5 border-t border-[#DCEAF5]">
            <span>{experiences.length} positions documented</span>
            <button
              onClick={() => onNavigateTab('bullet')}
              className="font-bold text-[#006B83] hover:underline flex items-center gap-1"
            >
              <span>Polish STAR Metrics</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Right: AI Improvement Suggestions */}
        <div className="lg:col-span-6 rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#006B83]" />
                <span>AI Improvement Suggestions</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('analyzer')} 
                className="text-[11px] font-semibold text-[#006B83] hover:underline"
              >
                View Audit Report →
              </button>
            </div>
            <p className="text-xs text-[#64748B]">
              High-priority optimizations to boost your ATS compatibility score.
            </p>
          </div>

          {/* 5 Suggestion Cards with working Action Buttons */}
          <div className="space-y-2.5 my-2">
            
            {/* Suggestion 1: Add Quantified Achievements */}
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#102A43]">Add Quantified Achievements</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 uppercase">
                    High Impact
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug truncate">
                  Include QPS, latency reductions, or revenue metrics in your top engineering role.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('bullet')}
                className="px-2.5 py-1.5 rounded-xl bg-[#006B83] hover:bg-[#005569] text-white text-[11px] font-bold transition shrink-0 shadow-sm"
              >
                Fix in STAR
              </button>
            </div>

            {/* Suggestion 2: Include Relevant Job Keywords */}
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#102A43]">Include Relevant Job Keywords</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 uppercase">
                    ATS Keyword Gap
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug truncate">
                  3 missing keywords detected (e.g. Distributed Caching, CI/CD Pipelines).
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('analyzer')}
                className="px-2.5 py-1.5 rounded-xl bg-[#006B83] hover:bg-[#005569] text-white text-[11px] font-bold transition shrink-0 shadow-sm"
              >
                Add Keywords
              </button>
            </div>

            {/* Suggestion 3: Improve Professional Summary */}
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#102A43]">Improve Professional Summary</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-[#00C9A7]/20 text-[#006B83] uppercase">
                    Hook & Impact
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug truncate">
                  Tailor executive opening to emphasize distributed systems and architecture.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('visualizer')}
                className="px-2.5 py-1.5 rounded-xl bg-[#006B83] hover:bg-[#005569] text-white text-[11px] font-bold transition shrink-0 shadow-sm"
              >
                Edit Summary
              </button>
            </div>

            {/* Suggestion 4: Highlight Technical Projects */}
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#102A43]">Highlight Technical Projects</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-cyan-100 text-[#006B83] uppercase">
                    Portfolio
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug truncate">
                  Showcase open-source or production deployments with live URLs.
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('visualizer')}
                className="px-2.5 py-1.5 rounded-xl bg-[#006B83] hover:bg-[#005569] text-white text-[11px] font-bold transition shrink-0 shadow-sm"
              >
                Add Projects
              </button>
            </div>

            {/* Suggestion 5: Improve Action Verbs */}
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5] flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#102A43]">Improve Action Verbs</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 uppercase">
                    Verbiage
                  </span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug truncate">
                  Replace passive phrasing ("worked on") with executive power verbs ("Spearheaded", "Engineered").
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('bullet')}
                className="px-2.5 py-1.5 rounded-xl bg-[#006B83] hover:bg-[#005569] text-white text-[11px] font-bold transition shrink-0 shadow-sm"
              >
                Upgrade Verbs
              </button>
            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2 border-t border-[#DCEAF5]">
            <span>5 strategic recommendations generated</span>
            <button
              onClick={() => onNavigateTab('analyzer')}
              className="font-bold text-[#006B83] hover:underline"
            >
              Recalculate Suggestions →
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          6. RECENT RESUME UPLOADS & JOB APPLICATIONS
      ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Recent Resume Uploads Table / List */}
        <div className="lg:col-span-7 rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#006B83]" />
                <span>Recent Resume Uploads</span>
              </h4>
              <button 
                onClick={onOpenUpload} 
                className="text-[11px] font-semibold text-[#006B83] hover:underline flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload New File</span>
              </button>
            </div>
            <p className="text-xs text-[#64748B]">
              Track your uploaded documents, parse status, ATS scores, and downloads.
            </p>
          </div>

          {/* Resumes List */}
          <div className="space-y-2.5 my-3">
            {displayResumes.map((doc) => {
              const isDeleting = deleteConfirmId === doc.id;
              return (
                <div 
                  key={doc.id}
                  className="p-3.5 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5] hover:border-[#006B83] transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#006B83] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                      {doc.fileName?.endsWith('.docx') ? 'DOC' : 'PDF'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#102A43] truncate">
                        {doc.fileName || doc.name || 'Candidate_Resume.pdf'}
                      </div>
                      <div className="text-[10px] text-[#64748B] mt-0.5 flex items-center gap-2">
                        <span>{doc.uploadDate || 'Active'}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#006B83]">{doc.status || 'ATS Ready'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right side: Score & Action Buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-white text-[#006B83] border border-[#DCEAF5] shadow-xs">
                      {doc.score || atsScore} ATS
                    </span>

                    {/* View Button */}
                    <button
                      onClick={() => onNavigateTab('visualizer')}
                      className="p-1.5 rounded-lg bg-white border border-[#DCEAF5] text-[#102A43] hover:text-[#006B83] hover:border-[#006B83] transition"
                      title="View Resume in Visualizer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>

                    {/* Download Button */}
                    <button
                      onClick={handleDownloadActiveResume}
                      className="p-1.5 rounded-lg bg-white border border-[#DCEAF5] text-[#102A43] hover:text-[#006B83] hover:border-[#006B83] transition"
                      title="Download Resume"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete Option with Confirmation */}
                    {isDeleting ? (
                      <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-rose-200">
                        <button
                          onClick={() => {
                            onDeleteSavedResume(doc.id);
                            setDeleteConfirmId(null);
                          }}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white hover:bg-rose-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-1.5 py-0.5 rounded text-[10px] text-slate-500 hover:bg-slate-100 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(doc.id)}
                        className="p-1.5 rounded-lg bg-white border border-[#DCEAF5] text-[#64748B] hover:text-rose-600 hover:border-rose-300 transition"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2.5 border-t border-[#DCEAF5]">
            <span>{displayResumes.length} resume revisions cataloged</span>
            <button
              onClick={onOpenSamples}
              className="font-bold text-[#006B83] hover:underline"
            >
              Browse Sample Templates →
            </button>
          </div>
        </div>

        {/* Right: Active Application Pipeline Mini-Card */}
        <div className="lg:col-span-5 rounded-3xl p-6 bg-white border border-[#DCEAF5] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="text-sm font-bold text-[#102A43] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#006B83]" />
                <span>Active Job Pipeline</span>
              </h4>
              <button 
                onClick={() => onNavigateTab('applications')} 
                className="text-[11px] font-semibold text-[#006B83] hover:underline"
              >
                View Pipeline ({applications.length}) →
              </button>
            </div>
            <p className="text-xs text-[#64748B]">
              Track opportunities currently monitored in your job tracker.
            </p>
          </div>

          {/* Mini-Stages */}
          <div className="grid grid-cols-3 gap-2.5 my-3 text-center">
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5]">
              <div className="text-lg font-black text-[#102A43] font-syne">{appliedCount}</div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] mt-0.5">Applied</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5]">
              <div className="text-lg font-black text-[#006B83] font-syne">{interviewCount}</div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] mt-0.5">Interviews</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#EFF8FF] border border-[#DCEAF5]">
              <div className="text-lg font-black text-[#00C9A7] font-syne">{offerCount}</div>
              <div className="text-[10px] uppercase font-bold text-[#64748B] mt-0.5">Offers</div>
            </div>
          </div>

          {/* Top 2 Active Applications */}
          <div className="space-y-2">
            {applications.slice(0, 2).map((app) => (
              <div 
                key={app.id}
                onClick={() => onNavigateTab('applications')}
                className="p-3 rounded-2xl bg-[#EFF8FF] hover:bg-white border border-[#DCEAF5] hover:border-[#006B83] transition cursor-pointer flex items-center justify-between"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-bold text-[#102A43] truncate">{app.title}</div>
                  <div className="text-[10px] text-[#64748B] truncate mt-0.5 flex items-center gap-1.5">
                    <span className="font-semibold text-[#102A43]">{app.company}</span>
                    <span>•</span>
                    <span>{app.location || 'Remote'}</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-[#006B83] border border-[#DCEAF5] shrink-0">
                  {app.status}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B] pt-2.5 border-t border-[#DCEAF5] mt-3">
            <span>{applications.length} applications tracked</span>
            <button
              onClick={() => onNavigateTab('matcher')}
              className="font-bold text-[#006B83] hover:underline"
            >
              + Search Jobs
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          7. CAREER PROMOTION BANNER
      ======================================================== */}
      <div className="rounded-3xl bg-gradient-to-r from-[#006B83] via-[#004B63] to-[#031B35] text-white p-6 sm:p-7 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5 border border-[#00E5FF]/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00E5FF]/15 text-[#00E5FF] text-[10px] font-extrabold uppercase border border-[#00E5FF]/30 mb-2">
            <span>Career Acceleration Opportunity</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white font-syne tracking-tight">
            Reach Your Dream Job with SkillBridge
          </h3>
          <p className="text-cyan-100 text-xs sm:text-sm mt-1 font-medium">
            Analyze. Improve. Get Hired.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigateTab('matcher')}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#00C9A7] hover:brightness-105 text-[#031B35] text-xs font-black transition shadow-lg shadow-[#00E5FF]/25 hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Explore Jobs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </motion.div>
  );
}
