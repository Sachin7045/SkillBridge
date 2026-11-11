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

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  atsScore = 88,
  currentUser = null,
  currentResume = null,
  onLogout = () => {},
  onOpenHistory = () => {}
}) {
  const displayName = formatUserDisplayName(currentUser, currentResume);

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
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#031B35] border-r border-[#0b294c] shadow-2xl transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Brand & Collapser */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#0b294c]">
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            {/* Logo Icon with Neon Cyan Glow */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#006B83] to-[#004B63] border border-[#00E5FF]/40 text-white flex items-center justify-center shadow-lg shadow-[#00E5FF]/10 shrink-0 transition-transform group-hover:scale-105 font-black text-base">
              <span className="text-[#00E5FF]">S</span>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-syne font-bold text-base text-white tracking-tight truncate">
                    Skill<span className="text-[#00E5FF]">Bridge</span>
                  </span>
                </div>
                <span className="text-[10px] text-cyan-200/60 truncate">AI Career Accelerator</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-cyan-200/60 hover:text-white hover:bg-[#08284d] transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* AI Assistant Quick Shortcut Pill */}
        <div className="px-3 pt-3 pb-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-[#006B83] to-[#005266] text-white border-[#00E5FF] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                : 'bg-[#062445]/80 text-[#00E5FF] border-[#00E5FF]/30 hover:bg-[#082d56] hover:border-[#00E5FF]/60'
            } ${isCollapsed ? 'justify-center px-2' : ''}`}
            title={isCollapsed ? "AI Career Chatbot" : undefined}
          >
            <MessageSquare className="w-4 h-4 text-[#00E5FF] shrink-0 animate-pulse" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-left">
                <span className="truncate font-bold">AI Assistant</span>
                <span className="text-[9px] bg-[#00E5FF]/20 text-[#00E5FF] px-1.5 py-0.5 rounded font-extrabold uppercase">
                  GPT-4o
                </span>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="p-3 space-y-1">
          <div className={`px-2 py-1 text-[10px] font-bold tracking-wider uppercase text-cyan-300/40 ${isCollapsed ? 'hidden' : 'block'}`}>
            Main Menu
          </div>

          {primaryNav.map((item) => {
            const Icon = item.icon;
            // Check active state
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#006B83] to-[#004d61] text-white font-semibold shadow-md shadow-[#001828]/50 border-l-4 border-[#00E5FF]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#00E5FF]' : 'text-slate-400 group-hover:text-[#00E5FF]'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                      }`}>
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
      <div className="p-3 space-y-3 border-t border-[#0b294c]">
        {/* Upgrade to Pro Card */}
        {!isCollapsed && (
          <div className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-[#062445] to-[#031B35] border border-[#00E5FF]/25 shadow-xl">
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#00E5FF]/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0 border border-amber-400/30">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Pro AI Tier</span>
              <span className="ml-auto text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#00C9A7]/20 text-[#00C9A7] border border-[#00C9A7]/30">
                Active
              </span>
            </div>
            <p className="text-[11px] text-cyan-100/70 leading-snug mb-3">
              Unlock unlimited mock interviews, 100-point ATS diagnostics & AI cover letters.
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-1.5 px-3 rounded-xl bg-[#006B83] hover:bg-[#00829e] text-white text-xs font-bold shadow-md shadow-black/40 transition flex items-center justify-center gap-1.5 border border-[#00E5FF]/30"
            >
              <span>Manage Subscription</span>
              <ArrowRight className="w-3 h-3 text-[#00E5FF]" />
            </button>
          </div>
        )}

        {/* User Profile Pill at Bottom */}
        <div className={`p-2 rounded-xl bg-[#062445]/90 border border-cyan-500/20 flex items-center justify-between ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div 
            onClick={() => setActiveTab('login')} 
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
            title="View Profile / Account Settings"
          >
            <div className="w-8 h-8 rounded-full bg-[#006B83] border border-[#00E5FF]/50 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden shadow-sm">
              {displayName ? displayName.charAt(0).toUpperCase() : 'C'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-cyan-200/70 truncate max-w-[120px]">
                  {currentUser?.email || 'Active Candidate'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && currentUser && (
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-[#08284d] rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {!isCollapsed && !currentUser && (
            <button
              onClick={() => setActiveTab('login')}
              className="p-1 text-slate-400 hover:text-[#00E5FF] hover:bg-[#08284d] rounded-lg transition"
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
