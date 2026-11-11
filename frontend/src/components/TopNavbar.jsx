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
  User,
  ShieldCheck,
  Sparkles,
  ExternalLink
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
    { id: 1, title: 'ATS Optimization Complete', desc: 'Score increased by +14% after STAR metrics rewrite.', time: '10m ago' },
    { id: 2, title: 'AI Mock Interview Ready', desc: 'Technical questions generated for target engineering role.', time: '1h ago' },
    { id: 3, title: 'Skill Gap Detected', desc: '3 missing frameworks identified for Cloud Architect.', time: '3h ago' }
  ];

  const displayName = formatUserDisplayName(currentUser, currentResume);
  const displayRole = currentResume?.targetRole || 'Full Stack Developer';
  const accountStatus = currentUser ? 'Verified Candidate' : 'Guest Preview';

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-xl border-b border-[#DCEAF5] shadow-sm px-4 sm:px-6 flex items-center justify-between gap-4 text-[#102A43]">
      
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-[#EFF8FF] border border-[#DCEAF5] text-[#102A43] hover:bg-[#DCEAF5]/60 transition"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Global Search Field with Ctrl + K */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes, skills, jobs, or diagnostics..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#EFF8FF] border border-[#DCEAF5] text-[#102A43] text-xs placeholder-[#64748B] focus:outline-none focus:bg-white focus:border-[#006B83] focus:ring-2 focus:ring-[#00E5FF]/20 transition shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white text-[10px] font-semibold text-[#64748B] border border-[#DCEAF5] shadow-sm">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Evaluation Engine Status, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        
        {/* Professional Engine Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF8FF] border border-[#DCEAF5] text-xs font-semibold text-[#006B83]">
          <span className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
          <span>AI Engine: Active</span>
        </div>

        {/* Notifications Icon with Counter */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-[#EFF8FF] border border-[#DCEAF5] text-[#102A43] hover:bg-[#DCEAF5]/60 text-xs transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#006B83]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#006B83] border border-white text-[#00E5FF] text-[9px] font-bold flex items-center justify-center shadow-md">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white text-[#102A43] border border-[#DCEAF5] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCEAF5]">
                <span className="text-xs font-bold text-[#102A43] uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-[#006B83] font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#EFF8FF] hover:bg-[#DCEAF5]/50 border border-[#DCEAF5] transition">
                    <div className="text-xs font-bold text-[#102A43] flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-[#006B83] font-medium">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-[#EFF8FF] border border-[#DCEAF5] text-[#102A43] hover:bg-[#DCEAF5]/60 text-xs transition"
          title={theme === 'dark' ? "Switch to Light Theme" : "Switch to Dark Theme"}
        >
          {theme === 'dark' ? (
            <Moon className="w-4 h-4 text-[#006B83]" />
          ) : (
            <Sun className="w-4 h-4 text-amber-500" />
          )}
        </button>

        {/* User Avatar & Profile Pill */}
        <div className="relative">
          <div 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#EFF8FF] border border-[#DCEAF5] hover:border-[#006B83] hover:bg-white cursor-pointer transition text-[#102A43]"
          >
            <div className="w-8 h-8 rounded-full bg-[#006B83] border border-[#00E5FF]/40 flex items-center justify-center text-xs font-bold text-white overflow-hidden shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-[#102A43] leading-tight truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[10px] text-[#64748B] truncate max-w-[120px]">
                {accountStatus}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] hidden sm:block" />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white text-[#102A43] border border-[#DCEAF5] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2.5 border-b border-[#DCEAF5] mb-1 bg-[#EFF8FF] rounded-xl">
                <div className="text-xs font-bold text-[#102A43]">{displayName}</div>
                <div className="text-[10px] text-[#64748B] truncate">{currentUser?.email || 'Candidate Account'}</div>
                <div className="mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]" />
                  <span className="text-[10px] font-semibold text-[#006B83]">{displayRole}</span>
                </div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenAuth(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#102A43] hover:text-[#006B83] hover:bg-[#EFF8FF] transition font-medium"
              >
                <User className="w-3.5 h-3.5 text-[#006B83]" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenUpload(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#102A43] hover:text-[#006B83] hover:bg-[#EFF8FF] transition font-medium"
              >
                <Upload className="w-3.5 h-3.5 text-[#006B83]" />
                <span>Upload New Resume</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenApiKey(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#102A43] hover:text-[#006B83] hover:bg-[#EFF8FF] transition font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#006B83]" />
                <span>AI Key Settings</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 transition mt-1 pt-1.5 border-t border-[#DCEAF5] font-semibold"
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
