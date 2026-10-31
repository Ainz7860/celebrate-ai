// ============================================================
// CelebrateAI — Home / Landing Page (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { loadAllEvents, saveEventState } from '@/lib/storage';
import { DEMO_SCENARIOS } from '@/lib/demo-data';
import { CELEBRATION_MEDIA } from '@/lib/celebration-media';
import type { EventRecord } from '@/lib/types';

export default function HomePage() {
  const router = useRouter();
  const [savedEvents, setSavedEvents] = useState<EventRecord[]>([]);

  useEffect(() => {
    setSavedEvents(loadAllEvents());
  }, []);

  const handleLaunchDemo = (key: string) => {
    const scenario = DEMO_SCENARIOS.find((s) => s.key === key);
    if (!scenario) return;
    const demoState = scenario.create();
    saveEventState(demoState);
    router.push(`/events/${demoState.event.id}`);
  };

  return (
    <div className="relative overflow-hidden space-y-28 py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Ambient background light meshes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-gradient-to-tr from-violet-600/30 via-fuchsia-600/20 to-amber-500/15 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[500px] h-[400px] bg-gradient-to-br from-cyan-500/15 via-violet-600/15 to-transparent blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ─── Hero Section ────────────────────────────────────────── */}
      <section className="text-center space-y-8 pt-6 max-w-4xl mx-auto relative z-10">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-violet-500/15 text-violet-200 text-xs font-bold border border-violet-500/30 shadow-xl shadow-violet-500/10 backdrop-blur-md">
          <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 animate-pulse shadow-md shadow-fuchsia-400/50" />
          <span>Prompt Wars Challenge 5</span>
          <span className="text-violet-400">•</span>
          <span className="text-stone-300 font-normal">Next-Gen Celebration Architect</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight font-display leading-[1.12]">
          Flawless Celebrations,{' '}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
            Engineered by AI.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed font-light">
          From royal weddings to magical birthdays and vibrant community festivals. Experience
          mathematically deterministic budgeting, backwards-scheduled milestone checklists, vendor
          vetting dossiers, and conflict-aware adaptive replanning.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/events/new">
            <Button
              variant="primary"
              size="lg"
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
              }
              className="shadow-2xl shadow-violet-600/50 ring-2 ring-violet-400/20"
            >
              Plan Your Celebration
            </Button>
          </Link>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => handleLaunchDemo('wedding')}
            leftIcon={<span className="text-lg">💒</span>}
          >
            Explore Royal Wedding Demo
          </Button>
        </div>

        {/* Floating Mini Dashboard Preview */}
        <div className="pt-10 max-w-3xl mx-auto">
          <div className="glass-panel rounded-3xl p-6 border border-white/15 shadow-2xl shadow-black/80 text-left relative overflow-hidden group hover:border-violet-500/40 transition-all duration-500">
            <div className="absolute top-0 right-0 w-80 h-40 bg-gradient-to-bl from-violet-600/20 via-fuchsia-600/10 to-transparent blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 flex items-center justify-center text-white text-lg shadow-lg shadow-violet-500/30">
                  ✨
                </span>
                <div>
                  <h3 className="text-white font-bold text-sm sm:text-base font-display">
                    Priya & Arjun&apos;s Royal Wedding
                  </h3>
                  <p className="text-xs text-stone-400">Jaipur, Rajasthan • 350 VIP Attendees</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  ⏳ 180 Days to Go
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  🛡️ 5% Buffer Safe
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="glass-panel p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Total Budget</span>
                <span className="text-base sm:text-lg font-bold font-display text-white">₹25,00,000</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Contingency Vault</span>
                <span className="text-base sm:text-lg font-bold font-display text-emerald-400">₹1,25,000</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Milestones</span>
                <span className="text-base sm:text-lg font-bold font-display text-violet-300">18 Scheduled</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-white/10">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">Vendor Dossier</span>
                <span className="text-base sm:text-lg font-bold font-display text-amber-300">3 Shortlisted</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Saved Events Section (if any exists) ────────────────── */}
      {savedEvents.length > 0 && (
        <section className="space-y-6 relative z-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-white font-display">
                Your Saved Celebrations
              </h2>
              <p className="text-xs text-stone-400 mt-1">Pick up right where you left off</p>
            </div>
            <Link href="/events/new">
              <Button variant="ghost" size="sm">
                + New Event
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedEvents.map((ev) => (
              <Card key={ev.id} hoverEffect padding="md" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <span className="font-bold text-base sm:text-lg text-white font-display">
                      {ev.name}
                    </span>
                    <Badge variant="primary" size="sm">
                      {ev.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-400 mt-2 flex items-center gap-2">
                    <span>📍 {ev.city}</span>
                    <span>•</span>
                    <span>📅 {ev.date}</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    👥 {ev.guestCount} guests • {ev.venueSetting}
                  </p>
                </div>
                <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-300">
                    Budget: {ev.currency} {ev.budget.toLocaleString()}
                  </span>
                  <Link href={`/events/${ev.id}`}>
                    <Button variant="secondary" size="sm">
                      Open Dashboard →
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* ─── Visual Scenario Showcase ────────────────────────────── */}
      <section className="space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-400">
            Instant Exploration
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Curated Celebration Scenarios
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Experience complete, realistic celebrations with one click. Pre-populated with budgets,
            backward-scheduled timelines, vendor dossiers, and guest dietary profiles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wedding Card */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/15 hover:border-violet-500/50 transition-all duration-300 group flex flex-col justify-between shadow-2xl">
            <div className="relative h-52 overflow-hidden">
              <img
                src={CELEBRATION_MEDIA.wedding.thumbnail}
                alt="Royal Wedding"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100C1F] via-[#100C1F]/50 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#100C1F]/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  💒 Royal Wedding
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl font-bold text-white font-display">
                  Priya &amp; Arjun&apos;s Royal Wedding
                </h3>
                <p className="text-xs text-stone-300">Jaipur Palace • Marigold &amp; Royal Blue</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Attendees</span>
                  <span className="text-white font-bold font-display text-sm">350 Guests</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Budget</span>
                  <span className="text-amber-300 font-bold font-display text-sm">₹25,00,000</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Milestones</span>
                  <span className="text-stone-200 font-bold font-display text-sm">18 Checklists</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Reserve Buffer</span>
                  <span className="text-emerald-400 font-bold font-display text-sm">5% Built-in</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full shadow-lg shadow-violet-600/30"
                onClick={() => handleLaunchDemo('wedding')}
              >
                Launch Royal Wedding →
              </Button>
            </div>
          </div>

          {/* Birthday Card */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/15 hover:border-fuchsia-500/50 transition-all duration-300 group flex flex-col justify-between shadow-2xl">
            <div className="relative h-52 overflow-hidden">
              <img
                src={CELEBRATION_MEDIA.birthday.thumbnail}
                alt="Magical Birthday"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100C1F] via-[#100C1F]/50 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#100C1F]/80 backdrop-blur-md text-pink-300 border border-pink-500/30">
                  🎂 Fantasy Birthday
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl font-bold text-white font-display">
                  Maya&apos;s 7th Birthday Party
                </h3>
                <p className="text-xs text-stone-300">Bengaluru • Pastel Iridescent Wonderland</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Attendees</span>
                  <span className="text-white font-bold font-display text-sm">30 Kids + Parents</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Budget</span>
                  <span className="text-pink-300 font-bold font-display text-sm">₹80,000</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Milestones</span>
                  <span className="text-stone-200 font-bold font-display text-sm">12 Checklists</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Reserve Buffer</span>
                  <span className="text-emerald-400 font-bold font-display text-sm">5% Built-in</span>
                </div>
              </div>

              <Button
                variant="coral"
                size="md"
                className="w-full shadow-lg shadow-pink-600/30"
                onClick={() => handleLaunchDemo('birthday')}
              >
                Launch Fantasy Birthday →
              </Button>
            </div>
          </div>

          {/* Community Event Card */}
          <div className="glass-panel rounded-3xl overflow-hidden border border-white/15 hover:border-emerald-500/50 transition-all duration-300 group flex flex-col justify-between shadow-2xl">
            <div className="relative h-52 overflow-hidden">
              <img
                src={CELEBRATION_MEDIA.community.thumbnail}
                alt="Community Festival"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#100C1F] via-[#100C1F]/50 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#100C1F]/80 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  🎪 Community Festival
                </span>
              </div>
              <div className="absolute bottom-3 left-4 right-4">
                <h3 className="text-xl font-bold text-white font-display">
                  Starlight Lantern Festival
                </h3>
                <p className="text-xs text-stone-300">Pune Riverside • Open-Air Cultural Gathering</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Attendees</span>
                  <span className="text-white font-bold font-display text-sm">500 Public</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Total Budget</span>
                  <span className="text-emerald-300 font-bold font-display text-sm">₹5,00,000</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Milestones</span>
                  <span className="text-stone-200 font-bold font-display text-sm">16 Checklists</span>
                </div>
                <div className="glass-panel p-2.5 rounded-xl border border-white/5">
                  <span className="text-stone-400 block text-[10px] uppercase font-bold">Reserve Buffer</span>
                  <span className="text-emerald-400 font-bold font-display text-sm">5% Built-in</span>
                </div>
              </div>

              <Button
                variant="secondary"
                size="md"
                className="w-full shadow-lg shadow-emerald-600/20 text-emerald-300 hover:text-white"
                onClick={() => handleLaunchDemo('community')}
              >
                Launch Lantern Festival →
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Thematic Aesthetic & Sensory Showcase ─────────────────── */}
      <section className="space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-amber-400">
            Aesthetic Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Curated Sensory Moodboards
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            CelebrateAI couples quantitative precision with refined sensory palettes, cultural
            nuances, and lighting design.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['wedding', 'birthday', 'community'] as const).map((type) => {
            const visual = CELEBRATION_MEDIA[type];
            return (
              <div key={type} className="glass-panel rounded-2xl p-5 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-white font-bold font-display text-sm flex items-center gap-2">
                    <span>{visual.badgeEmoji}</span>
                    <span className="capitalize">{type} Aesthetic</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">{visual.tagline}</span>
                </div>

                {/* Color swatches */}
                <div className="grid grid-cols-4 gap-2">
                  {visual.colorPalette.map((col) => (
                    <div key={col.name} className="space-y-1 text-center">
                      <div
                        className="h-10 rounded-lg shadow-md border border-white/10"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span className="block text-[10px] text-stone-300 font-mono">{col.hex}</span>
                    </div>
                  ))}
                </div>

                {/* Sensory note */}
                <div className="bg-white/[0.03] p-3 rounded-xl border border-white/5 text-xs text-stone-300 leading-relaxed font-light">
                  {visual.inspirationImages[0]?.description}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Architectural Excellence Grid ────────────────────────── */}
      <section className="space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold tracking-widest uppercase text-cyan-400">
            Built For Mathematical Rigor
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
            Why CelebrateAI Stands Out
          </h2>
          <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
            Zero hallucinations on numbers. Defensive engineering with local privacy and multi-LLM
            redundancy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl shadow-lg shadow-amber-500/10">
              💰
            </span>
            <h3 className="font-bold text-lg text-white font-display">Deterministic Budget Math</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Never let an LLM do raw math. Calculate category allocations, spend variances, and a
              dedicated 5% emergency buffer purely in TypeScript.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/10">
              ⏱️
            </span>
            <h3 className="font-bold text-lg text-white font-display">Backward-Scheduled Milestones</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Milestone checklists calculated chronologically backwards from your event date, with
              live overdue alerts and priority tags.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/10">
              ⚡
            </span>
            <h3 className="font-bold text-lg text-white font-display">Conflict-Aware Adaptive Replanning</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              When bad weather hits or budgets shrink, CelebrateAI recalculates dependencies while
              protecting already-booked vendors and completed milestones.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-2xl shadow-lg shadow-rose-500/10">
              🤝
            </span>
            <h3 className="font-bold text-lg text-white font-display">Vendor Vetting &amp; Guides</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Each vendor category includes targeted questions to ask, comparison criteria, and
              quote tracking to prevent costly hiring mistakes.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-fuchsia-500/15 border border-fuchsia-500/30 flex items-center justify-center text-2xl shadow-lg shadow-fuchsia-500/10">
              👥
            </span>
            <h3 className="font-bold text-lg text-white font-display">VIP Guest RSVP &amp; Dietary Safety</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              Track seat counts, invitation delivery, and prominent dietary allergy flags (vegan, nut
              allergy, gluten-free, Jain foods) to protect your guests.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-violet-500/40 transition-all duration-300 space-y-3">
            <span className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-2xl shadow-lg shadow-cyan-500/10">
              🔒
            </span>
            <h3 className="font-bold text-lg text-white font-display">Local Privacy &amp; Full Export</h3>
            <p className="text-xs text-stone-300 leading-relaxed font-light">
              No cloud accounts or tracking required. Instant export to structured JSON, formatted
              Markdown, or printer-friendly summaries.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Call To Action ────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl p-10 sm:p-14 border border-violet-500/30 bg-gradient-to-r from-violet-950/60 via-[#190F38] to-fuchsia-950/50 shadow-2xl text-center space-y-6">
        <div className="absolute inset-0 bg-radial-mesh-violet opacity-60 pointer-events-none" />
        <h2 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight relative z-10">
          Ready to experience the future of celebration planning?
        </h2>
        <p className="text-stone-300 max-w-xl mx-auto text-sm sm:text-base font-light relative z-10">
          Start in seconds. Tailor every detail with intelligent suggestions, guaranteed math, and
          curated aesthetics.
        </p>
        <div className="pt-2 relative z-10">
          <Link href="/events/new">
            <Button variant="primary" size="lg" className="shadow-2xl shadow-violet-600/50">
              Start Planning Now →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
