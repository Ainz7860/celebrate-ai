// ============================================================
// CelebrateAI — Dashboard Ideas Tab (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getCelebrationMedia } from '@/lib/celebration-media';
import type { IdeaItem, EventType } from '@/lib/types';

interface IdeasTabProps {
  ideas: IdeaItem[];
  eventType?: EventType | string;
  onToggleSaveIdea: (ideaId: string) => void;
  onAddIdea: (idea: IdeaItem) => void;
}

export const IdeasTab: React.FC<IdeasTabProps> = ({
  ideas,
  eventType,
  onToggleSaveIdea,
  onAddIdea,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const media = getCelebrationMedia(eventType);

  // New Idea Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<IdeaItem['category']>('theme');
  const [newDescription, setNewDescription] = useState('');
  const [newRationale, setNewRationale] = useState('');
  const [newEstCost, setNewEstCost] = useState('');

  const filteredIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      const matchesCat = filterCategory === 'all' || idea.category === filterCategory;
      const matchesSaved = !onlySaved || idea.isUserSaved;
      return matchesCat && matchesSaved;
    });
  }, [ideas, filterCategory, onlySaved]);

  const handleCopyHex = (hex: string) => {
    navigator.clipboard?.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const idea: IdeaItem = {
      id: uuidv4(),
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      rationale: newRationale.trim(),
      estimatedCost: newEstCost.trim() || undefined,
      isUserSaved: true,
    };

    onAddIdea(idea);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewRationale('');
    setNewEstCost('');
  };

  const savedCount = ideas.filter((i) => i.isUserSaved).length;

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ─── Curated Color Palette & Sensory Theme ──────────────── */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">{media.badgeEmoji}</span>
              <h3 className="font-extrabold text-white text-lg font-display">
                Signature Sensory Color Palette
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-1">
              Curated tonal harmonies for florals, linens, invitations, and atmospheric wash lighting.
            </p>
          </div>
          {copiedHex && (
            <span className="text-xs text-emerald-400 font-mono bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              Copied {copiedHex} to clipboard!
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-1">
          {media.colorPalette.map((color) => (
            <button
              key={color.name}
              onClick={() => handleCopyHex(color.hex)}
              className="group p-4 rounded-2xl bg-white/3 border border-white/5 hover:border-violet-500/40 transition-all text-left cursor-pointer"
            >
              <div
                className="h-16 rounded-xl shadow-lg border border-white/10 group-hover:scale-102 transition-transform"
                style={{ backgroundColor: color.hex }}
              />
              <div className="mt-3">
                <span className="font-bold text-white text-xs block font-display">
                  {color.name}
                </span>
                <span className="text-[10px] text-stone-400 block">{color.role}</span>
                <span className="text-[11px] font-mono text-violet-300 font-bold block mt-1">
                  {color.hex}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ─── Visual Moodboard Gallery ─────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-lg font-display">
              Atmospheric &amp; Decor Inspiration
            </h3>
            <p className="text-xs text-stone-400">
              Visual motifs tailored to your venue setting and celebratory style.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {media.inspirationImages.map((img, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-2xl overflow-hidden border border-white/10 group hover:border-violet-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#100C22] via-[#100C22]/30 to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#100C22]/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {img.category}
                </span>
              </div>

              <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-display">{img.title}</h4>
                  <p className="text-xs text-stone-300 font-light mt-1 leading-relaxed">
                    {img.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Curated Concept Cards & Filter Controls ──────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
              Curated Concept Dossiers
            </h2>
            <p className="text-xs text-stone-400 mt-1">
              AI-curated ideas for menu, entertainment, surprises, and cost optimizations.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setOnlySaved(!onlySaved)}
              className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-all flex items-center gap-2 cursor-pointer ${
                onlySaved
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-lg shadow-amber-500/20'
                  : 'bg-white/5 text-stone-300 border-white/10 hover:border-white/20'
              }`}
            >
              <span>⭐</span>
              <span>Saved Favorites ({savedCount})</span>
            </button>

            <select
              aria-label="Filter Category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs px-3.5 py-2 bg-[#120D26] border border-white/15 rounded-xl text-stone-200 focus:outline-none focus:border-violet-400 cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="theme">Theme &amp; Styling</option>
              <option value="decoration">Decorations</option>
              <option value="menu">Menu &amp; Catering</option>
              <option value="activity">Activities</option>
              <option value="entertainment">Entertainment</option>
              <option value="guest-experience">Guest Experience</option>
              <option value="cost-saving">Cost Saving</option>
              <option value="contingency">Contingency</option>
              <option value="accessibility">Accessibility</option>
              <option value="logistics">Logistics</option>
            </select>

            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              leftIcon={<span>+</span>}
            >
              Add Idea
            </Button>
          </div>
        </div>

        {/* Ideas Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIdeas.length === 0 ? (
            <div className="col-span-full glass-panel rounded-2xl p-16 text-center text-stone-400 text-xs">
              No concepts found matching your selected criteria.
            </div>
          ) : (
            filteredIdeas.map((idea) => {
              return (
                <Card
                  key={idea.id}
                  padding="md"
                  hoverEffect
                  className="flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-white/8">
                      <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest px-2.5 py-1 rounded-lg bg-violet-600/20 border border-violet-500/30">
                        {idea.category}
                      </span>
                      <button
                        onClick={() => onToggleSaveIdea(idea.id)}
                        className={`text-lg transition-transform active:scale-125 cursor-pointer ${
                          idea.isUserSaved
                            ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-stone-500 hover:text-amber-300'
                        }`}
                        title={idea.isUserSaved ? 'Remove bookmark' : 'Bookmark this idea'}
                      >
                        ★
                      </button>
                    </div>

                    <h3 className="font-extrabold text-base text-white mb-2 font-display">
                      {idea.title}
                    </h3>
                    <p className="text-xs text-stone-300 leading-relaxed mb-4 font-light">
                      {idea.description}
                    </p>

                    {idea.rationale && (
                      <div className="p-3 bg-white/3 rounded-xl text-[11px] text-stone-300 border border-white/5 leading-relaxed">
                        <span className="font-bold text-violet-300">Why this works: </span>
                        {idea.rationale}
                      </div>
                    )}
                  </div>

                  {idea.estimatedCost && (
                    <div className="mt-5 pt-3 border-t border-white/8 flex items-center justify-between text-xs text-stone-400">
                      <span className="text-[11px] font-semibold">Cost Impact:</span>
                      <span className="font-bold text-emerald-300 text-xs font-mono">
                        {idea.estimatedCost}
                      </span>
                    </div>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Add Custom Idea Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Creative Concept"
        subtitle="Save custom inspiration, decor themes, or celebration surprises"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Idea Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Polaroid Guestbook Station"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                aria-label="Category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as IdeaItem['category'])}
                className="w-full text-sm px-4 py-2.5 bg-[#120D26] border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              >
                <option value="theme">Theme &amp; Styling</option>
                <option value="decoration">Decoration</option>
                <option value="menu">Menu &amp; Catering</option>
                <option value="activity">Activity</option>
                <option value="entertainment">Entertainment</option>
                <option value="guest-experience">Guest Experience</option>
                <option value="cost-saving">Cost Saving</option>
                <option value="contingency">Contingency</option>
                <option value="accessibility">Accessibility</option>
                <option value="logistics">Logistics</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Estimated Cost / Impact
              </label>
              <input
                type="text"
                placeholder="e.g. ₹5,000 for film & cameras"
                value={newEstCost}
                onChange={(e) => setNewEstCost(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Description *
            </label>
            <textarea
              rows={2}
              placeholder="Describe the experience and how it will unfold..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Rationale / Why you love it
            </label>
            <input
              type="text"
              placeholder="e.g. Leaves a physical memory book for the couple"
              value={newRationale}
              onChange={(e) => setNewRationale(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Concept
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
