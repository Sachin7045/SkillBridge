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
  Star,
  MessageSquare
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
    { id: 'highlights', label: 'Resume Highlights', icon: Star, badge: 'AUDIT' },
    { id: 'chat', label: 'AI Career Chatbot', icon: MessageSquare, badge: 'NEW' },
    { id: 'matcher', label: 'Job Matcher', icon: Search, badge: null, hasDropdown: true },
    { id: 'interview', label: 'Technical Mock Interview', icon: Mic, badge: null },
    { id: 'roadmap', label: 'Career Roadmap', icon: GitFork, badge: null },
    { id: 'bullet', label: 'STAR Bullet Polisher', icon: Wand2, badge: null },
    { id: 'github', label: 'GitHub Analyzer', icon: GitBranch, badge: null },
    { id: 'applications', label: 'Job Applications', icon: Briefcase, badge: null },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, badge: null },
  ];

  return (
    <aside 
      className={`fixed top-0 bottom-0 left-0 z-40 bg-[#003B49] border-r border-[#002833] shadow-2xl transition-all duration-300 flex flex-col justify-between select-none ${
        isCollapsed ? 'w-[72px]' : 'w-64'
      }`}
    >
      {/* Top Brand & Collapser */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#002D38]">
          <div 
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 cursor-pointer group overflow-hidden"
          >
            {/* Logo Icon */}
            <div className="w-9 h-9 rounded-xl bg-[#0F766E] border border-[#14B8A6]/40 text-white flex items-center justify-center shadow-md shadow-teal-950/40 shrink-0 transition-transform group-hover:scale-105 font-black text-base">
              S
            </div>

            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-syne font-bold text-base text-white tracking-tight truncate">
                    Skill<span className="text-[#14B8A6]">Bridge</span>
                  </span>
                </div>
                <span className="text-[10px] text-teal-200/70 truncate">Career Platform & Resume Studio</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-teal-200/60 hover:text-white hover:bg-[#002D38] transition"
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
                    ? 'bg-[#0F766E] text-white font-semibold shadow-md shadow-[#00222a]/50 border-l-4 border-[#14B8A6]'
                    : 'text-teal-100/70 hover:text-white hover:bg-white/10'
                } ${isCollapsed ? 'justify-center' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-teal-200/60 group-hover:text-[#14B8A6]'
                }`} />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between min-w-0">
                    <span className="truncate">{item.label}</span>
                    <div className="flex items-center gap-1">
                      {item.badge && (
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                          isActive ? 'bg-white/20 text-white' : 'bg-[#14B8A6]/20 text-[#14B8A6] border border-[#14B8A6]/30'
                        }`}>{item.badge}</span>
                      )}
                      {item.hasDropdown && (
                        <ChevronDown className="w-3.5 h-3.5 text-teal-200/50 group-hover:text-teal-100" />
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
      <div className="p-3 space-y-3 border-t border-[#002D38]">
        {/* Upgrade to Pro Card */}
        {!isCollapsed && (
          <div className="relative overflow-hidden rounded-2xl p-3.5 bg-[#002B35] border border-teal-500/20 shadow-xl">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="w-6 h-6 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                <Crown className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-white tracking-wide">Professional Tier</span>
            </div>
            <p className="text-[11px] text-teal-100/70 leading-snug mb-3">
              Unlock senior benchmarks, unlimited interview practice & ATS diagnostics.
            </p>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-1.5 px-3 rounded-xl bg-[#0F766E] hover:bg-[#0D9488] text-white text-xs font-bold shadow-md shadow-[#00222a]/40 transition flex items-center justify-center gap-1.5"
            >
              <span>View Plans</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* User Profile Pill at Bottom */}
        <div className={`p-2 rounded-xl bg-[#002B35] border border-teal-500/20 flex items-center justify-between ${
          isCollapsed ? 'justify-center' : ''
        }`}>
          <div 
            onClick={() => setActiveTab('login')} 
            className="flex items-center gap-2.5 cursor-pointer min-w-0"
            title="View Profile / Account Settings"
          >
            <div className="w-8 h-8 rounded-full bg-[#003B49] border border-teal-400/40 flex items-center justify-center text-xs font-bold text-white shrink-0 overflow-hidden shadow-sm">
              {displayName ? displayName.charAt(0).toUpperCase() : 'S'}
            </div>
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {displayName}
                </span>
                <span className="text-[10px] text-teal-200/70 truncate max-w-[120px]">
                  {currentUser?.email || 'sachin.yadav@email.com'}
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && currentUser && (
            <button
              onClick={onLogout}
              className="p-1 text-teal-200/70 hover:text-rose-400 hover:bg-[#002D38] rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}

          {!isCollapsed && !currentUser && (
            <button
              onClick={() => setActiveTab('login')}
              className="p-1 text-teal-200/70 hover:text-[#14B8A6] hover:bg-[#002D38] rounded-lg transition"
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
