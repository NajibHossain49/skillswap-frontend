'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = title ? `modal-${title.toLowerCase().replace(/\s+/g, '-')}` : undefined;

  // Escape to close + focus management + focus trap + scroll lock.
  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Move focus into the dialog once mounted.
    const focusFirst = () => {
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      (focusables[0] ?? panel).focus();
    };
    const raf = requestAnimationFrame(focusFirst);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (focusables.length === 0) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          'relative w-full bg-ink-800 border border-ink-700 rounded-3xl shadow-2xl z-10 animate-fade-up outline-none',
          modalSizes[size],
        )}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-ink-700">
            <h3 id={titleId} className="font-display font-bold text-lg text-ink-100">
              {title}
            </h3>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="w-8 h-8 rounded-lg hover:bg-ink-700 flex items-center justify-center text-ink-400 hover:text-ink-200 transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
