// ============================================================
// CelebrateAI — Button Component (Luxury Glass / Cyber-Luxe)
// ============================================================

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'coral' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 focus:ring-offset-[#070510] disabled:opacity-40 disabled:cursor-not-allowed select-none active:scale-[0.97] cursor-pointer overflow-hidden';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 rounded-lg',
    md: 'text-xs sm:text-sm px-4 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 font-bold rounded-2xl',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 hover:shadow-violet-500/50 border border-white/20',
    secondary:
      'bg-white/[0.07] hover:bg-white/[0.12] text-stone-200 hover:text-white border border-white/10 hover:border-white/20 backdrop-blur-md shadow-sm',
    outline:
      'bg-transparent hover:bg-violet-500/10 text-violet-300 hover:text-violet-200 border border-violet-500/30 hover:border-violet-400/60 shadow-xs',
    ghost:
      'bg-transparent hover:bg-white/[0.06] text-stone-400 hover:text-stone-200',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/30 border border-rose-400/30',
    coral:
      'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 hover:from-orange-400 hover:via-amber-400 hover:to-rose-400 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 border border-orange-300/30',
    gold:
      'bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 hover:from-amber-400 hover:via-yellow-400 hover:to-orange-400 text-stone-950 font-black shadow-lg shadow-amber-500/30 border border-yellow-200/50',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        leftIcon
      )}
      <span className="relative z-10">{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
