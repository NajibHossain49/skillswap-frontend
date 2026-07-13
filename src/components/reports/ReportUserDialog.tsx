'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Flag } from 'lucide-react';
import { Modal, Select, Textarea } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { useCreateReport } from '@/hooks/useReports';
import { ReportReason } from '@/types';

const REASONS: { label: string; value: ReportReason }[] = [
  { label: 'Spam', value: 'SPAM' },
  { label: 'Harassment', value: 'HARASSMENT' },
  { label: 'Inappropriate content', value: 'INAPPROPRIATE_CONTENT' },
  { label: 'No-show', value: 'NO_SHOW' },
  { label: 'Fraud', value: 'FRAUD' },
  { label: 'Other', value: 'OTHER' },
];

const schema = z.object({
  reason: z.enum(['SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'NO_SHOW', 'FRAUD', 'OTHER']),
  description: z.string().max(1000).optional(),
});
type FormData = z.infer<typeof schema>;

export function ReportUserDialog({
  open,
  onClose,
  reportedUserId,
  userName,
}: {
  open: boolean;
  onClose: () => void;
  reportedUserId: string;
  userName?: string;
}) {
  const report = useCreateReport();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { reason: 'SPAM' },
  });

  const onSubmit = async (data: FormData) => {
    await report.mutateAsync({
      reportedUserId,
      reason: data.reason,
      description: data.description?.trim() || undefined,
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Report this user" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-rose-500/25 bg-rose-500/10 p-3.5 text-sm text-rose-200">
          <Flag size={16} className="mt-0.5 shrink-0 text-rose-400" />
          <p className="leading-relaxed">
            Reports are confidential. Our team will review
            {userName ? <> your report about <strong>{userName}</strong></> : ' this report'} and
            take appropriate action.
          </p>
        </div>

        <Select
          label="Reason"
          error={errors.reason?.message}
          options={REASONS.map((r) => ({ label: r.label, value: r.value }))}
          {...register('reason')}
        />

        <Textarea
          label="Details (optional)"
          placeholder="Add any context that will help us investigate..."
          rows={4}
          error={errors.description?.message}
          {...register('description')}
        />

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="destructive" type="submit" loading={report.isPending} className="flex-1">
            Submit report
          </Button>
        </div>
      </form>
    </Modal>
  );
}
