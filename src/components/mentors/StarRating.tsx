import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  /** Average rating, 0–5 (may be fractional). */
  value: number;
  /** Number of ratings; when provided, rendered as "(n)". */
  count?: number;
  size?: number;
  className?: string;
  /** Show the numeric average next to the stars. */
  showValue?: boolean;
}

export function StarRating({
  value,
  count,
  size = 14,
  className,
  showValue = true,
}: StarRatingProps) {
  const rounded = Math.round(value * 2) / 2;

  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      <div className="relative inline-flex">
        {/* Empty track */}
        <div className="flex text-ink-700">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} className="fill-current" />
          ))}
        </div>
        {/* Filled overlay clipped to the rating width */}
        <div
          className="absolute inset-0 flex overflow-hidden text-amber-400"
          style={{ width: `${(rounded / 5) * 100}%` }}
        >
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} className="fill-current shrink-0" />
          ))}
        </div>
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-ink-200 tabular-nums">
          {value > 0 ? value.toFixed(1) : 'New'}
          {typeof count === 'number' && value > 0 && (
            <span className="ml-1 font-normal text-ink-500">({count})</span>
          )}
        </span>
      )}
    </div>
  );
}
