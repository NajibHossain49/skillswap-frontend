'use client';

import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Coins, AlertTriangle } from 'lucide-react';
import { Modal, Select, Textarea } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { Input as FormInput } from '@/components/ui/Input';
import { useCreateBooking } from '@/hooks/useBookings';
import { useCreditBalance } from '@/hooks/useCredits';
import { useAuthStore } from '@/store/auth';
import { MentorProfile } from '@/types';
import { cn } from '@/lib/utils';

const schema = z.object({
  skillId: z.string().min(1, 'Choose a skill'),
  proposedAt: z.string().min(1, 'Pick a date & time'),
  duration: z.coerce.number().min(15, 'At least 15 minutes').max(480, 'At most 8 hours'),
  message: z.string().max(1000).optional(),
});
type FormData = z.infer<typeof schema>;

export function RequestSessionModal({
  open,
  onClose,
  mentor,
  initialSkillId,
}: {
  open: boolean;
  onClose: () => void;
  mentor: MentorProfile;
  initialSkillId?: string;
}) {
  const booking = useCreateBooking();
  const { data: balanceData } = useCreditBalance();
  const user = useAuthStore((s) => s.user);
  const balance = balanceData ?? user?.creditBalance ?? 0;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      skillId: initialSkillId || mentor.skills[0]?.id || '',
      duration: 60,
    },
  });

  const selectedSkillId = watch('skillId');
  const selectedSkill = useMemo(
    () => mentor.skills.find((s) => s.id === selectedSkillId),
    [mentor.skills, selectedSkillId],
  );
  const cost = selectedSkill?.creditCost ?? 0;
  const affordable = balance >= cost;

  const onSubmit = async (data: FormData) => {
    await booking.mutateAsync({
      mentorId: mentor.id,
      skillId: data.skillId,
      proposedAt: new Date(data.proposedAt).toISOString(),
      duration: data.duration,
      message: data.message?.trim() || undefined,
    });
    reset();
    onClose();
  };

  const skillOptions = mentor.skills.length
    ? mentor.skills.map((s) => ({ label: `${s.title} · ${s.creditCost} cr`, value: s.id }))
    : [{ label: 'This mentor has no skills yet', value: '' }];

  return (
    <Modal open={open} onClose={onClose} title={`Request a session with ${mentor.name}`} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select
          label="Skill"
          error={errors.skillId?.message}
          options={skillOptions}
          disabled={!mentor.skills.length}
          {...register('skillId')}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Proposed date & time"
            type="datetime-local"
            error={errors.proposedAt?.message}
            {...register('proposedAt')}
          />
          <FormInput
            label="Duration (minutes)"
            type="number"
            min="15"
            max="480"
            placeholder="60"
            error={errors.duration?.message}
            {...register('duration')}
          />
        </div>

        <Textarea
          label="Message (optional)"
          placeholder="Tell the mentor what you'd like to focus on..."
          rows={3}
          {...register('message')}
        />

        {selectedSkill && (
          <div
            className={cn(
              'flex items-start gap-3 rounded-xl border p-3.5 text-sm',
              affordable
                ? 'border-amber-500/25 bg-amber-500/10 text-amber-200'
                : 'border-rose-500/25 bg-rose-500/10 text-rose-200',
            )}
          >
            {affordable ? (
              <Coins size={16} className="mt-0.5 shrink-0 text-amber-400" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-rose-400" />
            )}
            <p className="leading-relaxed">
              This session costs{' '}
              <strong>
                {cost} credit{cost === 1 ? '' : 's'}
              </strong>
              , held when the mentor accepts. Your balance is{' '}
              <strong>{balance}</strong>.
              {!affordable && (
                <> You need {cost - balance} more to book this — teach a session to earn credits.</>
              )}
            </p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={booking.isPending}
            disabled={!mentor.skills.length || !affordable}
            className="flex-1"
          >
            Send request
          </Button>
        </div>
      </form>
    </Modal>
  );
}
