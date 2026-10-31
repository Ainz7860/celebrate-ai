// ============================================================
// CelebrateAI — useEvent Hook
// Central state management for an event with auto-save
// ============================================================

'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  EventState,
  Task,
  BudgetCategory,
  VendorEntry,
  GuestEntry,
  IdeaItem,
  RefinementProposal,
  GeneratedPlan,
} from '@/lib/types';
import { loadEventState, saveEventState } from '@/lib/storage';
import { recalculateBudget } from '@/lib/budget';
import { recalculateTimeline } from '@/lib/timeline';

export function useEvent(eventId: string | null) {
  const [state, setState] = useState<EventState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Load initial state
  useEffect(() => {
    if (!eventId) {
      setState(null);
      setIsLoading(false);
      return;
    }

    try {
      const loaded = loadEventState(eventId);
      setState(loaded);
    } catch (err) {
      console.error('[CelebrateAI] Failed to load event state:', err);
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  // Persist helper
  const persist = useCallback((nextState: EventState) => {
    setSaveStatus('saving');
    setState(nextState);
    try {
      const res = saveEventState(nextState);
      if (res.success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    }
  }, []);

  // ─── Task Actions ─────────────────────────────────────────────

  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>) => {
      if (!state || !state.plan) return;
      const updatedTasks = state.plan.timeline.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              ...updates,
              completedAt:
                updates.status === 'done'
                  ? t.completedAt || new Date().toISOString()
                  : updates.status !== undefined
                  ? undefined
                  : t.completedAt,
            }
          : t,
      );

      const newTimeline = recalculateTimeline(updatedTasks);
      const nextState: EventState = {
        ...state,
        plan: {
          ...state.plan,
          timeline: newTimeline,
        },
      };
      persist(nextState);
    },
    [state, persist],
  );

  const addTask = useCallback(
    (task: Task) => {
      if (!state || !state.plan) return;
      const updatedTasks = [task, ...state.plan.timeline.tasks];
      const newTimeline = recalculateTimeline(updatedTasks);
      persist({
        ...state,
        plan: {
          ...state.plan,
          timeline: newTimeline,
        },
      });
    },
    [state, persist],
  );

  const deleteTask = useCallback(
    (taskId: string) => {
      if (!state || !state.plan) return;
      const updatedTasks = state.plan.timeline.tasks.filter((t) => t.id !== taskId);
      const newTimeline = recalculateTimeline(updatedTasks);
      persist({
        ...state,
        plan: {
          ...state.plan,
          timeline: newTimeline,
        },
      });
    },
    [state, persist],
  );

  // ─── Budget Actions ───────────────────────────────────────────

  const updateBudgetCategory = useCallback(
    (catId: string, updates: Partial<BudgetCategory>) => {
      if (!state || !state.plan) return;
      const updatedCats = state.plan.budget.categories.map((c) =>
        c.id === catId ? { ...c, ...updates } : c,
      );
      const newBudget = recalculateBudget({
        ...state.plan.budget,
        categories: updatedCats,
      });
      persist({
        ...state,
        plan: {
          ...state.plan,
          budget: newBudget,
        },
      });
    },
    [state, persist],
  );

  const addBudgetCategory = useCallback(
    (cat: BudgetCategory) => {
      if (!state || !state.plan) return;
      const updatedCats = [...state.plan.budget.categories, cat];
      const newBudget = recalculateBudget({
        ...state.plan.budget,
        categories: updatedCats,
      });
      persist({
        ...state,
        plan: {
          ...state.plan,
          budget: newBudget,
        },
      });
    },
    [state, persist],
  );

  const deleteBudgetCategory = useCallback(
    (catId: string) => {
      if (!state || !state.plan) return;
      const updatedCats = state.plan.budget.categories.filter((c) => c.id !== catId);
      const newBudget = recalculateBudget({
        ...state.plan.budget,
        categories: updatedCats,
      });
      persist({
        ...state,
        plan: {
          ...state.plan,
          budget: newBudget,
        },
      });
    },
    [state, persist],
  );

  // ─── Vendor Actions ───────────────────────────────────────────

  const updateVendor = useCallback(
    (vendorId: string, updates: Partial<VendorEntry>) => {
      if (!state || !state.plan) return;
      const updatedVendors = state.plan.vendors.map((v) =>
        v.id === vendorId ? { ...v, ...updates } : v,
      );
      persist({
        ...state,
        plan: {
          ...state.plan,
          vendors: updatedVendors,
        },
      });
    },
    [state, persist],
  );

  const addVendor = useCallback(
    (vendor: VendorEntry) => {
      if (!state || !state.plan) return;
      persist({
        ...state,
        plan: {
          ...state.plan,
          vendors: [...state.plan.vendors, vendor],
        },
      });
    },
    [state, persist],
  );

  const deleteVendor = useCallback(
    (vendorId: string) => {
      if (!state || !state.plan) return;
      persist({
        ...state,
        plan: {
          ...state.plan,
          vendors: state.plan.vendors.filter((v) => v.id !== vendorId),
        },
      });
    },
    [state, persist],
  );

  // ─── Guest Actions ────────────────────────────────────────────

  const updateGuest = useCallback(
    (guestId: string, updates: Partial<GuestEntry>) => {
      if (!state) return;
      const updatedGuests = state.guests.map((g) =>
        g.id === guestId ? { ...g, ...updates } : g,
      );
      persist({
        ...state,
        guests: updatedGuests,
      });
    },
    [state, persist],
  );

  const addGuest = useCallback(
    (guest: GuestEntry) => {
      if (!state) return;
      persist({
        ...state,
        guests: [guest, ...state.guests],
      });
    },
    [state, persist],
  );

  const deleteGuest = useCallback(
    (guestId: string) => {
      if (!state) return;
      persist({
        ...state,
        guests: state.guests.filter((g) => g.id !== guestId),
      });
    },
    [state, persist],
  );

  // ─── Ideas Actions ────────────────────────────────────────────

  const toggleSaveIdea = useCallback(
    (ideaId: string) => {
      if (!state || !state.plan) return;
      const updatedIdeas = state.plan.ideas.map((i) =>
        i.id === ideaId ? { ...i, isUserSaved: !i.isUserSaved } : i,
      );
      persist({
        ...state,
        plan: {
          ...state.plan,
          ideas: updatedIdeas,
        },
      });
    },
    [state, persist],
  );

  const addIdea = useCallback(
    (idea: IdeaItem) => {
      if (!state || !state.plan) return;
      persist({
        ...state,
        plan: {
          ...state.plan,
          ideas: [idea, ...state.plan.ideas],
        },
      });
    },
    [state, persist],
  );

  // ─── Adaptive Replanning / Proposal Actions ───────────────────

  const setRefinementProposal = useCallback(
    (proposal: RefinementProposal | null) => {
      if (!state) return;
      persist({
        ...state,
        activeRefinement: proposal,
      });
    },
    [state, persist],
  );

  const applyRefinement = useCallback(
    (proposal: RefinementProposal, approvedChangeIds: Set<string>) => {
      if (!state || !state.plan) return;

      const currentPlan: GeneratedPlan = { ...state.plan };
      let updatedSummary = currentPlan.eventSummary;
      let updatedCategories = [...currentPlan.budget.categories];
      let updatedTasks = [...currentPlan.timeline.tasks];

      for (const change of proposal.changes) {
        if (!approvedChangeIds.has(change.id)) continue;

        if (change.section === 'summary' && typeof change.proposedValue === 'string') {
          updatedSummary = change.proposedValue;
        }

        if (change.section === 'budget' && change.recordId) {
          updatedCategories = updatedCategories.map((c) => {
            if (c.id === change.recordId || c.vendorCategory === change.field) {
              const val = Number(change.proposedValue);
              return !isNaN(val) ? { ...c, allocatedAmount: val } : c;
            }
            return c;
          });
        }

        if (change.section === 'timeline' && change.recordId) {
          updatedTasks = updatedTasks.map((t) => {
            if (t.id === change.recordId) {
              if (change.field === 'deadline' && typeof change.proposedValue === 'string') {
                return { ...t, deadline: change.proposedValue };
              }
              if (change.field === 'priority' && typeof change.proposedValue === 'string') {
                return { ...t, priority: change.proposedValue as Task['priority'] };
              }
            }
            return t;
          });
        }
      }

      const nextPlan: GeneratedPlan = {
        ...currentPlan,
        eventSummary: updatedSummary,
        budget: recalculateBudget({
          ...currentPlan.budget,
          categories: updatedCategories,
        }),
        timeline: recalculateTimeline(updatedTasks),
      };

      persist({
        ...state,
        plan: nextPlan,
        activeRefinement: null,
      });
    },
    [state, persist],
  );

  const rejectRefinement = useCallback(() => {
    if (!state) return;
    persist({
      ...state,
      activeRefinement: null,
    });
  }, [state, persist],
  );

  return {
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
    setRefinementProposal,
    applyRefinement,
    rejectRefinement,
    saveFullState: persist,
  };
}
