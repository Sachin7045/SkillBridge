import React, { useEffect, useState } from "react";
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
  Sparkles,
  Cpu,
  Upload,
  Save,
  Cloud,
  CheckCircle2,
  Search,
  Printer,
  Download
} from "lucide-react";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import ResumeEditModal from "./ResumeEditModal";
import { highlightKeywords } from "./ResumeHighlights";

export default function ResumeVisualizer({
  resume = {},
  onUpdateResume = () => {},
  onResumeUpload,
  currentUser = null,
  onSaveToCloud = null,
  highlightKeywords: kwList = []
}) {
  const [template, setTemplate] = useState("modern");
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editableResume, setEditableResume] = useState(resume);
  const [readingResume, setReadingResume] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync resume whenever parent data changes
  useEffect(() => {
    setEditableResume(resume || {});
  }, [resume]);

  // Handle resume upload
  const handleResumeUpload = async (file) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "text/plain",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const isValidType =
      allowedTypes.includes(file.type) ||
      file.name.toLowerCase().endsWith(".pdf") ||
      file.name.toLowerCase().endsWith(".docx") ||
      file.name.toLowerCase().endsWith(".txt");

    if (!isValidType) {
      alert("Please upload a PDF or DOCX resume.");
      return;
    }

    setReadingResume(true);

    try {
      // If parent component provides upload functionality,
      // send the file to the parent.
      if (onResumeUpload) {
        await onResumeUpload(file);
      } else {
        // Temporary local upload handling.
        // Backend resume parsing can be connected here later.
        console.log("Resume selected:", file.name);

        alert(
          'Resume "' +
            file.name +
            '" selected successfully. Connect your backend parser to analyze it.'
        );
      }
    } catch (error) {
      console.error("Resume upload error:", error);
      alert("Unable to upload resume. Please try again.");
    } finally {
      setReadingResume(false);
    }
  };

  // Save edits
  const handleSaveEdits = () => {
    setIsEditing(false);
    onUpdateResume(editableResume);
  };

  // Skills data for radar chart
  const skills = editableResume?.skills || {};

  const radarData = [
    {
      subject: "Languages",
      A: Math.min(10, (skills.languages?.length || 0) * 2),
      fullMark: 10,
    },
    {
      subject: "Frameworks",
      A: Math.min(10, (skills.frameworks?.length || 0) * 2),
      fullMark: 10,
    },
    {
      subject: "Databases",
      A: Math.min(10, (skills.databases?.length || 0) * 3.3),
      fullMark: 10,
    },
    {
      subject: "Cloud/DevOps",
      A: Math.min(10, (skills.cloudAndDevops?.length || 0) * 3),
      fullMark: 10,
    },
    {
      subject: "Tools",
      A: Math.min(10, (skills.tools?.length || 0) * 2.5),
      fullMark: 10,
    },
    {
      subject: "Soft Skills",
      A: Math.min(10, (skills.softSkills?.length || 0) * 2.5),
      fullMark: 10,
    },
  ];

  return (
    <div className="space-y-6">

      {/* =========================
          TOP CONTROL BAR (Executive Glass Surface)
      ========================== */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/90 shadow-xl backdrop-blur-xl">

        <div className="flex flex-wrap items-center gap-4">

          {/* Upload Resume Button */}
          <label className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl cursor-pointer transition shadow-md shadow-indigo-600/25 group">
            <Upload className="w-3.5 h-3.5 transition-transform group-hover:-translate-y-0.5" />
            <span>{readingResume ? "Analyzing File..." : "Upload New Resume"}</span>
            <input
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              className="hidden"
              disabled={readingResume}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleResumeUpload(file);
                }
                e.target.value = "";
              }}
            />
          </label>

          {/* Template Switcher */}
          <div className="flex items-center gap-2 border-l border-slate-800 pl-4">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Layout className="w-3.5 h-3.5 text-indigo-400" />
              Layout:
            </span>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/90 shadow-inner">
              <button
                type="button"
                onClick={() => setTemplate("modern")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  template === "modern"
                    ? "bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Modern Tech
              </button>

              <button
                type="button"
                onClick={() => setTemplate("executive")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  template === "executive"
                    ? "bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Executive Clean
              </button>

              <button
                type="button"
                onClick={() => setTemplate("cards")}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
                  template === "cards"
                    ? "bg-slate-800 text-white font-semibold border border-slate-700/80 shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Visual Grid
              </button>
            </div>
          </div>
        </div>

        {/* Edit Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 rounded-xl transition shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Structured Section Editor</span>
          </button>

          {/* Cloud Database Save Button */}
          {onSaveToCloud && (
            <button
              type="button"
              disabled={isSavingCloud}
              onClick={async () => {
                setIsSavingCloud(true);
                try {
                  await onSaveToCloud(editableResume);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 3000);
                } finally {
                  setIsSavingCloud(false);
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl transition shadow-sm ${
                savedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80'
              }`}
              title="Save resume to your profile in database"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Saved to Cloud</span>
                </>
              ) : isSavingCloud ? (
                <>
                  <Cloud className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Save to Cloud</span>
                </>
              )}
            </button>
          )}

          {/* Print / Save to PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition shadow-sm"
            title="Print or Save Resume as PDF via browser"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          {isEditing ? (
            <button
              type="button"
              onClick={handleSaveEdits}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-md shadow-emerald-600/25"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Inline</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/80 rounded-xl transition shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inline Edit</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* =========================
            LEFT COLUMN
        ========================== */}
        <div className="lg:col-span-4 space-y-6">

          {/* Skills Radar */}
          <div className="pro-card p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">

            <div className="flex items-center justify-between mb-2">

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                Technical Competency Radar
              </h3>

              <span className="text-[10px] text-indigo-300 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20 font-semibold">
                Calibrated
              </span>

            </div>

            <div className="w-full h-56 -my-2">

              <ResponsiveContainer width="100%" height="100%">

                <RadarChart data={radarData}>

                  <PolarGrid stroke="#1e293b" />

                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{
                      fill: "#94a3b8",
                      fontSize: 10,
                      fontWeight: 500
                    }}
                  />

                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 10]}
                    stroke="#334155"
                    tick={false}
                  />

                  <Radar
                    name="Skills"
                    dataKey="A"
                    stroke="#818cf8"
                    strokeWidth={2}
                    fill="#6366f1"
                    fillOpacity={0.35}
                  />

                </RadarChart>

              </ResponsiveContainer>

            </div>

            <div className="grid grid-cols-2 gap-2 text-center pt-3 border-t border-slate-800/80">

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">

                <div className="text-base font-bold text-white">
                  {(skills.languages?.length || 0) +
                    (skills.frameworks?.length || 0)}
                </div>

                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Core Technologies
                </div>

              </div>

              <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">

                <div className="text-base font-bold text-indigo-400">
                  {editableResume.experience?.length || 0}
                </div>

                <div className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">
                  Career Milestones
                </div>

              </div>

            </div>

          </div>

          {/* Categorized Skills */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Categorized Skills
            </h3>

            {Object.entries(skills).map(([category, list]) => {
              if (!Array.isArray(list) || list.length === 0) {
                return null;
              }

              const formattedName = category
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase());

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

            {Object.keys(skills).length === 0 && (
              <p className="text-xs text-slate-500">
                No skills available. Upload a resume to analyze skills.
              </p>
            )}

          </div>

          {/* Certifications */}
          {editableResume.certifications?.length > 0 && (

            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">

              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                Certifications
              </h3>

              <ul className="space-y-1.5 text-xs text-slate-300">

                {editableResume.certifications.map((cert, idx) => (

                  <li
                    key={idx}
                    className="flex items-start gap-2"
                  >

                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />

                    <span>{cert}</span>

                  </li>

                ))}

              </ul>

            </div>
          )}

        </div>

        {/* =========================
            RIGHT RESUME
        ========================== */}
        <div className="lg:col-span-8">

          <div
            className={`print-area rounded-3xl transition-all duration-300 p-8 sm:p-10 ${
              template === "modern"
                ? "bg-slate-900/90 border border-indigo-500/30 shadow-2xl shadow-black/60 relative overflow-hidden"
                : template === "executive"
                ? "bg-[#090d16] border border-slate-700/80 text-slate-100 shadow-2xl"
                : "bg-slate-900/60 border border-slate-800 shadow-xl"
            }`}
          >
            {template === "modern" && (
              <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
            )}

            {/* =========================
                HEADER
            ========================== */}
            <div
              className={`pb-6 border-b ${
                template === "modern"
                  ? "border-slate-800/80"
                  : "border-slate-800"
              }`}
            >

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <div>

                  {isEditing ? (

                    <div className="space-y-2">

                      <input
                        type="text"
                        value={editableResume.name || ""}
                        onChange={(e) =>
                          setEditableResume({
                            ...editableResume,
                            name: e.target.value,
                          })
                        }
                        className="text-2xl font-black bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-white w-full"
                        placeholder="Full Name"
                      />

                      <input
                        type="text"
                        value={editableResume.title || ""}
                        onChange={(e) =>
                          setEditableResume({
                            ...editableResume,
                            title: e.target.value,
                          })
                        }
                        className="text-sm font-semibold bg-slate-950 border border-slate-700 rounded px-2 py-1 text-cyan-400 w-full"
                        placeholder="Professional Title"
                      />

                    </div>

                  ) : (

                    <>
                      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                        {editableResume.name || "Your Name"}
                      </h1>

                      <p className="text-sm sm:text-base font-semibold text-cyan-400 mt-1">
                        {editableResume.title || "Professional Title"}
                      </p>
                    </>

                  )}

                </div>

                {/* Contact */}
                <div className="flex flex-wrap sm:flex-col sm:items-end gap-2 text-xs text-slate-400">

                  {editableResume.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" />
                      {editableResume.email}
                    </span>
                  )}

                  {editableResume.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-indigo-400" />
                      {editableResume.phone}
                    </span>
                  )}

                  {editableResume.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                      {editableResume.location}
                    </span>
                  )}

                </div>

              </div>

              {/* Social links */}
              {(editableResume.links?.linkedin ||
                editableResume.links?.github) && (

                <div className="flex flex-wrap items-center gap-3 pt-4 mt-4 border-t border-slate-800/60 text-xs">

                  {editableResume.links?.linkedin && (
                    <a
                      href={editableResume.links.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                    >
                      <Linkedin className="w-3.5 h-3.5" />
                      LinkedIn Profile
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
                      GitHub Profile
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                </div>
              )}

            </div>

            {/* =========================
                SUMMARY
            ========================== */}
            {editableResume.summary && (

              <div className="py-5 border-b border-slate-800/80">

                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Professional Profile
                  {kwList.length > 0 && (
                    <span className="ml-auto text-[10px] text-amber-400 flex items-center gap-1 font-normal normal-case tracking-normal">
                      <Search className="w-3 h-3" />{kwList.length} keyword{kwList.length > 1 ? 's' : ''} highlighted
                    </span>
                  )}
                </h2>

                {isEditing ? (

                  <textarea
                    rows={4}
                    value={editableResume.summary || ""}
                    onChange={(e) =>
                      setEditableResume({
                        ...editableResume,
                        summary: e.target.value,
                      })
                    }
                    className="w-full text-xs sm:text-sm bg-slate-950 border border-slate-700 rounded p-2 text-slate-200 leading-relaxed font-sans"
                  />

                ) : (

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {highlightKeywords(editableResume.summary, kwList)}
                  </p>

                )}

              </div>
            )}

            {/* =========================
                EXPERIENCE
            ========================== */}
            {editableResume.experience?.length > 0 && (

              <div className="py-6 border-b border-slate-800/80">

                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Work Experience Timeline
                </h2>

                <div className={template === "cards" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-6"}>

                  {editableResume.experience.map((exp, idx) => (

                    <div
                      key={idx}
                      className={
                        template === "cards"
                          ? "p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 hover:border-slate-700 transition"
                          : template === "executive"
                          ? "pb-5 border-b border-slate-800/60 last:border-0"
                          : "relative pl-7"
                      }
                    >

                      {template === "modern" && (
                        <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-indigo-400" />
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">

                        <div>

                          <h3 className={`font-bold ${template === "executive" ? "text-base text-slate-100 font-serif" : "text-sm sm:text-base text-white"}`}>
                            {exp.role || "Position"}
                          </h3>

                          <p className={`text-xs font-semibold ${template === "executive" ? "text-slate-400" : "text-indigo-300"}`}>
                            {exp.company || "Company"}
                            {exp.location && ` • ${exp.location}`}
                          </p>

                        </div>

                        {exp.period && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                            template === "executive"
                              ? "text-slate-400 bg-transparent border-0 font-serif italic"
                              : "text-slate-400 bg-slate-950/80 border border-slate-800"
                          }`}>
                            {exp.period}
                          </span>
                        )}

                      </div>

                      <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">

                        {(exp.bullets || []).map((bullet, bIdx) => (

                          <li
                            key={bIdx}
                            className="flex items-start gap-2"
                          >

                            <span className={`w-1.5 h-1.5 rounded-full mt-2 shrink-0 ${
                              template === "executive" ? "bg-slate-400" : "bg-slate-600"
                            }`} />

                            <span className={`leading-relaxed ${template === "executive" ? "text-slate-300 font-serif" : ""}`}>
                              {highlightKeywords(bullet, kwList)}
                            </span>

                          </li>

                        ))}

                      </ul>

                    </div>

                  ))}

                </div>

              </div>
            )}

            {/* =========================
                PROJECTS
            ========================== */}
            {editableResume.projects?.length > 0 && (

              <div className="py-6 border-b border-slate-800/80">

                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  Featured Technical Projects
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {editableResume.projects.map((proj, idx) => (

                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 transition"
                    >

                      <div className="flex items-center justify-between mb-1.5">

                        <h3 className="text-sm font-bold text-white">
                          {proj.name || "Project"}
                        </h3>

                        {proj.link && (
                          <a
                            href={proj.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:text-indigo-300"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                      </div>

                      <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                        {highlightKeywords(proj.description, kwList)}
                      </p>

                      <div className="flex flex-wrap gap-1">

                        {(proj.tech || []).map((tech, tIdx) => (

                          <span
                            key={tIdx}
                            className="text-[10px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800"
                          >
                            {tech}
                          </span>

                        ))}

                      </div>

                    </div>

                  ))}

                </div>

              </div>
            )}

            {/* =========================
                EDUCATION
            ========================== */}
            {editableResume.education?.length > 0 && (

              <div className="pt-6">

                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                  Education & Honors
                </h2>

                <div className="space-y-3">

                  {editableResume.education.map((edu, idx) => (

                    <div
                      key={idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                    >

                      <div>

                        <span className="font-bold text-white">
                          {edu.degree || "Degree"}
                        </span>

                        {edu.institution && (
                          <span className="text-slate-400">
                            {" "}
                            — {edu.institution}
                            {edu.location && ` (${edu.location})`}
                          </span>
                        )}

                        {edu.honors && (
                          <p className="text-[11px] text-amber-400 font-medium">
                            {edu.honors}
                          </p>
                        )}

                      </div>

                      <div className="text-slate-400 font-medium">
                        {edu.year}

                        {edu.gpa && (
                          <> • GPA: {edu.gpa}</>
                        )}
                      </div>

                    </div>

                  ))}

                </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* Structured Multi-Section Editor Modal */}
      <ResumeEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        resume={editableResume}
        onSave={(updated) => {
          setEditableResume(updated);
          onUpdateResume(updated);
        }}
      />

    </div>
  );
}
