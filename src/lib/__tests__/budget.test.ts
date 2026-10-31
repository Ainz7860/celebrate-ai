import { describe, it, expect } from 'vitest';
import {
  calculateContingency,
  createBudgetFromTemplate,
  recalculateBudget,
  formatCurrency,
} from '../budget';
import type { BudgetPlan, BudgetCategory } from '../types';

describe('Budget Calculations', () => {
  it('correctly calculates 5% contingency buffer', () => {
    const contingency = calculateContingency(100000, 5);
    expect(contingency).toBe(5000);
  });

  it('creates deterministic budget from wedding template', () => {
    const budget = createBudgetFromTemplate(1000000, 'INR', 'wedding', 5);
    expect(budget.totalBudget).toBe(1000000);
    expect(budget.contingencyAmount).toBe(50000);
    expect(budget.currency).toBe('INR');
    expect(budget.categories.length).toBeGreaterThan(0);

    // Sum of allocated + contingency should equal or be within total budget
    const allocatedSum = budget.categories.reduce((s, c) => s + c.allocatedAmount, 0);
    expect(allocatedSum + budget.contingencyAmount).toBeLessThanOrEqual(1000000);
  });

  it('detects over-spending when actual exceeds total budget', () => {
    const categories: BudgetCategory[] = [
      {
        id: '1',
        name: 'Venue',
        vendorCategory: 'venue',
        allocatedAmount: 40000,
        estimatedAmount: 40000,
        actualAmount: 60000,
        notes: '',
      },
    ];

    const plan: BudgetPlan = {
      totalBudget: 50000,
      currency: 'USD',
      contingencyPercent: 5,
      contingencyAmount: 2500,
      categories,
      totalAllocated: 40000,
      totalEstimated: 40000,
      totalActual: 60000,
      remaining: -10000,
      isOverBudget: false,
      isOverSpent: true,
    };

    const recalculated = recalculateBudget(plan);
    expect(recalculated.isOverSpent).toBe(true);
    expect(recalculated.totalActual).toBe(60000);
    expect(recalculated.remaining).toBe(-10000);
  });

  it('formats currency correctly for INR and USD', () => {
    expect(formatCurrency(50000, 'USD')).toContain('50,000');
    expect(formatCurrency(2500000, 'INR')).toContain('25,00,000');
  });
});
