// ============================================================
// CelebrateAI — 404 Not Found Page (Cyber-Luxe Glassmorphic)
// ============================================================

import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4">
      <div className="relative">
        <div className="w-24 h-24 rounded-3xl bg-linear-to-tr from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 flex items-center justify-center text-4xl shadow-xl shadow-violet-500/10 mb-6 mx-auto backdrop-blur-xl">
          ✨
        </div>
      </div>
      <h1 className="text-4xl sm:text-5xl font-black font-display tracking-tight text-white mb-3">
        Celebration Not Found
      </h1>
      <p className="text-base text-stone-400 max-w-md mx-auto mb-8 font-light">
        The celebration plan you are looking for may have been removed, or the link may be outdated.
      </p>
      <Link
        href="/"
        className="px-6 py-3 rounded-xl bg-linear-to-r from-violet-600 via-fuchsia-600 to-violet-700 text-white font-bold text-sm tracking-wide shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        Return to Celebrations Hub
      </Link>
    </div>
  );
}
