// ============================================================
// CelebrateAI — StatCard KPI Primitive (Cyber-Luxe Glass)
// ============================================================

import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    positive?: boolean;
  };
  accentColor?: 'violet' | 'coral' | 'emerald' | 'amber' | 'blue';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtitle,
  icon,
  trend,
  accentColor = 'violet',
  className = '',
}) => {
  const accentGlow = {
    violet:
      'border-violet-500/30 hover:border-violet-400/60 shadow-lg shadow-violet-950/40 bg-gradient-to-br from-violet-950/20 via-transparent to-transparent',
    coral:
      'border-orange-500/30 hover:border-orange-400/60 shadow-lg shadow-orange-950/40 bg-gradient-to-br from-orange-950/20 via-transparent to-transparent',
    emerald:
      'border-emerald-500/30 hover:border-emerald-400/60 shadow-lg shadow-emerald-950/40 bg-gradient-to-br from-emerald-950/20 via-transparent to-transparent',
    amber:
      'border-amber-500/30 hover:border-amber-400/60 shadow-lg shadow-amber-950/40 bg-gradient-to-br from-amber-950/20 via-transparent to-transparent',
    blue:
      'border-cyan-500/30 hover:border-cyan-400/60 shadow-lg shadow-cyan-950/40 bg-gradient-to-br from-cyan-950/20 via-transparent to-transparent',
  };

  const iconBox = {
    violet: 'bg-violet-500/20 text-violet-300 border border-violet-500/30 shadow-xs shadow-violet-500/30',
    coral: 'bg-orange-500/20 text-orange-300 border border-orange-500/30 shadow-xs shadow-orange-500/30',
    emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs shadow-emerald-500/30',
    amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-xs shadow-amber-500/30',
    blue: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-xs shadow-cyan-500/30',
  };

  return (
    <div
      className={`glass-panel rounded-2xl p-5 border transition-all duration-300 hover:scale-[1.02] flex items-center justify-between ${accentGlow[accentColor]} ${className}`}
    >
      <div className="space-y-1.5">
        <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          {value}
        </p>
        {subtitle && <p className="text-xs text-stone-400 font-medium">{subtitle}</p>}
        {trend && (
          <p
            className={`text-xs font-bold ${
              trend.positive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.value}
          </p>
        )}
      </div>

      {icon && (
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${iconBox[accentColor]}`}
        >
          {icon}
        </div>
      )}
    </div>
  );
};
