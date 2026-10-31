// ============================================================
// CelebrateAI — Modal Dialog Primitive (Luxury Frosted Glass)
// ============================================================

'use client';

import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#070510]/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-[#120D26]/95 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-violet-950/80 border border-white/15 p-6 sm:p-7 z-10 my-8 transition-all animate-scale-in max-h-[90vh] flex flex-col text-stone-100 overflow-hidden`}
      >
        {/* Top ambient highlight */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />

        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between pb-4 mb-4 border-b border-white/10 flex-shrink-0">
            <div>
              {title && (
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-display">
                  {title}
                </h2>
              )}
              {subtitle && <p className="text-xs text-stone-400 mt-1">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white rounded-xl p-2 hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto pr-1 flex-1">{children}</div>
      </div>
    </div>
  );
};
