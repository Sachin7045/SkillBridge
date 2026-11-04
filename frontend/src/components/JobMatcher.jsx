import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Target,
  ExternalLink,
  Globe,
  MapPin,
  Clock,
  Building2,
  Linkedin,
  Filter,
  RotateCcw,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { analyzeResumeApi } from '../api';
import { 
  getLinkedInSearchUrl, 
  getNaukriSearchUrl, 
  SAMPLE_LINKEDIN_JD, 
  SAMPLE_NAUKRI_JD, 
  CURATED_PORTAL_JOBS 
} from '../data/portalJobs';

export default function JobMatcher({
  resume,
  rolesList = [],
  analysis,
  onAnalysisUpdated,
  onNavigateTab,
  onTrackJob = () => {},
  trackedJobIds = []
}) {
  const [selectedRole, setSelectedRole] = useState(resume?.targetRole || 'Full Stack Developer');
  const [customJD, setCustomJD] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [activePortalFilter, setActivePortalFilter] = useState('all'); // 'all' | 'LinkedIn' | 'Naukri'
  const [activeCityFilter, setActiveCityFilter] = useState('all');
  const [searchLocation, setSearchLocation] = useState('India');
  const [searchKeywords, setSearchKeywords] = useState(resume?.targetRole || 'Full Stack Developer');
  const [copiedLink, setCopiedLink] = useState(false);

  const matchedSkills = analysis?.jobMatch?.matchedSkills || [];
  const missingSkills = analysis?.jobMatch?.missingSkills || [];
  const matchPercentage = analysis?.jobMatch?.matchPercentage || 75;

  // Compute all candidate skill strings in lowercase for quick membership checks
  const candidateSkillSet = useMemo(() => {
    return new Set([
      ...(resume?.skills?.languages || []),
      ...(resume?.skills?.frameworks || []),
      ...(resume?.skills?.databases || []),
      ...(resume?.skills?.cloudAndDevops || []),
      ...(resume?.skills?.tools || []),
      ...(resume?.skills?.softSkills || [])
    ].map(s => s.toLowerCase().trim()));
  }, [resume]);

  const handleRoleSelect = (roleName) => {
    setSelectedRole(roleName);
    setSearchKeywords(roleName);
  };

  const handleRunMatch = async (overrideJD = null) => {
    const jdText = typeof overrideJD === 'string' ? overrideJD : customJD;
    setIsMatching(true);
    try {
      const res = await analyzeResumeApi(resume, selectedRole, jdText);
      if (res?.analysis) {
        onAnalysisUpdated(res.analysis);
        if (res.analysis.atsScore >= 80) {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
        }
      }
    } catch (err) {
      console.error('Job match evaluation failed:', err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleLoadSampleJD = (type) => {
    const text = type === 'linkedin' ? SAMPLE_LINKEDIN_JD : SAMPLE_NAUKRI_JD;
    setCustomJD(text);
    handleRunMatch(text);
  };

  const handleLoadAndMatchJob = (job) => {
    setCustomJD(job.description);
    handleRunMatch(job.description);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleOpenBothPortals = () => {
    const liUrl = getLinkedInSearchUrl(searchKeywords || selectedRole, searchLocation);
    const nkUrl = getNaukriSearchUrl(searchKeywords || selectedRole, searchLocation);
    window.open(liUrl, '_blank', 'noopener,noreferrer');
    window.open(nkUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopySearchTerms = () => {
    const text = `${searchKeywords || selectedRole} in ${searchLocation}`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const sampleRoles = [
    "Full Stack Developer",
    "Frontend Engineer",
    "Backend Engineer",
    "DevOps & Cloud Engineer",
    "Data Scientist & ML",
    "Software Engineer (Generalist)"
  ];

  const locationsList = [
    { label: "All India", value: "India" },
    { label: "Bengaluru", value: "Bengaluru" },
    { label: "Delhi NCR / Gurugram", value: "Delhi NCR" },
    { label: "Hyderabad", value: "Hyderabad" },
    { label: "Pune", value: "Pune" },
    { label: "Mumbai", value: "Mumbai" },
    { label: "Remote", value: "Remote" },
    { label: "Worldwide / US", value: "United States" }
  ];

  // Filter curated jobs by platform, role, and city
  const filteredJobs = useMemo(() => {
    return CURATED_PORTAL_JOBS.filter(job => {
      const matchesPortal = activePortalFilter === 'all' || job.portal === activePortalFilter;
      const matchesCity = activeCityFilter === 'all' || job.city === activeCityFilter;
      const matchesRole = selectedRole === 'Software Engineer (Generalist)' || 
                          job.targetRole === selectedRole ||
                          job.title.toLowerCase().includes(selectedRole.toLowerCase().split(' ')[0]);
      return matchesPortal && matchesCity && matchesRole;
    });
  }, [activePortalFilter, activeCityFilter, selectedRole]);

  const linkedInJobsCount = CURATED_PORTAL_JOBS.filter(j => j.portal === 'LinkedIn').length;
  const naukriJobsCount = CURATED_PORTAL_JOBS.filter(j => j.portal === 'Naukri').length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Top Banner */}
      <div className="pro-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Search className="w-3.5 h-3.5" />
            <span>Target Role & Live Portal Matcher</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Job Description & Keyword Gap Calibration
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Test candidate resume against actual recruiter job descriptions, search live openings on <strong className="text-sky-400 font-semibold">LinkedIn</strong> and <strong className="text-blue-400 font-semibold">Naukri.com</strong>, or detect missing competency gaps.
          </p>
        </div>

        {/* Current Match Pill */}
        <div className="flex items-center gap-4 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Match Coefficient</div>
            <div className="text-2xl font-black text-blue-400 mt-0.5">{matchPercentage}%</div>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-blue-500/20 border-t-cyan-400 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 1: LinkedIn & Naukri.com Deep Link Search Bar */}
      {/* ---------------------------------------------------- */}
      <div className="pro-card p-5 sm:p-6 rounded-2xl border border-blue-500/30 bg-slate-900/70 space-y-4 shadow-lg shadow-blue-950/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Live Portal Search & Direct Deep Links</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-blue-300 border border-blue-500/20 font-medium">
                  LinkedIn & Naukri
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Generate 1-click live search links matching your role, skills, and target location.
              </p>
            </div>
          </div>

          <button
            onClick={handleCopySearchTerms}
            className="self-start sm:self-center text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition"
            title="Copy search query"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Search className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedLink ? 'Copied Query' : 'Copy Query'}</span>
          </button>
        </div>

        {/* Search Inputs Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          {/* Keywords input */}
          <div className="md:col-span-7">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Role Keywords
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeywords}
                onChange={(e) => setSearchKeywords(e.target.value)}
                placeholder="e.g. Full Stack Developer, React, Node.js..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 font-sans"
              />
            </div>
          </div>

          {/* Location input / selector */}
          <div className="md:col-span-5">
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans appearance-none"
              >
                {locationsList.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons: LinkedIn, Naukri, and Open Both */}
        <div className="pt-2 flex flex-wrap items-center gap-3">
          {/* LinkedIn Deep Link */}
          <a
            href={getLinkedInSearchUrl(searchKeywords || selectedRole, searchLocation)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0A66C2] hover:bg-[#004182] text-white text-xs font-bold transition shadow-md shadow-[#0A66C2]/20"
          >
            <Linkedin className="w-4 h-4 fill-white" />
            <span>Search on LinkedIn Jobs</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Naukri.com Deep Link */}
          <a
            href={getNaukriSearchUrl(searchKeywords || selectedRole, searchLocation)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0078DB] hover:bg-[#005fb2] text-white text-xs font-bold transition shadow-md shadow-[#0078DB]/20"
          >
            <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[#0078DB] font-black text-[10px]">
              N
            </div>
            <span>Search on Naukri.com</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Open Both in Tabs */}
          <button
            onClick={handleOpenBothPortals}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold transition"
            title="Open searches on both LinkedIn and Naukri.com"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Open Both Portals</span>
            <span className="sm:hidden">Both</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 2: Custom Job Description Precision Calibrator */}
      {/* ---------------------------------------------------- */}
      <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-5">
        
        {/* Preset Roles Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Role Preset
          </label>
          <div className="flex flex-wrap gap-2">
            {sampleRoles.map((roleName) => (
              <button
                key={roleName}
                onClick={() => handleRoleSelect(roleName)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  selectedRole === roleName
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 border border-blue-500'
                    : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
              >
                {roleName}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Job Description Textarea */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Paste Specific Job Description
              </label>
              <span className="text-[11px] text-slate-500">From LinkedIn, Naukri, or Careers Page</span>
            </div>

            {/* Quick Sample JD Loaders */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleLoadSampleJD('linkedin')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500/20 transition flex items-center gap-1 font-medium"
                title="Paste a sample LinkedIn Tier-1 FinTech JD"
              >
                <Linkedin className="w-3 h-3" />
                <span>Sample LinkedIn JD</span>
              </button>

              <button
                onClick={() => handleLoadSampleJD('naukri')}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 text-blue-400 border border-blue-500/20 hover:bg-cyan-500/20 transition flex items-center gap-1 font-medium"
                title="Paste a sample Naukri.com Enterprise JD"
              >
                <span className="w-3 h-3 rounded-full bg-cyan-400 text-slate-950 font-black text-[8px] flex items-center justify-center">N</span>
                <span>Sample Naukri JD</span>
              </button>

              {customJD && (
                <button
                  onClick={() => {
                    setCustomJD('');
                    handleRunMatch('');
                  }}
                  className="text-[11px] px-2 py-1 rounded-lg text-slate-400 hover:text-rose-400 transition"
                  title="Clear pasted job description"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <textarea
            rows={5}
            value={customJD}
            onChange={(e) => setCustomJD(e.target.value)}
            placeholder="Paste raw requirements from LinkedIn, Naukri.com, or company careers page (e.g. requirements for React, Node.js, Docker, PostgreSQL, AWS, Redis)..."
            className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">
              {customJD.split(/\s+/).filter(Boolean).length} words
            </span>

            <button
              onClick={() => handleRunMatch()}
              disabled={isMatching}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition shadow-md shadow-blue-600/25"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isMatching ? "Scanning Keywords..." : "Run Precision Match"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 3: Matched vs Missing Skill Badges */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Matched Skills */}
        <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Detected Matching Keywords</h3>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
              {matchedSkills.length} Present
            </span>
          </div>

          {matchedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {matchedSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-medium flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">Run a match scan to view verified keyword coverage.</p>
          )}
        </div>

        {/* Missing Skills */}
        <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Missing Role Competencies</h3>
            </div>
            <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
              {missingSkills.length} Recommended
            </span>
          </div>

          {missingSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/20 font-medium"
                >
                  + {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No critical competency omissions detected for this role profile.</p>
          )}

          <div className="mt-5 pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">Want to add missing skills to your learning path?</span>
            <button
              onClick={() => onNavigateTab('roadmap')}
              className="text-blue-400 hover:text-blue-300 font-medium transition"
            >
              Open Roadmap →
            </button>
          </div>
        </div>

      </div>

      {/* ---------------------------------------------------- */}
      {/* SECTION 4: Featured Tech Openings on LinkedIn & Naukri */}
      {/* ---------------------------------------------------- */}
      <div className="pro-card p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <h3 className="text-base font-bold text-white">
                Featured Tech Openings on LinkedIn & Naukri.com
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Curated openings matching <strong className="text-slate-200">{selectedRole}</strong>. Click <strong className="text-blue-400">Match With Resume</strong> to test your compatibility, or apply directly on the portal.
            </p>
          </div>

          {/* Portal and Location Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Platform Filter Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActivePortalFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  activePortalFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({CURATED_PORTAL_JOBS.length})
              </button>
              <button
                onClick={() => setActivePortalFilter('LinkedIn')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  activePortalFilter === 'LinkedIn'
                    ? 'bg-[#0A66C2] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Linkedin className="w-3 h-3" />
                <span>LinkedIn ({linkedInJobsCount})</span>
              </button>
              <button
                onClick={() => setActivePortalFilter('Naukri')}
                className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1.5 ${
                  activePortalFilter === 'Naukri'
                    ? 'bg-[#0078DB] text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block" />
                <span>Naukri ({naukriJobsCount})</span>
              </button>
            </div>

            {/* City Filter Dropdown */}
            <select
              value={activeCityFilter}
              onChange={(e) => setActiveCityFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Cities</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
            </select>
          </div>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-2">
            <p>No featured listings match this specific role and city filter.</p>
            <button
              onClick={() => {
                setActivePortalFilter('all');
                setActiveCityFilter('all');
              }}
              className="text-blue-400 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJobs.map((job) => {
              // Calculate real match score against candidate's skills
              const totalRequired = job.requiredSkills.length;
              const userMatches = job.requiredSkills.filter(sk => candidateSkillSet.has(sk.toLowerCase().trim()));
              const jobScore = totalRequired > 0 ? Math.round((userMatches.length / totalRequired) * 100) : 70;

              const isLinkedIn = job.portal === 'LinkedIn';

              return (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800/90 hover:border-blue-500/40 hover:bg-slate-950 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Top Row: Company, Title, Portal Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                          {job.companyLogo || '🏢'}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white group-hover:text-blue-300 transition leading-snug">
                            {job.title}
                          </h4>
                          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{job.company}</span>
                          </div>
                        </div>
                      </div>

                      {/* Portal Badge */}
                      <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        isLinkedIn
                          ? 'bg-[#0A66C2]/15 text-[#60a5fa] border-[#0A66C2]/30'
                          : 'bg-[#0078DB]/15 text-[#38bdf8] border-[#0078DB]/30'
                      }`}>
                        {isLinkedIn ? (
                          <Linkedin className="w-2.5 h-2.5 text-[#60a5fa]" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-[#0078DB]" />
                        )}
                        <span>{job.portalBadge}</span>
                      </span>
                    </div>

                    {/* Metadata: Location, Exp, Salary, Posted */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{job.experience}</span>
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
                          <TrendingUp className="w-3 h-3 text-emerald-400" />
                          <span>{job.salary}</span>
                        </span>
                      )}
                    </div>

                    {/* Tech Stack Pills with match status */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                        <span>Required Tech Stack</span>
                        <span className="text-slate-400">
                          {userMatches.length}/{totalRequired} skills on resume
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {job.requiredSkills.map((sk, idx) => {
                          const hasSkill = candidateSkillSet.has(sk.toLowerCase().trim());
                          return (
                            <span
                              key={idx}
                              className={`px-2 py-0.5 rounded text-[11px] font-medium border flex items-center gap-1 ${
                                hasSkill
                                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              {hasSkill && <Check className="w-2.5 h-2.5 text-emerald-400 shrink-0" />}
                              <span>{sk}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Row: Resume Match Meter & Action Buttons */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-medium">Compatibility:</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${
                        jobScore >= 80 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : jobScore >= 60
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}>
                        {jobScore}% Match
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Track Job Button */}
                      {(() => {
                        const isTracked = trackedJobIds.includes(`${job.company.toLowerCase()}_${job.title.toLowerCase()}`);
                        return (
                          <button
                            onClick={() => onTrackJob(job)}
                            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 border ${
                              isTracked
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                            }`}
                            title={isTracked ? "Already in your applications pipeline" : "Track this role in your Job Applications Pipeline"}
                          >
                            {isTracked ? <Check className="w-3 h-3 text-emerald-400" /> : <Briefcase className="w-3 h-3 text-blue-400" />}
                            <span>{isTracked ? 'Tracked' : 'Track'}</span>
                          </button>
                        );
                      })()}

                      {/* Match With Resume Button */}
                      <button
                        onClick={() => handleLoadAndMatchJob(job)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition flex items-center gap-1.5"
                        title="Load this job description into the calibration engine"
                      >
                        <Sparkles className="w-3 h-3 text-blue-400" />
                        <span>Match</span>
                      </button>

                      {/* External Apply Link */}
                      <a
                        href={job.applyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`px-3 py-1.5 rounded-xl text-white text-xs font-semibold transition flex items-center gap-1 ${
                          isLinkedIn
                            ? 'bg-[#0A66C2] hover:bg-[#004182]'
                            : 'bg-[#0078DB] hover:bg-[#005fb2]'
                        }`}
                      >
                        <span>Apply</span>
                        <ExternalLink className="w-3 h-3 opacity-80" />
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </motion.div>
  );
}
