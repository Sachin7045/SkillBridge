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
  Sparkles,
  Crown,
  ArrowRight,
  LogIn,
  LogOut,
  ChevronDown,
  Star
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';

export default function Sidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  atsScore = 78,
  currentUser = null,
  currentResume = null,
  onLogout = () => {}
}) {
  const displayName = formatUserDisplayName(currentUser, currentResume);
  const primaryNav = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'visualizer', label: 'Resume Visualizer', icon: FileText, badge: null },
    { id: 'analyzer', label: 'ATS Analyzer', icon: ShieldCheck, badge: null },
    { id: 'highlights', label: 'Resume Highlights', icon: Star, badge: 'NEW' },
    { id: 'matcher', label: 'Job Matcher', icon: Search, badge: null, hasDropdown: true },
    { id: 'interview', label: 'AI Interviewer', icon: Mic, badge: null },
    { id: 'roadmap', label: 'Career Roadmap', icon: GitFork, badge: null },
    { id: 'bullet', label: 'STAR Optimizer', icon: Wand2, badge: null },
    { id: 'github', label: 'GitHub Analyzer', icon: GitBranch, badge: null },
    { id: 'applications', label: 'Job Applications', icon: Briefcase, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null },
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#020817] border-r border-[#0B1933] backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Brand & Collapser */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#0B1933]">
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            {/* Logo Icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#258BFF] via-[#773BFF] to-[#16D9F5] p-[1.5px] shadow-lg shadow-[#258BFF]/20 shrink-0 transition-transform group-hover:scale-105">
              <div className="w-full h-full bg-[#020817] rounded-[10px] flex items-center justify-center">
                <span className="font-extrabold text-base bg-gradient-to-r from-[#16D9F5] to-[#258BFF] bg-clip-text text-transparent">
                  S
                </span>
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-syne font-bold text-base text-white tracking-tight truncate">
                    Skill<span className="text-[#16D9F5]">Bridge</span>
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate">AI Resume Intelligence & Career Accelerator</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#07152B] transition"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Item List */}
        <div className="p-3 space-y-1.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#258BFF] text-white font-semibold shadow-lg shadow-[#258BFF]/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-[#07152B]'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#16D9F5]'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-amber-500/20 text-amber-400'
                        }`}>{item.badge}</span>
                      )}
                      {item.hasDropdown && (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                      )}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Area: Upgrade to Pro & Profile */}
      <div className="p-3 space-y-3 border-t border-[#0B1933]">
        {/* Upgrade to Pro Card */}
        {!isCollapsed && (
          <div className="relative overflow-hidden rounded-2xl p-3.5 bg-gradient-to-br from-[#07152B] via-[#0B1933] to-[#07152B] border border-[#258BFF]/25 shadow-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug mb-3">
              Unlock premium features, advanced AI & more.
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#258BFF] via-[#773BFF] to-[#258BFF] text-white text-xs font-bold shadow-md shadow-[#258BFF]/30 hover:opacity-95 transition flex items-center justify-center gap-1.5"
            >
              <span>Go Pro</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* User Profile Pill at Bottom */}
        <div className={`p-2 rounded-xl bg-[#07152B] border border-[#0B1933] flex items-center justify-between ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div 
            onClick={() => setActiveTab('login')} 
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
            title="View Profile / Account Settings"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#258BFF] to-[#16D9F5] p-[1px] shrink-0 overflow-hidden shadow-md">
              <div className="w-full h-full bg-[#020817] rounded-full flex items-center justify-center text-xs font-bold text-white">
                {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {currentUser?.email || 'sachin.yadav@email.com'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && currentUser && (
            <button
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-400 hover:bg-[#0B1933] rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {!isCollapsed && !currentUser && (
            <button
              onClick={() => setActiveTab('login')}
              className="p-1 text-slate-400 hover:text-[#16D9F5] hover:bg-[#0B1933] rounded-lg transition"
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
