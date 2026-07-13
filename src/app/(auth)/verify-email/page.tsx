'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck, MailX, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { authApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';

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
        <div className="mx-auto mb-6 w-12 h-12 rounded-2xl bg-accent-500/15 border border-accent-500/25 flex items-center justify-center">
          <Loader2 size={22} className="text-accent-400 animate-spin" />
        </div>
        <h1 className="font-display font-black text-3xl text-ink-100">Verifying your email…</h1>
        <p className="text-ink-500 mt-2">This will only take a moment.</p>
      </div>
    );
  }

  if (state === 'success') {
    return (
      <div className="animate-fade-up">
        <div className="mb-6 w-12 h-12 rounded-2xl bg-sage-500/15 border border-sage-500/25 flex items-center justify-center">
          <MailCheck size={22} className="text-sage-400" />
        </div>
        <h1 className="font-display font-black text-3xl text-ink-100">Email verified</h1>
        <p className="text-ink-400 mt-3 leading-relaxed">
          Your email address has been confirmed. You now have full access to SkillSwap.
        </p>
        <Button asChild size="lg" className="w-full mt-8">
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
          'mb-6 w-12 h-12 rounded-2xl flex items-center justify-center border ' +
          (expired
            ? 'bg-amber-500/15 border-amber-500/25'
            : 'bg-rose-500/15 border-rose-500/25')
        }
      >
        {expired ? (
          <Clock size={22} className="text-amber-400" />
        ) : (
          <MailX size={22} className="text-rose-400" />
        )}
      </div>
      <h1 className="font-display font-black text-3xl text-ink-100">
        {expired ? 'Link expired' : 'Verification failed'}
      </h1>
      <p className="text-ink-400 mt-3 leading-relaxed">
        {expired
          ? 'This verification link has expired. Request a fresh one below.'
          : 'This verification link is invalid or has already been used. You can request a new one.'}
      </p>

      <Button
        size="lg"
        className="w-full mt-8"
        variant="outline"
        loading={resending}
        onClick={handleResend}
      >
        Resend verification email
      </Button>

      <p className="mt-6 text-center text-sm text-ink-500">
        <Link
          href="/login"
          className="text-accent-400 hover:text-accent-300 font-medium transition-colors"
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
