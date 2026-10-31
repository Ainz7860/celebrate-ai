// ============================================================
// CelebrateAI — Event Dashboard Shell (Luxury Glassmorphic)
// ============================================================

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEvent } from '@/hooks/useEvent';
import { OverviewTab } from './OverviewTab';
import { BudgetTab } from './BudgetTab';
import { TimelineTab } from './TimelineTab';
import { VendorsTab } from './VendorsTab';
import { GuestsTab } from './GuestsTab';
import { IdeasTab } from './IdeasTab';
import { RefinementModal } from './RefinementModal';
import { Button } from '@/components/ui/Button';
import type { DashboardTab } from '@/lib/types';

interface EventDashboardProps {
  eventId: string;
}

export const EventDashboard: React.FC<EventDashboardProps> = ({ eventId }) => {
  const {
    state,
    isLoading,
    saveStatus,
    updateTask,
    addTask,
    deleteTask,
    updateBudgetCategory,
    addBudgetCategory,
    deleteBudgetCategory,
    updateVendor,
    addVendor,
    deleteVendor,
    updateGuest,
    addGuest,
    deleteGuest,
    toggleSaveIdea,
    addIdea,
    applyRefinement,
  } = useEvent(eventId);

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isReplanningOpen, setIsReplanningOpen] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-violet-500/30" />
        <p className="text-sm font-bold text-violet-300 font-display">
          Loading your celebration master plan...
        </p>
      </div>
    );
  }

  if (!state || !state.plan) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-5">
        <span className="text-5xl block animate-bounce">🎈</span>
        <h2 className="text-3xl font-extrabold text-white font-display">Celebration Not Found</h2>
        <p className="text-sm text-stone-400">
          We couldn&apos;t find an active plan for this event ID. It may have been cleared from local storage.
        </p>
        <div className="pt-4 flex justify-center gap-4">
          <Link href="/">
            <Button variant="secondary">Go to Home</Button>
          </Link>
          <Link href="/events/new">
            <Button variant="primary">Create New Event</Button>
          </Link>
        </div>
      </div>
    );
  }

  const { event, plan, guests } = state;
  const overdueTasksCount = plan.timeline.tasks.filter((t) => t.status === 'overdue').length;
  const bookedVendorsCount = plan.vendors.filter((v) => v.status === 'booked').length;
  const savedIdeasCount = plan.ideas.filter((i) => i.isUserSaved).length;

  const tabs: Array<{
    id: DashboardTab;
    label: string;
    icon: string;
    badge?: string | number;
    badgeColor?: string;
  }> = [
    { id: 'overview', label: 'Executive Overview', icon: '📊' },
    {
      id: 'budget',
      label: 'Budget & Variance',
      icon: '💰',
      badge: plan.budget.isOverBudget ? '⚠️ Over' : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/30',
    },
    {
      id: 'timeline',
      label: 'Timeline & Milestones',
      icon: '⏱️',
      badge:
        overdueTasksCount > 0
          ? `${overdueTasksCount} overdue`
          : `${plan.timeline.completedCount}/${plan.timeline.totalCount}`,
      badgeColor:
        overdueTasksCount > 0
          ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 animate-pulse'
          : 'bg-white/10 text-stone-300',
    },
    {
      id: 'vendors',
      label: 'Vendor Guides',
      icon: '🤝',
      badge: `${bookedVendorsCount}/${plan.vendors.length}`,
    },
    {
      id: 'guests',
      label: 'VIP Guest List',
      icon: '👥',
      badge: `${guests.length}`,
    },
    {
      id: 'ideas',
      label: 'Inspiration Board',
      icon: '💡',
      badge: savedIdeasCount > 0 ? `★ ${savedIdeasCount}` : undefined,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Sub-header Breadcrumb & Autosave Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/8">
        <div className="flex items-center gap-2.5 text-xs text-stone-400 font-medium">
          <Link href="/" className="hover:text-white transition-colors">
            Celebrations
          </Link>
          <span>/</span>
          <span className="font-bold text-white truncate max-w-xs">{event.name}</span>
        </div>

        <div className="flex items-center gap-4">
          {/* Autosave Status */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span
              className={`w-2 h-2 rounded-full ${
                saveStatus === 'saved'
                  ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50'
                  : saveStatus === 'saving'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-rose-500'
              }`}
            />
            <span className="text-stone-300 capitalize font-mono text-[11px]">
              {saveStatus === 'saved' ? 'Saved to LocalStorage' : saveStatus}
            </span>
          </div>

          <Button
            variant="coral"
            size="sm"
            onClick={() => setIsReplanningOpen(true)}
            leftIcon={<span>⚡</span>}
          >
            Adaptive Replan
          </Button>
        </div>
      </div>

      {/* Segmented Floating Pill Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 p-1.5 glass-panel rounded-2xl border border-white/10 no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-linear-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/40 border border-white/20 scale-[1.02]'
                  : 'text-stone-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    tab.badgeColor ? tab.badgeColor : isActive ? 'bg-white/20 text-white' : 'bg-white/8 text-stone-300'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View */}
      <main className="space-y-8">
        {activeTab === 'overview' && (
          <OverviewTab
            state={state}
            onUpdateTask={updateTask}
            onOpenReplanning={() => setIsReplanningOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetTab
            budget={plan.budget}
            onUpdateCategory={updateBudgetCategory}
            onAddCategory={addBudgetCategory}
            onDeleteCategory={deleteBudgetCategory}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            timeline={plan.timeline}
            eventDate={event.date}
            onUpdateTask={updateTask}
            onAddTask={addTask}
            onDeleteTask={deleteTask}
          />
        )}

        {activeTab === 'vendors' && (
          <VendorsTab
            vendors={plan.vendors}
            currency={event.currency}
            onUpdateVendor={updateVendor}
            onAddVendor={addVendor}
            onDeleteVendor={deleteVendor}
          />
        )}

        {activeTab === 'guests' && (
          <GuestsTab
            guests={guests}
            targetGuestCount={event.guestCount}
            onUpdateGuest={updateGuest}
            onAddGuest={addGuest}
            onDeleteGuest={deleteGuest}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasTab
            ideas={plan.ideas}
            eventType={event.type}
            onToggleSaveIdea={toggleSaveIdea}
            onAddIdea={addIdea}
          />
        )}
      </main>

      {/* Adaptive Replanning Modal */}
      <RefinementModal
        isOpen={isReplanningOpen}
        onClose={() => setIsReplanningOpen(false)}
        state={state}
        onApplyRefinement={applyRefinement}
      />
    </div>
  );
};
