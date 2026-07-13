'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Coins } from 'lucide-react';
import { useCreditBalance } from '@/hooks/useCredits';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

function useAnimatedNumber(value: number, duration = 500) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);

  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;

    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
      else prev.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return display;
}

export function CreditBadge() {
  const { data } = useCreditBalance();
  const storeBalance = useAuthStore((s) => s.user?.creditBalance);
  const balance = data ?? storeBalance ?? 0;

  const display = useAnimatedNumber(balance);
  const [pulse, setPulse] = useState(false);
  const lastBalance = useRef(balance);

  useEffect(() => {
    if (lastBalance.current !== balance) {
      lastBalance.current = balance;
      setPulse(true);
      const timeout = setTimeout(() => setPulse(false), 450);
      return () => clearTimeout(timeout);
    }
  }, [balance]);

  return (
    <Link
      href="/credits"
      aria-label={`${balance} credits`}
      className={cn(
        'inline-flex items-center gap-1.5 h-9 px-3 rounded-xl border transition-all',
        'bg-amber-500/10 border-amber-500/20 text-amber-300 hover:border-amber-500/40 hover:bg-amber-500/15',
        pulse && 'scale-105',
      )}
    >
      <Coins size={15} className="text-amber-400" />
      <span className="font-display font-bold text-sm tabular-nums">{display}</span>
    </Link>
  );
}
