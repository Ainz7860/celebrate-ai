// ============================================================
// CelebrateAI — Guest List Utilities
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type { GuestEntry, GuestStats } from './types';

export function createGuest(params: Partial<GuestEntry> & { name: string }): GuestEntry {
  return {
    id: uuidv4(),
    email: '',
    phone: '',
    invitationStatus: 'not-sent',
    rsvpStatus: 'pending',
    attendeeCount: 1,
    dietaryNotes: '',
    accessibilityNotes: '',
    notes: '',
    ...params,
  };
}

export function calculateGuestStats(guests: GuestEntry[]): GuestStats {
  const total = guests.length;
  const invited = guests.filter((g) => g.invitationStatus !== 'not-sent').length;
  const accepted = guests.filter((g) => g.rsvpStatus === 'accepted').length;
  const declined = guests.filter((g) => g.rsvpStatus === 'declined').length;
  const maybe = guests.filter((g) => g.rsvpStatus === 'maybe').length;
  const pending = guests.filter((g) => g.rsvpStatus === 'pending').length;
  const totalAttendees = guests
    .filter((g) => g.rsvpStatus === 'accepted')
    .reduce((s, g) => s + g.attendeeCount, 0);

  return { total, invited, accepted, declined, maybe, pending, totalAttendees };
}
