import React, { useState } from 'react';
import { 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Award, 
  MapPin, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  ExternalLink,
  Edit3,
  Check,
  Layout,
  Layers,
  Sparkles,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function ResumeVisualizer({ resume, onUpdateResume }) {
  const [template, setTemplate] = useState('modern'); // 'modern' | 'executive' | 'cards'
  const [isEditing, setIsEditing] = useState(false);
  const [editableResume, setEditableResume] = useState(resume);

  // Sync if resume prop changes
  React.useEffect(() => {
    setEditableResume(resume);
  }, [resume]);

  const handleSaveEdits = () => {
    setIsEditing(false);
    onUpdateResume(editableResume);
  };

  // Prepare radar chart data for skills
  const radarData = [
    { subject: 'Languages', A: Math.min(10, (editableResume.skills?.languages?.length || 3) * 2), fullMark: 10 },
    { subject: 'Frameworks', A: Math.min(10, (editableResume.skills?.frameworks?.length || 4) * 2), fullMark: 10 },
    { subject: 'Databases', A: Math.min(10, (editableResume.skills?.databases?.length || 2) * 3.3), fullMark: 10 },
    { subject: 'Cloud/DevOps', A: Math.min(10, (editableResume.skills?.cloudAndDevops?.length || 2) * 3), fullMark: 10 },
    { subject: 'Tools', A: Math.min(10, (editableResume.skills?.tools?.length || 3) * 2.5), fullMark: 10 },
    { subject: 'Soft Skills', A: Math.min(10, (editableResume.skills?.softSkills?.length || 3) * 2.5), fullMark: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2"> <label className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer transition">
  <input
    type="file"
    accept=".pdf,.docx"
    className="hidden"
    onChange={(e) => {
      const file = e.target.files?.[0];

      if (file) {
        handleResumeUpload(file);
      }
    }}
  />

  {readingResume ? 'Reading...' : 'Upload Resume'}
</label>
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-indigo-400" />
            Template:
          </span>
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setTemplate('modern')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                template === 'modern' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Modern Tech
            </button>
            <button
              onClick={() => setTemplate('executive')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                template === 'executive' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Clean
            </button>
            <button
              onClick={() => setTemplate('cards')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                template === 'cards' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Visual Grid
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <button
              onClick={handleSaveEdits}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-600/20 transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Quick Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Resume Canvas Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Interactive / Radar Summary Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Skills Radar Card */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Technical Competency Radar
              </h3>
              <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                Balanced
              </span>
            </div>
            
            <div className="w-full h-56 -my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#475569" tick={false} />
                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.45}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t border-slate-800/80">
              <div className="p-2 rounded-xl bg-slate-950/60">
                <div className="text-base font-bold text-white">
                  {(editableResume.skills?.languages?.length || 0) + (editableResume.skills?.frameworks?.length || 0)}
                </div>
                <div className="text-[10px] text-slate-400">Core Tech Stacks</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60">
                <div className="text-base font-bold text-indigo-400">
                  {editableResume.experience?.length || 0}
                </div>
                <div className="text-[10px] text-slate-400">Career Positions</div>
              </div>
            </div>
          </div>

          {/* Quick Categorized Skills List */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Categorized Skills
            </h3>

            {Object.entries(editableResume.skills || {}).map(([category, list]) => {
              if (!Array.isArray(list) || list.length === 0) return null;
              const formattedName = category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              return (
                <div key={category} className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                    {formattedName}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {list.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs rounded-md bg-slate-900 border border-slate-700/80 text-slate-200"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certifications & Education Highlight */}
          {editableResume.certifications && editableResume.certifications.length > 0 && (
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Certifications
              </h3>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {editableResume.certifications.map((cert, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Right Resume Document Render Column */}
        <div className="lg:col-span-8">
          
          {/* Resume Paper Shell */}
          <div className={`print-area rounded-2xl transition-all duration-300 p-6 sm:p-8 ${
            template === 'modern'
              ? 'bg-slate-900/90 border border-indigo-500/20 shadow-xl shadow-indigo-950/40'
              : template === 'executive'
              ? 'bg-slate-950 border border-slate-700 text-slate-100 shadow-2xl'
              : 'bg-slate-900/50 border border-slate-800'
          }`}>
            
            {/* Header / Contact Area */}
            <div className={`pb-6 border-b ${template === 'modern' ? 'border-indigo-500/20' : 'border-slate-800'}`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={editableResume.name || ''}
                        onChange={(e) => setEditableResume({ ...editableResume, name: e.target.value })}
                        className="text-2xl font-black bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-white w-full"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        value={editableResume.title || ''}
                        onChange={(e) => setEditableResume({ ...editableResume, title: e.target.value })}
                        className="text-sm font-semibold bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-400 w-full"
                        placeholder="Professional Title"
                      />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {editableResume.name}
                      </h1>
                      <p className="text-sm sm:text-base font-semibold text-cyan-400 mt-1">
                        {editableResume.title}
                      </p>
                    </>
                  )}
                </div>

                {/* Contact Badges */}
                <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs text-slate-400">
                  {editableResume.email && (
                    <span className="flex items-center gap-1.5 hover:text-slate-200">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {editableResume.email}
                    </span>
                  )}
                  {editableResume.phone && (
                    <span className="flex items-center gap-1.5 hover:text-slate-200">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      {editableResume.phone}
                    </span>
                  )}
                  {editableResume.location && (
                    <span className="flex items-center gap-1.5 hover:text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {editableResume.location}
                    </span>
                  )}
                </div>
              </div>

              {/* Social Links Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-slate-800/60 text-xs">
                {editableResume.links?.linkedin && (
                  <a
                    href={editableResume.links.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                    <span>LinkedIn Profile</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
                {editableResume.links?.github && (
                  <a
                    href={editableResume.links.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub Repos</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>

            {/* Summary Section */}
            {editableResume.summary && (
              <div className="py-5 border-b border-slate-800/80">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Professional Profile
                </h2>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={editableResume.summary}
                    onChange={(e) => setEditableResume({ ...editableResume, summary: e.target.value })}
                    className="w-full text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 leading-relaxed font-sans"
                  />
                ) : (
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {editableResume.summary}
                  </p>
                )}
              </div>
            )}

            {/* Work Experience Section */}
            <div className="py-6 border-b border-slate-800/80">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Work Experience Timeline
              </h2>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-indigo-500/40 before:to-transparent">
                {(editableResume.experience || []).map((exp, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    {/* Timeline Node Icon */}
                    <div className="absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border-2 border-indigo-400 group-hover:border-cyan-400 group-hover:scale-110 transition-all flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-bold text-white">
                          {exp.role}
                        </h3>
                        <p className="text-xs font-semibold text-indigo-300">
                          {exp.company} {exp.location && `• ${exp.location}`}
                        </p>
                      </div>
                      <span className="text-xs font-medium text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 self-start sm:self-auto">
                        {exp.period}
                      </span>
                    </div>

                    {/* Bullet Points with highlight metrics */}
                    <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
                      {(exp.bullets || []).map((bullet, bIdx) => {
                        // Highlight numbers or percentages
                        const parts = bullet.split(/(\b\d+[\d,.]*\s*(?:%|\$|k|m|users|hours|days|x)?|\$\d+)/i);
                        return (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0 group-hover:bg-cyan-400 transition" />
                            <span className="leading-relaxed">
                              {parts.map((p, pIdx) => {
                                if (/(\d+[%$kKmMxX]?|\$\d+)/.test(p)) {
                                  return (
                                    <span key={pIdx} className="font-semibold text-cyan-300 underline decoration-cyan-500/40 decoration-wavy">
                                      {p}
                                    </span>
                                  );
                                }
                                return p;
                              })}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Featured Projects Section */}
            {editableResume.projects && editableResume.projects.length > 0 && (
              <div className="py-6 border-b border-slate-800/80">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Featured Technical Projects
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {editableResume.projects.map((proj, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-center justify-between mb-1.5">
                        <h3 className="text-sm font-bold text-white">{proj.name}</h3>
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {(proj.tech || []).map((t, tIdx) => (
                          <span key={tIdx} className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education Section */}
            {editableResume.education && editableResume.education.length > 0 && (
              <div className="pt-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  Education & Honors
                </h2>

                <div className="space-y-2">
                  {editableResume.education.map((edu, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                      <div>
                        <span className="font-bold text-white">{edu.degree}</span>
                        <span className="text-slate-400"> — {edu.institution} {edu.location && `(${edu.location})`}</span>
                        {edu.honors && <p className="text-[11px] text-amber-400 font-medium">{edu.honors}</p>}
                      </div>
                      <div className="text-slate-400 font-medium self-start sm:self-auto">
                        {edu.year} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
