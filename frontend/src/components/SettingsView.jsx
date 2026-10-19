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
  Save
} from 'lucide-react';

export default function SettingsView({
  apiKey,
  onSaveApiKey,
  theme,
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
      message: inputKey.trim() ? 'Google Gemini API key configured.' : 'Operating in offline local AI heuristic mode.'
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="pro-card p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Platform Configuration</h2>
            <p className="text-xs text-slate-400 mt-0.5">Manage AI credentials, intelligence engine modes, and UI theme preferences.</p>
          </div>
        </div>
      </div>

      {/* AI Key Card */}
      <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">Google Gemini API Credentials</h3>
          </div>
          <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${
            apiKey ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
          }`}>
            {apiKey ? 'Live Connected' : 'Local Fallback Active'}
          </span>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-600 text-xs focus:outline-none focus:border-indigo-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
              When omitted, SkillBridge seamlessly runs an <strong>intelligent offline heuristic AI engine</strong> that parses resume taxonomy, generates anchored questions, and calculates STAR adherence locally without external network dependencies.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition"
            >
              <span>Get a free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shadow-md shadow-indigo-600/25"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? 'Saved' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* System Theme Card */}
      <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <Sun className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Appearance & Theme</h3>
          </div>
          <span className="text-xs text-slate-400">Current: {theme === 'dark' ? 'Deep Obsidian' : 'Clean Light'}</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-white">Color Theme</div>
            <p className="text-[11px] text-slate-400 mt-0.5">Toggle between Deep Obsidian dark mode and Clean SaaS light mode.</p>
          </div>

          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs font-medium text-slate-200 hover:border-slate-700 transition"
          >
            {theme === 'dark' ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark Obsidian</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Clean</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Architectural Engine Overview */}
      <div className="pro-card p-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 space-y-3">
        <div className="flex items-center gap-2.5 text-sm font-bold text-white">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Active Architecture Telemetry</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Parser Protocol</span>
            <span className="text-white font-semibold mt-0.5 block">pdf-parse & mammoth</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Data Privacy</span>
            <span className="text-emerald-400 font-semibold mt-0.5 block">100% In-Memory Buffers</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-slate-400 block text-[10px] uppercase">Client Framework</span>
            <span className="text-cyan-400 font-semibold mt-0.5 block">React 18 + Vite 6 + Tailwind</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
