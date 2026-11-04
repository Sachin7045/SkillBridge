import React from 'react';
import { 
  Sparkles, 
  FileText, 
  BarChart3, 
  Mic, 
  GitFork, 
  Wand2, 
  Upload, 
  KeyRound, 
  Download,
  Users,
  Mail,
  Disc
} from 'lucide-react';

export default function Header({ 
  activeTab, 
  setActiveTab, 
  onOpenUpload, 
  onOpenSamples, 
  onOpenApiKey, 
  hasApiKey,
  currentResumeName,
  onPrint
}) {
  const tabs = [
    { id: 'landing', label: 'Portal Hero', icon: Sparkles },
    { id: 'visualizer', label: 'Resume Visualizer', icon: FileText },
    { id: 'analyzer', label: 'ATS & JD Analyzer', icon: BarChart3 },
    { id: 'interview', label: 'Technical Mock Interview', icon: Mic },
    { id: 'roadmap', label: 'Skill Bridge', icon: GitFork },
    { id: 'bullet', label: 'STAR Optimizer', icon: Wand2 },
    { id: 'coverletter', label: 'Cover Letter', icon: Mail },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3.5 cursor-pointer group" onClick={() => setActiveTab('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-blue-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white font-syne">
                  Skill<span className="text-blue-400">Bridge</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/25">
                  Pro Studio
                </span>
              </div>
              {currentResumeName && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span className="truncate max-w-[190px] text-slate-300 font-medium">{currentResumeName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/90 shadow-inner">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSamples}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition shadow-sm"
              title="Load pre-built sample profiles"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Samples</span>
            </button>

            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition shadow-md shadow-blue-600/25"
              title="Upload PDF or TXT resume"
            >
              <Upload className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Upload</span>
            </button>

            <button
              onClick={onPrint}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-medium transition shadow-sm"
              title="Print or save as PDF"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export</span>
            </button>

            <button
              onClick={onOpenApiKey}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition border ${
                hasApiKey 
                  ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/40' 
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Configure Gemini API Key"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">{hasApiKey ? 'Cloud Engine' : 'Engine Key'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-900'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
