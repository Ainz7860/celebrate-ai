// ============================================================
// CelebrateAI — Core Data Types
// Version: 1.0.0
// ============================================================

export const SCHEMA_VERSION = '1.0.0';

// ─── Enumerations ────────────────────────────────────────────

export type EventType = 'wedding' | 'birthday' | 'community';
export type VenueSetting = 'indoor' | 'outdoor' | 'undecided';
export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskCategory =
  | 'venue'
  | 'catering'
  | 'photography'
  | 'decorations'
  | 'entertainment'
  | 'transport'
  | 'legal'
  | 'invitations'
  | 'attire'
  | 'planning'
  | 'other';
export type TaskStatus = 'pending' | 'in-progress' | 'done' | 'overdue';
export type VendorStatus = 'not-started' | 'shortlisted' | 'contacted' | 'booked';
export type VendorCategory =
  | 'venue'
  | 'catering'
  | 'photography'
  | 'videography'
  | 'decorations'
  | 'entertainment'
  | 'transport'
  | 'equipment-rental'
  | 'flowers'
  | 'cake'
  | 'attire'
  | 'makeup'
  | 'invitations'
  | 'security'
  | 'other';
export type RSVPStatus = 'pending' | 'accepted' | 'declined' | 'maybe';
export type InvitationStatus = 'not-sent' | 'sent' | 'delivered';
export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overdue';
export type DashboardTab = 'overview' | 'budget' | 'timeline' | 'vendors' | 'guests' | 'ideas';
export type PlanSource = 'ai' | 'demo' | 'manual';

// ─── Event ───────────────────────────────────────────────────

export interface EventFormData {
  name: string;
  type: EventType;
  date: string; // YYYY-MM-DD local date
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  city: string;
  guestCount: number;
  budget: number; // in whole currency units
  currency: Currency;
  venueSetting: VenueSetting;
  themePreferences: string;
  dietaryRequirements: string;
  accessibilityRequirements: string;
  culturalPreferences: string;
  specialInstructions: string;
}

export interface EventRecord extends EventFormData {
  id: string;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

// ─── Budget ──────────────────────────────────────────────────

export interface BudgetCategory {
  id: string;
  name: string;
  vendorCategory: VendorCategory;
  allocatedAmount: number; // whole units
  estimatedAmount: number;
  actualAmount: number;
  notes: string;
}

export interface BudgetPlan {
  totalBudget: number;
  currency: Currency;
  contingencyPercent: number; // e.g. 5 means 5%
  contingencyAmount: number;
  categories: BudgetCategory[];
  // Derived — recalculated in code, not from AI
  totalAllocated: number;
  totalEstimated: number;
  totalActual: number;
  remaining: number;
  isOverBudget: boolean;
  isOverSpent: boolean;
}

// ─── Task / Timeline ─────────────────────────────────────────

export interface Task {
  id: string;
  name: string;
  description: string;
  deadline: string; // YYYY-MM-DD
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  notes: string;
  isUserCreated: boolean;
  completedAt?: string;
}

export interface TimelinePlan {
  tasks: Task[];
  // Derived
  completedCount: number;
  totalCount: number;
  overdueCount: number;
  upcomingCount: number; // tasks due within next 7 days
  criticalPending: Task[];
}

// ─── Vendor ──────────────────────────────────────────────────

export interface VendorEntry {
  id: string;
  category: VendorCategory;
  requirements: string;
  questionsToAsk: string;
  comparisonCriteria: string;
  estimatedBudget: number;
  status: VendorStatus;
  vendorName: string;
  quotedPrice?: number;
  rating?: number; // 1-5
  includedServices: string;
  notes: string;
  contractReference: string;
  paymentNotes: string;
}

// ─── Guest ───────────────────────────────────────────────────

export interface GuestEntry {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  invitationStatus: InvitationStatus;
  rsvpStatus: RSVPStatus;
  attendeeCount: number;
  dietaryNotes: string;
  accessibilityNotes: string;
  notes: string;
}

export interface GuestStats {
  total: number;
  invited: number;
  accepted: number;
  declined: number;
  maybe: number;
  pending: number;
  totalAttendees: number;
}

// ─── Ideas ───────────────────────────────────────────────────

export interface IdeaItem {
  id: string;
  category:
    | 'theme'
    | 'decoration'
    | 'menu'
    | 'activity'
    | 'entertainment'
    | 'guest-experience'
    | 'cost-saving'
    | 'contingency'
    | 'accessibility'
    | 'logistics';
  title: string;
  description: string;
  rationale: string;
  estimatedCost?: string;
  isUserSaved: boolean;
}

// ─── Documents / Expenses ────────────────────────────────────

export interface DocumentEntry {
  id: string;
  title: string;
  category: 'contract' | 'receipt' | 'permit' | 'quote' | 'insurance' | 'other';
  vendorId?: string;
  paymentDueDate?: string;
  paymentStatus: PaymentStatus;
  amountPaid: number;
  notes: string;
  createdAt: string;
}

// ─── AI Plan ─────────────────────────────────────────────────

export interface GeneratedPlan {
  schemaVersion: string;
  source: PlanSource;
  generatedAt: string;
  eventSummary: string;
  budget: BudgetPlan;
  timeline: TimelinePlan;
  vendors: VendorEntry[];
  ideas: IdeaItem[];
}

// ─── Refinement / Replanning ─────────────────────────────────

export interface RefinementChange {
  id: string;
  section: 'budget' | 'timeline' | 'vendors' | 'ideas' | 'summary';
  field: string;
  recordId?: string;
  previousValue: unknown;
  proposedValue: unknown;
  rationale: string;
  impactSummary: string;
  isConflict: boolean;
  conflictDescription?: string;
  isApproved?: boolean;
}

export interface RefinementProposal {
  id: string;
  requestText: string;
  changes: RefinementChange[];
  overallRationale: string;
  tradeOffs: string[];
  unresolvedConflicts: string[];
  generatedAt: string;
}

// ─── Full Event State ─────────────────────────────────────────

export interface EventState {
  schemaVersion: string;
  event: EventRecord;
  plan: GeneratedPlan | null;
  guests: GuestEntry[];
  documents: DocumentEntry[];
  activeRefinement: RefinementProposal | null;
  lastSavedAt: string;
}

// ─── Storage ─────────────────────────────────────────────────

export interface AppStorage {
  schemaVersion: string;
  events: EventRecord[];
  eventStates: Record<string, EventState>;
  activeEventId: string | null;
}

// ─── API types ───────────────────────────────────────────────

export interface GeneratePlanRequest {
  event: EventFormData;
  demoMode?: boolean;
}

export interface GeneratePlanResponse {
  success: boolean;
  plan?: GeneratedPlan;
  error?: string;
  isDemo?: boolean;
}

export interface RefinePlanRequest {
  event: EventRecord;
  currentPlan: GeneratedPlan;
  refinementRequest: string;
  approvedCommitments: {
    bookedVendors: string[];
    completedTaskIds: string[];
    recordedPaymentIds: string[];
    actualSpendingByCategory: Record<string, number>;
  };
}

export interface RefinePlanResponse {
  success: boolean;
  proposal?: RefinementProposal;
  error?: string;
  isDemo?: boolean;
}
