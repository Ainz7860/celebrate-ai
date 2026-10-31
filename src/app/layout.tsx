// ============================================================
// CelebrateAI — Root Layout
// ============================================================

import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'CelebrateAI — Intelligent Celebration & Event Planning Assistant',
  description:
    'Plan weddings, birthdays, and community festivals with AI-powered budget calculations, dynamic timeline milestones, vendor sourcing checklists, and adaptive replanning.',
  keywords: [
    'event planner',
    'wedding planner',
    'birthday planning',
    'celebration assistant',
    'budget calculator',
    'AI event assistant',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#070510] text-[#F1EDFA] font-sans selection:bg-violet-500/30 selection:text-white">
        <Suspense fallback={<header className="h-16 bg-[#0B081A]/80 border-b border-white/[0.08]" />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
