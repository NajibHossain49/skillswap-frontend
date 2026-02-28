'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <div className="mb-8">
        <h1 className="font-display font-black text-3xl text-ink-100">Welcome back</h1>
        <p className="text-ink-500 mt-2">Sign in to continue your learning journey</p>
      </div>

      {/* Demo credentials */}
      <div className="mb-6 p-4 bg-accent-500/8 border border-accent-500/20 rounded-xl">
        <p className="text-xs font-semibold text-accent-400 mb-2 uppercase tracking-wide">Demo accounts</p>
        <div className="space-y-1 text-xs text-ink-400">
          <p>🛡 <span className="text-ink-300">Admin:</span> admin@skillswap.com / Adm!n-SkillSwap-2026</p>
          <p>🎓 <span className="text-ink-300">Mentor:</span> michael.kovacs@skillswap.com / Mentor2026!!</p>
          <p>📚 <span className="text-ink-300">Learner:</span> alex.k@skillswap.com / Learner2026!!</p>
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
            <button type="button" onClick={() => setShowPass(!showPass)}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          }
          {...register('password')}
        />

        <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
          Sign in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-accent-400 hover:text-accent-300 font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
}
