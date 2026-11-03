import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Plus, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  Building2, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  FileText, 
  Mic, 
  ChevronRight, 
  MoreVertical,
  X,
  Sparkles,
  Kanban,
  List,
  Check,
  Linkedin,
  Download
} from 'lucide-react';

export const PIPELINE_STAGES = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30', dot: 'bg-blue-400' },
  { id: 'screening', label: 'Screening', color: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30', dot: 'bg-cyan-400' },
  { id: 'interview', label: 'Technical Interview', color: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30', dot: 'bg-indigo-400' },
  { id: 'final', label: 'Final Round', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30', dot: 'bg-purple-400' },
  { id: 'offer', label: 'Offer Received', color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
  { id: 'rejected', label: 'Archived / Rejected', color: 'bg-slate-800/60 text-slate-400 border-slate-700/60', dot: 'bg-slate-500' }
];

export const PLATFORM_SOURCES = [
  'LinkedIn',
  'Naukri.com',
  'Company Careers Site',
  'Indeed',
  'Employee Referral',
  'Wellfound / AngelList',
  'Other'
];

export default function JobApplications({
  applications = [],
  onAddApplication = () => {},
  onUpdateApplication = () => {},
  onDeleteApplication = () => {},
  onNavigateTab = () => {},
  onPrepareInterview = () => {},
  onGenerateCoverLetter = () => {}
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  
  // Form State
  const [formCompany, setFormCompany] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSource, setFormSource] = useState('LinkedIn');
  const [formLocation, setFormLocation] = useState('Bengaluru (Hybrid)');
  const [formSalary, setFormSalary] = useState('');
  const [formStatus, setFormStatus] = useState('applied');
  const [formAppliedDate, setFormAppliedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formNextInterview, setFormNextInterview] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Open modal for new application
  const handleOpenAddModal = (presetData = null) => {
    setEditingApp(null);
    setFormCompany(presetData?.company || '');
    setFormTitle(presetData?.title || '');
    setFormSource(presetData?.source || 'LinkedIn');
    setFormLocation(presetData?.location || 'Bengaluru (Hybrid)');
    setFormSalary(presetData?.salary || '');
    setFormStatus(presetData?.status || 'applied');
    setFormAppliedDate(new Date().toISOString().split('T')[0]);
    setFormNextInterview(presetData?.nextInterview || '');
    setFormUrl(presetData?.url || '');
    setFormContact(presetData?.contact || '');
    setFormNotes(presetData?.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  // Open modal to edit existing application
  const handleOpenEditModal = (app) => {
    setEditingApp(app);
    setFormCompany(app.company || '');
    setFormTitle(app.title || '');
    setFormSource(app.source || 'LinkedIn');
    setFormLocation(app.location || '');
    setFormSalary(app.salary || '');
    setFormStatus(app.status || 'applied');
    setFormAppliedDate(app.appliedDate || new Date().toISOString().split('T')[0]);
    setFormNextInterview(app.nextInterview || '');
    setFormUrl(app.url || '');
    setFormContact(app.contact || '');
    setFormNotes(app.notes || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formCompany.trim() || !formTitle.trim()) {
      setFormError('Company name and job title are required.');
      return;
    }

    const appData = {
      id: editingApp ? editingApp.id : `app_${Date.now()}`,
      company: formCompany.trim(),
      title: formTitle.trim(),
      source: formSource,
      location: formLocation.trim() || 'Remote',
      salary: formSalary.trim() || 'Competitive',
      status: formStatus,
      appliedDate: formAppliedDate,
      nextInterview: formNextInterview.trim() || null,
      url: formUrl.trim() || null,
      contact: formContact.trim() || null,
      notes: formNotes.trim() || '',
      updatedAt: new Date().toISOString()
    };

    if (editingApp) {
      onUpdateApplication(appData);
    } else {
      onAddApplication(appData);
    }

    setIsModalOpen(false);
  };

  // Quick 1-click status change
  const handleQuickStatusChange = (appId, newStatus) => {
    const target = applications.find(a => a.id === appId);
    if (target) {
      onUpdateApplication({ ...target, status: newStatus, updatedAt: new Date().toISOString() });
    }
  };

  // Filter applications
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        app.company?.toLowerCase().includes(q) || 
        app.title?.toLowerCase().includes(q) || 
        app.notes?.toLowerCase().includes(q) ||
        app.location?.toLowerCase().includes(q);

      const matchesStage = selectedStage === 'all' || app.status === selectedStage;
      const matchesSource = selectedSource === 'all' || app.source === selectedSource;

      return matchesSearch && matchesStage && matchesSource;
    });
  }, [applications, searchQuery, selectedStage, selectedSource]);

  // Key Pipeline Statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const applied = applications.filter(a => a.status === 'applied').length;
    const screening = applications.filter(a => a.status === 'screening').length;
    const interview = applications.filter(a => a.status === 'interview').length;
    const finalRound = applications.filter(a => a.status === 'final').length;
    const offer = applications.filter(a => a.status === 'offer').length;
    const activeInterviews = screening + interview + finalRound;
    const responseRate = total > 0 ? Math.round(((activeInterviews + offer) / total) * 100) : 0;

    return { total, applied, activeInterviews, offer, responseRate };
  }, [applications]);

  const getSourceBadge = (source) => {
    if (source === 'LinkedIn') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0A66C2]/15 text-[#60a5fa] border border-[#0A66C2]/30">
          <Linkedin className="w-2.5 h-2.5" /> LinkedIn
        </span>
      );
    }
    if (source === 'Naukri.com') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#0078DB]/15 text-[#38bdf8] border border-[#0078DB]/30">
          <span className="w-2 h-2 rounded-full bg-[#0078DB]" /> Naukri
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
        <Building2 className="w-2.5 h-2.5 text-slate-400" /> {source || 'Direct'}
      </span>
    );
  };

  const getStageMeta = (statusId) => {
    return PIPELINE_STAGES.find(s => s.id === statusId) || PIPELINE_STAGES[0];
  };

  const handleExportCSV = () => {
    if (applications.length === 0) {
      alert('No job applications to export.');
      return;
    }
    const headers = ['Company', 'Job Title', 'Stage', 'Platform', 'Location', 'Salary', 'Applied Date', 'Next Interview', 'Job URL', 'Notes'];
    const rows = applications.map(a => [
      `"${(a.company || '').replace(/"/g, '""')}"`,
      `"${(a.title || '').replace(/"/g, '""')}"`,
      `"${a.status || ''}"`,
      `"${a.source || ''}"`,
      `"${(a.location || '').replace(/"/g, '""')}"`,
      `"${(a.salary || '').replace(/"/g, '""')}"`,
      `"${a.appliedDate || ''}"`,
      `"${(a.nextInterview || '').replace(/"/g, '""')}"`,
      `"${(a.url || '').replace(/"/g, '""')}"`,
      `"${(a.notes || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `skillbridge_job_applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Bar */}
      <div className="pro-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Briefcase className="w-3.5 h-3.5" />
            <span>End-to-End Application Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Job Applications & Interview Loop Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Monitor real-time progress of submitted roles across <strong className="text-sky-400">LinkedIn</strong>, <strong className="text-cyan-400">Naukri.com</strong>, and referrals. Never miss an interview deadline or follow-up.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => onNavigateTab('matcher')}
            className="px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition flex items-center gap-1.5 shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explore Matched Jobs</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-300 transition flex items-center gap-1.5 shadow-sm"
            title="Download CSV report of tracked applications"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => handleOpenAddModal()}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Track New Job</span>
          </button>
        </div>
      </div>

      {/* 4 Key Performance Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1">
          <div className="text-xs text-slate-400 font-medium">Total Applied</div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.total}</div>
          <div className="text-[11px] text-slate-500">Tracked in your active studio</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1">
          <div className="text-xs text-indigo-400 font-medium">In Interview Loops</div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-400">{stats.activeInterviews}</div>
          <div className="text-[11px] text-slate-500">Screening, Tech, or Final rounds</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1">
          <div className="text-xs text-emerald-400 font-medium">Offers Received</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{stats.offer}</div>
          <div className="text-[11px] text-slate-500">Ready for compensation review</div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/70 border border-slate-800/80 space-y-1">
          <div className="text-xs text-cyan-400 font-medium">Pipeline Response Rate</div>
          <div className="text-2xl sm:text-3xl font-black text-cyan-400">{stats.responseRate}%</div>
          <div className="text-[11px] text-slate-500">Applications reaching interview stage</div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="pro-card p-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, role title, or notes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stage Filter */}
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Stages ({applications.length})</option>
            {PIPELINE_STAGES.map(s => (
              <option key={s.id} value={s.id}>
                {s.label} ({applications.filter(a => a.status === s.id).length})
              </option>
            ))}
          </select>

          {/* Source Filter */}
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Sources</option>
            {PLATFORM_SOURCES.map(src => (
              <option key={src} value={src}>{src}</option>
            ))}
          </select>

          {/* View Toggle (Kanban vs List) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Pipeline Columns View"
            >
              <Kanban className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Table List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* KANBAN PIPELINE VIEW */}
      {/* ------------------------------------------------------------------ */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
          {PIPELINE_STAGES.filter(s => s.id !== 'rejected').map(stage => {
            const stageApps = filteredApps.filter(a => a.status === stage.id);

            return (
              <div 
                key={stage.id}
                className="bg-slate-900/70 border border-slate-800/90 rounded-2xl p-3.5 space-y-3 min-h-[380px] flex flex-col"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                    <h3 className="text-xs font-bold text-white truncate max-w-[130px]" title={stage.label}>
                      {stage.label}
                    </h3>
                  </div>
                  <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800">
                    {stageApps.length}
                  </span>
                </div>

                {/* Cards in column */}
                <div className="space-y-3 flex-1">
                  {stageApps.map(app => (
                    <motion.div
                      key={app.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 hover:border-indigo-500/40 transition-all space-y-2.5 group relative shadow-md"
                    >
                      {/* Top Header: Title & Company */}
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white group-hover:text-indigo-300 transition line-clamp-1">
                            {app.title}
                          </h4>
                          <button
                            onClick={() => handleOpenEditModal(app)}
                            className="text-slate-500 hover:text-slate-300 p-0.5"
                            title="Edit application"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span className="truncate">{app.company}</span>
                        </div>
                      </div>

                      {/* Source & Location badges */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {getSourceBadge(app.source)}
                        {app.location && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5 truncate max-w-[120px]">
                            <MapPin className="w-2.5 h-2.5 text-slate-500" />
                            <span className="truncate">{app.location}</span>
                          </span>
                        )}
                      </div>

                      {/* Interview Alert Banner (if set) */}
                      {app.nextInterview && (
                        <div className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-500/30 text-[10px] text-indigo-300 space-y-0.5">
                          <div className="font-semibold flex items-center gap-1 text-cyan-400">
                            <Clock className="w-3 h-3" />
                            <span>Upcoming Loop</span>
                          </div>
                          <div className="truncate text-slate-300 font-mono">
                            {app.nextInterview}
                          </div>
                        </div>
                      )}

                      {/* Notes snippet */}
                      {app.notes && (
                        <p className="text-[10px] text-slate-400 line-clamp-2 italic bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/50">
                          "{app.notes}"
                        </p>
                      )}

                      {/* Bottom Controls: Stage Mover & AI Action */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                        {/* Quick Mover Selector */}
                        <select
                          value={app.status}
                          onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                          className="bg-slate-900 text-slate-300 rounded px-1.5 py-0.5 border border-slate-800 text-[10px] focus:outline-none focus:border-indigo-500"
                        >
                          {PIPELINE_STAGES.map(st => (
                            <option key={st.id} value={st.id}>{st.label}</option>
                          ))}
                        </select>

                        {/* Quick AI Shortcuts */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onPrepareInterview(app)}
                            className="p-1 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 transition"
                            title="Launch AI Mock Interview for this role"
                          >
                            <Mic className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => onGenerateCoverLetter(app)}
                            className="p-1 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 transition"
                            title="Generate Tailored Cover Letter"
                          >
                            <FileText className="w-3 h-3" />
                          </button>
                          
                          <button
                            onClick={() => onDeleteApplication(app.id)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                    </motion.div>
                  ))}

                  {stageApps.length === 0 && (
                    <div className="p-6 text-center text-slate-600 text-[11px] rounded-xl border border-dashed border-slate-800">
                      No jobs in this stage
                    </div>
                  )}
                </div>

                {/* Column Footer: Quick add button */}
                <button
                  onClick={() => handleOpenAddModal({ status: stage.id })}
                  className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 rounded-xl transition flex items-center justify-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add to {stage.label}</span>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        /* ------------------------------------------------------------------ */
        /* DETAILED TABLE LIST VIEW */
        /* ------------------------------------------------------------------ */
        <div className="pro-card rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 border-collapse">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="py-3 px-4">Role & Company</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Location & CTC</th>
                  <th className="py-3 px-4">Interview Schedule</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredApps.map(app => {
                  const stageMeta = getStageMeta(app.status);
                  return (
                    <tr key={app.id} className="hover:bg-slate-950/50 transition">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-xs">{app.title}</div>
                        <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{app.company}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={app.status}
                          onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-semibold focus:outline-none ${stageMeta.color}`}
                        >
                          {PIPELINE_STAGES.map(st => (
                            <option key={st.id} value={st.id}>{st.label}</option>
                          ))}
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        {getSourceBadge(app.source)}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">{app.location || 'Remote'}</div>
                        <div className="text-emerald-400/90 text-[11px] font-medium">{app.salary}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        {app.nextInterview ? (
                          <div className="text-indigo-300 font-mono text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3 text-cyan-400" />
                            <span>{app.nextInterview}</span>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">Applied on {app.appliedDate}</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-1">
                        <button
                          onClick={() => onPrepareInterview(app)}
                          className="px-2 py-1 rounded bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 text-[11px] font-semibold transition inline-flex items-center gap-1"
                          title="Interview Prep"
                        >
                          <Mic className="w-3 h-3" />
                          <span className="hidden sm:inline">Mock Q&A</span>
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(app)}
                          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteApplication(app.id)}
                          className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filteredApps.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No applications match current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* MODAL: ADD / EDIT JOB APPLICATION */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {editingApp ? 'Edit Tracked Application' : 'Track New Job Application'}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Record submission details, next round dates, and preparation notes.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveForm} className="p-5 space-y-4 overflow-y-auto">
                
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Company & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formCompany}
                      onChange={(e) => setFormCompany(e.target.value)}
                      placeholder="e.g. Razorpay, Swiggy, TCS"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Title *</label>
                    <input
                      type="text"
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. Senior Full Stack Engineer"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Platform Source & Stage */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Source</label>
                    <select
                      value={formSource}
                      onChange={(e) => setFormSource(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {PLATFORM_SOURCES.map(src => (
                        <option key={src} value={src}>{src}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Pipeline Stage</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      {PIPELINE_STAGES.map(st => (
                        <option key={st.id} value={st.id}>{st.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location & Salary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Location / Work Mode</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      placeholder="e.g. Bengaluru (Hybrid) / Remote"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Salary / CTC</label>
                    <input
                      type="text"
                      value={formSalary}
                      onChange={(e) => setFormSalary(e.target.value)}
                      placeholder="e.g. ₹24 - ₹30 LPA"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Applied Date & Next Interview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Applied Date</label>
                    <input
                      type="date"
                      value={formAppliedDate}
                      onChange={(e) => setFormAppliedDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Next Interview / Deadline</label>
                    <input
                      type="text"
                      value={formNextInterview}
                      onChange={(e) => setFormNextInterview(e.target.value)}
                      placeholder="e.g. 12 Nov, Round 2 Tech"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* URL Link & Recruiter Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Job Link / Portal URL</label>
                    <input
                      type="url"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://linkedin.com/jobs/..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Recruiter / Contact Person</label>
                    <input
                      type="text"
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      placeholder="e.g. Priya (Tech Recruiter)"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                {/* Notes & Prep Checklist */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Interview Prep Notes & Feedback</label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Key concepts to revise (e.g. Redis caching, PostgreSQL indexing, STAR response for deadline questions)..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed font-sans"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingApp ? 'Save Changes' : 'Track Application'}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

