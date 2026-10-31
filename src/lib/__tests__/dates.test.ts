import { describe, it, expect } from 'vitest';
import {
  parseLocalDate,
  formatDateString,
  addDays,
  subtractDays,
  computeDeadline,
  daysBetween,
  daysUntil,
  isInThePast,
  isToday,
  todayString,
} from '../dates';

describe('Date Utilities', () => {
  it('parses local date without time zone drift', () => {
    const d = parseLocalDate('2026-10-24');
    expect(d.getFullYear()).toBe(2026);
    expect(d.getMonth()).toBe(9); // 0-indexed month
    expect(d.getDate()).toBe(24);
  });

  it('formats Date to YYYY-MM-DD correctly', () => {
    const d = new Date(2026, 4, 15);
    expect(formatDateString(d)).toBe('2026-05-15');
  });

  it('adds and subtracts days accurately across month boundaries', () => {
    expect(addDays('2026-01-30', 5)).toBe('2026-02-04');
    expect(subtractDays('2026-03-01', 2)).toBe('2026-02-27');
  });

  it('computes daysBetween correctly', () => {
    expect(daysBetween('2026-10-20', '2026-10-25')).toBe(5);
    expect(daysBetween('2026-10-25', '2026-10-20')).toBe(-5);
  });

  it('computes deadlines backwards from event date', () => {
    const deadline = computeDeadline('2026-12-31', 30);
    expect(deadline).toBe('2026-12-01');
  });
});
