// ============================================================
// CelebrateAI — Dashboard Guests Tab (Luxury Cyber-Luxe)
// ============================================================

'use client';

import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { calculateGuestStats } from '@/lib/guests';
import type { GuestEntry, RSVPStatus, InvitationStatus } from '@/lib/types';

interface GuestsTabProps {
  guests: GuestEntry[];
  targetGuestCount: number;
  onUpdateGuest: (guestId: string, updates: Partial<GuestEntry>) => void;
  onAddGuest: (guest: GuestEntry) => void;
  onDeleteGuest: (guestId: string) => void;
}

export const GuestsTab: React.FC<GuestsTabProps> = ({
  guests,
  targetGuestCount,
  onUpdateGuest,
  onAddGuest,
  onDeleteGuest,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRsvp, setFilterRsvp] = useState<string>('all');

  // Form State
  const [name, setName] = useState('');
  const [attendeeCount, setAttendeeCount] = useState<number>(1);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [accessibilityNotes, setAccessibilityNotes] = useState('');
  const [notes, setNotes] = useState('');

  const stats = useMemo(() => calculateGuestStats(guests), [guests]);

  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const matchesSearch =
        guest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (guest.email && guest.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (guest.dietaryNotes && guest.dietaryNotes.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesRsvp = filterRsvp === 'all' || guest.rsvpStatus === filterRsvp;
      return matchesSearch && matchesRsvp;
    });
  }, [guests, searchQuery, filterRsvp]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newGuest: GuestEntry = {
      id: uuidv4(),
      name: name.trim(),
      attendeeCount: Math.max(1, Number(attendeeCount) || 1),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      invitationStatus: 'not-sent',
      rsvpStatus: 'pending',
      dietaryNotes: dietaryNotes.trim(),
      accessibilityNotes: accessibilityNotes.trim(),
      notes: notes.trim(),
    };

    onAddGuest(newGuest);
    setIsAddModalOpen(false);
    setName('');
    setAttendeeCount(1);
    setEmail('');
    setPhone('');
    setDietaryNotes('');
    setAccessibilityNotes('');
    setNotes('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* RSVP Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
            Target Attendees
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white font-display mt-2 font-mono">
            {targetGuestCount}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Expected event capacity</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-emerald-500/30 shadow-lg shadow-emerald-950/40">
          <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-widest block">
            Confirmed Attending
          </span>
          <p className="text-2xl sm:text-3xl font-black text-emerald-300 font-display mt-2 font-mono">
            {stats.accepted}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">
            {stats.totalAttendees} total seats confirmed
          </span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-amber-500/30 shadow-lg shadow-amber-950/40">
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-widest block">
            Awaiting RSVP
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-300 font-display mt-2 font-mono">
            {stats.pending + stats.maybe}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Pending guest responses</span>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-white/10 shadow-lg">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest block">
            Declined
          </span>
          <p className="text-2xl sm:text-3xl font-black text-stone-400 font-display mt-2 font-mono">
            {stats.declined}
          </p>
          <span className="text-xs text-stone-400 mt-1 block">Unable to attend</span>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-panel rounded-2xl border border-white/10">
        <div className="w-full sm:w-80">
          <input
            type="text"
            placeholder="Search guests or dietary needs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            aria-label="Filter RSVP Status"
            value={filterRsvp}
            onChange={(e) => setFilterRsvp(e.target.value)}
            className="text-xs px-3 py-2 bg-[#120D26] border border-white/15 rounded-xl text-stone-200 focus:outline-none focus:border-violet-400 cursor-pointer"
          >
            <option value="all">All RSVPs</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="declined">Declined</option>
            <option value="maybe">Maybe</option>
          </select>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<span>+</span>}
          >
            Add Guest / Party
          </Button>
        </div>
      </div>

      {/* Guest Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-stone-400 font-bold uppercase tracking-wider text-[11px] bg-white/2">
                <th className="py-4 px-5">Guest / Family Name</th>
                <th className="py-4 px-4">Party Size</th>
                <th className="py-4 px-4">RSVP Status</th>
                <th className="py-4 px-4">Invitation Status</th>
                <th className="py-4 px-4">Dietary Accommodations</th>
                <th className="py-4 px-4">Accessibility</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No guests recorded. Click &quot;Add Guest / Party&quot; to build your attendee list.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => {
                  return (
                    <tr key={guest.id} className="hover:bg-white/4 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-extrabold text-white text-sm block font-display">
                          {guest.name}
                        </span>
                        {(guest.email || guest.phone) && (
                          <span className="text-[11px] text-stone-400 mt-0.5 block">
                            {[guest.email, guest.phone].filter(Boolean).join(' • ')}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4 font-mono font-bold text-stone-200">
                        {guest.attendeeCount} {guest.attendeeCount === 1 ? 'seat' : 'seats'}
                      </td>

                      <td className="py-4 px-4">
                        <select
                          aria-label="RSVP Status"
                          value={guest.rsvpStatus}
                          onChange={(e) =>
                            onUpdateGuest(guest.id, {
                              rsvpStatus: e.target.value as RSVPStatus,
                            })
                          }
                          className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                            guest.rsvpStatus === 'accepted'
                              ? 'bg-emerald-500/20 text-emerald-200 border-emerald-500/40'
                              : guest.rsvpStatus === 'declined'
                              ? 'bg-rose-500/20 text-rose-200 border-rose-500/40'
                              : 'bg-white/6 text-stone-300 border-white/10'
                          }`}
                        >
                          <option value="pending" className="bg-[#120D26]">Pending</option>
                          <option value="accepted" className="bg-[#120D26]">Accepted ✓</option>
                          <option value="declined" className="bg-[#120D26]">Declined ✗</option>
                          <option value="maybe" className="bg-[#120D26]">Maybe ?</option>
                        </select>
                      </td>

                      <td className="py-4 px-4">
                        <select
                          aria-label="Invitation Status"
                          value={guest.invitationStatus}
                          onChange={(e) =>
                            onUpdateGuest(guest.id, {
                              invitationStatus: e.target.value as InvitationStatus,
                            })
                          }
                          className="text-xs px-3 py-1.5 rounded-xl border border-white/15 bg-[#120D26] text-stone-300 cursor-pointer"
                        >
                          <option value="not-sent" className="bg-[#120D26]">Not Sent</option>
                          <option value="sent" className="bg-[#120D26]">Sent</option>
                          <option value="delivered" className="bg-[#120D26]">Delivered</option>
                        </select>
                      </td>

                      <td className="py-4 px-4">
                        {guest.dietaryNotes ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold text-[11px]">
                            🥗 {guest.dietaryNotes}
                          </span>
                        ) : (
                          <span className="text-stone-500">—</span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        {guest.accessibilityNotes ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-200 border border-cyan-500/30 font-semibold text-[11px]">
                            ♿ {guest.accessibilityNotes}
                          </span>
                        ) : (
                          <span className="text-stone-500">—</span>
                        )}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => onDeleteGuest(guest.id)}
                          className="text-stone-500 hover:text-rose-400 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                          title="Delete guest"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Guest Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add VIP Guest or Party"
        subtitle="Track seat allocations, meals, and accommodations"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Guest / Party Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Vikramaditya & Family"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Seats Count *
              </label>
              <input
                type="number"
                min="1"
                max="50"
                value={attendeeCount}
                onChange={(e) => setAttendeeCount(Math.max(1, Number(e.target.value) || 1))}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white font-mono focus:outline-none focus:border-violet-400"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="e.g. guest@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Dietary Restrictions / Allergies
            </label>
            <input
              type="text"
              placeholder="e.g. Jain food only, severe peanut allergy, vegan..."
              value={dietaryNotes}
              onChange={(e) => setDietaryNotes(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
              Accessibility Accommodations
            </label>
            <input
              type="text"
              placeholder="e.g. Wheelchair access, elder seating, quiet lounge..."
              value={accessibilityNotes}
              onChange={(e) => setAccessibilityNotes(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/8">
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Guest
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
