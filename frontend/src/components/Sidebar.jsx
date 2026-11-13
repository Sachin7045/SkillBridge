import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  ShieldCheck, 
  Search, 
  Mic, 
  GitFork, 
  Wand2, 
  GitBranch,
  Briefcase,
  BarChart3, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Crown,
  ArrowRight,
  LogIn,
  LogOut,
  ChevronDown,
  Sparkles,
  MessageSquare,
  History,
  FileCheck
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';
import { getThemeById } from '../utils/themes';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  atsScore = 88,
  currentUser = null,
  currentResume = null,
  currentThemeId = 'teal',
  onLogout = () => {},
  onOpenHistory = () => {}
}) {
  const displayName = formatUserDisplayName(currentUser, currentResume);
  const activeTheme = getThemeById(currentThemeId);
  const p = activeTheme.palette;

  // Exact 11 core navigation items requested + AI Chatbot
  const primaryNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'analyzer', label: 'Resume Analyzer', icon: ShieldCheck, badge: null },
    { id: 'ats', label: 'ATS Checker', icon: FileCheck, badge: `${atsScore}%` },
    { id: 'visualizer', label: 'Resume Visualizer', icon: FileText, badge: null },
    { id: 'matcher', label: 'Job Matcher', icon: Search, badge: null },
    { id: 'coverletter', label: 'Cover Letter Generator', icon: Sparkles, badge: 'AI' },
    { id: 'interview', label: 'AI Interview Prep', icon: Mic, badge: 'HOT' },
    { id: 'skillgap', label: 'Skill Gap Analyzer', icon: GitBranch, badge: null },
    { id: 'roadmap', label: 'Career Roadmap', icon: GitFork, badge: null },
    { id: 'history', label: 'My History', icon: History, badge: null },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null },
  ];

  return (
    <aside 
      style={{
        backgroundColor: p.sidebar,
        borderColor: p.sidebarBorder
      }}
      className={`fixed top-0 bottom-0 left-0 z-40 border-r shadow-2xl transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Brand & Collapser */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div 
          style={{ borderColor: p.sidebarBorder }}
          className="h-16 flex items-center justify-between px-4 border-b"
        >
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            {/* Logo Icon with Dynamic Theme Glow */}
            <div 
              style={{
                background: p.sidebarActive,
                borderColor: p.accent
              }}
              className="w-9 h-9 rounded-xl border text-white flex items-center justify-center shadow-lg shrink-0 transition-transform group-hover:scale-105 font-black text-base"
            >
              <span style={{ color: p.accent }}>S</span>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-syne font-bold text-base text-white tracking-tight truncate">
                    Skill<span style={{ color: p.accent }}>Bridge</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-300/60 truncate">AI Career Accelerator</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Assistant Quick Shortcut Pill */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setActiveTab('chat')}
            style={{
              borderColor: activeTab === 'chat' ? p.accent : `${p.accent}40`,
              background: activeTab === 'chat' ? p.sidebarActive : 'rgba(255,255,255,0.06)'
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeTab === 'chat'
                ? 'text-white shadow-md'
                : 'text-slate-200 hover:bg-white/10'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? "AI Career Chatbot" : undefined}
          >
            <MessageSquare style={{ color: p.accent }} className="w-4 h-4 shrink-0 animate-pulse" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span className="truncate font-bold text-white">AI Assistant</span>
                <span 
                  style={{ backgroundColor: `${p.accent}25`, color: p.accent }}
                  className="text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase"
                >
                  GPT-4o
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="p-3 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-slate-400/60 ${isCollapsed ? 'hidden' : 'block'}`}>
            Main Menu
          </div>

          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || 
              (item.id === 'ats' && activeTab === 'ats') ||
              (item.id === 'skillgap' && activeTab === 'skillgap') ||
              (item.id === 'history' && activeTab === 'history');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'history') {
                    onOpenHistory();
                  } else {
                    setActiveTab(item.id);
                  }
                }}
                title={isCollapsed ? item.label : undefined}
                style={isActive ? {
                  background: p.sidebarActive,
                  borderLeftColor: p.sidebarActiveBorder || p.accent
                } : {}}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'text-white font-semibold shadow-md border-l-4'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon 
                  style={isActive ? { color: p.accent } : {}}
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? '' : 'text-slate-400 group-hover:text-white'
                  }`} 
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span 
                        style={isActive ? {
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: '#FFFFFF'
                        } : {
                          backgroundColor: `${p.accent}20`,
                          color: p.accent,
                          borderColor: `${p.accent}40`
                        }}
                        className="text-[9px] font-extrabold px-1.5 py-0.5 rounded border"
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Area: Upgrade to Pro & Profile */}
      <div 
        style={{ borderColor: p.sidebarBorder }}
        className="p-3 space-y-3 border-t"
      >
        {/* Upgrade to Pro Card */}
        {!isCollapsed && (
          <div 
            style={{ 
              borderColor: `${p.accent}30`,
              background: 'linear-gradient(to bottom right, rgba(255,255,255,0.07), rgba(0,0,0,0.2))' 
            }}
            className="relative overflow-hidden rounded-2xl p-3.5 border shadow-xl"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Pro AI Tier</span>
              <span 
                style={{ backgroundColor: `${p.accent}20`, color: p.accent, borderColor: `${p.accent}40` }}
                className="ml-auto text-[9px] font-black uppercase px-1.5 py-0.5 rounded border"
              >
                Active
              </span>
            </div>
            <p className="text-[11px] text-slate-300/80 leading-snug mb-3">
              Unlock unlimited mock interviews, 100-point ATS diagnostics & AI cover letters.
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              style={{
                backgroundColor: p.primary,
                color: p.primaryText,
                borderColor: `${p.accent}40`
              }}
              className="w-full py-1.5 px-3 rounded-xl hover:opacity-90 text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5 border"
            >
              <span>Manage Subscription</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* User Profile Pill at Bottom */}
        <div 
          style={{ 
            borderColor: `${p.accent}20`,
            background: 'rgba(255,255,255,0.05)'
          }}
          className={`p-2 rounded-xl border flex items-center justify-between ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div 
            onClick={() => setActiveTab('login')} 
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
            title="View Profile / Account Settings"
          >
            <div 
              style={{ 
                backgroundColor: p.primary, 
                borderColor: `${p.accent}60`,
                color: p.primaryText 
              }}
              className="w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden shadow-sm"
            >
              {displayName ? displayName.charAt(0).toUpperCase() : 'C'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-300/70 truncate max-w-[120px]">
                  {currentUser?.email || 'Active Candidate'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && currentUser && (
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-white/10 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {!isCollapsed && !currentUser && (
            <button
              onClick={() => setActiveTab('login')}
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition"
              title="Sign In"
            >
              <LogIn className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
