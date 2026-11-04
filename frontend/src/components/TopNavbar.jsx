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
    <header className="sticky top-0 z-30 h-16 bg-[#0a0e17]/95 border-b border-slate-800/80 backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between gap-4">
      
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Global Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes, skills, jobs, or anything..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-semibold text-slate-400 border border-slate-700/50">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Evaluation Engine Status, Notifications, Theme, Profile */}
      <div className="flex items-center gap-3 shrink-0">
        
        {/* Professional Engine Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Evaluation Engine: Active</span>
        </div>

        {/* Notifications Icon with Counter */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center shadow-md">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-blue-400 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="space-y-2.5">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-white/5 transition">
                    <div className="text-xs font-bold text-white flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs transition"
          title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-blue-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* User Avatar & Profile Pill */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition"
          >
            <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-white leading-tight truncate max-w-[110px]">
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                {displayRole}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2 border-b border-slate-800 mb-1">
                <div className="text-xs font-bold text-white">{displayName}</div>
                <div className="text-[10px] text-slate-400">{currentUser?.email || 'sachin.yadav@email.com'}</div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenAuth(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <User className="w-3.5 h-3.5 text-blue-400" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenUpload(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span>Upload New Resume</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-950/30 transition mt-1 pt-1 border-t border-slate-800"
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
