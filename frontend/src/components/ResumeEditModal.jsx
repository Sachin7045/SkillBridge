import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Check, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function ResumeEditModal({ 
  isOpen, 
  onClose, 
  resume = {}, 
  onSave = () => {} 
}) {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(resume || {})));
  const [activeTab, setActiveTab] = useState('basics'); // 'basics' | 'experience' | 'education' | 'projects' | 'skills' | 'certifications'

  if (!isOpen) return null;

  // Handlers for Basic info
  const handleBasicChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      contact: { ...(prev.contact || {}), [field]: value },
      [field]: value // Sync top-level for backwards compatibility
    }));
  };

  const handleLinkChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      links: { ...(prev.links || {}), [field]: value }
    }));
  };

  // Experience handlers
  const handleAddExperience = () => {
    const newExp = {
      role: 'Senior Software Engineer',
      company: 'Tech Corp',
      location: 'Remote',
      period: '2024 - Present',
      bullets: ['Architected scalable features and improved throughput by 35%.']
    };
    setFormData(prev => ({
      ...prev,
      experience: [newExp, ...(prev.experience || [])]
    }));
  };

  const handleUpdateExperience = (index, field, value) => {
    setFormData(prev => {
      const list = [...(prev.experience || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, experience: list };
    });
  };

  const handleDeleteExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handleBulletChange = (expIdx, bulletIdx, value) => {
    setFormData(prev => {
      const list = [...(prev.experience || [])];
      const bullets = [...(list[expIdx].bullets || [])];
      bullets[bulletIdx] = value;
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, experience: list };
    });
  };

  const handleAddBullet = (expIdx) => {
    setFormData(prev => {
      const list = [...(prev.experience || [])];
      const bullets = [...(list[expIdx].bullets || []), 'Delivered impactful technical improvements.'];
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, experience: list };
    });
  };

  const handleDeleteBullet = (expIdx, bulletIdx) => {
    setFormData(prev => {
      const list = [...(prev.experience || [])];
      const bullets = (list[expIdx].bullets || []).filter((_, i) => i !== bulletIdx);
      list[expIdx] = { ...list[expIdx], bullets };
      return { ...prev, experience: list };
    });
  };

  // Projects handlers
  const handleAddProject = () => {
    const newProj = {
      name: 'Distributed Cloud Platform',
      link: 'https://github.com/example/project',
      description: 'Engineered a high-performance system reducing latency.',
      tech: ['React', 'Node.js', 'PostgreSQL']
    };
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), newProj]
    }));
  };

  const handleUpdateProject = (index, field, value) => {
    setFormData(prev => {
      const list = [...(prev.projects || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, projects: list };
    });
  };

  const handleDeleteProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const handleAddEducation = () => {
    const newEdu = {
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      year: '2020 - 2024',
      honors: 'Dean\'s List, Magna Cum Laude'
    };
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), newEdu]
    }));
  };

  const handleUpdateEducation = (index, field, value) => {
    setFormData(prev => {
      const list = [...(prev.education || [])];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, education: list };
    });
  };

  const handleDeleteEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // Skills handlers
  const handleSkillsListChange = (category, commaSeparated) => {
    const list = commaSeparated.split(',').map(s => s.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      skills: {
        ...(prev.skills || {}),
        [category]: list
      }
    }));
  };

  // Reorder experience
  const moveExperience = (from, to) => {
    if (to < 0 || to >= (formData.experience || []).length) return;
    setFormData(prev => {
      const list = [...prev.experience];
      const item = list.splice(from, 1)[0];
      list.splice(to, 0, item);
      return { ...prev, experience: list };
    });
  };

  // Reorder projects
  const moveProject = (from, to) => {
    if (to < 0 || to >= (formData.projects || []).length) return;
    setFormData(prev => {
      const list = [...(prev.projects || [])];
      const item = list.splice(from, 1)[0];
      list.splice(to, 0, item);
      return { ...prev, projects: list };
    });
  };

  // Reorder education
  const moveEducation = (from, to) => {
    if (to < 0 || to >= (formData.education || []).length) return;
    setFormData(prev => {
      const list = [...(prev.education || [])];
      const item = list.splice(from, 1)[0];
      list.splice(to, 0, item);
      return { ...prev, education: list };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const tabs = [
    { id: 'basics', label: 'Basic Info & Summary', icon: User },
    { id: 'experience', label: 'Experience Timeline', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Code2 },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills & Taxonomy', icon: Sparkles }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Structured Resume Editor</h2>
              <p className="text-xs text-slate-400">Directly modify, add, or delete verified resume fields and timeline entries.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Bar */}
        <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-950/40 px-5 gap-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* BASICS TAB */}
          {activeTab === 'basics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Candidate Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleBasicChange('name', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Alex Morgan"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Professional Title</label>
                  <input
                    type="text"
                    value={formData.title || ''}
                    onChange={(e) => handleBasicChange('title', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="e.g. Senior Full Stack Engineer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || formData.contact?.email || ''}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="alex@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone || formData.contact?.phone || ''}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="+1 (555) 019-2834"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location || formData.contact?.location || ''}
                    onChange={(e) => handleContactChange('location', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="San Francisco, CA (or Remote)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.links?.linkedin || ''}
                    onChange={(e) => handleLinkChange('linkedin', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">GitHub / Portfolio URL</label>
                  <input
                    type="text"
                    value={formData.links?.github || ''}
                    onChange={(e) => handleLinkChange('github', e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs focus:outline-none focus:border-indigo-500"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Executive Summary</label>
                <textarea
                  rows={4}
                  value={formData.summary || ''}
                  onChange={(e) => handleBasicChange('summary', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs leading-relaxed focus:outline-none focus:border-indigo-500 resize-none"
                  placeholder="Summarize your key technical impact, years of experience, and engineering specialties..."
                />
              </div>
            </div>
          )}

          {/* EXPERIENCE TAB */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  {(formData.experience || []).length} Documented Work Positions
                </span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Experience</span>
                </button>
              </div>

              {(formData.experience || []).map((exp, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-indigo-400">Position 0{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveExperience(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExperience(idx, idx + 1)}
                        disabled={idx === (formData.experience || []).length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExperience(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300 ml-2"
                        title="Delete Position"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Role Title</label>
                      <input
                        type="text"
                        value={exp.role || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'role', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'company', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration / Period</label>
                      <input
                        type="text"
                        value={exp.period || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'period', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        placeholder="e.g. 2022 - 2024"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Location</label>
                      <input
                        type="text"
                        value={exp.location || ''}
                        onChange={(e) => handleUpdateExperience(idx, 'location', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        placeholder="e.g. New York, NY"
                      />
                    </div>
                  </div>

                  {/* Bullet points */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold text-slate-400">Accomplishment Bullets</label>
                      <button
                        type="button"
                        onClick={() => handleAddBullet(idx)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
                      >
                        + Add Bullet
                      </button>
                    </div>

                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => handleBulletChange(idx, bIdx, e.target.value)}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 resize-none leading-relaxed"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteBullet(idx, bIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Featured Technical Projects
                </span>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Project</span>
                </button>
              </div>

              {(formData.projects || []).map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-cyan-400">Project 0{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveProject(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveProject(idx, idx + 1)}
                        disabled={idx === (formData.projects || []).length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProject(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300 ml-2"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Name</label>
                      <input
                        type="text"
                        value={proj.name || ''}
                        onChange={(e) => handleUpdateProject(idx, 'name', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Project Link / Repo</label>
                      <input
                        type="text"
                        value={proj.link || ''}
                        onChange={(e) => handleUpdateProject(idx, 'link', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Description & Impact</label>
                    <textarea
                      rows={2}
                      value={proj.description || ''}
                      onChange={(e) => handleUpdateProject(idx, 'description', e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">Technologies (Comma separated)</label>
                    <input
                      type="text"
                      value={Array.isArray(proj.tech) ? proj.tech.join(', ') : (proj.tech || '')}
                      onChange={(e) => handleUpdateProject(idx, 'tech', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                      placeholder="React, Node.js, Redis, Docker"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* EDUCATION TAB */}
          {activeTab === 'education' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  Education & Academic Degrees
                </span>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              {(formData.education || []).map((edu, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-indigo-400">Degree 0{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => moveEducation(idx, idx - 1)}
                        disabled={idx === 0}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveEducation(idx, idx + 1)}
                        disabled={idx === (formData.education || []).length - 1}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteEducation(idx)}
                        className="p-1 text-rose-400 hover:text-rose-300 ml-2"
                        title="Delete Degree"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'degree', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Institution / University</label>
                      <input
                        type="text"
                        value={edu.institution || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'institution', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Graduation Year / Period</label>
                      <input
                        type="text"
                        value={edu.year || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'year', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1">Honors / GPA (Optional)</label>
                      <input
                        type="text"
                        value={edu.honors || ''}
                        onChange={(e) => handleUpdateEducation(idx, 'honors', e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                        placeholder="e.g. Magna Cum Laude"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* SKILLS TAB */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Categorized skills are dynamically graphed into the Technical Competency Radar. Enter skills as comma-separated values:
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Programming Languages</label>
                <input
                  type="text"
                  value={(formData.skills?.languages || []).join(', ')}
                  onChange={(e) => handleSkillsListChange('languages', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-mono"
                  placeholder="JavaScript, TypeScript, Python, Go, Java"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Frameworks & Libraries</label>
                <input
                  type="text"
                  value={(formData.skills?.frameworks || []).join(', ')}
                  onChange={(e) => handleSkillsListChange('frameworks', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-mono"
                  placeholder="React, Next.js, Node.js, Express, Tailwind CSS"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Databases & Storage</label>
                <input
                  type="text"
                  value={(formData.skills?.databases || []).join(', ')}
                  onChange={(e) => handleSkillsListChange('databases', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-mono"
                  placeholder="PostgreSQL, MongoDB, Redis, MySQL"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Cloud, DevOps & Containers</label>
                <input
                  type="text"
                  value={(formData.skills?.cloudAndDevops || []).join(', ')}
                  onChange={(e) => handleSkillsListChange('cloudAndDevops', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-mono"
                  placeholder="AWS, Docker, Kubernetes, CI/CD, Terraform"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Developer Tools</label>
                <input
                  type="text"
                  value={(formData.skills?.tools || []).join(', ')}
                  onChange={(e) => handleSkillsListChange('tools', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-mono"
                  placeholder="Git, GitHub, Postman, Jest, Linux"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/60">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md shadow-emerald-600/20"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply & Recalibrate ATS</span>
          </button>
        </div>

      </div>
    </div>
  );
}
