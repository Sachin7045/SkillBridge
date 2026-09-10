import React from 'react';
import { Users, X, Briefcase, Award, ArrowRight, Sparkles } from 'lucide-react';

export default function SampleModal({ isOpen, onClose, samples, currentId, onSelectSample }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Load Sample Profile</h3>
            <p className="text-xs text-slate-400">Instantly test the visualizer, ATS analyzer, and AI mock interview</p>
          </div>
        </div>

        <div className="space-y-3">
          {samples.map((sample) => {
            const isCurrent = sample.id === currentId;
            return (
              <div
                key={sample.id}
                onClick={() => {
                  onSelectSample(sample);
                  onClose();
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-indigo-600/10 border-indigo-500 shadow-md shadow-indigo-600/10 ring-1 ring-indigo-500'
                    : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-950/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{sample.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-indigo-300 font-medium">
                      {sample.targetRole}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Briefcase className="w-3 h-3 text-slate-500" />
                    <span>{sample.title}</span>
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {[
                      ...(sample.skills?.languages || []),
                      ...(sample.skills?.frameworks || [])
                    ].slice(0, 5).map((sk, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center">
                  <button
                    className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      isCurrent
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white'
                    }`}
                  >
                    <span>{isCurrent ? 'Loaded' : 'Select'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
