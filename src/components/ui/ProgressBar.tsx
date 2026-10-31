// ============================================================
// CelebrateAI — ProgressBar Component (Glowing Neon Bar)
// ============================================================

import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  sublabel?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'violet' | 'emerald' | 'amber' | 'rose' | 'auto';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  sublabel,
  size = 'md',
  color = 'auto',
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getAutoColor = (val: number) => {
    if (val >= 100)
      return 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/40';
    if (val > 80)
      return 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-md shadow-amber-500/40';
    return 'bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-md shadow-violet-500/40';
  };

  const colorClasses = {
    violet:
      'bg-gradient-to-r from-violet-600 via-purple-500 to-fuchsia-500 shadow-md shadow-violet-500/40',
    emerald:
      'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/40',
    amber:
      'bg-gradient-to-r from-amber-500 to-orange-400 shadow-md shadow-amber-500/40',
    rose:
      'bg-gradient-to-r from-rose-500 to-red-400 shadow-md shadow-rose-500/40',
    auto: getAutoColor(clamped),
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || sublabel) && (
        <div className="flex justify-between items-center text-xs mb-2">
          {label && <span className="font-semibold text-stone-300">{label}</span>}
          {sublabel && <span className="font-bold text-white font-mono">{sublabel}</span>}
        </div>
      )}
      <div className={`w-full bg-white/8 rounded-full overflow-hidden p-0.5 border border-white/5 ${heights[size]}`}>
        <div
          className={`${colorClasses[color]} ${heights[size]} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};
