'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, MailCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api-services';

const primaryBtn =
  'w-full mt-2 h-11 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-[0.98]';

const schema = z.object({
  email: z.string().email('Invalid email'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authApi.forgotPassword({ email: data.email });
    } catch {
      // Intentionally ignored: the backend never reveals whether an account
      // exists, so we always show the same neutral success state.
    } finally {
      setLoading(false);
      // Always the same outcome — never branch the UI on the response.
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="animate-fade-up">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-sage-500/25 bg-sage-500/15">
          <MailCheck size={22} className="text-sage-500 dark:text-sage-400" />
        </div>
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Check your inbox</h1>
        <p className="mt-3 leading-relaxed text-paper-600 dark:text-ink-400">
          If an account exists for that address, we&apos;ve sent a reset link. It may take a
          few minutes to arrive — remember to check your spam folder.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Forgot password?</h1>
        <p className="mt-2 text-sm text-paper-600 dark:text-ink-400">
          Enter your email and we&apos;ll send you a link to reset it.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={15} />}
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" size="lg" className={primaryBtn} loading={loading}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-600 dark:text-ink-400">
        Remembered it?{' '}
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
