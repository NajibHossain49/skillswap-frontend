'use client';

import { useEffect, useRef, useState } from 'react';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export interface OverflowMenuItem {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

/** Accessible "kebab" menu: labelled trigger, Escape-to-close, click-away. */
export function OverflowMenu({
  items,
  label = 'More options',
}: {
  items: OverflowMenuItem[];
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="ghost"
        size="icon"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={18} />
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-1 z-20 w-52 rounded-xl border border-ink-700 bg-ink-800 p-1 shadow-xl"
        >
          {items.map((item) => (
            <button
              key={item.label}
              role="menuitem"
              onClick={() => {
                setOpen(false);
                item.onClick();
              }}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
                item.destructive
                  ? 'text-rose-400 hover:bg-rose-500/10'
                  : 'text-ink-300 hover:bg-ink-700 hover:text-ink-100',
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
