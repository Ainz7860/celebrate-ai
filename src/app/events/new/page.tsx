// ============================================================
// CelebrateAI — /events/new Page
// ============================================================

import React, { Suspense } from 'react';
import { EventWizard } from '@/components/wizard/EventWizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Plan a New Celebration | CelebrateAI',
  description:
    'Create a tailored celebration plan with deterministic budget, milestone checklist, and vendor sourcing using CelebrateAI.',
};

export default function NewEventPage() {
  return (
    <div className="min-h-screen py-6 relative">
      <Suspense
        fallback={
          <div className="min-h-[50vh] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-violet-500/30" />
          </div>
        }
      >
        <EventWizard />
      </Suspense>
    </div>
  );
}
