'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck, MailX, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';

const primaryBtn =
  'w-full mt-8 h-11 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-[0.98]';
const outlineBtn =
  'w-full mt-8 h-11 rounded-xl border border-paper-300 bg-white font-semibold text-ink-900 transition-all hover:border-accent-500/40 hover:text-accent-600 dark:border-ink-700 dark:bg-ink-800/40 dark:text-ink-100 dark:hover:text-accent-400';

type VerifyState = 'verifying' | 'success' | 'expired' | 'invalid';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const updateUser = useAuthStore((s) => s.updateUser);

  const [state, setState] = useState<VerifyState>('verifying');
  const [resending, setResending] = useState(false);
  const ran = useRef(false);

  useEffect(() => {
    // Guard against double-invocation in React strict mode.
    if (ran.current) return;
    ran.current = true;

    if (!token) {
      setState('invalid');
      return;
    }

    (async () => {
      try {
        await authApi.verifyEmail({ token });
        updateUser({ isEmailVerified: true });
        setState('success');
      } catch (e: any) {
        const message: string = e?.response?.data?.message ?? '';
        setState(/expir/i.test(message) ? 'expired' : 'invalid');
      }
    })();
  }, [token, updateUser]);

  const handleResend = async () => {
    setResending(true);
    try {
      await authApi.resendVerification();
      toast.success('A new verification email is on its way.');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Could not resend. Please sign in and try again.');
    } finally {
      setResending(false);
    }
  };

  if (state === 'verifying') {
    return (
      <div className="animate-fade-up text-center">
        <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-500/25 bg-accent-500/15">
          <Loader2 size={22} className="animate-spin text-accent-500 dark:text-accent-400" />
        </div>
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Verifying your email…</h1>
        <p className="mt-2 text-sm text-paper-600 dark:text-ink-500">This will only take a moment.</p>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="animate-fade-up">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-sage-500/25 bg-sage-500/15">
          <MailCheck size={22} className="text-sage-500 dark:text-sage-400" />
        </div>
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Email verified</h1>
        <p className="mt-3 leading-relaxed text-paper-600 dark:text-ink-400">
          Your email address has been confirmed. You now have full access to SkillSwap.
        </p>
        <Button asChild size="lg" className={primaryBtn}>
          <Link href="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    );
  }

  const expired = state === 'expired';
  return (
    <div className="animate-fade-up">
      <div
        className={
          'mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border ' +
          (expired
            ? 'bg-amber/15 border-amber/25'
            : 'bg-rose-500/15 border-rose-500/25')
        }
      >
        {expired ? (
          <Clock size={22} className="text-amber" />
        ) : (
          <MailX size={22} className="text-rose-500 dark:text-rose-400" />
        )}
      </div>
      <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">
        {expired ? 'Link expired' : 'Verification failed'}
      </h1>
      <p className="mt-3 leading-relaxed text-paper-600 dark:text-ink-400">
        {expired
          ? 'This verification link has expired. Request a fresh one below.'
          : 'This verification link is invalid or has already been used. You can request a new one.'}
      </p>

      <Button
        size="lg"
        className={outlineBtn}
        variant="outline"
        loading={resending}
        onClick={handleResend}
      >
        Resend verification email
      </Button>

      <p className="mt-6 text-center text-sm text-paper-600 dark:text-ink-400">
        <Link
          href="/login"
          className="font-semibold text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailInner />
    </Suspense>
  );
}
