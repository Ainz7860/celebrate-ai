import { describe, it, expect } from 'vitest';
import { exportEventAsJson, exportPlanAsMarkdown } from '../export';
import { createWeddingDemo } from '../demo-data';

describe('Export Functions', () => {
  it('exports event state as valid JSON', () => {
    const demo = createWeddingDemo();
    const jsonStr = exportEventAsJson(demo);
    expect(jsonStr).toBeTypeOf('string');
    const parsed = JSON.parse(jsonStr);
    expect(parsed.event.name).toBe(demo.event.name);
    expect(parsed.plan.budget.totalBudget).toBe(demo.plan?.budget.totalBudget);
  });

  it('exports event plan as comprehensive Markdown', () => {
    const demo = createWeddingDemo();
    if (!demo.plan) throw new Error('Missing plan');
    const md = exportPlanAsMarkdown(demo.event, demo.plan);
    expect(md).toContain(`# ${demo.event.name}`);
    expect(md).toContain('## Executive Summary');
    expect(md).toContain('## 💰 Budget Breakdown');
    expect(md).toContain('## ⏱️ Timeline & Tasks');
    expect(md).toContain('## 🤝 Vendor Sourcing Guide');
  });
});
