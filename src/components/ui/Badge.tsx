interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'error' | 'warning' | 'neutral';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'neutral', size = 'sm' }: BadgeProps) {
  const variants = {
    primary: 'bg-[#FFF7F0] text-[#F47721]',
    success: 'bg-green-50 text-[#269B62]',
    error: 'bg-red-50 text-[#D94A43]',
    warning: 'bg-amber-50 text-amber-700',
    neutral: 'bg-[#EEEEEE] text-[#777777]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
}

