import React, { useState } from 'react';
import { KeyRound, X, CheckCircle, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

export default function ApiKeyModal({ isOpen, onClose, apiKey, onSaveApiKey }) {
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Engine Settings</h3>
            <p className="text-xs text-slate-400">Configure Live Gemini API or Local Engine</p>
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 mb-4 text-xs text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dual-Mode AI Capability</span>
          </div>
          <p>
            • <strong className="text-white">Built-in Local AI:</strong> Works 100% offline out-of-the-box with zero setup, generating realistic questions, ATS metrics, and STAR rewrites.
          </p>
          <p>
            • <strong className="text-white">Live Gemini 1.5 Flash:</strong> Add a Google AI Studio key to enable live generative interview answers, real-time feedback, and dynamic questions.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <label className="block text-xs font-semibold text-slate-300">
            Google Gemini API Key (Optional)
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              <span>Get a free key from Google AI Studio</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3 h-3" /> Stored locally in browser
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition"
            >
              Remove Key
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 transition"
          >
            {saved ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save Settings</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
