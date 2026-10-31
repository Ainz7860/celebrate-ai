// ============================================================
// CelebrateAI — Footer Component (Luxury Glass)
// ============================================================

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/8 bg-[#070510]/80 backdrop-blur-xl py-10 text-stone-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-xl bg-linear-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-600/30">
            ✨
          </span>
          <div>
            <span className="font-bold text-stone-200">CelebrateAI</span>
            <span className="text-stone-500 ml-2">— Prompt Wars Challenge 5 GenAI Assistant</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-stone-400 text-xs">
          <span className="flex items-center gap-1.5 text-violet-300">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Deterministic Budget Engine
          </span>
          <span>•</span>
          <span className="text-fuchsia-300">Adaptive Replanning</span>
          <span>•</span>
          <span className="text-emerald-300">Local Privacy</span>
        </div>
      </div>
    </footer>
  );
};
