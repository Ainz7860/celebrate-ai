// ============================================================
// CelebrateAI — Budget Calculation Logic (Deterministic)
// All financial values are recalculated here, never from AI.
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import type {
  BudgetCategory,
  BudgetPlan,
  Currency,
  EventType,
  VendorCategory,
} from './types';

// ─── Currency Formatting ──────────────────────────────────────

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
};

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCY_SYMBOLS[currency] ?? currency;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const symbol = getCurrencySymbol(currency);
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${symbol}${formatted}`;
}

export function calculateContingency(totalBudget: number, contingencyPercent: number): number {
  const safePercent = Math.max(0, Math.min(100, contingencyPercent));
  return Math.round((totalBudget * safePercent) / 100);
}

// ─── Default Allocations ──────────────────────────────────────

interface AllocationTemplate {
  name: string;
  vendorCategory: VendorCategory;
  percent: number;
}

const WEDDING_TEMPLATE: AllocationTemplate[] = [
  { name: 'Venue & Decor', vendorCategory: 'venue', percent: 28 },
  { name: 'Catering & Bar', vendorCategory: 'catering', percent: 25 },
  { name: 'Photography & Video', vendorCategory: 'photography', percent: 12 },
  { name: 'Flowers & Decorations', vendorCategory: 'flowers', percent: 10 },
  { name: 'Entertainment & Music', vendorCategory: 'entertainment', percent: 8 },
  { name: 'Attire & Beauty', vendorCategory: 'attire', percent: 7 },
  { name: 'Invitations & Stationery', vendorCategory: 'invitations', percent: 3 },
  { name: 'Transport', vendorCategory: 'transport', percent: 3 },
  { name: 'Miscellaneous', vendorCategory: 'other', percent: 4 },
];

const BIRTHDAY_TEMPLATE: AllocationTemplate[] = [
  { name: 'Venue', vendorCategory: 'venue', percent: 25 },
  { name: 'Catering & Cake', vendorCategory: 'catering', percent: 30 },
  { name: 'Decorations', vendorCategory: 'decorations', percent: 15 },
  { name: 'Entertainment & Activities', vendorCategory: 'entertainment', percent: 15 },
  { name: 'Photography', vendorCategory: 'photography', percent: 8 },
  { name: 'Invitations & Party Favors', vendorCategory: 'invitations', percent: 4 },
  { name: 'Miscellaneous', vendorCategory: 'other', percent: 3 },
];

const COMMUNITY_TEMPLATE: AllocationTemplate[] = [
  { name: 'Venue & Permits', vendorCategory: 'venue', percent: 25 },
  { name: 'Catering & Refreshments', vendorCategory: 'catering', percent: 25 },
  { name: 'Equipment Rental & Setup', vendorCategory: 'equipment-rental', percent: 15 },
  { name: 'Entertainment & Performances', vendorCategory: 'entertainment', percent: 15 },
  { name: 'Marketing & Invitations', vendorCategory: 'invitations', percent: 8 },
  { name: 'Security & Staff', vendorCategory: 'security', percent: 7 },
  { name: 'Miscellaneous', vendorCategory: 'other', percent: 5 },
];

export function getDefaultTemplate(eventType: EventType): AllocationTemplate[] {
  switch (eventType) {
    case 'wedding': return WEDDING_TEMPLATE;
    case 'birthday': return BIRTHDAY_TEMPLATE;
    case 'community': return COMMUNITY_TEMPLATE;
  }
}

// ─── Budget Creation ──────────────────────────────────────────

/**
 * Create a budget plan from AI-suggested category data.
 * All totals are recalculated here; AI values are used only as estimates.
 *
 * @param totalBudget - Total budget in whole currency units
 * @param currency - Currency code
 * @param aiCategories - AI-suggested categories with allocationPercent and estimatedAmount
 * @param contingencyPercent - Contingency reserve percent (0–20)
 */
export function createBudgetFromAI(
  totalBudget: number,
  currency: Currency,
  aiCategories: Array<{
    name: string;
    vendorCategory: string;
    allocationPercent: number;
    estimatedAmount: number;
    notes: string;
  }>,
  contingencyPercent: number,
): BudgetPlan {
  // Clamp contingency
  const safeContingency = Math.max(0, Math.min(20, contingencyPercent));
  const contingencyAmount = Math.round((totalBudget * safeContingency) / 100);
  const availableForCategories = totalBudget - contingencyAmount;

  // Normalise AI allocation percentages
  const totalPercent = aiCategories.reduce((s, c) => s + c.allocationPercent, 0);
  const normFactor = totalPercent > 0 ? availableForCategories / totalPercent : 0;

  const categories: BudgetCategory[] = aiCategories.map((c) => {
    const allocated = Math.round(c.allocationPercent * normFactor);
    return {
      id: uuidv4(),
      name: c.name,
      vendorCategory: c.vendorCategory as VendorCategory,
      allocatedAmount: allocated,
      estimatedAmount: allocated, // Start estimate = allocation
      actualAmount: 0,
      notes: c.notes ?? '',
    };
  });

  return recalculateBudget({
    totalBudget,
    currency,
    contingencyPercent: safeContingency,
    contingencyAmount,
    categories,
    // Derived — will be overwritten by recalculateBudget
    totalAllocated: 0,
    totalEstimated: 0,
    totalActual: 0,
    remaining: 0,
    isOverBudget: false,
    isOverSpent: false,
  });
}

/**
 * Create a default budget plan from a template (used in demo mode or initial state).
 */
export function createBudgetFromTemplate(
  totalBudget: number,
  currency: Currency,
  eventType: EventType,
  contingencyPercent = 5,
): BudgetPlan {
  const template = getDefaultTemplate(eventType);
  const safeContingency = Math.max(0, Math.min(20, contingencyPercent));
  const contingencyAmount = Math.round((totalBudget * safeContingency) / 100);
  const available = totalBudget - contingencyAmount;

  const categories: BudgetCategory[] = template.map((t) => {
    const allocated = Math.round((t.percent / 100) * available);
    return {
      id: uuidv4(),
      name: t.name,
      vendorCategory: t.vendorCategory,
      allocatedAmount: allocated,
      estimatedAmount: allocated,
      actualAmount: 0,
      notes: '',
    };
  });

  return recalculateBudget({
    totalBudget,
    currency,
    contingencyPercent: safeContingency,
    contingencyAmount,
    categories,
    totalAllocated: 0,
    totalEstimated: 0,
    totalActual: 0,
    remaining: 0,
    isOverBudget: false,
    isOverSpent: false,
  });
}

/**
 * Recalculate all derived budget totals from source data.
 * Must be called after any mutation to categories or budget.
 */
export function recalculateBudget(plan: BudgetPlan): BudgetPlan {
  const totalAllocated = plan.categories.reduce((s, c) => s + c.allocatedAmount, 0);
  const totalEstimated = plan.categories.reduce((s, c) => s + c.estimatedAmount, 0);
  const totalActual = plan.categories.reduce((s, c) => s + c.actualAmount, 0);

  const totalSpend = totalAllocated + plan.contingencyAmount;
  const remaining = plan.totalBudget - totalActual;
  const isOverBudget = totalSpend > plan.totalBudget;
  const isOverSpent = totalActual > plan.totalBudget;

  return {
    ...plan,
    totalAllocated,
    totalEstimated,
    totalActual,
    remaining,
    isOverBudget,
    isOverSpent,
  };
}

/**
 * Update a category's allocated amount and recalculate.
 */
export function updateCategoryAllocation(
  plan: BudgetPlan,
  categoryId: string,
  allocatedAmount: number,
): { plan: BudgetPlan; error?: string } {
  if (allocatedAmount < 0) {
    return { plan, error: 'Allocation cannot be negative.' };
  }

  const updated = plan.categories.map((c) =>
    c.id === categoryId ? { ...c, allocatedAmount } : c,
  );

  const newPlan = recalculateBudget({ ...plan, categories: updated });

  if (newPlan.isOverBudget) {
    // Allow but flag — do not silently cap
  }

  return { plan: newPlan };
}

/**
 * Update actual spending for a category.
 */
export function recordActualSpending(
  plan: BudgetPlan,
  categoryId: string,
  actualAmount: number,
): { plan: BudgetPlan; error?: string } {
  if (actualAmount < 0) {
    return { plan, error: 'Actual amount cannot be negative.' };
  }

  const updated = plan.categories.map((c) =>
    c.id === categoryId ? { ...c, actualAmount } : c,
  );

  return { plan: recalculateBudget({ ...plan, categories: updated }) };
}

/**
 * Check whether a budget reduction conflicts with actual commitments.
 */
export function checkBudgetReductionConflicts(
  plan: BudgetPlan,
  newBudget: number,
): string[] {
  const conflicts: string[] = [];

  if (plan.totalActual > newBudget) {
    conflicts.push(
      `Already spent ${formatCurrency(plan.totalActual, plan.currency)} which exceeds the proposed budget of ${formatCurrency(newBudget, plan.currency)}.`,
    );
  }

  for (const cat of plan.categories) {
    if (cat.actualAmount > 0) {
      const proportion = cat.allocatedAmount / Math.max(plan.totalAllocated, 1);
      const newAlloc = Math.round(newBudget * proportion);
      if (cat.actualAmount > newAlloc) {
        conflicts.push(
          `${cat.name}: already spent ${formatCurrency(cat.actualAmount, plan.currency)}, but new allocation would be only ${formatCurrency(newAlloc, plan.currency)}.`,
        );
      }
    }
  }

  return conflicts;
}

/**
 * Get percentage of budget spent.
 */
export function getBudgetSpentPercent(plan: BudgetPlan): number {
  if (plan.totalBudget === 0) return 0;
  return Math.min(100, Math.round((plan.totalActual / plan.totalBudget) * 100));
}

/**
 * Get percentage of budget allocated.
 */
export function getBudgetAllocatedPercent(plan: BudgetPlan): number {
  if (plan.totalBudget === 0) return 0;
  return Math.min(100, Math.round(((plan.totalAllocated + plan.contingencyAmount) / plan.totalBudget) * 100));
}
