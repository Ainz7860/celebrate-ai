// ============================================================
// CelebrateAI — Dashboard Vendors Tab (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatCurrency } from '@/lib/budget';
import type { VendorEntry, VendorCategory, VendorStatus, Currency } from '@/lib/types';

interface VendorsTabProps {
  vendors: VendorEntry[];
  currency: Currency;
  onUpdateVendor: (vendorId: string, updates: Partial<VendorEntry>) => void;
  onAddVendor: (vendor: VendorEntry) => void;
  onDeleteVendor: (vendorId: string) => void;
}

export const VendorsTab: React.FC<VendorsTabProps> = ({
  vendors,
  currency,
  onUpdateVendor,
  onAddVendor,
  onDeleteVendor,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<VendorEntry | null>(null);

  // New Vendor Form
  const [newCategory, setNewCategory] = useState<VendorCategory>('venue');
  const [newVendorName, setNewVendorName] = useState('');
  const [newRequirements, setNewRequirements] = useState('');
  const [newQuestions, setNewQuestions] = useState('');
  const [newCriteria, setNewCriteria] = useState('');
  const [newEstBudget, setNewEstBudget] = useState<number>(0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vendor: VendorEntry = {
      id: uuidv4(),
      category: newCategory,
      vendorName: newVendorName.trim(),
      requirements: newRequirements.trim(),
      questionsToAsk: newQuestions.trim(),
      comparisonCriteria: newCriteria.trim(),
      estimatedBudget: Number(newEstBudget) || 0,
      status: 'not-started',
      includedServices: '',
      notes: '',
      contractReference: '',
      paymentNotes: '',
    };

    onAddVendor(vendor);
    setIsAddModalOpen(false);
    setNewVendorName('');
    setNewRequirements('');
    setNewQuestions('');
    setNewCriteria('');
    setNewEstBudget(0);
  };

  const bookedCount = vendors.filter((v) => v.status === 'booked').length;
  const contactedCount = vendors.filter((v) => v.status === 'contacted').length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Sourcing Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
            Procurement Categories
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2 font-mono">
            {vendors.length}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Categories to procure</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 shadow-lg shadow-amber-950/40">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
            In Discussions / Vetting
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-300 font-display mt-2 font-mono">
            {contactedCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Shortlisted or contacted</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block">
            Confirmed & Booked
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 font-display mt-2 font-mono">
            {bookedCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Locked contracts</span>
        </div>
      </div>

      {/* Header and Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
            Vendor Dossier & Evaluation Cards
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            Compare quotes, review recommended interview questions, and secure contracts.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<span>+</span>}
        >
          Add Sourcing Category
        </Button>
      </div>

      {/* Vendor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {vendors.map((vendor) => {
          return (
            <Card key={vendor.id} padding="md" hoverEffect className="flex flex-col justify-between">
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
                  <div>
                    <span className="text-[11px] font-bold text-violet-300 uppercase tracking-widest block mb-1">
                      {vendor.category}
                    </span>
                    <h3 className="text-lg font-bold text-white font-display">
                      {vendor.vendorName || `Unassigned ${vendor.category} Vendor`}
                    </h3>
                  </div>

                  <select
                    aria-label="Vendor Status"
                    value={vendor.status}
                    onChange={(e) =>
                      onUpdateVendor(vendor.id, {
                        status: e.target.value as VendorStatus,
                      })
                    }
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border border-white/20 bg-[#120D26] text-white focus:outline-none focus:border-violet-400 cursor-pointer"
                  >
                    <option value="not-started">Not Started</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="contacted">Contacted</option>
                    <option value="booked">Booked ✓</option>
                  </select>
                </div>

                {/* Sourcing Requirements */}
                <div className="mt-4 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-stone-300 block mb-1">Scope & Requirements:</span>
                    <p className="text-stone-300 leading-relaxed">
                      {vendor.requirements || 'No specific requirements noted.'}
                    </p>
                  </div>

                  {/* Questions to Ask */}
                  {vendor.questionsToAsk && (
                    <div className="p-4 bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-indigo-950/40 rounded-2xl border border-violet-500/30">
                      <span className="font-bold text-violet-200 block text-xs flex items-center gap-2 mb-1.5">
                        <span>💬</span> Key Vetting Questions:
                      </span>
                      <p className="text-stone-300 text-[11px] whitespace-pre-line leading-relaxed">
                        {vendor.questionsToAsk}
                      </p>
                    </div>
                  )}

                  {/* Comparison Criteria */}
                  {vendor.comparisonCriteria && (
                    <div className="pt-1">
                      <span className="font-bold text-stone-400">Selection Criteria: </span>
                      <span className="text-stone-300">{vendor.comparisonCriteria}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer / Financials & Edit */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-stone-400 block font-semibold">Target Allocation</span>
                  <span className="font-extrabold text-white text-sm font-mono">
                    {formatCurrency(vendor.estimatedBudget, currency)}
                  </span>
                  {vendor.quotedPrice && (
                    <span className="text-[11px] text-violet-300 block font-mono font-bold">
                      Quote: {formatCurrency(vendor.quotedPrice, currency)}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditingVendor(vendor)}
                    className="text-violet-300 hover:text-white font-bold text-xs px-3 py-1.5 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 border border-violet-500/40 transition-all cursor-pointer"
                  >
                    Edit / Quote
                  </button>
                  <button
                    onClick={() => onDeleteVendor(vendor.id)}
                    className="text-stone-500 hover:text-rose-400 p-2 transition-colors cursor-pointer"
                    title="Delete vendor"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Vendor / Quote Modal */}
      <Modal
        isOpen={!!editingVendor}
        onClose={() => setEditingVendor(null)}
        title={`Vendor Dossier: ${editingVendor?.category.toUpperCase()}`}
        subtitle="Record vendor business name, quote, and contractual notes"
      >
        {editingVendor && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Vendor / Business Name
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Rajputana Caterers"
                defaultValue={editingVendor.vendorName}
                onChange={(e) => (editingVendor.vendorName = e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Quoted Price ({currency})
                </label>
                <input
                  type="number"
                  min="0"
                  defaultValue={editingVendor.quotedPrice || ''}
                  onChange={(e) =>
                    (editingVendor.quotedPrice = Number(e.target.value) || undefined)
                  }
                  className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white font-mono font-bold focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select
                  aria-label="Status"
                  defaultValue={editingVendor.status}
                  onChange={(e) => (editingVendor.status = e.target.value as VendorStatus)}
                  className="w-full text-sm px-4 py-2.5 bg-[#120D26] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
                >
                  <option value="not-started">Not Started</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked ✓</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Contract Reference / Contact Phone
              </label>
              <input
                type="text"
                placeholder="e.g. Contract #492, Phone: +91 9876543210"
                defaultValue={editingVendor.contractReference}
                onChange={(e) => (editingVendor.contractReference = e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Notes & Deliverables Included
              </label>
              <textarea
                rows={3}
                defaultValue={editingVendor.notes}
                onChange={(e) => (editingVendor.notes = e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <Button variant="secondary" onClick={() => setEditingVendor(null)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onUpdateVendor(editingVendor.id, editingVendor);
                  setEditingVendor(null);
                }}
              >
                Save Details
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Sourcing Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Vendor Sourcing Category"
        subtitle="Add a new service provider requirement to your event plan"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Category *
              </label>
              <select
                aria-label="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as VendorCategory)}
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
                Estimated Budget ({currency})
              </label>
              <input
                type="number"
                min="0"
                value={newEstBudget}
                onChange={(e) => setNewEstBudget(Number(e.target.value) || 0)}
                className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Vendor Name (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Royal Decorators"
              value={newVendorName}
              onChange={(e) => setNewVendorName(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Requirements & Scope
            </label>
            <textarea
              rows={2}
              placeholder="What deliverables are expected from this vendor?"
              value={newRequirements}
              onChange={(e) => setNewRequirements(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Interview Questions
            </label>
            <textarea
              rows={2}
              placeholder="Questions to ask during vetting..."
              value={newQuestions}
              onChange={(e) => setNewQuestions(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/[0.05] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Vendor
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
