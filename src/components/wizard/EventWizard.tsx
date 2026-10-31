// ============================================================
// CelebrateAI — Event Creation Wizard (Luxury Glassmorphic)
// ============================================================

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { saveEventState } from '@/lib/storage';
import { addDays, todayString } from '@/lib/dates';
import type { EventFormData, EventRecord, EventState, EventType, Currency, VenueSetting } from '@/lib/types';

interface WizardErrors {
  [key: string]: string;
}

export const EventWizard: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<number>(1);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    type: 'wedding',
    date: '',
    startTime: '10:00',
    endTime: '22:00',
    city: 'Mumbai',
    guestCount: 150,
    budget: 800000,
    currency: 'INR',
    venueSetting: 'indoor',
    themePreferences: '',
    dietaryRequirements: '',
    accessibilityRequirements: '',
    culturalPreferences: '',
    specialInstructions: '',
  });

  useEffect(() => {
    setFormData((prev) => (prev.date ? prev : { ...prev, date: addDays(todayString(), 90) }));
  }, []);

  const [errors, setErrors] = useState<WizardErrors>({});

  const validateStep = (currentStep: number): boolean => {
    const newErrors: WizardErrors = {};

    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = 'Please provide an event name.';
      if (!formData.date) newErrors.date = 'Event date is required.';
      if (!formData.city.trim()) newErrors.city = 'City or location is required.';
    }

    if (currentStep === 2) {
      if (formData.guestCount < 1) newErrors.guestCount = 'Guest count must be at least 1.';
      if (formData.budget <= 0) newErrors.budget = 'Budget must be greater than zero.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handlePresetSelect = (type: EventType) => {
    if (type === 'wedding') {
      setFormData({
        name: 'Royal Heritage Wedding',
        type: 'wedding',
        date: addDays(todayString(), 180),
        startTime: '11:00',
        endTime: '23:00',
        city: 'Jaipur, Rajasthan',
        guestCount: 300,
        budget: 2000000,
        currency: 'INR',
        venueSetting: 'outdoor',
        themePreferences: 'Marigold and Royal Blue, Palace Heritage',
        dietaryRequirements: 'Pure Vegetarian, Jain food counters available',
        accessibilityRequirements: 'Wheelchair access for elderly relatives',
        culturalPreferences: 'Traditional Rajasthani Sangeet & Pheras',
        specialInstructions: 'Need fireworks permit and drone photography',
      });
    } else if (type === 'birthday') {
      setFormData({
        name: "Aarav's 5th Superhero Birthday",
        type: 'birthday',
        date: addDays(todayString(), 30),
        startTime: '15:00',
        endTime: '19:00',
        city: 'Bengaluru',
        guestCount: 45,
        budget: 95000,
        currency: 'INR',
        venueSetting: 'indoor',
        themePreferences: 'Marvel Avengers / Superhero themed',
        dietaryRequirements: 'Nut-free treats, kid-friendly finger foods',
        accessibilityRequirements: 'Stroller accessible entrance',
        culturalPreferences: '',
        specialInstructions: 'Custom iron-man cake and party favor bags for kids',
      });
    } else {
      setFormData({
        name: 'Neighborhood Green Community Festival',
        type: 'community',
        date: addDays(todayString(), 60),
        startTime: '09:00',
        endTime: '17:00',
        city: 'Pune',
        guestCount: 400,
        budget: 350000,
        currency: 'INR',
        venueSetting: 'outdoor',
        themePreferences: 'Eco-friendly, Zero-waste, Solar aesthetic',
        dietaryRequirements: 'Organic local food stalls, Vegan friendly',
        accessibilityRequirements: 'Complete ramp access and reserved seating',
        culturalPreferences: 'Local folk art performances',
        specialInstructions: 'PA system, waste segregation bins, water refill stations',
      });
    }
  };

  const handleGeneratePlan = async () => {
    if (!validateStep(1) || !validateStep(2)) return;

    setIsGenerating(true);
    setErrorMsg(null);

    const eventRecord: EventRecord = {
      ...formData,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: formData }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate plan.');
      }

      const initialEventState: EventState = {
        schemaVersion: '1.0.0',
        event: eventRecord,
        plan: data.plan,
        guests: [],
        documents: [],
        activeRefinement: null,
        lastSavedAt: new Date().toISOString(),
      };

      saveEventState(initialEventState);
      router.push(`/events/${eventRecord.id}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Plan generation failed';
      setErrorMsg(msg);
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 relative z-10">
      {/* Wizard Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-violet-500/20 text-violet-200 border border-violet-500/40 shadow-lg shadow-violet-500/10 mb-4">
          ✨ Intelligent Celebration Concierge
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight">
          Craft Your Celebration
        </h1>
        <p className="text-sm text-stone-400 mt-2 max-w-lg mx-auto">
          Specify your vision. CelebrateAI generates deterministic budget limits, milestone checklists, and vendor guides.
        </p>
      </div>

      {/* Preset Quick Fill Bar */}
      <div className="mb-8 p-3.5 glass-panel rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs border border-white/10">
        <span className="font-bold text-violet-300 flex items-center gap-2">
          <span>⚡</span> Quick start with a sample event:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePresetSelect('wedding')}
            className="px-3 py-1.5 bg-white/8 hover:bg-violet-600/30 border border-white/10 hover:border-violet-400/50 text-white rounded-xl transition-all font-semibold cursor-pointer"
          >
            💒 Royal Wedding
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('birthday')}
            className="px-3 py-1.5 bg-white/8 hover:bg-violet-600/30 border border-white/10 hover:border-violet-400/50 text-white rounded-xl transition-all font-semibold cursor-pointer"
          >
            🎂 Kids Birthday
          </button>
          <button
            type="button"
            onClick={() => handlePresetSelect('community')}
            className="px-3 py-1.5 bg-white/8 hover:bg-violet-600/30 border border-white/10 hover:border-violet-400/50 text-white rounded-xl transition-all font-semibold cursor-pointer"
          >
            🎪 Community Fest
          </button>
        </div>
      </div>

      {/* Stepper Progress Indicator */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-white/10 z-0" />
        {[
          { num: 1, title: 'Basics' },
          { num: 2, title: 'Scale & Budget' },
          { num: 3, title: 'Preferences' },
          { num: 4, title: 'Generate' },
        ].map((s) => (
          <div key={s.num} className="relative z-10 flex flex-col items-center">
            <button
              onClick={() => {
                if (s.num < step || validateStep(step)) setStep(s.num);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all cursor-pointer ${
                step === s.num
                  ? 'bg-linear-to-r from-violet-600 to-fuchsia-600 text-white shadow-xl shadow-violet-600/50 ring-4 ring-violet-500/20 scale-110'
                  : step > s.num
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#120D26] border border-white/20 text-stone-400'
              }`}
            >
              {step > s.num ? '✓' : s.num}
            </button>
            <span
              className={`text-[11px] font-bold mt-2 uppercase tracking-wider ${
                step === s.num ? 'text-violet-300' : 'text-stone-500'
              }`}
            >
              {s.title}
            </span>
          </div>
        ))}
      </div>

      {/* Error Message Alert */}
      {errorMsg && (
        <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-rose-200 text-sm flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <div className="flex-1">
            <p className="font-bold">Plan Generation Failed</p>
            <p className="text-xs text-rose-300 mt-0.5">{errorMsg}</p>
          </div>
          <button onClick={() => setErrorMsg(null)} className="text-rose-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Form Content */}
      <Card padding="lg">
        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/8 pb-3">
              <h2 className="text-xl font-bold text-white font-display">
                Step 1: Event Essentials
              </h2>
              <p className="text-xs text-stone-400 mt-1">Name, celebration type, date and venue city</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Event Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Maya & Rohan's Royal Wedding"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all"
              />
              {errors.name && <p className="text-xs text-rose-400 mt-1.5 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Celebration Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { key: 'wedding', label: 'Wedding', icon: '💒', desc: 'Sangeet, vows, reception' },
                  { key: 'birthday', label: 'Birthday', icon: '🎂', desc: 'Milestone, themed, kids' },
                  { key: 'community', label: 'Community', icon: '🎪', desc: 'Fest, gala, gathering' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: item.key as EventType })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      formData.type === item.key
                        ? 'bg-violet-600/30 border-violet-400 shadow-lg shadow-violet-600/30'
                        : 'bg-white/3 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{item.icon}</span>
                    <span className="font-bold text-white text-sm block">{item.label}</span>
                    <span className="text-[11px] text-stone-400 mt-0.5 block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all"
                />
                {errors.date && <p className="text-xs text-rose-400 mt-1.5 font-semibold">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  City / Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all"
                />
                {errors.city && <p className="text-xs text-rose-400 mt-1.5 font-semibold">{errors.city}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Start Time (Optional)
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  End Time (Optional)
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Scale & Budget */}
        {step === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/8 pb-3">
              <h2 className="text-xl font-bold text-white font-display">
                Step 2: Guests & Financial Limits
              </h2>
              <p className="text-xs text-stone-400 mt-1">Scale, total budget allocation, and venue environment</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Expected Guest Count *
                </label>
                <input
                  type="number"
                  min="1"
                  max="100000"
                  value={formData.guestCount}
                  onChange={(e) =>
                    setFormData({ ...formData, guestCount: parseInt(e.target.value) || 0 })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.guestCount && (
                  <p className="text-xs text-rose-400 mt-1.5 font-semibold">{errors.guestCount}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Venue Setting
                </label>
                <select
                  aria-label="Venue Setting"
                  value={formData.venueSetting}
                  onChange={(e) =>
                    setFormData({ ...formData, venueSetting: e.target.value as VenueSetting })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-[#120D26] border border-white/15 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="indoor">🏢 Indoor (Banquet, Ballroom, Hotel)</option>
                  <option value="outdoor">🌳 Outdoor (Garden, Palace Lawn, Beach)</option>
                  <option value="undecided">🤔 Undecided / Flexible</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Total Budget *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white font-bold font-mono focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
                {errors.budget && <p className="text-xs text-rose-400 mt-1.5 font-semibold">{errors.budget}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Currency
                </label>
                <select
                  aria-label="Currency"
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value as Currency })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-[#120D26] border border-white/15 text-white focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                >
                  <option value="INR">₹ INR (Indian Rupee)</option>
                  <option value="USD">$ USD (US Dollar)</option>
                  <option value="EUR">€ EUR (Euro)</option>
                  <option value="GBP">£ GBP (British Pound)</option>
                </select>
              </div>
            </div>

            {/* Live Financial Partition Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 bg-white/3 border border-white/10 rounded-2xl text-xs space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                  Spend Per Guest
                </span>
                <span className="text-sm font-bold text-white font-mono block">
                  {formData.guestCount > 0
                    ? `${formData.currency} ${Math.round(formData.budget / formData.guestCount).toLocaleString()}`
                    : '—'}
                </span>
              </div>

              <div className="p-3.5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl text-xs space-y-1">
                <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider flex items-center gap-1">
                  <span>🛡️</span> 5% Contingency Buffer
                </span>
                <span className="text-sm font-bold text-emerald-400 font-mono block">
                  {formData.currency} {Math.round(formData.budget * 0.05).toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 bg-violet-950/30 border border-violet-500/30 rounded-2xl text-xs space-y-1">
                <span className="text-[10px] text-violet-300 uppercase font-bold tracking-wider block">
                  95% Category Allocations
                </span>
                <span className="text-sm font-bold text-violet-300 font-mono block">
                  {formData.currency} {Math.round(formData.budget * 0.95).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="border-b border-white/8 pb-3">
              <h2 className="text-xl font-bold text-white font-display">
                Step 3: Vision, Styling & Accommodations
              </h2>
              <p className="text-xs text-stone-400 mt-1">Theme, dietary restrictions, and accessibility needs</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Theme & Aesthetic Preferences
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Marigold & Royal Blue, Palace Heritage, Boho Sunset, Neon Cyberpunk..."
                value={formData.themePreferences}
                onChange={(e) => setFormData({ ...formData, themePreferences: e.target.value })}
                className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Dietary Accommodations
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Vegetarian only, Jain counters, peanut allergy, vegan..."
                  value={formData.dietaryRequirements}
                  onChange={(e) =>
                    setFormData({ ...formData, dietaryRequirements: e.target.value })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Accessibility Accommodations
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Wheelchair access, elder seating, stroller ramps..."
                  value={formData.accessibilityRequirements}
                  onChange={(e) =>
                    setFormData({ ...formData, accessibilityRequirements: e.target.value })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Cultural / Ceremonial Traditions
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rajasthani Sangeet, South Indian Muhurtham..."
                  value={formData.culturalPreferences}
                  onChange={(e) =>
                    setFormData({ ...formData, culturalPreferences: e.target.value })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                  Special Logistics Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Drone permit, strict curfew, fireworks..."
                  value={formData.specialInstructions}
                  onChange={(e) =>
                    setFormData({ ...formData, specialInstructions: e.target.value })
                  }
                  className="w-full text-sm px-4 py-3 rounded-xl bg-white/5 border border-white/15 text-white placeholder:text-stone-500 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Generate */}
        {step === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-white/8 pb-3">
              <h2 className="text-xl font-bold text-white font-display">
                Step 4: Review & Generate Plan
              </h2>
              <p className="text-xs text-stone-400 mt-1">Review event specifications before plan synthesis</p>
            </div>

            <div className="p-5 bg-white/4 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/8">
                <span className="font-extrabold text-lg sm:text-xl text-white font-display">
                  {formData.name}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-500/25 text-violet-300 border border-violet-400/30 uppercase tracking-wider">
                  {formData.type}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block font-semibold">Date</span>
                  <span className="font-bold text-white">{formData.date}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">City</span>
                  <span className="font-bold text-white">{formData.city}</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Attendees</span>
                  <span className="font-bold text-white">{formData.guestCount} guests</span>
                </div>
                <div>
                  <span className="text-stone-400 block font-semibold">Total Budget</span>
                  <span className="font-bold text-violet-300 font-mono">
                    {formData.currency} {formData.budget.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-5 bg-linear-to-r from-violet-950/40 via-purple-950/30 to-indigo-950/40 rounded-2xl border border-violet-500/30 text-xs space-y-2.5">
              <p className="font-bold text-violet-200 flex items-center gap-2">
                <span>🤖</span> What CelebrateAI will generate for you:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-stone-300">
                <li>Deterministic budget allocation with a dedicated 5% safety buffer</li>
                <li>Backward-scheduled milestone checklist with deadlines & priority tags</li>
                <li>Vendor requirements, questions to ask, and inspection criteria</li>
                <li>Creative theme, menu, and guest experience inspiration</li>
              </ul>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-white/8">
          <div>
            {step > 1 && (
              <Button variant="secondary" onClick={handleBack} disabled={isGenerating}>
                Back
              </Button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {step < 4 ? (
              <Button variant="primary" onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button
                variant="coral"
                size="lg"
                onClick={handleGeneratePlan}
                isLoading={isGenerating}
                leftIcon={<span>✨</span>}
              >
                {isGenerating ? 'Generating Plan...' : 'Synthesize Event Plan'}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
