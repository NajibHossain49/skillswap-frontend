'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

const primaryBtn =
  'w-full mt-2 h-11 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-semibold shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-[0.98]';

const schema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  password: z
    .string()
    .min(8, 'Min 8 characters')
    .regex(/[A-Z]/, 'Need uppercase')
    .regex(/[0-9]/, 'Need number')
    .regex(/[^A-Za-z0-9]/, 'Need special char'),
  bio: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const user = await registerUser(data);
      toast.success(`Welcome to SkillSwap, ${user.name}!`);
      router.push('/dashboard');
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <h1 className="font-display text-2xl font-black text-ink-900 dark:text-ink-100 sm:text-3xl">Create account</h1>
        <p className="mt-2 text-sm text-paper-600 dark:text-ink-400">Join thousands of learners and mentors.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-accent-500/20 bg-accent-500/5 p-3.5">
          <GraduationCap size={18} className="mt-0.5 shrink-0 text-accent-500 dark:text-accent-400" />
          <p className="text-xs leading-relaxed text-paper-600 dark:text-ink-400">
            Everyone starts as a learner. Want to teach? You can apply to become a
            mentor from your profile after signing up.
          </p>
        </div>

        <Input
          label="Full name"
          placeholder="Jane Smith"
          icon={<User size={15} />}
          error={errors.name?.message}
          {...register('name')}
        />
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
          hint="Min 8 chars, one uppercase, number, special character"
          error={errors.password?.message}
          suffix={
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register('password')}
        />
        <Textarea
          label="Bio (optional)"
          placeholder="Tell us a bit about yourself..."
          rows={3}
          {...register('bio')}
        />

        <Button type="submit" size="lg" className={primaryBtn} loading={loading}>
          Create account
          {!loading && <ArrowRight size={16} />}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-paper-600 dark:text-ink-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 dark:hover:text-accent-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}
