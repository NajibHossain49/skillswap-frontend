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
  description: z
    .string()
    .trim()
    .min(10, 'Please add at least 10 characters of detail')
    .max(1000, 'Keep it under 1000 characters'),
});
type FormData = z.infer<typeof schema>;

/**
 * Generic report dialog. Provide exactly one target: a `reportedUserId` (mentor
 * profiles, skill authors) or a `sessionId` (session detail).
 */
export function ReportDialog({
  open,
  onClose,
  reportedUserId,
  sessionId,
  targetLabel,
}: {
  open: boolean;
  onClose: () => void;
  reportedUserId?: string;
  sessionId?: string;
  targetLabel?: string;
}) {
  const report = useCreateReport();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { reason: 'SPAM', description: '' },
  });

  const onSubmit = async (data: FormData) => {
    await report.mutateAsync({
      reportedUserId,
      sessionId,
      reason: data.reason,
      description: data.description.trim(),
    });
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Submit a report" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-ink-700 bg-ink-800/50 p-3.5 text-sm text-ink-300">
          <Flag size={16} className="mt-0.5 shrink-0 text-ink-400" />
          <p className="leading-relaxed">
            Reports are confidential. Tell us what&apos;s wrong
            {targetLabel ? <> with <strong className="text-ink-200">{targetLabel}</strong></> : ''} and
            our team will review it.
          </p>
        </div>

        <Select
          label="Reason"
          error={errors.reason?.message}
          options={REASONS.map((r) => ({ label: r.label, value: r.value }))}
          {...register('reason')}
        />

        <Textarea
          label="Details"
          placeholder="Describe what happened so our team can investigate..."
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
