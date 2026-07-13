'use client';

import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui';
import { Session } from '@/types';
import { willRefundOnCancel } from '@/lib/booking';
import { cn } from '@/lib/utils';

export function CancelSessionDialog({
  open,
  onClose,
  session,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  session: Session;
  onConfirm: () => void;
  loading?: boolean;
}) {
  const cost = session.skill.creditCost ?? 0;
  const hasLearner = !!session.learnerId;
  const willRefund = willRefundOnCancel(session);

  return (
    <Modal open={open} onClose={onClose} title="Cancel session" size="sm">
      <div className="space-y-5">
        <p className="text-sm text-ink-400">
          Are you sure you want to cancel this session? The other participant will be notified.
        </p>

        {hasLearner ? (
          <div
            className={cn(
              'flex items-start gap-3 rounded-xl border p-3.5 text-sm',
              willRefund
                ? 'border-sage-500/25 bg-sage-500/10 text-sage-200'
                : 'border-amber-500/25 bg-amber-500/10 text-amber-200',
            )}
          >
            {willRefund ? (
              <RotateCcw size={16} className="mt-0.5 shrink-0 text-sage-400" />
            ) : (
              <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
            )}
            <p className="leading-relaxed">
              {willRefund ? (
                <>
                  This session hasn&apos;t started yet, so the{' '}
                  <strong>
                    {cost} credit{cost === 1 ? '' : 's'}
                  </strong>{' '}
                  held for it will be <strong>fully refunded</strong>.
                </>
              ) : (
                <>
                  This session has already started, so the held{' '}
                  <strong>
                    {cost} credit{cost === 1 ? '' : 's'}
                  </strong>{' '}
                  will <strong>not</strong> be refunded.
                </>
              )}
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-ink-700 bg-ink-800/40 p-3.5 text-sm text-ink-400">
            No learner has booked this session, so no credits are affected.
          </div>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Keep it
          </Button>
          <Button variant="destructive" onClick={onConfirm} loading={loading} className="flex-1">
            Cancel session
          </Button>
        </div>
      </div>
    </Modal>
  );
}
