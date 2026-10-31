// ============================================================
// CelebrateAI — Badge Component (Glowing Neon Pills)
// ============================================================

import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'neutral'
    | 'primary'
    | 'coral'
    | 'success'
    | 'warning'
    | 'danger'
    | 'gold'
    | 'critical'
    | 'high'
    | 'medium'
    | 'low'
    | 'pending'
    | 'in-progress'
    | 'done'
    | 'overdue'
    | 'not-started'
    | 'shortlisted'
    | 'contacted'
    | 'booked';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2.5 py-0.5 font-bold tracking-wider',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide',
  };

  const variantStyles: Record<string, string> = {
    neutral: 'bg-white/[0.08] text-stone-300 border border-white/10',
    primary:
      'bg-violet-500/20 text-violet-200 border border-violet-500/40 shadow-xs shadow-violet-500/20',
    coral:
      'bg-orange-500/20 text-orange-200 border border-orange-500/40 shadow-xs shadow-orange-500/20',
    success:
      'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40 shadow-xs shadow-emerald-500/20',
    warning:
      'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-xs shadow-amber-500/20',
    danger:
      'bg-rose-500/20 text-rose-200 border border-rose-500/40 shadow-xs shadow-rose-500/20',
    gold:
      'bg-yellow-500/20 text-yellow-200 border border-yellow-500/40 shadow-xs shadow-yellow-500/20',

    // Priority mappings
    critical:
      'bg-rose-500/25 text-rose-200 border border-rose-500/50 font-black shadow-xs shadow-rose-500/30 animate-pulse',
    high: 'bg-amber-500/20 text-amber-200 border border-amber-500/40 font-bold',
    medium: 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40',
    low: 'bg-white/[0.08] text-stone-300 border border-white/10',

    // Status mappings
    pending: 'bg-white/[0.06] text-stone-300 border border-white/10',
    'in-progress': 'bg-blue-500/20 text-blue-200 border border-blue-500/40 shadow-xs',
    done: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold',
    overdue:
      'bg-rose-500/30 text-rose-100 border border-rose-400 font-black shadow-md shadow-rose-500/40 animate-pulse',

    // Vendor status
    'not-started': 'bg-white/[0.06] text-stone-400 border border-white/10',
    shortlisted: 'bg-purple-500/20 text-purple-200 border border-purple-500/40',
    contacted: 'bg-amber-500/20 text-amber-200 border border-amber-500/40',
    booked:
      'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-xs shadow-emerald-500/30 font-bold',
  };

  const style = variantStyles[variant] || variantStyles.neutral;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full uppercase transition-all ${sizeStyles[size]} ${style} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{children}</span>
    </span>
  );
};
