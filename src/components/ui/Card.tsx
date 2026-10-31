// ============================================================
// CelebrateAI — Card Component (Glassmorphic)
// ============================================================

import React from 'react';

export interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  padding = 'md',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const paddingStyles = {
    none: '',
    sm: 'p-3 sm:p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  return (
    <div
      className={`relative rounded-2xl border transition-all duration-300 ${
        hoverEffect ? 'glass-panel-interactive' : 'glass-panel'
      } ${className}`}
      {...props}
    >
      {/* Top subtle highlight shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent pointer-events-none rounded-t-2xl" />

      {(title || subtitle || headerAction) && (
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-white/8 px-5 sm:px-6 pt-5 sm:pt-6">
          <div>
            {title && (
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight font-display">
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-stone-400 mt-0.5">{subtitle}</p>}
          </div>
          {headerAction && <div className="flex items-center gap-2">{headerAction}</div>}
        </div>
      )}

      <div className={paddingStyles[padding]}>{children}</div>

      {footer && (
        <div className="pt-3.5 mt-4 border-t border-white/8 text-xs text-stone-400 flex items-center justify-between px-5 sm:px-6 pb-4">
          {footer}
        </div>
      )}
    </div>
  );
};
