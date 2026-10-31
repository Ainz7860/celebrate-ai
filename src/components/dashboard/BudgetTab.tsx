// ============================================================
// CelebrateAI — Dashboard Budget Tab (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/budget';
import type { BudgetPlan, BudgetCategory, Currency, VendorCategory } from '@/lib/types';

interface BudgetTabProps {
  budget: BudgetPlan;
  onUpdateCategory: (catId: string, updates: Partial<BudgetCategory>) => void;
  onAddCategory: (cat: BudgetCategory) => void;
  onDeleteCategory: (catId: string) => void;
}

export const BudgetTab: React.FC<BudgetTabProps> = ({
  budget,
  onUpdateCategory,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);

  // New Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [newCatVendor, setNewCatVendor] = useState<VendorCategory>('decorations');
  const [newCatAllocated, setNewCatAllocated] = useState<number>(0);
  const [newCatNotes, setNewCatNotes] = useState('');

  // Payment Recording State
  const [expenseModalCat, setExpenseModalCat] = useState<BudgetCategory | null>(null);
  const [expenseAmount, setExpenseAmount] = useState<number>(0);

  const { totalBudget, currency, contingencyPercent, contingencyAmount, categories } = budget;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newCategory: BudgetCategory = {
      id: uuidv4(),
      name: newCatName.trim(),
      vendorCategory: newCatVendor,
      allocatedAmount: Number(newCatAllocated) || 0,
      estimatedAmount: Number(newCatAllocated) || 0,
      actualAmount: 0,
      notes: newCatNotes.trim(),
    };

    onAddCategory(newCategory);
    setIsAddModalOpen(false);
    setNewCatName('');
    setNewCatAllocated(0);
    setNewCatNotes('');
  };

  const handleRecordExpense = () => {
    if (!expenseModalCat) return;
    const updatedActual = expenseModalCat.actualAmount + (Number(expenseAmount) || 0);
    onUpdateCategory(expenseModalCat.id, { actualAmount: updatedActual });
    setExpenseModalCat(null);
    setExpenseAmount(0);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Alert if Over Budget or Over Spent */}
      {budget.isOverBudget && (
        <div className="p-5 bg-rose-500/20 border border-rose-500/40 rounded-3xl flex items-start gap-4 text-rose-200 text-xs sm:text-sm shadow-xl shadow-rose-950/40">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-extrabold text-white text-base font-display">
              Total Allocations Exceed Budget
            </p>
            <p className="text-rose-300 text-xs mt-1 leading-relaxed">
              The total allocated across all categories ({formatCurrency(budget.totalAllocated, currency)})
              exceeds your set budget of {formatCurrency(totalBudget, currency)}. Adjust category allocations or run
              Adaptive Replanning.
            </p>
          </div>
        </div>
      )}

      {/* Financial Health Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
            Total Event Budget
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2 font-mono">
            {formatCurrency(totalBudget, currency)}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Baseline spending limit</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-violet-500/30 shadow-lg shadow-violet-950/40">
          <span className="text-[11px] font-bold text-violet-300 uppercase tracking-widest block">
            Total Target Allocated
          </span>
          <p className="text-2xl sm:text-3xl font-black text-violet-300 font-display mt-2 font-mono">
            {formatCurrency(budget.totalAllocated, currency)}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">
            {totalBudget > 0 ? Math.round((budget.totalAllocated / totalBudget) * 100) : 0}% of total budget
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block">
            Contingency Vault ({contingencyPercent}%)
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 font-display mt-2 font-mono">
            {formatCurrency(contingencyAmount, currency)}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Guaranteed emergency buffer</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
            Actual Spent
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2 font-mono">
            {formatCurrency(budget.totalActual, currency)}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">
            Remaining: {formatCurrency(totalBudget - budget.totalActual, currency)}
          </span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <Card
        title="Category Budget Allocations"
        subtitle="Manage and track actual spend vs target allocations"
        headerAction={
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<span>+</span>}
          >
            Add Category
          </Button>
        }
      >
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Allocated Target</th>
                <th className="py-3.5 px-3">Estimated</th>
                <th className="py-3.5 px-3">Actual Spent</th>
                <th className="py-3.5 px-3">Variance</th>
                <th className="py-3.5 px-3">Notes</th>
                <th className="py-3.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {categories.map((cat) => {
                const variance = cat.allocatedAmount - cat.actualAmount;
                const isOver = variance < 0;
                const percentOfTotal =
                  totalBudget > 0
                    ? Math.round((cat.allocatedAmount / totalBudget) * 100)
                    : 0;

                return (
                  <tr key={cat.id} className="hover:bg-white/4 transition-colors">
                    <td className="py-4 px-3">
                      <span className="font-extrabold text-white text-sm block font-display">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-violet-300 uppercase tracking-wider font-semibold">
                        {cat.vendorCategory} • {percentOfTotal}%
                      </span>
                    </td>

                    <td className="py-4 px-3 font-semibold text-white font-mono">
                      {editingCatId === cat.id ? (
                        <input
                          type="number"
                          defaultValue={cat.allocatedAmount}
                          onBlur={(e) => {
                            onUpdateCategory(cat.id, {
                              allocatedAmount: Number(e.target.value) || 0,
                            });
                            setEditingCatId(null);
                          }}
                          className="w-28 px-2.5 py-1 text-xs bg-[#120D26] border border-violet-400 rounded-lg text-white font-mono focus:ring-1 focus:ring-violet-500"
                          autoFocus
                        />
                      ) : (
                        <button
                          onClick={() => setEditingCatId(cat.id)}
                          className="hover:text-violet-300 flex items-center gap-1.5 group cursor-pointer"
                          title="Click to edit target"
                        >
                          <span>{formatCurrency(cat.allocatedAmount, currency)}</span>
                          <span className="text-[10px] text-stone-500 group-hover:text-violet-300">✎</span>
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-3 text-stone-400 font-mono">
                      {formatCurrency(cat.estimatedAmount, currency)}
                    </td>

                    <td className="py-4 px-3 font-bold font-mono">
                      <span className={cat.actualAmount > 0 ? 'text-white' : 'text-stone-500'}>
                        {formatCurrency(cat.actualAmount, currency)}
                      </span>
                    </td>

                    <td className="py-4 px-3 font-mono">
                      <span
                        className={`font-bold ${
                          isOver ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isOver ? '-' : '+'}
                        {formatCurrency(Math.abs(variance), currency)}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-stone-400 max-w-50 truncate" title={cat.notes}>
                      {cat.notes || '—'}
                    </td>

                    <td className="py-4 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setExpenseModalCat(cat);
                          setExpenseAmount(0);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-violet-600/30 text-violet-200 hover:bg-violet-600/50 border border-violet-500/40 font-semibold transition-all cursor-pointer"
                      >
                        + Log Spend
                      </button>
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="text-stone-500 hover:text-rose-400 p-1.5 transition-colors cursor-pointer"
                        title="Delete category"
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Budget Category"
        subtitle="Create a new allocation bucket for your event"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Category Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Photo Booth, Special Fireworks"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Vendor Type
              </label>
              <select
                aria-label="Vendor Type"
                value={newCatVendor}
                onChange={(e) => setNewCatVendor(e.target.value as VendorCategory)}
                className="w-full text-sm px-4 py-2.5 bg-[#120D26] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              >
                <option value="venue">Venue</option>
                <option value="catering">Catering</option>
                <option value="photography">Photography</option>
                <option value="videography">Videography</option>
                <option value="decorations">Decorations</option>
                <option value="entertainment">Entertainment</option>
                <option value="transport">Transport</option>
                <option value="equipment-rental">Equipment Rental</option>
                <option value="flowers">Flowers</option>
                <option value="cake">Cake</option>
                <option value="attire">Attire</option>
                <option value="makeup">Makeup / Grooming</option>
                <option value="invitations">Invitations</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Allocated Amount ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={newCatAllocated}
                onChange={(e) => setNewCatAllocated(Number(e.target.value) || 0)}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Notes / Assumptions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Estimated based on quotes..."
              value={newCatNotes}
              onChange={(e) => setNewCatNotes(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Category
            </Button>
          </div>
        </form>
      </Modal>

      {/* Record Spend Modal */}
      <Modal
        isOpen={!!expenseModalCat}
        onClose={() => setExpenseModalCat(null)}
        title={`Log Payment: ${expenseModalCat?.name}`}
        subtitle="Add an actual payment or expense to this category"
      >
        <div className="space-y-4">
          <p className="text-xs text-stone-300">
            Current logged spend: <strong>{formatCurrency(expenseModalCat?.actualAmount || 0, currency)}</strong> (Target: {formatCurrency(expenseModalCat?.allocatedAmount || 0, currency)})
          </p>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Payment Amount ({currency}) *
            </label>
            <input
              type="number"
              min="1"
              value={expenseAmount}
              onChange={(e) => setExpenseAmount(Number(e.target.value) || 0)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-400"
              placeholder="Enter amount paid"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
            <Button variant="secondary" onClick={() => setExpenseModalCat(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRecordExpense}>
              Save Spend
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
