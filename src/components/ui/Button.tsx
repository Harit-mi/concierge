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
      'inline-flex items-center justify-center font-sans font-medium uppercase transition-all duration-300 ease-out select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9E7A4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FAF7F2] disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed';

    // 2. Variant Configurations (Shopping Concierge Luxury Direction)
    const variantStyles: Record<ButtonVariant, string> = {
      // Primary: Understated near-black obsidian with razor border & gold ambient hover
      primary:
        'btn-obsidian border border-[#1C1E26] shadow-sm text-[#FAF7F2]',

      // Secondary: Soft parchment linen with fine border
      secondary:
        'bg-[#F4EFEA] hover:bg-[#EFE8E0] text-[#111215] border border-[#E3D8CB] hover:border-[#C4A575] shadow-2xs hover:-translate-y-0.5 active:translate-y-0',

      // Outline: Translucent canvas outline that inverts to obsidian on hover
      outline:
        'btn-luxury-outline border border-[#D5C9B8] text-[#111215]',

      // Gilt: Archival burnished bronze gradient
      gilt:
        'btn-gilt border border-[#C4A575] text-white shadow-sm',

      // Text: Understated editorial text with expanding gilt underline
      text:
        'btn-editorial-text p-0 bg-transparent text-[#111215] tracking-kicker',

      // Destructive: Crimson / Rosewood warning
      destructive:
        'bg-[#881337] hover:bg-[#4C0519] text-white border border-[#9F1239] shadow-sm hover:-translate-y-0.5 active:translate-y-0',

      // Icon-only: Square touch target
      icon:
        'p-2 text-[#575A6B] hover:text-[#111215] bg-white hover:bg-[#F4EFEA] border border-[#E3D8CB] hover:border-[#C4A575] rounded-[2px] shadow-2xs',
    };

    // 3. Size Scaling
    const sizeStyles: Record<ButtonSize, string> = {
      sm: variant === 'icon' ? 'w-8 h-8' : variant === 'text' ? 'text-[10px]' : 'h-8 px-3.5 text-[10px] tracking-kicker rounded-[2px]',
      md: variant === 'icon' ? 'w-10 h-10' : variant === 'text' ? 'text-[11px]' : 'h-11 px-6 text-[11px] tracking-kicker rounded-[2px]',
      lg: variant === 'icon' ? 'w-12 h-12' : variant === 'text' ? 'text-xs' : 'h-13 px-8 text-xs tracking-kicker rounded-[2px]',
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
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span className="opacity-80">Processing...</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-2">
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
