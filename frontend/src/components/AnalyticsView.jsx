import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Target, 
  Cpu, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Compass, 
  Layers,
  Activity,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';

export default function AnalyticsView({
  resume,
  analysis,
  onNavigateTab
}) {
  const skills = resume?.skills || {};
  const radarData = [
    { subject: "Languages", A: Math.min(10, (skills.languages?.length || 0) * 2), fullMark: 10 },
    { subject: "Frameworks", A: Math.min(10, (skills.frameworks?.length || 0) * 2), fullMark: 10 },
    { subject: "Databases", A: Math.min(10, (skills.databases?.length || 0) * 3.3), fullMark: 10 },
    { subject: "Cloud/DevOps", A: Math.min(10, (skills.cloudAndDevops?.length || 0) * 3), fullMark: 10 },
    { subject: "Tools", A: Math.min(10, (skills.tools?.length || 0) * 2.5), fullMark: 10 },
    { subject: "Soft Skills", A: Math.min(10, (skills.softSkills?.length || 0) * 2.5), fullMark: 10 },
  ];

  const subScores = analysis?.subScores || {
    contactScore: { current: 15, max: 15, percentage: 100 },
    sectionScore: { current: 18, max: 20, percentage: 90 },
    metricsScore: { current: 18, max: 25, percentage: 72 },
    verbScore: { current: 12, max: 15, percentage: 80 },
    skillCoverageScore: { current: 18, max: 25, percentage: 72 }
  };

  const scoreBreakdown = [
    { name: 'Contact Info', score: subScores.contactScore?.current || 15, max: 15 },
    { name: 'Section Integrity', score: subScores.sectionScore?.current || 18, max: 20 },
    { name: 'Quantified Impact', score: subScores.metricsScore?.current || 18, max: 25 },
    { name: 'Power Verbs', score: subScores.verbScore?.current || 12, max: 15 },
    { name: 'Role Skills', score: subScores.skillCoverageScore?.current || 18, max: 25 },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="pro-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>Deep Algorithmic Analytics</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Competency Radar & Score Breakdown
          </h2>
          <p className="text-xs text-slate-400 mt-1">Multi-dimensional evaluation across technical breadth, infrastructure density, and recruiter parsing vectors.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('analyzer')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/25"
          >
            Open ATS Auditor →
          </button>
        </div>
      </div>

      {/* Main Grid: Radar + Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Chart */}
        <div className="lg:col-span-6 pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Technical Domain Balance</span>
              </h3>
              <span className="text-[10px] text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 font-semibold">
                Calibrated
              </span>
            </div>
            <p className="text-xs text-slate-400">Balance across languages, frameworks, cloud infrastructure, and databases.</p>
          </div>

          <div className="w-full h-72 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#334155" tick={false} />
                <Radar name="Skills" dataKey="A" stroke="#818cf8" strokeWidth={2.5} fill="#6366f1" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-base font-bold text-white">{skills.languages?.length || 0}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-0.5">Languages</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-base font-bold text-indigo-400">{skills.frameworks?.length || 0}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-0.5">Frameworks</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <div className="text-base font-bold text-cyan-400">{skills.databases?.length || 0}</div>
              <div className="text-[10px] text-slate-400 uppercase mt-0.5">Databases</div>
            </div>
          </div>
        </div>

        {/* Score Category Breakdown Bar Chart */}
        <div className="lg:col-span-6 pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Scoring Category Performance</span>
              </h3>
              <span className="text-xs text-slate-400">Heuristic Audit</span>
            </div>
            <p className="text-xs text-slate-400">Point allocation and performance against maximum scoring capacity.</p>
          </div>

          <div className="w-full h-72 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreBreakdown} layout="vertical">
                <XAxis type="number" stroke="#475569" fontSize={10} domain={[0, 25]} />
                <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={11} width={110} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} 
                />
                <Bar dataKey="score" fill="#6366f1" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Total Algorithmic Fit:</span>
            <span className="font-bold text-emerald-400 text-sm">{analysis?.atsScore || 78}/100 Pts ({analysis?.ratingTier || 'Competitive'})</span>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
