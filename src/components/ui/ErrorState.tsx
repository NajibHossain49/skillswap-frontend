'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * Shared error surface for query failures. Keeps messaging generic and offers a
 * retry affordance. Use in every query `isError` branch.
 */
export function ErrorState({
  title = 'Something went wrong',
  description = 'We couldn’t load this right now. Please try again.',
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className ?? ''}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
        <AlertTriangle size={26} />
      </div>
      <div>
        <p className="text-ink-200 font-semibold font-display text-lg">{title}</p>
        <p className="text-ink-500 text-sm mt-1 max-w-sm">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} aria-label="Retry loading">
          <RefreshCw size={15} />
          Try again
        </Button>
      )}
    </div>
  );
}
