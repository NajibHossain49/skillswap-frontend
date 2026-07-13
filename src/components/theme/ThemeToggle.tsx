'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

/**
 * Accessible light/dark switch. Renders a neutral placeholder until mounted to
 * avoid a hydration mismatch (theme is only known on the client).
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300',
        'border-paper-300 bg-paper-100/70 text-paper-700 hover:bg-paper-200 hover:text-paper-900',
        'dark:border-ink-700/70 dark:bg-ink-800/60 dark:text-ink-300 dark:hover:bg-ink-700/60 dark:hover:text-ink-100',
        'hover:scale-105 active:scale-95',
        className,
      )}
    >
      {mounted ? (
        <>
          <Sun
            size={16}
            className={cn(
              'absolute transition-all duration-300',
              isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
            )}
          />
          <Moon
            size={16}
            className={cn(
              'absolute transition-all duration-300',
              isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
            )}
          />
        </>
      ) : (
        <Sun size={16} className="opacity-0" />
      )}
    </button>
  );
}
