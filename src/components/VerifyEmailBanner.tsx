'use client';

import { useEffect, useRef, useState } from 'react';
import { MailWarning, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { cn } from '@/lib/utils';

const COOLDOWN_SECONDS = 60;

export function VerifyEmailBanner() {
  const user = useAuthStore((s) => s.user);
  const [dismissed, setDismissed] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Only show for signed-in users whose email is not yet verified.
  if (!user || user.isEmailVerified !== false || dismissed) return null;

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (sending || cooldown > 0) return;
    setSending(true);
    try {
      await authApi.resendVerification();
      toast.success('Verification email sent. Check your inbox.');
      startCooldown();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not send verification email');
    } finally {
      setSending(false);
    }
  };

  const disabled = sending || cooldown > 0;

  return (
    <div className="border-b border-amber-500/20 bg-amber-500/10">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <MailWarning size={18} className="text-amber-400 shrink-0" />
        <p className="flex-1 text-sm text-amber-200/90">
          <span className="font-medium text-amber-100">Verify your email</span>
          <span className="hidden sm:inline">
            {' '}
            — confirm {user.email} to unlock everything SkillSwap has to offer.
          </span>
        </p>

        <button
          onClick={handleResend}
          disabled={disabled}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border border-amber-500/30 px-3 py-1.5 text-xs font-medium text-amber-100 transition-colors',
            disabled
              ? 'cursor-not-allowed opacity-60'
              : 'hover:bg-amber-500/20',
          )}
        >
          {sending && <Loader2 size={13} className="animate-spin" />}
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend verification email'}
        </button>

        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="rounded-lg p-1 text-amber-300/70 transition-colors hover:bg-amber-500/20 hover:text-amber-100"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
