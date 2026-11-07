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
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 active:scale-95 select-none';

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  const variants = {
    primary:
      'bg-[#F47721] text-white hover:bg-[#e06310] disabled:opacity-50 disabled:cursor-not-allowed',
    outline:
      'border-2 border-[#F47721] text-[#F47721] bg-white hover:bg-[#FFF7F0] disabled:opacity-50 disabled:cursor-not-allowed',
    ghost:
      'text-[#F47721] bg-transparent hover:bg-[#FFF7F0] disabled:opacity-50 disabled:cursor-not-allowed',
    danger:
      'bg-[#D94A43] text-white hover:bg-[#b83b35] disabled:opacity-50 disabled:cursor-not-allowed',
    success:
      'bg-[#269B62] text-white hover:bg-[#1f7d4f] disabled:opacity-50 disabled:cursor-not-allowed',
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
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
          Loading…
        </>
      ) : (
        children
      )}
    </button>
  );
}

