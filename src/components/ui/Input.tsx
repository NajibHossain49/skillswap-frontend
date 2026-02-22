import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, suffix, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-ink-300">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-ink-400 pointer-events-none">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-2.5 text-sm text-ink-100',
              'placeholder:text-ink-500 focus:outline-none focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30',
              'transition-all duration-200',
              icon && 'pl-10',
              suffix && 'pr-10',
              error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20',
              className,
            )}
            {...props}
          />
          {suffix && (
            <span className="absolute right-3 text-ink-400">{suffix}</span>
          )}
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
        {hint && !error && <p className="text-xs text-ink-500">{hint}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
