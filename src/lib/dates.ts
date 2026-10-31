// ============================================================
// CelebrateAI — Date & Timeline Utilities
// ============================================================

/**
 * Parse a local YYYY-MM-DD date string to a Date at local midnight.
 * We deliberately avoid UTC conversion to preserve the displayed date.
 */
export function parseLocalDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get today's date as a YYYY-MM-DD string (local time).
 */
export function todayString(): string {
  const d = new Date();
  return formatDateString(d);
}

/**
 * Format a Date to YYYY-MM-DD using local calendar date.
 */
export function formatDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Add days to a local date and return YYYY-MM-DD string.
 */
export function addDays(dateStr: string, days: number): string {
  const d = parseLocalDate(dateStr);
  d.setDate(d.getDate() + days);
  return formatDateString(d);
}

/**
 * Subtract days from a local date and return YYYY-MM-DD string.
 */
export function subtractDays(dateStr: string, days: number): string {
  return addDays(dateStr, -days);
}

/**
 * Compute a task deadline based on event date and days-before-event.
 * Clamps to today (minimum) if the computed deadline would be in the past.
 */
export function computeDeadline(eventDate: string, daysBeforeEvent: number): string {
  const computed = subtractDays(eventDate, daysBeforeEvent);
  const today = todayString();
  return computed >= today ? computed : today;
}

/**
 * Return number of days between two local date strings (to - from).
 * Positive if to is after from.
 */
export function daysBetween(from: string, to: string): number {
  const f = parseLocalDate(from).getTime();
  const t = parseLocalDate(to).getTime();
  return Math.round((t - f) / (1000 * 60 * 60 * 24));
}

/**
 * Return number of days until the given local date from today.
 * Positive if in the future, negative if in the past.
 */
export function daysUntil(dateStr: string): number {
  return daysBetween(todayString(), dateStr);
}

/**
 * Check if a date string is in the past (before today).
 */
export function isInThePast(dateStr: string): boolean {
  return dateStr < todayString();
}

/**
 * Check if a date string is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === todayString();
}

/**
 * Format a date string for display: "24 Oct 2026"
 */
export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = parseLocalDate(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format a date string for display relative to today: "in 3 days", "2 days ago"
 */
export function formatRelativeDate(dateStr: string): string {
  const days = daysBetween(todayString(), dateStr);
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 0) return `in ${days} day${days === 1 ? '' : 's'}`;
  return `${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
}

/**
 * Validate event date:
 * - Must be a valid date
 * - Must not be more than 5 years in the future
 * Returns an error string or null if valid.
 * Note: Today's date is allowed (same-day events).
 */
export function validateEventDate(dateStr: string): string | null {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return 'Invalid date format.';
  }
  const d = parseLocalDate(dateStr);
  if (isNaN(d.getTime())) {
    return 'Invalid calendar date.';
  }
  const today = todayString();
  if (dateStr < today) {
    return 'Event date cannot be in the past.';
  }
  const fiveYearsLater = addDays(today, 5 * 365);
  if (dateStr > fiveYearsLater) {
    return 'Event date is too far in the future (5-year limit).';
  }
  return null;
}

/**
 * Validate that end time is after start time on the same day.
 */
export function validateTimeRange(startTime?: string, endTime?: string): string | null {
  if (!startTime || !endTime) return null;
  if (endTime <= startTime) {
    return 'End time must be after start time.';
  }
  return null;
}
