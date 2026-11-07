import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, hint, leftIcon, rightElement, className = '', id, ...props },
  ref
) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[#252525] mb-1.5"
        >
          {label}
          {props.required && <span className="text-[#D94A43] ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#777777]">
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full border rounded-xl px-4 py-3 text-sm text-[#252525]
            placeholder:text-[#777777] bg-white
            transition-colors duration-150
            focus:outline-none focus:border-[#F47721] focus:ring-2 focus:ring-[#F47721]/20
            disabled:bg-[#FAFAFA] disabled:cursor-not-allowed
            ${error ? 'border-[#D94A43] focus:border-[#D94A43] focus:ring-[#D94A43]/20' : 'border-[#EEEEEE]'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </span>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-[#D94A43] flex items-center gap-1.5 font-medium">
          <AlertCircle size={13} className="shrink-0" />
          <span>{error}</span>
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-[#777777]">{hint}</p>
      )}
    </div>
  );
});

