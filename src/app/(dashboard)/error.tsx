'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ui/ErrorState';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface for observability; the user sees a friendly message.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <ErrorState
        title="This page hit a snag"
        description="An unexpected error occurred while loading this view. You can try again."
        onRetry={reset}
      />
    </div>
  );
}
