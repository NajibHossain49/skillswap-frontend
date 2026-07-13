'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

const primaryBtn =
  'w-full mt-2 h-11 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-[0.98]';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await login(data.email, data.password);
      toast.success(`Welcome back, ${user.name}!`);
      router.push('/dashboard');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Welcome back</h1>
        <p className="mt-2 text-sm text-paper-600 dark:text-ink-400">Sign in to continue your learning journey.</p>
      </div>

      {/* Demo credentials — collapsible */}
      <div className="mb-6 overflow-hidden rounded-xl border border-accent-500/20 bg-accent-500/5">
        <button
          type="button"
          onClick={() => setShowDemo(!showDemo)}
          className="flex w-full items-center justify-between px-4 py-3 text-left"
        >
          <span className="text-xs font-semibold uppercase tracking-wide text-accent-600 dark:text-accent-300">Demo accounts</span>
          <ChevronDown size={15} className={`text-accent-500 transition-transform duration-300 ${showDemo ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ease-out ${showDemo ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="space-y-1.5 px-4 pb-4 text-xs text-paper-600 dark:text-ink-400">
              <p>🛡 <span className="text-ink-800 dark:text-ink-300">Admin:</span> admin@skillswap.com / Adm!n-SkillSwap-2026</p>
              <p>🎓 <span className="text-ink-800 dark:text-ink-300">Mentor:</span> michael.kovacs@skillswap.com / Mentor2026!!</p>
              <p>📚 <span className="text-ink-800 dark:text-ink-300">Learner:</span> alex.k@skillswap.com / Learner2026!!</p>
            </div>
          </div>
        </div>
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
        <Input
          label="Password"
          type={showPass ? 'text' : 'password'}
          placeholder="••••••••"
          icon={<Lock size={15} />}
          error={errors.password?.message}
          suffix={
            <button type="button" onClick={() => setShowPass(!showPass)} className="transition-colors hover:text-accent-500" aria-label="Toggle password visibility">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register('password')}
        />

        <div className="-mt-1 flex justify-end">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className={primaryBtn} loading={loading}>
          Sign in
          {!loading && <ArrowRight size={16} />}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-paper-200 dark:bg-ink-700/60" />
        <span className="text-xs text-paper-500 dark:text-ink-600">or</span>
        <span className="h-px flex-1 bg-paper-200 dark:bg-ink-700/60" />
      </div>

      <p className="text-center text-sm text-paper-600 dark:text-ink-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300">
          Create one
        </Link>
      </p>
    </div>
  );
}
