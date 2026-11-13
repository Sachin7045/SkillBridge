import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  KeyRound, 
  ShieldCheck, 
  Moon, 
  Sun, 
  Database, 
  Cpu, 
  Check, 
  AlertCircle,
  ExternalLink,
  Terminal,
  Save,
  Palette,
  Sparkles
} from 'lucide-react';
import { THEMES } from '../utils/themes';

export default function SettingsView({
  apiKey,
  onSaveApiKey,
  theme,
  currentThemeId = 'teal',
  onSelectTheme = () => {},
  onToggleTheme,
  onShowToast = () => {}
}) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    onSaveApiKey(inputKey.trim());
    setSavedSuccess(true);
    onShowToast({
      type: 'success',
      title: 'Settings Saved',
      message: inputKey.trim() ? 'Google Gemini API key configured.' : 'Operating in offline local evaluation mode.'
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const activeTheme = THEMES.find(t => t.id === currentThemeId) || THEMES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="pro-card p-6 rounded-3xl border border-[#DCEAF5] dark:border-[#192E52] bg-white dark:bg-[#0C182F] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#006B83]/10 dark:bg-[#00E5FF]/10 border border-[#006B83]/20 dark:border-[#00E5FF]/20 flex items-center justify-center text-[#006B83] dark:text-[#00E5FF]">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#102A43] dark:text-[#F1F5F9] tracking-tight">Platform Configuration</h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">Manage UI color palettes, dashboard themes, AI credentials, and evaluation engine modes.</p>
          </div>
        </div>
      </div>

      {/* Dashboard Color Themes Gallery */}
      <div className="pro-card p-6 rounded-3xl border border-[#DCEAF5] dark:border-[#192E52] bg-white dark:bg-[#0C182F] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#DCEAF5] dark:border-[#192E52]">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-[#006B83] dark:text-[#00E5FF]" />
            <div>
              <h3 className="text-sm font-bold text-[#102A43] dark:text-[#F1F5F9]">Dashboard Color Themes</h3>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">Choose your preferred visual aesthetic. Changes apply immediately across the entire platform.</p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold px-3 py-1 rounded-full bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-[#006B83] dark:text-[#00E5FF]">
            Active: {activeTheme.name}
          </span>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {THEMES.map((t) => {
            const isSelected = t.id === currentThemeId;
            return (
              <div
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 relative group flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#006B83] dark:border-[#00E5FF] bg-[#EFF8FF]/70 dark:bg-[#112242] shadow-md scale-[1.01]'
                    : 'border-[#DCEAF5] dark:border-[#192E52] hover:border-[#006B83]/60 dark:hover:border-[#00E5FF]/60 bg-white dark:bg-[#0C182F]/70 hover:shadow-sm'
                }`}
              >
                <div>
                  {/* Top Swatches and Status Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white dark:bg-[#0C182F] border border-slate-200 dark:border-slate-700 shadow-xs">
                      {t.previewColors.map((c, i) => (
                        <span 
                          key={i} 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/10" 
                          style={{ backgroundColor: c }} 
                          title={`Color: ${c}`}
                        />
                      ))}
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      t.type === 'dark' 
                        ? 'bg-slate-800 text-slate-300' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {t.category}
                    </span>
                  </div>

                  {/* Theme Info */}
                  <div className="text-sm font-bold text-[#102A43] dark:text-[#F1F5F9] flex items-center justify-between">
                    <span>{t.name}</span>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#006B83] dark:bg-[#00E5FF] text-white dark:text-[#030712] flex items-center justify-center text-xs font-bold shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-1 leading-snug">
                    {t.desc}
                  </p>
                </div>

                {/* Apply Button */}
                <div className="mt-4 pt-3 border-t border-[#DCEAF5] dark:border-[#192E52]/60 flex items-center justify-between">
                  <span className="text-[10px] font-semibold text-[#64748B] dark:text-slate-400">
                    {isSelected ? 'Currently Selected' : 'Click to Apply'}
                  </span>
                  <button
                    type="button"
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                      isSelected
                        ? 'bg-[#006B83] dark:bg-[#00E5FF] text-white dark:text-[#030712]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 group-hover:bg-[#006B83] group-hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Active' : 'Select'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Key Card */}
      <div className="pro-card p-6 rounded-3xl border border-[#DCEAF5] dark:border-[#192E52] bg-white dark:bg-[#0C182F] shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#DCEAF5] dark:border-[#192E52] mb-5">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-[#006B83] dark:text-[#00E5FF]" />
            <h3 className="text-sm font-bold text-[#102A43] dark:text-[#F1F5F9]">Google Gemini API Credentials</h3>
          </div>
          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
            apiKey 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
          }`}>
            {apiKey ? 'Live Connected' : 'Local Fallback Active'}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#102A43] dark:text-slate-300 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52] text-[#102A43] dark:text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/40 font-mono"
            />
            <p className="text-[11px] text-[#64748B] dark:text-slate-400 mt-2 leading-relaxed">
              When omitted, SkillBridge seamlessly runs an <strong>intelligent offline heuristic AI engine</strong> that parses resume taxonomy, generates anchored questions, and calculates STAR adherence locally without external network dependencies.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#006B83] dark:text-[#00E5FF] hover:underline inline-flex items-center gap-1 transition"
            >
              <span>Get a free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#006B83] hover:bg-[#005569] text-white text-xs font-semibold transition shadow-md"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Architectural Engine Overview */}
      <div className="pro-card p-6 rounded-3xl border border-[#DCEAF5] dark:border-[#192E52] bg-white dark:bg-[#0C182F] shadow-sm space-y-3">
        <div className="flex items-center gap-2.5 text-sm font-bold text-[#102A43] dark:text-[#F1F5F9]">
          <Cpu className="w-4 h-4 text-[#006B83] dark:text-[#00E5FF]" />
          <span>Active Architecture Telemetry</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52]">
            <span className="text-[#64748B] dark:text-slate-400 block text-[10px] uppercase font-bold">Parser Protocol</span>
            <span className="text-[#102A43] dark:text-white font-semibold mt-0.5 block">pdf-parse & mammoth</span>
          </div>
          <div className="p-3 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52]">
            <span className="text-[#64748B] dark:text-slate-400 block text-[10px] uppercase font-bold">Data Privacy</span>
            <span className="text-[#00C9A7] font-semibold mt-0.5 block">100% In-Memory Buffers</span>
          </div>
          <div className="p-3 rounded-xl bg-[#EFF8FF] dark:bg-[#112242] border border-[#DCEAF5] dark:border-[#192E52]">
            <span className="text-[#64748B] dark:text-slate-400 block text-[10px] uppercase font-bold">Client Framework</span>
            <span className="text-[#006B83] dark:text-[#00E5FF] font-semibold mt-0.5 block">React 18 + Vite 6 + Tailwind</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
