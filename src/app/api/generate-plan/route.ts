// ============================================================
// CelebrateAI — API Route: Generate Plan
// POST /api/generate-plan
// ============================================================

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { EventFormSchema } from '@/lib/schemas';
import { generateEventPlan, isAIConfigured } from '@/lib/gemini';
import {
  createBudgetFromAI,
  createBudgetFromTemplate,
  recalculateBudget,
} from '@/lib/budget';
import { buildTasksFromAI, recalculateTimeline, getDefaultTasks } from '@/lib/timeline';
import { v4 as uuidv4 } from 'uuid';
import { SCHEMA_VERSION } from '@/lib/types';
import type { GeneratedPlan, IdeaItem, VendorEntry } from '@/lib/types';

// Rate limiting (in-memory — not reliable across serverless instances)
const requestLog: number[] = [];
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20;

function isRateLimited(): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;
  // Remove old entries
  while (requestLog.length > 0 && requestLog[0] < windowStart) {
    requestLog.shift();
  }
  if (requestLog.length >= RATE_LIMIT_MAX) return true;
  requestLog.push(now);
  return false;
}

const RequestSchema = z.object({
  event: EventFormSchema,
  demoMode: z.boolean().optional(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Rate limiting
  if (isRateLimited()) {
    return NextResponse.json(
      { success: false, error: 'Too many requests. Please wait a moment before trying again.' },
      { status: 429 },
    );
  }

  // Size check
  const contentLength = req.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 50_000) {
    return NextResponse.json(
      { success: false, error: 'Request payload too large.' },
      { status: 413 },
    );
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

  const { event } = parsed.data;
  const aiAvailable = isAIConfigured();

  // Demo mode: return deterministic plan without AI
  if (!aiAvailable) {
    const budget = createBudgetFromTemplate(event.budget, event.currency, event.type, 5);
    const tasks = getDefaultTasks(event.type, event.date);
    const timeline = recalculateTimeline(tasks);

    const plan: GeneratedPlan = {
      schemaVersion: SCHEMA_VERSION,
      source: 'demo',
      generatedAt: new Date().toISOString(),
      eventSummary: `[DEMO MODE] ${event.name} — A ${event.type} for ${event.guestCount} guests in ${event.city} on ${event.date}. Budget: ${event.currency} ${event.budget.toLocaleString()}. Configure GEMINI_API_KEY to generate a personalized AI plan.`,
      budget: recalculateBudget(budget),
      timeline,
      vendors: [],
      ideas: [],
    };

    return NextResponse.json({ success: true, plan, isDemo: true });
  }

  // Live AI mode
  try {
    const aiPlan = await generateEventPlan(event);

    // Build budget from AI data (recalculate all totals in code)
    const budget = createBudgetFromAI(
      event.budget,
      event.currency,
      aiPlan.budgetCategories,
      aiPlan.contingencyPercent,
    );

    // Build tasks from AI data
    const rawTasks = buildTasksFromAI(aiPlan.tasks, event.date, new Set());
    const timeline = recalculateTimeline(rawTasks);

    // Build vendors
    const vendors: VendorEntry[] = aiPlan.vendors.map((v) => ({
      id: uuidv4(),
      category: v.category as VendorEntry['category'],
      requirements: v.requirements,
      questionsToAsk: v.questionsToAsk,
      comparisonCriteria: v.comparisonCriteria,
      estimatedBudget: Math.round((v.estimatedBudgetPercent / 100) * event.budget),
      status: 'not-started',
      vendorName: '',
      includedServices: '',
      notes: '',
      contractReference: '',
      paymentNotes: '',
    }));

    // Build ideas
    const ideas: IdeaItem[] = aiPlan.ideas.map((idea) => ({
      id: uuidv4(),
      category: idea.category,
      title: idea.title,
      description: idea.description,
      rationale: idea.rationale,
      estimatedCost: idea.estimatedCost,
      isUserSaved: false,
    }));

    const plan: GeneratedPlan = {
      schemaVersion: SCHEMA_VERSION,
      source: 'ai',
      generatedAt: new Date().toISOString(),
      eventSummary: aiPlan.eventSummary,
      budget: recalculateBudget(budget),
      timeline,
      vendors,
      ideas,
    };

    return NextResponse.json({ success: true, plan, isDemo: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Unknown AI error';
    console.error('[CelebrateAI] Plan generation error:', msg);

    // Return specific error messages for common cases
    if (msg.includes('API_KEY') || msg.includes('configured')) {
      return NextResponse.json(
        { success: false, error: 'AI credentials are not configured correctly. Running in demo mode.' },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { success: false, error: `AI plan generation failed: ${msg}` },
      { status: 500 },
    );
  }
}
