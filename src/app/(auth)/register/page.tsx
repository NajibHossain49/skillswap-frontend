'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, Eye, EyeOff, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui';
import { cn } from '@/lib/utils';
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
  role: z.enum(['LEARNER', 'MENTOR']),
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'LEARNER' },
  });

  const selectedRole = watch('role');

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
        {/* Role selector */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-ink-300">I want to join as</label>
          <div className="grid grid-cols-2 gap-3">
            {(['LEARNER', 'MENTOR'] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role)}
                className={cn(
                  'p-3.5 rounded-xl border text-sm font-medium transition-all',
                  selectedRole === role
                    ? 'border-accent-500 bg-accent-500/10 text-accent-400'
                    : 'border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-300',
                )}
              >
                <div className="text-2xl mb-1">{role === 'LEARNER' ? '📚' : '🎓'}</div>
                {role === 'LEARNER' ? 'Learner' : 'Mentor'}
                <p className="text-xs text-ink-500 font-normal mt-0.5">
                  {role === 'LEARNER' ? 'Book sessions' : 'Teach & earn'}
                </p>
              </button>
            ))}
          </div>
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

        <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
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
