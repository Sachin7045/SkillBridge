import React from 'react';

export function CardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-800 rounded-md w-1/3" />
            <div className="h-4 bg-slate-800 rounded-md w-16" />
          </div>
          <div className="h-3 bg-slate-800/70 rounded-md w-3/4" />
          <div className="h-3 bg-slate-800/50 rounded-md w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function MetricSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="h-3 bg-slate-800 rounded-md w-1/2" />
          <div className="h-7 bg-slate-800 rounded-md w-1/3" />
          <div className="h-2 bg-slate-800/60 rounded-md w-full" />
        </div>
      ))}
    </div>
  );
}

export function RadarSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center space-y-4 animate-pulse h-72">
      <div className="w-40 h-40 rounded-full border-4 border-slate-800/80 border-dashed" />
      <div className="h-3 bg-slate-800 rounded-md w-32" />
    </div>
  );
}
