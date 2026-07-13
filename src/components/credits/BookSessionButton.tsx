'use client';

import { useState } from 'react';
import { Coins } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui';
import { useBookSession } from '@/hooks/useSessions';
import { useCreditBalance } from '@/hooks/useCredits';
import { useAuthStore } from '@/store/auth';
import { Session } from '@/types';
import { cn } from '@/lib/utils';

type ButtonSize = 'default' | 'sm' | 'lg';

export function BookSessionButton({
  session,
  size = 'default',
  className,
}: {
  session: Session;
  size?: ButtonSize;
  className?: string;
}) {
  const user = useAuthStore((s) => s.user);
  const { data: balanceData } = useCreditBalance();
  const book = useBookSession();
  const [open, setOpen] = useState(false);

  const cost = session.skill.creditCost ?? 0;
  const balance = balanceData ?? user?.creditBalance ?? 0;
  const affordable = balance >= cost;
  const deficit = Math.max(0, cost - balance);
  const after = balance - cost;

  const confirm = async () => {
    try {
      await book.mutateAsync({ id: session.id, creditCost: cost });
    } catch {
      // Errors are surfaced by the mutation / interceptor.
    } finally {
      setOpen(false);
    }
  };

  // Not enough credits — block the request the server would reject anyway.
  if (!affordable) {
    return (
      <div className="relative inline-flex group">
        <Button size={size} disabled className={cn('cursor-not-allowed', className)}>
          Need {deficit} more credit{deficit === 1 ? '' : 's'}
        </Button>
        <div
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-lg border border-ink-700 bg-ink-800 p-2.5 text-xs leading-relaxed text-ink-300 opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100"
        >
          This session costs <span className="font-semibold text-amber-300">{cost} credits</span>.
          Teach a session to earn credits, then come back to book this one.
          <span className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-ink-700" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Button
        size={size}
        className={className}
        loading={book.isPending}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
      >
        <Coins size={14} />
        Book · {cost}
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Confirm booking" size="sm">
        <div className="space-y-5">
          <p className="text-sm text-ink-400 leading-relaxed">
            This will use{' '}
            <strong className="text-ink-100">
              {cost} credit{cost === 1 ? '' : 's'}
            </strong>
            . Your balance will be{' '}
            <span className="font-semibold text-ink-200">{balance}</span>
            {' → '}
            <span className="font-semibold text-accent-400">{after}</span>.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={confirm} loading={book.isPending} className="flex-1">
              Confirm booking
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
