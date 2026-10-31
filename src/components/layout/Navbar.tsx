// ============================================================
// CelebrateAI — Navigation Header (Luxury Glassmorphism)
// ============================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { loadAllEvents, saveEventState } from '@/lib/storage';
import { DEMO_SCENARIOS } from '@/lib/demo-data';
import type { EventRecord } from '@/lib/types';

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  useEffect(() => {
    setEvents(loadAllEvents());
  }, [pathname]);

  const handleLoadDemo = (key: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.key === key);
    if (!scenario) return;
    const demoState = scenario.create();
    saveEventState(demoState);
    setShowDemoMenu(false);
    router.push(`/events/${demoState.event.id}`);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#080514]/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-white/20">
              ✨
            </span>
            <div>
              <span className="font-black text-xl tracking-tight flex items-center gap-1.5 font-display text-white">
                Celebrate<span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-violet-300/70 block -mt-1">
                Luxury Event Planner
              </span>
            </div>
          </Link>

          {/* Event Quick Switcher */}
          {events.length > 0 && (
            <div className="hidden md:flex items-center gap-2 pl-5 border-l border-white/10">
              <span className="text-[11px] text-stone-400 font-semibold uppercase tracking-wider">
                Event:
              </span>
              <select
                aria-label="Select an event"
                className="text-xs bg-white/[0.05] hover:bg-white/[0.08] border border-white/15 rounded-xl px-3 py-1.5 text-stone-200 max-w-[200px] truncate focus:ring-2 focus:ring-violet-500/50 focus:border-violet-400 transition-colors cursor-pointer"
                onChange={(e) => {
                  if (e.target.value) {
                    router.push(`/events/${e.target.value}`);
                  }
                }}
                value=""
              >
                <option value="" disabled className="bg-[#120D26] text-stone-400">
                  Switch Celebration...
                </option>
                {events.map((ev) => (
                  <option key={ev.id} value={ev.id} className="bg-[#120D26] text-white">
                    {ev.name} ({ev.type})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Dropdown */}
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              rightIcon={
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showDemoMenu ? 'rotate-180 text-violet-300' : 'text-stone-400'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              }
            >
              Demo Scenarios
            </Button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-[#140E2D]/95 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-violet-950/80 border border-white/15 py-2 z-50 animate-scale-in">
                <div className="px-4 py-2 border-b border-white/[0.08] text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                  ⭐ Instant Demo Celebrations
                </div>
                {DEMO_SCENARIOS.map((demo) => (
                  <button
                    key={demo.key}
                    onClick={() => handleLoadDemo(demo.key)}
                    className="w-full text-left px-4 py-2.5 hover:bg-violet-600/20 hover:border-l-2 hover:border-violet-400 transition-all flex flex-col cursor-pointer group"
                  >
                    <span className="font-bold text-sm text-stone-100 group-hover:text-violet-200">
                      {demo.label}
                    </span>
                    <span className="text-xs text-stone-400 mt-0.5">{demo.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/events/new">
            <Button
              variant="primary"
              size="sm"
              leftIcon={
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              }
            >
              Plan Event
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
