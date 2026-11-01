import { z } from 'zod';

const BudgetCategorySchema = z.object({
  name: z.string().min(1),
  vendorCategory: z.enum([
    'venue', 'catering', 'photography', 'decorations', 'entertainment',
    'transport', 'equipment-rental', 'flowers', 'cake', 'attire',
    'makeup', 'invitations', 'security', 'other',
  ]),
  allocationPercent: z.number().positive().max(100),
  estimatedAmount: z.number().nonnegative(),
  notes: z.string().optional(),
});

const TaskItemSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  daysBeforeEvent: z.number().int().nonnegative(),
  category: z.enum([
    'venue', 'catering', 'photography', 'decorations', 'entertainment',
    'transport', 'legal', 'invitations', 'attire', 'planning', 'other',
  ]),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  guidance: z.string().optional(),
});

const VendorRecommendationSchema = z.object({
  category: z.enum([
    'venue', 'catering', 'photography', 'videography', 'decorations',
    'entertainment', 'transport', 'equipment-rental', 'flowers',
    'cake', 'attire', 'makeup', 'invitations', 'security', 'other',
  ]),
  requirements: z.string(),
  questionsToAsk: z.string(),
  comparisonCriteria: z.string(),
  estimatedBudgetPercent: z.number().nonnegative().max(100),
});

const IdeaRecommendationSchema = z.object({
  category: z.enum([
    'theme', 'decoration', 'menu', 'activity', 'entertainment',
    'guest-experience', 'cost-saving', 'contingency', 'accessibility', 'logistics',
  ]),
  title: z.string().min(1),
  description: z.string(),
  rationale: z.string(),
  estimatedCost: z.string().optional(),
});

const AIGeneratedPlanSchema = z.object({
  eventSummary: z.string().min(10),
  contingencyPercent: z.number().nonnegative().max(30),
  budgetCategories: z.array(BudgetCategorySchema).min(3),
  tasks: z.array(TaskItemSchema).min(5),
  vendors: z.array(VendorRecommendationSchema).min(2),
  ideas: z.array(IdeaRecommendationSchema).min(3),
});

const apiKey = process.env.GROQ_API_KEY;
const model = 'openai/gpt-oss-120b';

const prompt = `You are CelebrateAI, an expert event planning assistant.

Generate a comprehensive, personalized event plan for the following event.

**Event Details:**
- Name: Birthday Celebration
- Type: birthday
- Date: 2026-11-20
- Location: New Delhi
- Guests: 100
- Budget: INR 50,000
- Venue: outdoor
- Theme: Modern, elegant celebration
- Dietary: None specified
- Accessibility: None specified
- Cultural/Religious: None specified
- Special Instructions: None

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
      "daysBeforeEvent": 20,
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
1. budgetCategories allocationPercent values must sum to approximately 95% (leaving 5% for contingency).
2. Adapt all recommendations to the specific event type, location, guest count, and user preferences.
3. For outdoor events, always include at least one contingency idea.
4. Generate 8-15 budget categories, 15-30 tasks, 5-15 vendors, and 10-20 ideas.
5. Tasks daysBeforeEvent should be practical integers.
6. Never fabricate vendor names, prices, or bookings — use general guidance only.
7. estimatedAmount in budgetCategories should be 0.`;

async function test() {
  console.log('Sending request to Groq...');
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
          content: 'You are CelebrateAI, an expert celebration and event planning assistant. You must always output valid JSON adhering strictly to the requested schema. Do not output text outside the JSON.',
        },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 8192,
      temperature: 0.5,
    })
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  console.log('Got text length:', text?.length);
  
  const parsed = JSON.parse(text);
  const validated = AIGeneratedPlanSchema.safeParse(parsed);
  if (validated.success) {
    console.log('SUCCESS! Validated schema matches perfectly!');
    console.log('eventSummary:', validated.data.eventSummary);
    console.log('budgetCategories count:', validated.data.budgetCategories.length);
    console.log('tasks count:', validated.data.tasks.length);
    console.log('vendors count:', validated.data.vendors.length);
    console.log('ideas count:', validated.data.ideas.length);
  } else {
    console.error('Validation errors:', JSON.stringify(validated.error.format(), null, 2));
  }
}

test().catch(console.error);

