import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-[0.98] select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F47721] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:active:scale-100';

  const sizes = {
    sm: 'min-h-[38px] px-3.5 py-1.5 text-xs sm:text-sm',
    md: 'min-h-[44px] px-5 py-2.5 text-sm',
    lg: 'min-h-[48px] px-6 py-3 text-base',
  };

  const variants = {
    primary:
      'bg-[#F47721] text-white hover:bg-[#e06310] disabled:opacity-50 shadow-xs hover:shadow-sm',
    outline:
      'border-2 border-[#F47721] text-[#F47721] bg-white hover:bg-[#FFF7F0] disabled:opacity-50',
    ghost:
      'text-[#F47721] bg-transparent hover:bg-[#FFF7F0] disabled:opacity-50',
    danger:
      'bg-[#D94A43] text-white hover:bg-[#b83b35] disabled:opacity-50 shadow-xs',
    success:
      'bg-[#269B62] text-white hover:bg-[#1f7d4f] disabled:opacity-50 shadow-xs',
  };

  return (
    <button
      className={`
        ${base}
        ${sizes[size]}
        ${variants[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Processing…</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
