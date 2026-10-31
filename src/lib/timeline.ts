// ============================================================
// CelebrateAI — Timeline / Task Logic
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import { computeDeadline, todayString, daysBetween } from './dates';
import type { Task, TaskCategory, TaskPriority, TimelinePlan, EventType } from './types';

// ─── Task Factories ───────────────────────────────────────────

export function createTask(params: Partial<Task> & { name: string; deadline: string }): Task {
  return {
    id: uuidv4(),
    description: '',
    category: 'planning',
    priority: 'medium',
    status: 'pending',
    notes: '',
    isUserCreated: true,
    ...params,
  };
}

// ─── Timeline Calculations ────────────────────────────────────

export function recalculateTimeline(tasks: Task[]): TimelinePlan {
  const today = todayString();
  const nextWeek = daysBetween(today, today) + 7;

  const updatedTasks = tasks.map((t) => {
    if (t.status === 'done') return t;
    if (t.deadline < today) {
      return { ...t, status: 'overdue' as const };
    }
    return t;
  });

  const completedCount = updatedTasks.filter((t) => t.status === 'done').length;
  const overdueCount = updatedTasks.filter((t) => t.status === 'overdue').length;
  const upcomingCount = updatedTasks.filter((t) => {
    const daysUntil = daysBetween(today, t.deadline);
    return t.status !== 'done' && daysUntil >= 0 && daysUntil <= 7;
  }).length;

  const criticalPending = updatedTasks.filter(
    (t) => t.priority === 'critical' && t.status !== 'done',
  );

  return {
    tasks: updatedTasks,
    completedCount,
    totalCount: updatedTasks.length,
    overdueCount,
    upcomingCount,
    criticalPending,
  };
}

export function getTaskCompletionPercent(timeline: TimelinePlan): number {
  if (timeline.totalCount === 0) return 0;
  return Math.round((timeline.completedCount / timeline.totalCount) * 100);
}

// ─── AI Task Conversion ────────────────────────────────────────

export function buildTasksFromAI(
  aiTasks: Array<{
    name: string;
    description: string;
    daysBeforeEvent: number;
    category: string;
    priority: string;
    guidance?: string;
  }>,
  eventDate: string,
  existingTaskIds: Set<string>,
): Task[] {
  const today = todayString();
  return aiTasks.map((t) => {
    const deadline = computeDeadline(eventDate, t.daysBeforeEvent);
    return {
      id: uuidv4(),
      name: t.name,
      description: t.guidance || t.description,
      deadline,
      category: t.category as TaskCategory,
      priority: t.priority as TaskPriority,
      status: deadline < today ? 'overdue' : 'pending',
      notes: '',
      isUserCreated: false,
    };
  });
}

// ─── Default Task Templates (fallback / demo) ─────────────────

const WEDDING_TASKS = [
  { name: 'Set budget and priorities', daysBeforeEvent: 365, category: 'planning', priority: 'critical', description: 'Define your total budget and identify your top 3 priorities for the day.' },
  { name: 'Book ceremony venue', daysBeforeEvent: 300, category: 'venue', priority: 'critical', description: 'Research, visit, and confirm your ceremony location.' },
  { name: 'Book reception venue', daysBeforeEvent: 270, category: 'venue', priority: 'critical', description: 'Book your reception hall, garden, or banquet space.' },
  { name: 'Hire photographer', daysBeforeEvent: 240, category: 'photography', priority: 'critical', description: 'Review portfolios and book photographer and videographer.' },
  { name: 'Send save-the-dates', daysBeforeEvent: 180, category: 'invitations', priority: 'high', description: 'Send save-the-date cards to all guests.' },
  { name: 'Book caterer', daysBeforeEvent: 150, category: 'catering', priority: 'critical', description: 'Schedule tastings and confirm menu with caterer.' },
  { name: 'Book entertainment / DJ / band', daysBeforeEvent: 120, category: 'entertainment', priority: 'high', description: 'Confirm entertainment for ceremony and reception.' },
  { name: 'Order wedding attire', daysBeforeEvent: 120, category: 'attire', priority: 'high', description: 'Order and arrange fittings for wedding dress, suit/sherwani.' },
  { name: 'Send wedding invitations', daysBeforeEvent: 90, category: 'invitations', priority: 'high', description: 'Post or hand-deliver formal invitations.' },
  { name: 'Arrange floral decorations', daysBeforeEvent: 90, category: 'decorations', priority: 'medium', description: 'Finalise floral arrangements with your florist.' },
  { name: 'Arrange transport', daysBeforeEvent: 60, category: 'transport', priority: 'medium', description: 'Book cars, shuttles, or limousines for the day.' },
  { name: 'RSVP deadline', daysBeforeEvent: 45, category: 'invitations', priority: 'high', description: 'Collect all RSVPs and confirm final guest count.' },
  { name: 'Confirm vendor details', daysBeforeEvent: 14, category: 'planning', priority: 'critical', description: 'Call all vendors to reconfirm timing, location, and setup.' },
  { name: 'Final dress fitting', daysBeforeEvent: 14, category: 'attire', priority: 'high', description: 'Last fitting to ensure attire is ready.' },
  { name: 'Prepare seating plan', daysBeforeEvent: 10, category: 'planning', priority: 'high', description: 'Finalise and print table seating arrangements.' },
  { name: 'Prepare schedule / run sheet', daysBeforeEvent: 7, category: 'planning', priority: 'critical', description: 'Create minute-by-minute event timeline for vendors and family.' },
  { name: 'Pack honeymoon bags', daysBeforeEvent: 3, category: 'other', priority: 'medium', description: 'Pack for honeymoon and prepare any travel documents.' },
  { name: 'Wedding day briefing', daysBeforeEvent: 1, category: 'planning', priority: 'critical', description: 'Briefing with vendors, MC, and bridal party.' },
];

const BIRTHDAY_TASKS = [
  { name: 'Define theme and guest list', daysBeforeEvent: 60, category: 'planning', priority: 'critical', description: 'Decide on a theme and compile your guest list.' },
  { name: 'Book venue', daysBeforeEvent: 45, category: 'venue', priority: 'critical', description: 'Book party venue or arrange home space.' },
  { name: 'Send invitations', daysBeforeEvent: 30, category: 'invitations', priority: 'high', description: 'Send digital or physical invitations to all guests.' },
  { name: 'Order birthday cake', daysBeforeEvent: 14, category: 'catering', priority: 'high', description: 'Order custom cake from baker with theme specifications.' },
  { name: 'Arrange decorations', daysBeforeEvent: 14, category: 'decorations', priority: 'medium', description: 'Buy or hire balloons, banners, and themed decorations.' },
  { name: 'Book entertainment', daysBeforeEvent: 14, category: 'entertainment', priority: 'medium', description: 'Book DJ, clown, magician, or activities as needed.' },
  { name: 'Arrange catering / food', daysBeforeEvent: 7, category: 'catering', priority: 'high', description: 'Confirm catering, buffet, or order food for the party.' },
  { name: 'RSVP final count', daysBeforeEvent: 5, category: 'invitations', priority: 'high', description: 'Collect all RSVPs and confirm attendee numbers.' },
  { name: 'Prepare party favors', daysBeforeEvent: 3, category: 'other', priority: 'low', description: 'Prepare gift bags or party favors for guests.' },
  { name: 'Setup venue', daysBeforeEvent: 1, category: 'decorations', priority: 'critical', description: 'Decorate venue and test all equipment.' },
];

const COMMUNITY_TASKS = [
  { name: 'Define event goals and format', daysBeforeEvent: 90, category: 'planning', priority: 'critical', description: 'Clarify purpose, format, and expected outcomes.' },
  { name: 'Obtain necessary permits', daysBeforeEvent: 75, category: 'legal', priority: 'critical', description: 'Apply for public event permits, noise permits, or land-use approvals.' },
  { name: 'Secure venue or outdoor space', daysBeforeEvent: 60, category: 'venue', priority: 'critical', description: 'Book community hall, park, or public space.' },
  { name: 'Recruit volunteers', daysBeforeEvent: 45, category: 'planning', priority: 'high', description: 'Organise volunteer teams for setup, registration, and cleanup.' },
  { name: 'Arrange equipment rental', daysBeforeEvent: 30, category: 'entertainment', priority: 'high', description: 'Book stage, sound system, seating, tables, and tents.' },
  { name: 'Promote the event', daysBeforeEvent: 30, category: 'invitations', priority: 'high', description: 'Share on social media, community boards, and local news.' },
  { name: 'Confirm catering / food stalls', daysBeforeEvent: 21, category: 'catering', priority: 'high', description: 'Finalise food vendors and refreshment arrangements.' },
  { name: 'Arrange security if needed', daysBeforeEvent: 14, category: 'other', priority: 'medium', description: 'Hire professional security for larger events.' },
  { name: 'Confirm entertainment / performances', daysBeforeEvent: 14, category: 'entertainment', priority: 'medium', description: 'Finalise performers, speakers, or activity providers.' },
  { name: 'Prepare run sheet', daysBeforeEvent: 7, category: 'planning', priority: 'critical', description: 'Create event schedule and share with all team members.' },
  { name: 'Setup event space', daysBeforeEvent: 1, category: 'venue', priority: 'critical', description: 'Set up stage, signage, registration area, and equipment.' },
];

export function getDefaultTasks(
  eventType: EventType,
  eventDate: string,
): Task[] {
  const templates =
    eventType === 'wedding'
      ? WEDDING_TASKS
      : eventType === 'birthday'
      ? BIRTHDAY_TASKS
      : COMMUNITY_TASKS;

  return buildTasksFromAI(templates, eventDate, new Set());
}
