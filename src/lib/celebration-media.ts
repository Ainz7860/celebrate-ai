// ============================================================
// CelebrateAI — Curated Celebration Media & Visual Aesthetics
// High-resolution photography, moodboard inspirations & color swatches
// ============================================================

import type { EventType } from './types';

export interface CelebrationVisual {
  heroImage: string;
  thumbnail: string;
  accentGlow: string;
  badgeEmoji: string;
  tagline: string;
  colorPalette: Array<{ name: string; hex: string; role: string }>;
  inspirationImages: Array<{
    title: string;
    url: string;
    category: string;
    description: string;
  }>;
}

export const CELEBRATION_MEDIA: Record<EventType | 'general', CelebrationVisual> = {
  wedding: {
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    accentGlow: 'from-amber-500/20 via-rose-500/15 to-violet-600/20',
    badgeEmoji: '💒',
    tagline: 'Royal Heritage & Cinematic Elegance',
    colorPalette: [
      { name: 'Royal Jaipur Blue', hex: '#1E3A8A', role: 'Draping & Accent' },
      { name: 'Marigold Gold', hex: '#F59E0B', role: 'Florals & Garlands' },
      { name: 'Crimson Velvet', hex: '#BE123C', role: 'Attire & Highlights' },
      { name: 'Champagne Ivory', hex: '#FEF3C7', role: 'Stationery & Linens' },
    ],
    inspirationImages: [
      {
        title: 'Illuminated Mandap & Water Pavilion',
        url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
        category: 'Venue Decor',
        description: 'Floral arches with floating brass lamps and reflection pool.',
      },
      {
        title: 'Banquet Table Under Crystal Chandeliers',
        url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
        category: 'Dining Experience',
        description: 'Warm candlelight runners, hand-lettered gold menu cards.',
      },
      {
        title: 'Candid Golden-Hour Sangeet Stage',
        url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80',
        category: 'Entertainment',
        description: 'Acoustic stage backdrop with fairy light curtain and low-smoke entrance.',
      },
      {
        title: 'Artisan Dessert & Mithai Display',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        category: 'Gastronomy',
        description: 'Tiered brass trays with edible gold leaf garnishes and pistachio rabdi.',
      },
    ],
  },

  birthday: {
    heroImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=600&q=80',
    accentGlow: 'from-pink-500/20 via-purple-500/15 to-cyan-500/20',
    badgeEmoji: '🎂',
    tagline: 'Whimsical Enchantment & Wonder',
    colorPalette: [
      { name: 'Iridescent Lilac', hex: '#C084FC', role: 'Balloon Arches' },
      { name: 'Pastel Coral', hex: '#FB7185', role: 'Dessert Cart' },
      { name: 'Aquamarine Shimmer', hex: '#38BDF8', role: 'Undersea Lighting' },
      { name: 'Frosted Vanilla', hex: '#FDF4FF', role: 'Table Setting' },
    ],
    inspirationImages: [
      {
        title: 'Organic Pastel Balloon Cloud',
        url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
        category: 'Entrance Decor',
        description: 'Multi-tiered balloon garland with shimmer foil streamers.',
      },
      {
        title: 'Interactive Cake & Favor Bar',
        url: 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?auto=format&fit=crop&w=800&q=80',
        category: 'Kids Experience',
        description: 'Custom dessert tower with personalized themed party boxes.',
      },
      {
        title: 'Fairytale Lighting & Activity Zone',
        url: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80',
        category: 'Interactive Zones',
        description: 'Safe soft-play area with twinkle star projection canopy.',
      },
      {
        title: 'Custom Mocktail Station',
        url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
        category: 'Refreshments',
        description: 'Sparkling fruit punch dispensers with glitter sugar rims.',
      },
    ],
  },

  community: {
    heroImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=600&q=80',
    accentGlow: 'from-emerald-500/20 via-cyan-500/15 to-violet-600/20',
    badgeEmoji: '🎪',
    tagline: 'Vibrant Community Starlight Celebration',
    colorPalette: [
      { name: 'Electric Emerald', hex: '#10B981', role: 'Wayfinding & Signs' },
      { name: 'Neon Amber', hex: '#F59E0B', role: 'Lantern Glow' },
      { name: 'Cosmic Violet', hex: '#8B5CF6', role: 'Main Stage Lights' },
      { name: 'Pure Starlight', hex: '#F0FDFA', role: 'Ambient Festoon' },
    ],
    inspirationImages: [
      {
        title: 'Floating Sky Lanterns & Night Sky',
        url: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
        category: 'Main Spectacle',
        description: 'Biodegradable glowing lanterns floating against the twilight sky.',
      },
      {
        title: 'Community Food Truck Village',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        category: 'Food & Beverage',
        description: 'Fairy-lit artisan food stalls with picnic seating and trash sorting.',
      },
      {
        title: 'Contemporary Acoustic Stage',
        url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
        category: 'Performance',
        description: 'Low-profile timber stage with modular LED wash lighting.',
      },
      {
        title: 'Interactive Maker & Craft Pods',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80',
        category: 'Activities',
        description: 'Shaded pop-up pavilions for pottery, origami, and local makers.',
      },
    ],
  },

  general: {
    heroImage: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80',
    accentGlow: 'from-violet-600/20 via-fuchsia-600/15 to-cyan-500/20',
    badgeEmoji: '✨',
    tagline: 'Flawless Milestones & Curated Splendor',
    colorPalette: [
      { name: 'Obsidian Midnight', hex: '#0B081A', role: 'Background Canvas' },
      { name: 'Starlight Violet', hex: '#8B5CF6', role: 'Primary Keynote' },
      { name: 'Golden Glow', hex: '#F59E0B', role: 'Success & Buffer' },
      { name: 'Pure Pearl', hex: '#F8FAFC', role: 'Contrast Typography' },
    ],
    inspirationImages: [
      {
        title: 'Champagne Toast & Crystal Stemware',
        url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
        category: 'Celebration Toast',
        description: 'Towering crystal flute display illuminated by amber pinspots.',
      },
      {
        title: 'Grand Ballroom & Velvet Draping',
        url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
        category: 'Architectural Venue',
        description: 'High-vaulted ceilings with floating floral clouds and uplighting.',
      },
    ],
  },
};

export function getCelebrationMedia(type?: EventType | string): CelebrationVisual {
  if (type === 'wedding' || type === 'birthday' || type === 'community') {
    return CELEBRATION_MEDIA[type];
  }
  return CELEBRATION_MEDIA.general;
}
