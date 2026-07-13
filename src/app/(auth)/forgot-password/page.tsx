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
        <div className="mb-6 w-12 h-12 rounded-2xl bg-sage-500/15 border border-sage-500/25 flex items-center justify-center">
          <MailCheck size={22} className="text-sage-400" />
        </div>
        <h1 className="font-display font-black text-3xl text-ink-100">Check your inbox</h1>
        <p className="text-ink-400 mt-3 leading-relaxed">
          If an account exists for that address, we&apos;ve sent a reset link. It may take a
          few minutes to arrive — remember to check your spam folder.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 font-medium transition-colors"
        >
          <ArrowLeft size={15} />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-ink-100">Forgot password?</h1>
        <p className="text-ink-500 mt-2">
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

        <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
          Send reset link
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Remembered it?{' '}
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
