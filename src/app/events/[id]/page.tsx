// ============================================================
// CelebrateAI — /events/[id] Page
// ============================================================

import React, { Suspense } from 'react';
import { EventDashboard } from '@/components/dashboard/EventDashboard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Event Dashboard | CelebrateAI',
  description: 'Manage budget, timeline milestones, vendor negotiations, and guest RSVPs with CelebrateAI.',
};

interface EventPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;

  return (
    <div className="min-h-screen relative">
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-violet-500/30" />
            <p className="text-sm font-semibold text-violet-300 font-display">Loading celebration dashboard...</p>
          </div>
        }
      >
        <EventDashboard eventId={id} />
      </Suspense>
    </div>
  );
}
