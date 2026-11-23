import React, { forwardRef } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gilt' | 'text' | 'destructive' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    // 1. Base Structure & Accessibility
    const baseStyles =
      'inline-flex items-center justify-center font-sans font-medium uppercase tracking-[0.16em] transition-all duration-200 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#121212] focus-visible:ring-offset-1 focus-visible:ring-offset-[#FAF9F5] disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed';

    // 2. Variant Configurations (Quiet Luxury Editorial Direction)
    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Deep Noir (#121212)
      primary:
        'bg-[#121212] hover:bg-[#2A2A2A] active:bg-[#000000] text-[#FAF9F5] border border-[#121212] rounded-[1px]',

      // Secondary: Soft Alabaster with hairline border
      secondary:
        'bg-[#F3F2EC] hover:bg-[#EAE8E0] active:bg-[#DFDDD5] text-[#121212] border border-[#E0DED6] hover:border-[#121212] rounded-[1px]',

      // Outline: Sharp 1px hairline border that inverts on hover
      outline:
        'bg-transparent hover:bg-[#121212] text-[#121212] hover:text-[#FAF9F5] border border-[#121212] rounded-[1px]',

      // Gilt / Accent: Deep espresso charcoal
      gilt:
        'bg-[#121212] hover:bg-[#2A2A2A] text-[#FAF9F5] border border-[#121212] rounded-[1px]',

      // Text: Understated editorial text with subtle underline
      text:
        'p-0 bg-transparent text-[#121212] hover:text-[#000000] underline underline-offset-4 decoration-[#D5D3CC] hover:decoration-[#121212]',

      // Destructive: Deep muted crimson
      destructive:
        'bg-[#7A1D1D] hover:bg-[#5E1414] text-white border border-[#7A1D1D] rounded-[1px]',

      // Icon-only: Clean minimal square
      icon:
        'p-2 text-[#5A5852] hover:text-[#121212] bg-white hover:bg-[#F3F2EC] border border-[#E5E3DC] hover:border-[#121212] rounded-[1px]',
    };

    // 3. Size Scaling
    const sizeStyles: Record<ButtonSize, string> = {
      sm: variant === 'icon' ? 'w-8 h-8' : variant === 'text' ? 'text-[10px]' : 'h-8 px-4 text-[10px]',
      md: variant === 'icon' ? 'w-10 h-10' : variant === 'text' ? 'text-[11px]' : 'h-11 px-7 text-[11px]',
      lg: variant === 'icon' ? 'w-12 h-12' : variant === 'text' ? 'text-xs' : 'h-13 px-9 text-xs',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-3.5 w-3.5 text-current"
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
                strokeWidth="2"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Processing</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            {leftIcon && <span className="shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
