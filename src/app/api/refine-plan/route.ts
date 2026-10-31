// ============================================================
// CelebrateAI — API Route: Refine Plan
// POST /api/refine-plan
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { refineEventPlan, isAIConfigured } from '@/lib/gemini';
import { v4 as uuidv4 } from 'uuid';
import type { RefinementProposal, RefinementChange } from '@/lib/types';

const RequestSchema = z.object({
  event: z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['wedding', 'birthday', 'community']),
    date: z.string(),
    city: z.string(),
    guestCount: z.number(),
    budget: z.number(),
    currency: z.string(),
  }),
  currentPlanSummary: z.string(),
  refinementRequest: z.string().min(1).max(1000),
  approvedCommitments: z.object({
    bookedVendors: z.array(z.string()),
    completedTaskIds: z.array(z.string()),
    recordedPaymentIds: z.array(z.string()),
    actualSpendingByCategory: z.record(z.string(), z.number()),
  }),
});

// Rate limiting
const requestLog: number[] = [];
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  while (requestLog.length > 0 && requestLog[0] < windowStart) {
    requestLog.shift();
  }
  if (requestLog.length >= RATE_LIMIT_MAX) return true;
  requestLog.push(now);
  return false;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (isRateLimited()) {
    return NextResponse.json(
      { success: false, error: 'Too many refinement requests. Please wait before trying again.' },
      { status: 429 },
    );
  }

  if (!isAIConfigured()) {
    // Demo mode refinement
    const demoProposal: RefinementProposal = {
      id: uuidv4(),
      requestText: 'Demo refinement',
      changes: [
        {
          id: uuidv4(),
          section: 'summary',
          field: 'eventSummary',
          previousValue: 'Previous summary',
          proposedValue: '[DEMO MODE] Refinement requested. Configure GEMINI_API_KEY to get AI-powered adaptive replanning.',
          rationale: 'Demo mode — live AI not available',
          impactSummary: 'No changes applied in demo mode',
          isConflict: false,
          isApproved: undefined,
        } as RefinementChange,
      ],
      overallRationale: '[DEMO MODE] Configure your GEMINI_API_KEY to enable real AI-powered replanning.',
      tradeOffs: ['Live AI is required for adaptive replanning'],
      unresolvedConflicts: [],
      generatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, proposal: demoProposal, isDemo: true });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body.' }, { status: 400 });
  }

  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Invalid request data.', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { event, refinementRequest, approvedCommitments, currentPlanSummary } = parsed.data;

  try {
    // We pass a minimal plan object since we only need the summary for context
    const minimalPlan = {
      schemaVersion: '1.0.0',
      source: 'ai' as const,
      generatedAt: new Date().toISOString(),
      eventSummary: currentPlanSummary,
      budget: { totalBudget: event.budget, currency: event.currency as 'INR', contingencyPercent: 5, contingencyAmount: 0, categories: [], totalAllocated: 0, totalEstimated: 0, totalActual: 0, remaining: event.budget, isOverBudget: false, isOverSpent: false },
      timeline: { tasks: [], completedCount: 0, totalCount: 0, overdueCount: 0, upcomingCount: 0, criticalPending: [] },
      vendors: [],
      ideas: [],
    };

    const eventRecord = {
      ...event,
      currency: event.currency as 'INR',
      venueSetting: 'undecided' as const,
      themePreferences: '',
      dietaryRequirements: '',
      accessibilityRequirements: '',
      culturalPreferences: '',
      specialInstructions: '',
      startTime: undefined,
      endTime: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const aiProposal = await refineEventPlan(
      eventRecord,
      minimalPlan,
      refinementRequest,
      approvedCommitments,
    );

    const proposal: RefinementProposal = {
      id: uuidv4(),
      requestText: refinementRequest,
      changes: aiProposal.changes.map((c) => ({
        id: uuidv4(),
        section: c.section,
        field: c.field,
        recordId: c.recordId,
        previousValue: null,
        proposedValue: c.proposedValue,
        rationale: c.rationale,
        impactSummary: c.impactSummary,
        isConflict: c.isConflict,
        conflictDescription: c.conflictDescription,
        isApproved: undefined,
      })),
      overallRationale: aiProposal.overallRationale,
      tradeOffs: aiProposal.tradeOffs,
      unresolvedConflicts: aiProposal.unresolvedConflicts,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, proposal, isDemo: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown AI error';
    console.error('[CelebrateAI] Refinement error:', msg);
    return NextResponse.json(
      { success: false, error: `Refinement failed: ${msg}` },
      { status: 500 },
    );
  }
}
