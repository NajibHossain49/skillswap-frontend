'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';

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
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-ink-100">Create account</h1>
        <p className="text-ink-500 mt-2">Join thousands of learners and mentors</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-ink-700 bg-ink-800/40">
          <GraduationCap size={18} className="text-accent-400 mt-0.5 shrink-0" />
          <p className="text-xs text-ink-400 leading-relaxed">
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

        <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Already have an account?{' '}
        <Link href="/login" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
