'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, Eye, EyeOff, Check, X, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { authApi } from '@/lib/api-services';
import { passwordRequirements, passwordSchema, passwordStrength } from '@/lib/password';
import { cn } from '@/lib/utils';

const primaryBtn =
  'w-full mt-2 h-11 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-[0.98]';

const schema = z
  .object({
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema), mode: 'onChange' });

  const pw = watch('newPassword') ?? '';
  const strength = passwordStrength(pw);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword });
      toast.success('Password reset. You can now sign in.');
      router.push('/login');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Reset link is invalid or has expired');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="animate-fade-up">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-500/25 bg-rose-500/15">
          <AlertTriangle size={22} className="text-rose-500 dark:text-rose-400" />
        </div>
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Invalid reset link</h1>
        <p className="mt-3 leading-relaxed text-paper-600 dark:text-ink-400">
          This password reset link is missing its token. Please request a new one.
        </p>
        <Link
          href="/forgot-password"
          className="mt-8 inline-flex text-sm font-medium text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
        >
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Set a new password</h1>
        <p className="mt-2 text-sm text-paper-600 dark:text-ink-400">Choose a strong password you don&apos;t use elsewhere.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="New password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.newPassword?.message}
          suffix={
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register('newPassword')}
        />

        {/* Strength meter */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  i < strength.score ? strength.color : 'bg-paper-200 dark:bg-ink-700',
                )}
              />
            ))}
          </div>
          {pw && (
            <p className="text-xs text-paper-500 dark:text-ink-500">
              Strength: <span className="font-medium text-ink-800 dark:text-ink-300">{strength.label}</span>
            </p>
          )}
        </div>

        {/* Requirements checklist */}
        <ul className="grid grid-cols-1 gap-1.5 rounded-xl border border-paper-200 bg-paper-100 p-3.5 dark:border-ink-700 dark:bg-ink-800/40 sm:grid-cols-2">
          {passwordRequirements.map((req) => {
            const ok = req.test(pw);
            return (
              <li
                key={req.label}
                className={cn(
                  'flex items-center gap-2 text-xs transition-colors',
                  ok ? 'text-sage-600 dark:text-sage-400' : 'text-paper-500 dark:text-ink-500',
                )}
              >
                <span
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded-full',
                    ok ? 'bg-sage-500/20 text-sage-600 dark:text-sage-400' : 'bg-paper-200 dark:bg-ink-700',
                  )}
                >
                  {ok ? <Check size={11} /> : <X size={11} className="text-paper-500 dark:text-ink-600" />}
                </span>
                {req.label}
              </li>
            );
          })}
        </ul>

        <Input
          label="Confirm password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" size="lg" className={primaryBtn} loading={loading}>
          Reset password
        </Button>
      </form>

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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
