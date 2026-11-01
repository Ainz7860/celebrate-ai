// ============================================================
// CelebrateAI — Gemini AI Client (Server-Side Only)
// Uses @google/genai SDK
// ============================================================

import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { AIGeneratedPlanSchema, AIRefinementProposalSchema } from './schemas';
import type { AIGeneratedPlan, AIRefinementProposal } from './schemas';
import type { EventFormData, EventRecord, GeneratedPlan } from './types';

// ─── Client Initialization ────────────────────────────────────

function getAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. See .env.example for setup instructions.');
  }
  return new GoogleGenAI({ apiKey });
}

function getModelName(): string {
  return process.env.GEMINI_MODEL ?? 'gemini-3.8-flash';
}

// ─── Prompts ──────────────────────────────────────────────────

function buildPlanGenerationPrompt(event: EventFormData): string {
  return `You are CelebrateAI, an expert event planning assistant.

Generate a comprehensive, personalized event plan for the following event.

**Event Details:**
- Name: ${event.name}
- Type: ${event.type}
- Date: ${event.date}${event.startTime ? ` at ${event.startTime}` : ''}${event.endTime ? ` to ${event.endTime}` : ''}
- Location: ${event.city}
- Guests: ${event.guestCount}
- Budget: ${event.currency} ${event.budget.toLocaleString()}
- Venue: ${event.venueSetting}
- Theme: ${event.themePreferences || 'Not specified'}
- Dietary: ${event.dietaryRequirements || 'None specified'}
- Accessibility: ${event.accessibilityRequirements || 'None specified'}
- Cultural/Religious: ${event.culturalPreferences || 'None specified'}
- Special Instructions: ${event.specialInstructions || 'None'}

**Your task:**
Return a valid JSON object matching this exact structure. Do not include any text outside the JSON.

{
  "eventSummary": "A 2-3 sentence personalized summary of the event.",
  "contingencyPercent": 5,
  "budgetCategories": [
    {
      "name": "Category Name",
      "vendorCategory": "venue|catering|photography|decorations|entertainment|transport|equipment-rental|flowers|cake|attire|makeup|invitations|security|other",
      "allocationPercent": 30,
      "estimatedAmount": 0,
      "notes": "Why this allocation suits this event"
    }
  ],
  "tasks": [
    {
      "name": "Task name",
      "description": "Brief description",
      "daysBeforeEvent": 90,
      "category": "venue|catering|photography|decorations|entertainment|transport|legal|invitations|attire|planning|other",
      "priority": "critical|high|medium|low",
      "guidance": "Specific actionable guidance for this task"
    }
  ],
  "vendors": [
    {
      "category": "venue|catering|photography|videography|decorations|entertainment|transport|equipment-rental|flowers|cake|attire|makeup|invitations|security|other",
      "requirements": "What to look for",
      "questionsToAsk": "Questions to ask potential vendors",
      "comparisonCriteria": "How to compare options",
      "estimatedBudgetPercent": 30
    }
  ],
  "ideas": [
    {
      "category": "theme|decoration|menu|activity|entertainment|guest-experience|cost-saving|contingency|accessibility|logistics",
      "title": "Idea title",
      "description": "Detailed actionable description",
      "rationale": "Why this suits the specific event constraints",
      "estimatedCost": "Optional cost estimate"
    }
  ]
}

**Important rules:**
1. budgetCategories allocationPercent values must not exceed a total that, when a contingencyPercent of ${5} is reserved, would exceed 100% of budget.
2. Adapt all recommendations to the specific event type, location, guest count, and user preferences.
3. Respect dietary, accessibility, and cultural requirements in every recommendation.
4. For outdoor events, always include at least one contingency idea.
5. Generate 8-15 budget categories, 15-30 tasks, 5-15 vendors, and 10-20 ideas.
6. Tasks daysBeforeEvent should be practical: for events months away, spread tasks over the full timeline.
7. Never fabricate vendor names, prices, or bookings — use general guidance only.
8. estimatedAmount in budgetCategories should be 0 (budget calculations are done in application code).`;
}

function buildRefinementPrompt(
  event: EventRecord,
  currentPlan: GeneratedPlan,
  refinementRequest: string,
  approvedCommitments: {
    bookedVendors: string[];
    completedTaskIds: string[];
    recordedPaymentIds: string[];
    actualSpendingByCategory: Record<string, number>;
  },
): string {
  return `You are CelebrateAI. The user wants to refine their existing event plan.

**Event:** ${event.name} (${event.type}) on ${event.date} in ${event.city}
**Budget:** ${event.currency} ${event.budget.toLocaleString()}
**Guests:** ${event.guestCount}

**User's Refinement Request:**
"${refinementRequest}"

**Current Plan Summary:**
${currentPlan.eventSummary}

**Committed (CANNOT be changed without explicit user approval):**
- Booked vendors: ${approvedCommitments.bookedVendors.length > 0 ? approvedCommitments.bookedVendors.join(', ') : 'None'}
- Completed tasks: ${approvedCommitments.completedTaskIds.length} tasks
- Actual spending by category: ${JSON.stringify(approvedCommitments.actualSpendingByCategory)}

**Task:** Generate a structured change proposal that responds to the user's request.

Return valid JSON only (no other text):

{
  "overallRationale": "Explanation of the approach to this refinement",
  "tradeOffs": ["Trade-off 1", "Trade-off 2"],
  "unresolvedConflicts": ["Conflict if budget already spent exceeds new allocation", "Other unresolvable conflicts"],
  "changes": [
    {
      "section": "budget|timeline|vendors|ideas|summary",
      "field": "Human-readable field name",
      "recordId": "Optional ID of specific record to update",
      "proposedValue": "New value or object",
      "rationale": "Why this change",
      "impactSummary": "Effect on the overall plan",
      "isConflict": false,
      "conflictDescription": "Only if isConflict is true"
    }
  ]
}

**Rules:**
1. Do not propose changes to completed tasks or booked vendors unless you flag isConflict=true.
2. If the user requests a budget cut but money is already spent, flag that as an unresolvedConflict.
3. Propose concrete, actionable changes.
4. Maximum 20 changes per proposal.`;
}

// ─── Retry Logic ──────────────────────────────────────────────

async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 2,
  delayMs = 1000,
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      if (attempt === maxRetries) throw e;
      const isRetryable =
        e instanceof Error &&
        (e.message.includes('500') || e.message.includes('503') || e.message.includes('timeout'));
      if (!isRetryable) throw e;
      await new Promise((resolve) => setTimeout(resolve, delayMs * Math.pow(2, attempt)));
    }
  }
  throw new Error('Max retries exceeded');
}

// ─── JSON Extraction ──────────────────────────────────────────

function extractJSON(text: string): unknown {
  // Try direct parse first
  try {
    return JSON.parse(text);
  } catch {
    // Try to find JSON block
    const match = text.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (match) {
      return JSON.parse(match[1]);
    }
    // Try to find first { to last }
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error('No valid JSON found in AI response');
  }
}

// ─── Groq API Integration ─────────────────────────────────────

async function callGroqAPI(prompt: string, maxTokens: number): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');
  const model = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are CelebrateAI, an expert celebration and event planning assistant. You must always output valid JSON adhering strictly to the requested schema. Do not output text outside the JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: maxTokens,
      temperature: 0.5,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq API');
  return content;
}

// ─── Plan Generation ──────────────────────────────────────────

export async function generateEventPlan(event: EventFormData): Promise<AIGeneratedPlan> {
  const prompt = buildPlanGenerationPrompt(event);
  let text = '';
  let lastError: unknown = null;

  // 1. Prioritize Groq
  if (process.env.GROQ_API_KEY) {
    try {
      text = await withRetry(() => callGroqAPI(prompt, 8192));
    } catch (groqErr) {
      console.warn('[CelebrateAI] Groq generation failed, attempting Gemini fallback:', groqErr);
      lastError = groqErr;
    }
  }

  // 2. Fallback to Gemini if Groq was unavailable or threw an error
  if (!text && process.env.GEMINI_API_KEY) {
    try {
      const ai = getAIClient();
      const model = getModelName();

      const response = await withRetry(async () => {
        return await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 8192,
          },
        });
      });

      text = response.text || '';
    } catch (geminiErr) {
      console.warn('[CelebrateAI] Gemini generation failed:', geminiErr);
      if (!lastError) lastError = geminiErr;
    }
  }

  if (!text) {
    throw lastError || new Error('AI returned an empty response.');
  }

  const raw = extractJSON(text);
  const validated = AIGeneratedPlanSchema.parse(raw);
  return validated;
}

// ─── Plan Refinement ──────────────────────────────────────────

export async function refineEventPlan(
  event: EventRecord,
  currentPlan: GeneratedPlan,
  refinementRequest: string,
  approvedCommitments: {
    bookedVendors: string[];
    completedTaskIds: string[];
    recordedPaymentIds: string[];
    actualSpendingByCategory: Record<string, number>;
  },
): Promise<AIRefinementProposal> {
  const prompt = buildRefinementPrompt(event, currentPlan, refinementRequest, approvedCommitments);
  let text = '';
  let lastError: unknown = null;

  // 1. Prioritize Groq
  if (process.env.GROQ_API_KEY) {
    try {
      text = await withRetry(() => callGroqAPI(prompt, 4096));
    } catch (groqErr) {
      console.warn('[CelebrateAI] Groq refinement failed, attempting Gemini fallback:', groqErr);
      lastError = groqErr;
    }
  }

  // 2. Fallback to Gemini if Groq was unavailable or threw an error
  if (!text && process.env.GEMINI_API_KEY) {
    try {
      const ai = getAIClient();
      const model = getModelName();

      const response = await withRetry(async () => {
        return await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.5,
            maxOutputTokens: 4096,
          },
        });
      });

      text = response.text || '';
    } catch (geminiErr) {
      console.warn('[CelebrateAI] Gemini refinement failed:', geminiErr);
      if (!lastError) lastError = geminiErr;
    }
  }

  if (!text) {
    throw lastError || new Error('AI returned an empty response.');
  }

  const raw = extractJSON(text);
  const validated = AIRefinementProposalSchema.parse(raw);
  return validated;
}

// ─── Credential Check ─────────────────────────────────────────

export function isAIConfigured(): boolean {
  return !!(process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY);
}
