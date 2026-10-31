// ============================================================
// CelebrateAI — Demo Data (Realistic Scenarios)
// Labelled explicitly as demo, not live AI
// ============================================================

import { v4 as uuidv4 } from 'uuid';
import { SCHEMA_VERSION } from './types';
import { createBudgetFromTemplate, recalculateBudget } from './budget';
import { getDefaultTasks } from './timeline';
import { addDays, todayString } from './dates';
import type { EventRecord, EventState, GuestEntry, IdeaItem, VendorEntry, GeneratedPlan } from './types';

// ─── Wedding Demo ─────────────────────────────────────────────

export function createWeddingDemo(): EventState {
  const eventDate = addDays(todayString(), 180);
  const event: EventRecord = {
    id: uuidv4(),
    name: 'Priya & Arjun\'s Wedding',
    type: 'wedding',
    date: eventDate,
    startTime: '10:00',
    endTime: '22:00',
    city: 'Jaipur, Rajasthan',
    guestCount: 350,
    budget: 2500000,
    currency: 'INR',
    venueSetting: 'outdoor',
    themePreferences: 'Traditional Rajasthani with marigold and royal blue palette',
    dietaryRequirements: 'Vegetarian only, no onion/garlic for some guests',
    accessibilityRequirements: 'Wheelchair access required',
    culturalPreferences: 'Hindu ceremony with Rajasthani folk elements',
    specialInstructions: 'Photography and video essential. Need parking for 150 cars.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const budget = createBudgetFromTemplate(event.budget, event.currency, event.type, 5);

  const tasks = getDefaultTasks(event.type, event.date);

  const vendors: VendorEntry[] = [
    {
      id: uuidv4(),
      category: 'venue',
      requirements: 'Outdoor mandap space for 350+ guests, parking for 150 cars, bridal suite',
      questionsToAsk: 'What is included in the package? Do you allow outside caterers? What is the backup for rain?',
      comparisonCriteria: 'Capacity, rain cover availability, parking, ambiance',
      estimatedBudget: 500000,
      status: 'shortlisted',
      vendorName: '',
      quotedPrice: undefined,
      rating: undefined,
      includedServices: '',
      notes: 'Looking at 3 heritage properties in Jaipur',
      contractReference: '',
      paymentNotes: '',
    },
    {
      id: uuidv4(),
      category: 'catering',
      requirements: 'Vegetarian cuisine, traditional Rajasthani dishes, no onion/garlic option',
      questionsToAsk: 'Can you handle 350 guests? Do you provide servers? What are your hygiene certifications?',
      comparisonCriteria: 'Menu variety, service quality, price per head, tasting session',
      estimatedBudget: 700000,
      status: 'not-started',
      vendorName: '',
      includedServices: '',
      notes: '',
      contractReference: '',
      paymentNotes: '',
    },
    {
      id: uuidv4(),
      category: 'photography',
      requirements: '1 lead photographer + 1 assistant, pre-wedding shoot, full day coverage',
      questionsToAsk: 'Portfolio of Rajasthani weddings? Drone available? How long for delivery?',
      comparisonCriteria: 'Portfolio quality, turnaround time, included hours, backup equipment',
      estimatedBudget: 200000,
      status: 'not-started',
      vendorName: '',
      includedServices: '',
      notes: '',
      contractReference: '',
      paymentNotes: '',
    },
  ];

  const ideas: IdeaItem[] = [
    {
      id: uuidv4(),
      category: 'theme',
      title: 'Rajasthani Heritage Palate',
      description: 'Use marigold garlands, peacock motifs, and royal blue draping throughout.',
      rationale: 'Matches the Jaipur outdoor venue and traditional Hindu ceremony theme.',
      estimatedCost: '₹80,000–₹1,20,000',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'contingency',
      title: 'Monsoon Contingency Plan',
      description: 'Book marquee tents or confirm an indoor backup hall at the same property.',
      rationale: 'Outdoor events in Rajasthan during monsoon season need a reliable rain plan.',
      estimatedCost: '₹40,000–₹60,000 additional',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'accessibility',
      title: 'Wheelchair-Accessible Layout',
      description: 'Reserve front seats near the mandap for wheelchair users; ensure ramp access to all areas.',
      rationale: 'Required for your accessibility requirements.',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'menu',
      title: 'Dal Baati Churma Station',
      description: 'A live cooking station serving traditional Rajasthani dal baati churma.',
      rationale: 'Celebrates the Jaipur venue and creates a memorable guest experience.',
      estimatedCost: '₹25,000–₹40,000',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'entertainment',
      title: 'Kalbeliya Dance Performance',
      description: 'Hire a traditional Kalbeliya folk dance troupe for the reception.',
      rationale: 'Authentic Rajasthani entertainment that suits the cultural theme.',
      estimatedCost: '₹30,000–₹50,000',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'cost-saving',
      title: 'Seasonal Flower Alternatives',
      description: 'Use in-season marigolds and jasmine rather than imported roses.',
      rationale: 'Significantly reduces floral costs while maintaining traditional aesthetics.',
      estimatedCost: 'Saves ₹30,000–₹60,000',
      isUserSaved: false,
    },
  ];

  const plan: GeneratedPlan = {
    schemaVersion: SCHEMA_VERSION,
    source: 'demo',
    generatedAt: new Date().toISOString(),
    eventSummary: `[DEMO MODE] A beautiful traditional Rajasthani wedding for Priya & Arjun with 350 guests in Jaipur. The celebration features an outdoor mandap ceremony, vegetarian feast with authentic regional dishes, Kalbeliya folk entertainment, and a marigold-and-royal-blue colour palette celebrating the rich heritage of Rajasthan. Budget is ₹25,00,000 with a 5% contingency reserve.`,
    budget: recalculateBudget(budget),
    timeline: {
      tasks,
      completedCount: 0,
      totalCount: tasks.length,
      overdueCount: 0,
      upcomingCount: 0,
      criticalPending: tasks.filter((t) => t.priority === 'critical'),
    },
    vendors,
    ideas,
  };

  const guests: GuestEntry[] = [
    { id: uuidv4(), name: 'Sharma Family (4)', email: 'sharma@example.com', phone: '', invitationStatus: 'not-sent', rsvpStatus: 'pending', attendeeCount: 4, dietaryNotes: 'No onion/garlic', accessibilityNotes: '', notes: '' },
    { id: uuidv4(), name: 'Mehta Ji', email: '', phone: '', invitationStatus: 'not-sent', rsvpStatus: 'pending', attendeeCount: 2, dietaryNotes: '', accessibilityNotes: 'Wheelchair user', notes: 'Arjun\'s uncle' },
  ];

  return {
    schemaVersion: SCHEMA_VERSION,
    event,
    plan,
    guests,
    documents: [],
    activeRefinement: null,
    lastSavedAt: new Date().toISOString(),
  };
}

// ─── Birthday Demo ────────────────────────────────────────────

export function createBirthdayDemo(): EventState {
  const eventDate = addDays(todayString(), 30);
  const event: EventRecord = {
    id: uuidv4(),
    name: 'Zara\'s 7th Birthday Party',
    type: 'birthday',
    date: eventDate,
    startTime: '14:00',
    endTime: '18:00',
    city: 'Mumbai, Maharashtra',
    guestCount: 30,
    budget: 80000,
    currency: 'INR',
    venueSetting: 'indoor',
    themePreferences: 'Mermaid and under-the-sea theme with turquoise and coral colours',
    dietaryRequirements: 'Nut-free, one guest has a gluten allergy',
    accessibilityRequirements: '',
    culturalPreferences: '',
    specialInstructions: 'Parents expect interactive activities. Goodie bags for each child.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const budget = createBudgetFromTemplate(event.budget, event.currency, event.type, 5);
  const tasks = getDefaultTasks(event.type, event.date);

  const ideas: IdeaItem[] = [
    {
      id: uuidv4(),
      category: 'theme',
      title: 'Underwater Balloon Installation',
      description: 'Create an underwater scene with blue and green balloons, seaweed-style streamers, and inflatable fish.',
      rationale: 'Transforms the venue into an immersive mermaid world for a 7-year-old.',
      estimatedCost: '₹5,000–₹8,000',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'activity',
      title: 'Mermaid Craft Corner',
      description: 'Set up a craft table where children can decorate their own mermaid tail craft.',
      rationale: 'Interactive activity that keeps children engaged and gives them a keepsake.',
      estimatedCost: '₹3,000–₹5,000',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'menu',
      title: 'Gluten-Free Options',
      description: 'Include clearly labelled gluten-free sandwiches, rice crackers, and a separate GF cake slice.',
      rationale: 'Required to safely accommodate your guest with a gluten allergy.',
      estimatedCost: 'Minimal additional cost',
      isUserSaved: false,
    },
  ];

  const plan: GeneratedPlan = {
    schemaVersion: SCHEMA_VERSION,
    source: 'demo',
    generatedAt: new Date().toISOString(),
    eventSummary: `[DEMO MODE] A magical underwater mermaid birthday party for Zara's 7th birthday, with 30 guests in Mumbai. The party features nut-free, allergy-conscious catering, interactive crafts, and an immersive turquoise-and-coral mermaid theme. Budget is ₹80,000 with a 5% contingency.`,
    budget: recalculateBudget(budget),
    timeline: {
      tasks,
      completedCount: 0,
      totalCount: tasks.length,
      overdueCount: 0,
      upcomingCount: 0,
      criticalPending: tasks.filter((t) => t.priority === 'critical'),
    },
    vendors: [],
    ideas,
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    event,
    plan,
    guests: [],
    documents: [],
    activeRefinement: null,
    lastSavedAt: new Date().toISOString(),
  };
}

// ─── Community Demo ────────────────────────────────────────────

export function createCommunityDemo(): EventState {
  const eventDate = addDays(todayString(), 60);
  const event: EventRecord = {
    id: uuidv4(),
    name: 'Bengaluru Tech Community Fest 2026',
    type: 'community',
    date: eventDate,
    startTime: '09:00',
    endTime: '18:00',
    city: 'Bengaluru, Karnataka',
    guestCount: 500,
    budget: 500000,
    currency: 'INR',
    venueSetting: 'outdoor',
    themePreferences: 'Innovation and sustainability. Open-source aesthetic.',
    dietaryRequirements: 'Mix of vegetarian and non-vegetarian. Vegan options needed.',
    accessibilityRequirements: 'Wheelchair accessible venue required',
    culturalPreferences: '',
    specialInstructions: 'Hackathon area, speaker stage, food stalls, networking zones needed.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const budget = createBudgetFromTemplate(event.budget, event.currency, event.type, 5);
  const tasks = getDefaultTasks(event.type, event.date);

  const ideas: IdeaItem[] = [
    {
      id: uuidv4(),
      category: 'logistics',
      title: 'QR-Code Check-In System',
      description: 'Use a free QR code generation tool for digital tickets and gate check-in.',
      rationale: 'Reduces queuing and provides real-time attendance tracking for 500+ guests.',
      estimatedCost: 'Free–₹5,000 (tool dependent)',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'contingency',
      title: 'Indoor Backup Arrangement',
      description: 'Identify a nearby community hall or convention space as a rain backup.',
      rationale: 'Bengaluru can experience unexpected rain; a backup prevents full cancellation.',
      estimatedCost: '₹20,000–₹40,000 as standby deposit',
      isUserSaved: false,
    },
    {
      id: uuidv4(),
      category: 'cost-saving',
      title: 'Sponsor Food Stalls',
      description: 'Partner with local food vendors to set up paid stalls rather than providing free catering.',
      rationale: 'Reduces catering costs while adding variety and a market-like atmosphere.',
      estimatedCost: 'Reduces budget by ₹80,000–₹1,20,000',
      isUserSaved: false,
    },
  ];

  const plan: GeneratedPlan = {
    schemaVersion: SCHEMA_VERSION,
    source: 'demo',
    generatedAt: new Date().toISOString(),
    eventSummary: `[DEMO MODE] A full-day technology community festival for 500 attendees in Bengaluru, featuring a hackathon zone, speaker stage, networking areas, and sustainability-themed design. Vegan and vegetarian catering options, full wheelchair accessibility, and a comprehensive volunteer team are all planned. Budget is ₹5,00,000 with a 5% contingency.`,
    budget: recalculateBudget(budget),
    timeline: {
      tasks,
      completedCount: 0,
      totalCount: tasks.length,
      overdueCount: 0,
      upcomingCount: 0,
      criticalPending: tasks.filter((t) => t.priority === 'critical'),
    },
    vendors: [],
    ideas,
  };

  return {
    schemaVersion: SCHEMA_VERSION,
    event,
    plan,
    guests: [],
    documents: [],
    activeRefinement: null,
    lastSavedAt: new Date().toISOString(),
  };
}

export const DEMO_SCENARIOS = [
  { key: 'wedding', label: '💒 Wedding', description: 'Traditional Rajasthani wedding for 350 guests', create: createWeddingDemo },
  { key: 'birthday', label: '🎂 Birthday', description: 'Children\'s mermaid birthday party for 30 guests', create: createBirthdayDemo },
  { key: 'community', label: '🎪 Community Event', description: 'Tech community festival for 500 attendees', create: createCommunityDemo },
] as const;
