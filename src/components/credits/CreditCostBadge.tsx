import { Coins } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CreditCostBadge({
  cost,
  className,
}: {
  cost?: number | null;
  className?: string;
}) {
  if (typeof cost !== 'number') return null;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold',
        'bg-amber-500/10 text-amber-300 border border-amber-500/20',
        className,
      )}
      title={`${cost} credit${cost === 1 ? '' : 's'} to book`}
    >
      <Coins size={11} className="text-amber-400" />
      {cost}
    </span>
  );
}
