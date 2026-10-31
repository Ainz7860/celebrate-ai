// ============================================================
// CelebrateAI — Zod Validation Schemas
// ============================================================

import { z } from 'zod';

// ─── Event form ───────────────────────────────────────────────

export const EventTypeSchema = z.enum(['wedding', 'birthday', 'community']);
export const VenueSettingSchema = z.enum(['indoor', 'outdoor', 'undecided']);
export const CurrencySchema = z.enum(['INR', 'USD', 'EUR', 'GBP']);

export const EventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required').max(120, 'Event name is too long'),
  type: EventTypeSchema,
  date: z
    .string()
    .min(1, 'Event date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  startTime: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{2}:\d{2}$/.test(v), 'Invalid time format'),
  endTime: z
    .string()
    .optional()
    .refine((v) => !v || /^\d{2}:\d{2}$/.test(v), 'Invalid time format'),
  city: z.string().min(1, 'City or location is required').max(100, 'Location is too long'),
  guestCount: z
    .number()
    .int('Guest count must be a whole number')
    .min(1, 'Guest count must be at least 1')
    .max(100000, 'Guest count is unrealistically large'),
  budget: z
    .number()
    .positive('Budget must be greater than zero')
    .max(1_000_000_000, 'Budget is unrealistically large'),
  currency: CurrencySchema,
  venueSetting: VenueSettingSchema,
  themePreferences: z.string().max(500, 'Theme preferences too long'),
  dietaryRequirements: z.string().max(500, 'Dietary requirements too long'),
  accessibilityRequirements: z.string().max(500, 'Accessibility requirements too long'),
  culturalPreferences: z.string().max(500, 'Cultural preferences too long'),
  specialInstructions: z.string().max(1000, 'Special instructions too long'),
});

export type EventFormValues = z.infer<typeof EventFormSchema>;

// ─── Budget Category Schema ───────────────────────────────────

export const BudgetCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  vendorCategory: z.string(),
  allocatedAmount: z.number().min(0),
  estimatedAmount: z.number().min(0),
  actualAmount: z.number().min(0),
  notes: z.string(),
});

// ─── Task Schema ──────────────────────────────────────────────

export const TaskSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string(),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid deadline date'),
  category: z.string(),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['pending', 'in-progress', 'done', 'overdue']),
  notes: z.string(),
  isUserCreated: z.boolean(),
  completedAt: z.string().optional(),
});

// ─── Vendor Schema ────────────────────────────────────────────

export const VendorEntrySchema = z.object({
  id: z.string(),
  category: z.string(),
  requirements: z.string(),
  questionsToAsk: z.string(),
  comparisonCriteria: z.string(),
  estimatedBudget: z.number().min(0),
  status: z.enum(['not-started', 'shortlisted', 'contacted', 'booked']),
  vendorName: z.string(),
  quotedPrice: z.number().min(0).optional(),
  rating: z.number().min(1).max(5).optional(),
  includedServices: z.string(),
  notes: z.string(),
  contractReference: z.string(),
  paymentNotes: z.string(),
});

// ─── Idea Schema ──────────────────────────────────────────────

export const IdeaItemSchema = z.object({
  id: z.string(),
  category: z.enum([
    'theme',
    'decoration',
    'menu',
    'activity',
    'entertainment',
    'guest-experience',
    'cost-saving',
    'contingency',
    'accessibility',
    'logistics',
  ]),
  title: z.string().min(1),
  description: z.string(),
  rationale: z.string(),
  estimatedCost: z.string().optional(),
  isUserSaved: z.boolean(),
});

// ─── AI Generated Plan Schema (raw from AI) ───────────────────
// Note: We validate AI output before trusting financial values.
// Budget totals are always recalculated in code.

export const AIBudgetCategorySchema = z.object({
  name: z.string().min(1),
  vendorCategory: z.string().default('other'),
  allocationPercent: z.number().min(0).max(100),
  estimatedAmount: z.number().min(0),
  notes: z.string().default(''),
});

export const AITaskSchema = z.object({
  name: z.string().min(1),
  description: z.string().default(''),
  daysBeforeEvent: z.number().int().min(0).max(730),
  category: z.string().default('planning'),
  priority: z.enum(['critical', 'high', 'medium', 'low']).default('medium'),
  guidance: z.string().default(''),
});

export const AIVendorSchema = z.object({
  category: z.string(),
  requirements: z.string().default(''),
  questionsToAsk: z.string().default(''),
  comparisonCriteria: z.string().default(''),
  estimatedBudgetPercent: z.number().min(0).max(100).default(0),
});

export const AIIdeaSchema = z.object({
  category: z.enum([
    'theme',
    'decoration',
    'menu',
    'activity',
    'entertainment',
    'guest-experience',
    'cost-saving',
    'contingency',
    'accessibility',
    'logistics',
  ]),
  title: z.string().min(1),
  description: z.string(),
  rationale: z.string(),
  estimatedCost: z.string().optional(),
});

export const AIGeneratedPlanSchema = z.object({
  eventSummary: z.string().min(1),
  budgetCategories: z.array(AIBudgetCategorySchema).min(1).max(15),
  tasks: z.array(AITaskSchema).min(1).max(60),
  vendors: z.array(AIVendorSchema).min(1).max(20),
  ideas: z.array(AIIdeaSchema).min(1).max(30),
  contingencyPercent: z.number().min(0).max(20).default(5),
});

export type AIGeneratedPlan = z.infer<typeof AIGeneratedPlanSchema>;

// ─── Refinement Schemas ───────────────────────────────────────

export const AIRefinementChangeSchema = z.object({
  section: z.enum(['budget', 'timeline', 'vendors', 'ideas', 'summary']),
  field: z.string(),
  recordId: z.string().optional(),
  proposedValue: z.unknown(),
  rationale: z.string(),
  impactSummary: z.string(),
  isConflict: z.boolean().default(false),
  conflictDescription: z.string().optional(),
});

export const AIRefinementProposalSchema = z.object({
  changes: z.array(AIRefinementChangeSchema).min(0).max(30),
  overallRationale: z.string(),
  tradeOffs: z.array(z.string()).max(10),
  unresolvedConflicts: z.array(z.string()).max(10),
});

export type AIRefinementProposal = z.infer<typeof AIRefinementProposalSchema>;

// ─── Guest Schema ─────────────────────────────────────────────

export const GuestEntrySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Guest name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  invitationStatus: z.enum(['not-sent', 'sent', 'delivered']),
  rsvpStatus: z.enum(['pending', 'accepted', 'declined', 'maybe']),
  attendeeCount: z.number().int().min(1).max(20),
  dietaryNotes: z.string(),
  accessibilityNotes: z.string(),
  notes: z.string(),
});

// ─── Document Schema ──────────────────────────────────────────

export const DocumentEntrySchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Document title is required'),
  category: z.enum(['contract', 'receipt', 'permit', 'quote', 'insurance', 'other']),
  vendorId: z.string().optional(),
  paymentDueDate: z.string().optional(),
  paymentStatus: z.enum(['unpaid', 'partial', 'paid', 'overdue']),
  amountPaid: z.number().min(0),
  notes: z.string(),
  createdAt: z.string(),
});
