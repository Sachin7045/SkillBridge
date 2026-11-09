import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Command, 
  ChevronDown, 
  Upload, 
  LogOut, 
  User 
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';

export default function TopNavbar({
  activeTab,
  onOpenUpload,
  onOpenSamples,
  onOpenApiKey,
  hasApiKey,
  currentResumeName,
  currentResume = null,
  onPrint,
  theme,
  onToggleTheme,
  onToggleMobileSidebar,
  isMobileSidebarOpen,
  currentUser = null,
  onLogout = () => {},
  onOpenAuth = () => {},
  onUpdateUserName = () => {}
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'ATS Optimization Complete', desc: 'Score increased by +12% after STAR metrics rewrite.', time: '10m ago' },
    { id: 2, title: 'Mock Interview Ready', desc: 'System Design questions generated for target role.', time: '1h ago' },
    { id: 3, title: 'Skill Gap Detected', desc: '3 missing frameworks identified for DevOps Architect.', time: '3h ago' }
  ];

  const displayName = formatUserDisplayName(currentUser, currentResume);
  const displayRole = 'Full Stack Developer';

  return (
    <header className="sticky top-0 z-30 h-16 bg-gradient-to-r from-[#007C83] via-[#0D9488] to-[#007C83] border-b border-teal-700/50 shadow-md backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between gap-4 text-white">
      
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-teal-900/40 border border-teal-500/30 text-white hover:bg-teal-900/60 transition"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Global Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-teal-100/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes, skills, jobs, or anything..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-white/15 border border-white/25 text-white text-xs placeholder-teal-100/70 focus:outline-none focus:bg-white/25 focus:border-white focus:ring-1 focus:ring-teal-200 transition shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-teal-900/40 text-[10px] font-semibold text-teal-100 border border-teal-400/30">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Evaluation Engine Status, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Professional Engine Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-900/40 border border-teal-500/30 text-xs font-semibold text-teal-50">
          <span className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse" />
          <span>Evaluation Engine: Active</span>
        </div>

        {/* Notifications Icon with Counter */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-teal-900/40 border border-teal-500/30 text-teal-50 hover:bg-teal-900/60 hover:text-white text-xs transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0F766E] border border-white/40 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white text-slate-800 border border-teal-100 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-teal-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-[#0F766E] font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2.5">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-teal-50/60 hover:bg-teal-50 border border-teal-100 transition">
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-teal-700 font-medium">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-teal-900/40 border border-teal-500/30 text-teal-50 hover:bg-teal-900/60 hover:text-white text-xs transition"
          title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-teal-200" />
          ) : (
            <Sun className="w-4 h-4 text-amber-300" />
          )}
        </button>

        {/* User Avatar & Profile Pill */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-teal-900/40 border border-teal-500/30 hover:bg-teal-900/60 cursor-pointer transition text-white"
          >
            <div className="w-8 h-8 rounded-full bg-[#003B49] border border-teal-400/40 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                {displayName}
              </span>
              <span className="text-[10px] text-teal-100/80 truncate max-w-[110px]">
                {displayRole}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-teal-100/80 hidden sm:block" />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white text-slate-800 border border-teal-100 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-teal-100 mb-1">
                <div className="text-xs font-bold text-slate-900">{displayName}</div>
                <div className="text-[10px] text-slate-500 truncate">{currentUser?.email || 'sachin.yadav@email.com'}</div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenAuth(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-teal-50 transition"
              >
                <User className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenUpload(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-700 hover:text-slate-900 hover:bg-teal-50 transition"
              >
                <Upload className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Upload New Resume</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition mt-1 pt-1 border-t border-slate-100"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
