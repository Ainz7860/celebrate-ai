import { describe, it, expect } from 'vitest';
import {
  recalculateTimeline,
  getTaskCompletionPercent,
  getDefaultTasks,
} from '../timeline';
import type { Task } from '../types';

describe('Timeline & Task Logic', () => {
  it('correctly calculates completed, overdue, and pending counts', () => {
    const tasks: Task[] = [
      {
        id: '1',
        name: 'Task 1',
        description: '',
        deadline: '2026-01-01',
        category: 'venue',
        priority: 'critical',
        status: 'overdue',
        notes: '',
        isUserCreated: false,
      },
      {
        id: '2',
        name: 'Task 2',
        description: '',
        deadline: '2026-12-01',
        category: 'catering',
        priority: 'high',
        status: 'done',
        notes: '',
        isUserCreated: false,
        completedAt: '2026-05-01',
      },
      {
        id: '3',
        name: 'Task 3',
        description: '',
        deadline: '2026-11-01',
        category: 'planning',
        priority: 'medium',
        status: 'pending',
        notes: '',
        isUserCreated: false,
      },
    ];

    const timeline = recalculateTimeline(tasks);
    expect(timeline.totalCount).toBe(3);
    expect(timeline.completedCount).toBe(1);
    expect(timeline.overdueCount).toBe(1);
    expect(getTaskCompletionPercent(timeline)).toBe(33);
  });

  it('loads default tasks for wedding event type', () => {
    const tasks = getDefaultTasks('wedding', '2026-12-31');
    expect(tasks.length).toBeGreaterThan(10);
    const criticalTasks = tasks.filter((t) => t.priority === 'critical');
    expect(criticalTasks.length).toBeGreaterThan(0);
  });
});
