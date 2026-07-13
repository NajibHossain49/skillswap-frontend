'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, GraduationCap, Clock, CheckCircle2 } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input as FormInput } from '@/components/ui/Input';
import { Card, Textarea } from '@/components/ui';
import { useApplyMentor } from '@/hooks/useMentors';
import { useAuthStore } from '@/store/auth';

const schema = z.object({
  headline: z
    .string()
    .min(10, 'Give a headline of at least 10 characters')
    .max(120, 'Keep it under 120 characters'),
  experience: z
    .string()
    .min(50, 'Tell us a bit more — at least 50 characters')
    .max(2000, 'Keep it under 2000 characters'),
  linkedinUrl: z
    .string()
    .url('Enter a valid URL')
    .optional()
    .or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

export default function BecomeAMentorPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const apply = useApplyMentor();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { headline: user?.headline ?? '' },
  });

  const status = user?.mentorStatus ?? 'NONE';
  const canApply = status === 'NONE' || status === 'REJECTED';

  const onSubmit = async (data: FormData) => {
    await apply.mutateAsync({
      headline: data.headline,
      experience: data.experience,
      linkedinUrl: data.linkedinUrl?.trim() || undefined,
    });
    router.push('/profile');
  };

  return (
    <div className="min-h-screen">
      <Header title="Become a Mentor" subtitle="Share your expertise and start teaching" />
      <div className="p-8 max-w-2xl mx-auto">
        <Link href="/profile">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={15} />
            Back to Profile
          </Button>
        </Link>

        {!canApply ? (
          <Card className="p-8 text-center">
            {status === 'PENDING' ? (
              <>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                  <Clock size={26} />
                </div>
                <h2 className="font-display font-bold text-xl text-ink-100 mb-2">
                  Application under review
                </h2>
                <p className="text-sm text-ink-500 max-w-sm mx-auto">
                  Your mentor application is being reviewed by our team. We&apos;ll notify you as
                  soon as there&apos;s an update.
                </p>
              </>
            ) : (
              <>
                <div className="w-14 h-14 mx-auto rounded-2xl bg-sage-500/10 flex items-center justify-center text-sage-400 mb-4">
                  <CheckCircle2 size={26} />
                </div>
                <h2 className="font-display font-bold text-xl text-ink-100 mb-2">
                  You&apos;re already a mentor
                </h2>
                <p className="text-sm text-ink-500 max-w-sm mx-auto mb-5">
                  Your application was approved. Head over to your skills to start teaching.
                </p>
                <Link href="/skills">
                  <Button>Create a skill</Button>
                </Link>
              </>
            )}
          </Card>
        ) : (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-11 h-11 rounded-xl bg-accent-500/10 flex items-center justify-center text-accent-400">
                <GraduationCap size={22} />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-ink-100">
                  Tell us about yourself
                </h2>
                <p className="text-sm text-ink-500">
                  Applications are reviewed by our team before approval.
                </p>
              </div>
            </div>

            {status === 'REJECTED' && (
              <div className="mb-6 rounded-xl border border-amber-500/25 bg-amber-500/10 p-3.5 text-sm text-amber-200">
                Your previous application wasn&apos;t approved. Feel free to refine your details
                and apply again.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                label="Headline"
                placeholder="e.g. Senior Frontend Engineer & React mentor"
                error={errors.headline?.message}
                {...register('headline')}
              />
              <Textarea
                label="Experience"
                placeholder="Describe your background, what you can teach, and why you'd make a great mentor..."
                rows={6}
                error={errors.experience?.message}
                {...register('experience')}
              />
              <FormInput
                label="LinkedIn URL (optional)"
                placeholder="https://linkedin.com/in/you"
                error={errors.linkedinUrl?.message}
                {...register('linkedinUrl')}
              />
              <div className="flex gap-3 pt-2">
                <Link href="/profile" className="flex-1">
                  <Button variant="secondary" type="button" className="w-full">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" loading={apply.isPending} className="flex-1">
                  Submit application
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
