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
  ExternalLink,
  Palette,
  Check
} from 'lucide-react';
import { formatUserDisplayName } from '../utils/userDisplay';
import { THEMES } from '../utils/themes';

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
  currentThemeId = 'teal',
  onSelectTheme = () => {},
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
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const notifications = [
    { id: 1, title: 'ATS Optimization Complete', desc: 'Score increased by +14% after STAR metrics rewrite.', time: '10m ago' },
    { id: 2, title: 'AI Mock Interview Ready', desc: 'Technical questions generated for target engineering role.', time: '1h ago' },
    { id: 3, title: 'Skill Gap Detected', desc: '3 missing frameworks identified for Cloud Architect.', time: '3h ago' }
  ];

  const displayName = formatUserDisplayName(currentUser, currentResume);
  const displayRole = currentResume?.targetRole || 'Full Stack Developer';
  const accountStatus = currentUser ? 'Verified Candidate' : 'Guest Preview';

  const activeThemeObj = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  return (
    <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-[#0C182F]/95 backdrop-blur-xl border-b border-[#DCEAF5] dark:border-[#192E52] shadow-sm px-4 sm:px-6 flex items-center justify-between gap-4 text-[#102A43] dark:text-[#F1F5F9]">
      
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-[#102A43] dark:text-white hover:opacity-80 transition"
        >
          {isMobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>

        {/* Global Search Field with Ctrl + K */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#64748B] dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes, skills, jobs, or diagnostics..."
            className="w-full pl-10 pr-12 py-2 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-[#102A43] dark:text-white text-xs placeholder-[#64748B] dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/30 transition shadow-inner"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#0C182F] text-[10px] font-semibold text-[#64748B] dark:text-slate-400 border border-[#DCEAF5] dark:border-[#192E52] shadow-sm">
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls: Evaluation Engine Status, Theme Picker, Notifications, Theme Toggle, Profile */}
      <div className="flex items-center gap-2.5 shrink-0">
        
        {/* Professional Engine Status Pill */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-xs font-semibold text-[#006B83] dark:text-[#00E5FF]">
          <span className="w-2 h-2 rounded-full bg-[#00C9A7] animate-pulse" />
          <span>AI Engine: Active</span>
        </div>

        {/* Live Theme Color Switcher Pill */}
        <div className="relative">
          <button
            onClick={() => {
              setShowThemeMenu(!showThemeMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-xs font-semibold text-[#102A43] dark:text-white hover:border-[#00E5FF] transition shadow-xs"
            title="Change Dashboard Colors"
          >
            <Palette className="w-4 h-4 text-[#006B83] dark:text-[#00E5FF]" />
            <span className="hidden sm:inline text-xs">{activeThemeObj.name}</span>
            <div className="flex items-center -space-x-1">
              {activeThemeObj.previewColors.slice(0, 3).map((c, i) => (
                <span 
                  key={i} 
                  className="w-2.5 h-2.5 rounded-full border border-white dark:border-[#0C182F]" 
                  style={{ backgroundColor: c }} 
                />
              ))}
            </div>
          </button>

          {/* Theme Palette Dropdown */}
          {showThemeMenu && (
            <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-[#0C182F] text-[#102A43] dark:text-[#F1F5F9] border border-[#DCEAF5] dark:border-[#192E52] shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCEAF5] dark:border-[#192E52]">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider block">Dashboard Themes</span>
                  <span className="text-[10px] text-[#64748B] dark:text-slate-400">Click to instantly change color</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/20 text-[#006B83] dark:text-[#00E5FF]">
                  {THEMES.length} Themes
                </span>
              </div>

              <div className="space-y-1.5">
                {THEMES.map((t) => {
                  const isSelected = t.id === currentThemeId;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        onSelectTheme(t.id);
                        setShowThemeMenu(false);
                      }}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between group ${
                        isSelected
                          ? 'bg-[#EFF8FF] dark:bg-[#112242] border-[#006B83] dark:border-[#00E5FF] shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-[#112242]/60 hover:border-[#DCEAF5] dark:hover:border-[#192E52]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* 4-color swatch dot */}
                        <div className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 grid grid-cols-2 gap-0.5 shrink-0 overflow-hidden shadow-xs">
                          {t.previewColors.map((color, idx) => (
                            <div key={idx} className="w-full h-full rounded-xs" style={{ backgroundColor: color }} />
                          ))}
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate flex items-center gap-1.5">
                            <span>{t.name}</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold text-[#64748B] dark:text-slate-400 bg-slate-100 dark:bg-slate-800">
                              {t.type === 'dark' ? 'Dark' : 'Light'}
                            </span>
                          </div>
                          <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate mt-0.5">
                            {t.desc}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#006B83] dark:bg-[#00E5FF] text-white dark:text-[#030712] flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Icon with Counter */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowThemeMenu(false);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-[#102A43] dark:text-white hover:opacity-80 text-xs transition relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-[#006B83] dark:text-[#00E5FF]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#006B83] dark:bg-[#00E5FF] border border-white text-white dark:text-[#030712] text-[9px] font-bold flex items-center justify-center shadow-md">
              3
            </span>
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white dark:bg-[#0C182F] text-[#102A43] dark:text-[#F1F5F9] border border-[#DCEAF5] dark:border-[#192E52] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#DCEAF5] dark:border-[#192E52]">
                <span className="text-xs font-bold uppercase tracking-wider">Notifications</span>
                <span className="text-[10px] text-[#006B83] dark:text-[#00E5FF] font-semibold cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] hover:opacity-90 border border-[#DCEAF5] dark:border-[#192E52] transition">
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>{n.title}</span>
                      <span className="text-[9px] text-[#006B83] dark:text-[#00E5FF] font-medium">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Dark/Light Quick Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-[#102A43] dark:text-white hover:opacity-80 text-xs transition"
          title={theme === 'dark' ? "Switch to Light Theme (Teal)" : "Switch to Dark Theme (Midnight)"}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-[#006B83]" />
          )}
        </button>

        {/* User Avatar & Profile Pill */}
        <div className="relative">
          <div 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowThemeMenu(false);
            }}
            className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] hover:border-[#006B83] cursor-pointer transition text-[#102A43] dark:text-white"
          >
            <div className="w-8 h-8 rounded-full bg-[#006B83] dark:bg-[#00E5FF] border border-[#00E5FF]/40 flex items-center justify-center text-xs font-bold text-white dark:text-[#030712] overflow-hidden shadow-sm">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold leading-tight truncate max-w-[120px]">
                {displayName}
              </span>
              <span className="text-[10px] text-[#64748B] dark:text-slate-400 truncate max-w-[120px]">
                {accountStatus}
              </span>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400 hidden sm:block" />
          </div>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#0C182F] text-[#102A43] dark:text-white border border-[#DCEAF5] dark:border-[#192E52] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
              <div className="p-2.5 border-b border-[#DCEAF5] dark:border-[#192E52] mb-1 bg-[#EFF8FF] dark:bg-[#112242] rounded-xl">
                <div className="text-xs font-bold">{displayName}</div>
                <div className="text-[10px] text-[#64748B] dark:text-slate-400 truncate">{currentUser?.email || 'Candidate Account'}</div>
                <div className="mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00C9A7]" />
                  <span className="text-[10px] font-semibold text-[#006B83] dark:text-[#00E5FF]">{displayRole}</span>
                </div>
              </div>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenAuth(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:text-[#006B83] hover:bg-[#EFF8FF] dark:hover:bg-[#112242] transition font-medium"
              >
                <User className="w-3.5 h-3.5 text-[#006B83] dark:text-[#00E5FF]" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenUpload(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:text-[#006B83] hover:bg-[#EFF8FF] dark:hover:bg-[#112242] transition font-medium"
              >
                <Upload className="w-3.5 h-3.5 text-[#006B83] dark:text-[#00E5FF]" />
                <span>Upload New Resume</span>
              </button>
              <button
                onClick={() => { setShowProfileMenu(false); onOpenApiKey(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs hover:text-[#006B83] hover:bg-[#EFF8FF] dark:hover:bg-[#112242] transition font-medium"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#006B83] dark:text-[#00E5FF]" />
                <span>AI Key Settings</span>
              </button>
              {currentUser && (
                <button
                  onClick={() => { setShowProfileMenu(false); onLogout(); }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition mt-1 pt-1.5 border-t border-[#DCEAF5] dark:border-[#192E52] font-semibold"
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
