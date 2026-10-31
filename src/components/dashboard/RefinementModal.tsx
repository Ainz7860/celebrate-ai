// ============================================================
// CelebrateAI — Adaptive Replanning Modal (Cyber-Luxe Glass)
// ============================================================

'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { EventState, RefinementProposal } from '@/lib/types';

interface RefinementModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: EventState;
  onApplyRefinement: (proposal: RefinementProposal, approvedChangeIds: Set<string>) => void;
}

export const RefinementModal: React.FC<RefinementModalProps> = ({
  isOpen,
  onClose,
  state,
  onApplyRefinement,
}) => {
  const [requestText, setRequestText] = useState('');
  const [isRefining, setIsRefining] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [proposal, setProposal] = useState<RefinementProposal | null>(null);
  const [approvedChangeIds, setApprovedChangeIds] = useState<Set<string>>(new Set());

  const { event, plan } = state;
  if (!plan) return null;

  const quickScenarios = [
    { label: '🌧️ Rain forecast (outdoor backup)', text: 'Severe rain is now forecast for the event day. We need an indoor backup contingency, rain shelter, and adjusted timing.' },
    { label: '👥 Guest count increased (+30%)', text: 'Guest count increased by 30%. Recalculate catering, seating, and venue allocations while keeping total budget feasible.' },
    { label: '📉 Budget reduced by 15%', text: 'Budget has been cut by 15%. Recommend where to safely reallocate and trim without compromising core experience.' },
    { label: '⚡ Date moved 2 weeks earlier', text: 'The celebration date has moved two weeks earlier! Flag compressed deadlines, urgent tasks, and vendor confirmations.' },
  ];

  const handleRunRefinement = async () => {
    if (!requestText.trim()) return;

    setIsRefining(true);
    setErrorMsg(null);

    // Extract commitments to protect
    const bookedVendors = plan.vendors.filter((v) => v.status === 'booked').map((v) => v.category);
    const completedTaskIds = plan.timeline.tasks.filter((t) => t.status === 'done').map((t) => t.id);
    const actualSpendingByCategory: Record<string, number> = {};
    for (const cat of plan.budget.categories) {
      if (cat.actualAmount > 0) {
        actualSpendingByCategory[cat.vendorCategory] = cat.actualAmount;
      }
    }

    try {
      const res = await fetch('/api/refine-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event,
          currentPlanSummary: plan.eventSummary,
          refinementRequest: requestText,
          approvedCommitments: {
            bookedVendors,
            completedTaskIds,
            recordedPaymentIds: [],
            actualSpendingByCategory,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to refine plan.');
      }

      const receivedProposal: RefinementProposal = data.proposal;
      setProposal(receivedProposal);

      // Pre-select non-conflicting changes
      const initialApproved = new Set<string>();
      for (const ch of receivedProposal.changes) {
        if (!ch.isConflict) {
          initialApproved.add(ch.id);
        }
      }
      setApprovedChangeIds(initialApproved);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Replanning error';
      setErrorMsg(msg);
    } finally {
      setIsRefining(false);
    }
  };

  const toggleChangeApproval = (changeId: string) => {
    setApprovedChangeIds((prev) => {
      const next = new Set(prev);
      if (next.has(changeId)) {
        next.delete(changeId);
      } else {
        next.add(changeId);
      }
      return next;
    });
  };

  const handleApply = () => {
    if (!proposal) return;
    onApplyRefinement(proposal, approvedChangeIds);
    onClose();
    setProposal(null);
    setRequestText('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-base shadow-lg shadow-orange-500/30">
            ⚡
          </span>
          <span className="text-white">Adaptive Replanning Cockpit</span>
        </div>
      }
      subtitle="Recalculate allocations and schedules while preserving locked-in vendor contracts"
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Request Input Form */}
        {!proposal && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                What changed in your celebration plans? *
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Budget cut by 15%, guest count increased by 50, or heavy rain forecast requiring indoor contingency..."
                value={requestText}
                onChange={(e) => setRequestText(e.target.value)}
                className="w-full text-sm px-4 py-3 bg-white/[0.05] border border-white/15 rounded-2xl text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 leading-relaxed"
              />
            </div>

            {/* Quick Scenario Chips */}
            <div>
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block mb-2.5">
                Or select an instant scenario:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {quickScenarios.map((scen, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRequestText(scen.text)}
                    className="text-xs px-3 py-2 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-violet-600/25 hover:border-violet-400/50 hover:text-white transition-all text-stone-300 font-semibold cursor-pointer"
                  >
                    {scen.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-xs text-rose-200">
                {errorMsg}
              </div>
            )}

            <div className="p-4 bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-indigo-950/40 border border-violet-500/30 rounded-2xl text-xs space-y-1.5">
              <span className="font-bold text-violet-200 block text-sm flex items-center gap-1.5">
                <span>🛡️</span> Guaranteed Commitment Shield:
              </span>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                CelebrateAI automatically locks and protects your confirmed vendors, completed tasks, and
                recorded spend from being overwritten during synthesis.
              </p>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <Button variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="coral"
                onClick={handleRunRefinement}
                isLoading={isRefining}
                disabled={!requestText.trim()}
                leftIcon={<span>⚡</span>}
              >
                Analyze & Replan
              </Button>
            </div>
          </div>
        )}

        {/* Proposal Review Screen */}
        {proposal && (
          <div className="space-y-5 animate-fade-in">
            {/* Overall Rationale */}
            <div className="p-4 bg-white/[0.04] rounded-2xl border border-white/10 text-xs space-y-2">
              <span className="font-bold text-violet-300 uppercase tracking-wider block text-[11px]">
                AI Strategic Analysis
              </span>
              <p className="text-stone-200 leading-relaxed">{proposal.overallRationale}</p>
            </div>

            {/* Trade-offs & Conflicts */}
            {proposal.tradeOffs && proposal.tradeOffs.length > 0 && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs space-y-2">
                <span className="font-bold text-amber-300 flex items-center gap-2 text-sm">
                  <span>⚖️</span> Trade-Offs Considered:
                </span>
                <ul className="list-disc list-inside space-y-1 text-stone-300 text-[11px]">
                  {proposal.tradeOffs.map((to, i) => (
                    <li key={i}>{to}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Changes List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-300 uppercase tracking-widest">
                  Proposed Adjustments ({proposal.changes.length})
                </span>
                <span className="text-[11px] text-stone-400">
                  Select which adjustments to commit
                </span>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {proposal.changes.map((change) => {
                  const isChecked = approvedChangeIds.has(change.id);

                  return (
                    <div
                      key={change.id}
                      className={`p-4 rounded-2xl border text-xs transition-all flex items-start gap-3.5 ${
                        change.isConflict
                          ? 'border-rose-500/40 bg-rose-950/20'
                          : isChecked
                          ? 'border-violet-500/40 bg-violet-950/20'
                          : 'border-white/10 bg-white/[0.03]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleChangeApproval(change.id)}
                        className="mt-1 h-5 w-5 text-violet-600 rounded-lg border-white/20 bg-white/10 focus:ring-violet-500 cursor-pointer"
                      />

                      <div className="flex-1 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-violet-300 uppercase text-[10px] px-2 py-0.5 bg-violet-500/20 border border-violet-500/30 rounded-md">
                            {change.section}
                          </span>
                          <span className="font-bold text-white">{change.field}</span>
                          {change.isConflict && (
                            <Badge variant="danger" size="sm">
                              Protected Conflict
                            </Badge>
                          )}
                        </div>

                        <div className="text-xs text-stone-300 flex items-center gap-2 font-mono">
                          <span className="line-through text-stone-500">
                            {String(change.previousValue)}
                          </span>
                          <span>→</span>
                          <span className="font-bold text-violet-300">
                            {String(change.proposedValue)}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-400">{change.rationale}</p>

                        {change.conflictDescription && (
                          <p className="text-[11px] font-bold text-rose-300">
                            ⚠️ {change.conflictDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setProposal(null);
                  setErrorMsg(null);
                }}
              >
                Back to Edit
              </Button>

              <div className="flex items-center gap-3">
                <Button variant="secondary" size="sm" onClick={onClose}>
                  Discard
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApply}
                  disabled={approvedChangeIds.size === 0}
                  leftIcon={<span>✓</span>}
                >
                  Apply {approvedChangeIds.size} Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
