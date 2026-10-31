// ============================================================
// CelebrateAI — Dashboard Overview Tab (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from '@/components/ui/StatCard';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { formatCurrency } from '@/lib/budget';
import { daysUntil } from '@/lib/dates';
import { exportEventAsJson, exportPlanAsMarkdown, downloadFile, triggerPrintPlan } from '@/lib/export';
import { getCelebrationMedia } from '@/lib/celebration-media';
import type { EventState, Task } from '@/lib/types';

interface OverviewTabProps {
  state: EventState;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onOpenReplanning: () => void;
  onNavigateTab: (tab: 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  state,
  onUpdateTask,
  onOpenReplanning,
  onNavigateTab,
}) => {
  const { event, plan, guests } = state;
  if (!plan) return null;

  const { budget, timeline, vendors, ideas } = plan;
  const daysLeft = daysUntil(event.date);
  const media = getCelebrationMedia(event.type);

  // Financial calculations
  const totalBudget = budget.totalBudget;
  const totalAllocated = budget.totalAllocated;
  const totalActual = budget.totalActual;
  const spentPercent = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;
  const allocatedPercent = totalBudget > 0 ? Math.round((totalAllocated / totalBudget) * 100) : 0;

  // Task calculations
  const taskPercent =
    timeline.totalCount > 0
      ? Math.round((timeline.completedCount / timeline.totalCount) * 100)
      : 0;

  // Vendors calculations
  const bookedVendors = vendors.filter((v) => v.status === 'booked').length;

  // Guests calculations
  const acceptedGuests = guests
    .filter((g) => g.rsvpStatus === 'accepted')
    .reduce((sum, g) => sum + g.attendeeCount, 0);

  // Export handlers
  const handleExportJSON = () => {
    const jsonStr = exportEventAsJson(state);
    downloadFile(jsonStr, `${event.name.toLowerCase().replace(/\s+/g, '_')}_plan.json`);
  };

  const handleExportMarkdown = () => {
    const mdStr = exportPlanAsMarkdown(event, plan);
    downloadFile(
      mdStr,
      `${event.name.toLowerCase().replace(/\s+/g, '_')}_summary.md`,
      'text/markdown',
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─── Hero Banner with Photographic Backdrop ──────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-2xl shadow-violet-950/70 group">
        {/* Background photo with deep dark gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={media.heroImage}
            alt={event.name}
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 filter brightness-50"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0C081E]/95 via-[#120D2C]/85 to-[#0C081E]/90" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0C081E] via-transparent to-black/40" />
        </div>

        <div className="relative z-10 p-7 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Badge variant="primary" size="sm">
                {media.badgeEmoji} {event.type.toUpperCase()}
              </Badge>
              <Badge
                variant={plan.source === 'ai' ? 'success' : 'neutral'}
                size="sm"
              >
                {plan.source === 'ai' ? '✨ Live AI Synthesized' : '📋 Verified Scenario'}
              </Badge>
              <span className="text-xs text-stone-300 font-mono">
                5% Contingency Buffer: {formatCurrency(budget.contingencyAmount, budget.currency)}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight font-display drop-shadow-md">
              {event.name}
            </h1>

            <p className="text-stone-200 text-xs sm:text-sm flex flex-wrap items-center gap-3 drop-shadow">
              <span className="flex items-center gap-1.5 font-medium">📅 {event.date}</span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1.5 font-medium">📍 {event.city}</span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1.5 font-medium">👥 {event.guestCount} Guests Target</span>
              <span className="text-stone-400">•</span>
              <span className="flex items-center gap-1.5 capitalize font-medium">🏛️ {event.venueSetting} Setting</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Glowing Countdown Ring Card */}
            <div className="glass-panel rounded-2xl px-6 py-4 border border-white/20 text-center min-w-37.5 shadow-xl backdrop-blur-xl bg-[#120D28]/80">
              <span className="block text-3xl sm:text-4xl font-black font-display text-gradient-gold">
                {daysLeft > 0 ? daysLeft : daysLeft === 0 ? 'Today!' : 'Completed'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-200 block mt-0.5">
                {daysLeft > 0 ? 'Days Remaining' : 'Status'}
              </span>
            </div>

            <Button
              variant="coral"
              size="lg"
              onClick={onOpenReplanning}
              leftIcon={<span className="text-lg">⚡</span>}
              className="shadow-2xl shadow-orange-500/40 ring-2 ring-orange-400/30 font-bold"
            >
              Adaptive Replan
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 4 Cyber-Luxe KPI Stat Cards ──────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Total Budget"
          value={formatCurrency(totalBudget, budget.currency)}
          subtitle={`${allocatedPercent}% allocated across categories`}
          icon={<span className="text-xl">💰</span>}
          accentColor="violet"
        />

        <StatCard
          label="Actual Spent"
          value={formatCurrency(totalActual, budget.currency)}
          subtitle={`${formatCurrency(totalBudget - totalActual, budget.currency)} remaining`}
          icon={<span className="text-xl">💳</span>}
          accentColor="emerald"
        />

        <StatCard
          label="Milestones Progress"
          value={`${taskPercent}%`}
          subtitle={`${timeline.completedCount} of ${timeline.totalCount} completed`}
          icon={<span className="text-xl">⏱️</span>}
          accentColor="amber"
        />

        <StatCard
          label="Confirmed Vendors"
          value={`${bookedVendors}/${vendors.length}`}
          subtitle={`${vendors.length - bookedVendors} pending selection`}
          icon={<span className="text-xl">🤝</span>}
          accentColor="coral"
        />
      </div>

      {/* ─── Executive Concierge Briefing & Export Dock ────────────── */}
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/30 flex items-center justify-center text-sm">
              ✨
            </span>
            <h3 className="font-bold text-white text-base font-display">
              Executive Concierge Briefing
            </h3>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-stone-300 font-semibold transition-all flex items-center gap-1.5"
            >
              <span>📄</span> Export MD
            </button>
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-stone-300 font-semibold transition-all flex items-center gap-1.5"
            >
              <span>💾</span> Export JSON
            </button>
            <button
              onClick={triggerPrintPlan}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-stone-300 font-semibold transition-all flex items-center gap-1.5"
            >
              <span>🖨️</span> Print Dossier
            </button>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed italic bg-white/2 p-4 rounded-2xl border border-white/5 font-serif">
          &ldquo;{plan.eventSummary}&rdquo;
        </p>
      </div>

      {/* ─── 2-Column Operational Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Left Column: Budget & Milestones */}
        <div className="space-y-7">
          {/* Budget Widget */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-display">
                  Budget Allocation &amp; Buffer
                </h3>
                <p className="text-xs text-stone-400">Deterministic spend framework</p>
              </div>
              <button
                onClick={() => onNavigateTab('budget')}
                className="text-xs text-violet-300 hover:text-white transition-colors font-semibold"
              >
                View Full Budget →
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-stone-300 font-semibold">
                <span>Target Allocations Committed</span>
                <span>{allocatedPercent}% ({formatCurrency(totalAllocated, budget.currency)})</span>
              </div>
              <ProgressBar
                value={allocatedPercent}
                color={budget.isOverBudget ? 'rose' : 'violet'}
                size="md"
              />
            </div>

            {/* Contingency Buffer Callout */}
            <div className="p-4 rounded-2xl bg-linear-to-r from-emerald-950/40 to-[#0F1E19]/60 border border-emerald-500/30 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-lg">
                  🛡️
                </span>
                <div>
                  <span className="font-bold text-sm text-emerald-300 block">
                    Contingency Vault ({budget.contingencyPercent}%)
                  </span>
                  <span className="text-[11px] text-stone-400">
                    Reserved for unexpected emergency shifts
                  </span>
                </div>
              </div>
              <span className="text-base font-bold font-display text-emerald-400">
                {formatCurrency(budget.contingencyAmount, budget.currency)}
              </span>
            </div>

            {/* Top 3 Categories */}
            <div className="space-y-2.5 pt-1">
              <span className="text-[11px] text-stone-400 uppercase font-bold tracking-wider block">
                Top Budget Allocations
              </span>
              <div className="space-y-2">
                {budget.categories.slice(0, 3).map((cat) => (
                  <div
                    key={cat.id}
                    className="p-3 rounded-xl bg-white/3 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-stone-200">{cat.name}</span>
                    <span className="font-bold font-mono text-stone-300">
                      {formatCurrency(cat.allocatedAmount, budget.currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Priority Milestones */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-display">
                  Next Priority Milestones
                </h3>
                <p className="text-xs text-stone-400">Backward-scheduled deliverables</p>
              </div>
              <button
                onClick={() => onNavigateTab('timeline')}
                className="text-xs text-violet-300 hover:text-white transition-colors font-semibold"
              >
                View Timeline →
              </button>
            </div>

            <div className="space-y-2.5">
              {timeline.tasks.slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-2xl bg-white/3 border border-white/5 hover:border-violet-500/30 transition-all flex items-start gap-3 group"
                >
                  <input
                    type="checkbox"
                    aria-label={`Mark ${task.name} complete`}
                    checked={task.status === 'done'}
                    onChange={() =>
                      onUpdateTask(task.id, {
                        status: task.status === 'done' ? 'pending' : 'done',
                      })
                    }
                    className="mt-1 w-4 h-4 rounded text-violet-600 bg-white/10 border-white/20 focus:ring-violet-500 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`font-semibold text-xs sm:text-sm ${
                          task.status === 'done'
                            ? 'line-through text-stone-500'
                            : 'text-white'
                        }`}
                      >
                        {task.name}
                      </span>
                      <Badge
                        variant={
                          task.priority === 'critical'
                            ? 'danger'
                            : task.priority === 'high'
                            ? 'warning'
                            : 'neutral'
                        }
                        size="sm"
                      >
                        {task.priority.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-1">
                      Due: {task.deadline}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Vendor Pipeline & Visual Inspiration */}
        <div className="space-y-7">
          {/* Vendor Sourcing Pipeline */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-display">
                  Vendor Sourcing Pipeline
                </h3>
                <p className="text-xs text-stone-400">Contracts, quotes &amp; interviews</p>
              </div>
              <button
                onClick={() => onNavigateTab('vendors')}
                className="text-xs text-violet-300 hover:text-white transition-colors font-semibold"
              >
                Manage Vendors →
              </button>
            </div>

            <div className="space-y-3">
              {vendors.slice(0, 3).map((vendor) => (
                <div
                  key={vendor.id}
                  className="p-4 rounded-2xl bg-white/3 border border-white/5 space-y-2 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-white capitalize">
                      {vendor.vendorName || `${vendor.category} Vendor`}
                    </span>
                    <Badge
                      variant={
                        vendor.status === 'booked'
                          ? 'success'
                          : vendor.status === 'shortlisted'
                          ? 'primary'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {vendor.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-300 line-clamp-1">{vendor.requirements}</p>
                  <span className="text-[11px] text-amber-300/90 font-mono block">
                    Est: {formatCurrency(vendor.estimatedBudget, budget.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sensory Highlights & Visual Moodboard Preview */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base font-display">
                  Celebration Highlights &amp; Moodboard
                </h3>
                <p className="text-xs text-stone-400">Sensory concept preview</p>
              </div>
              <button
                onClick={() => onNavigateTab('ideas')}
                className="text-xs text-violet-300 hover:text-white transition-colors font-semibold"
              >
                Explore Ideas →
              </button>
            </div>

            {/* Inspiration photo preview */}
            <div className="relative rounded-2xl overflow-hidden h-36 border border-white/10 group">
              <img
                src={media.inspirationImages[0]?.url || media.thumbnail}
                alt="Celebration Decor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider block">
                  {media.inspirationImages[0]?.category || 'Atmosphere'}
                </span>
                <span className="text-sm font-bold text-white font-display">
                  {media.inspirationImages[0]?.title || 'Signature Celebration Aesthetic'}
                </span>
              </div>
            </div>

            {/* Guest Summary Card */}
            <div className="p-4 rounded-2xl bg-white/3 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-base">
                  👥
                </span>
                <div>
                  <span className="font-bold text-xs sm:text-sm text-white block">
                    VIP Guest RSVPs
                  </span>
                  <span className="text-[11px] text-stone-400">
                    {acceptedGuests} of {event.guestCount} confirmed
                  </span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('guests')}
                className="px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 text-xs text-violet-200 font-bold transition-all"
              >
                Guest List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
