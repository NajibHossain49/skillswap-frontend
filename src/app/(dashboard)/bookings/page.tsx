'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Inbox,
  Calendar,
  Check,
  X,
  Ban,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Modal, Textarea, SkeletonCard, EmptyState } from '@/components/ui';
import { CreditCostBadge } from '@/components/credits/CreditCostBadge';
import { MentorAvatar } from '@/components/mentors/MentorAvatar';
import {
  useBookings,
  useAcceptBooking,
  useRejectBooking,
  useCancelBooking,
} from '@/hooks/useBookings';
import { useAuthStore } from '@/store/auth';
import { BookingRequest, BookingRequestStatus } from '@/types';
import { cn, formatDateTime } from '@/lib/utils';

const TABS: { label: string; value: BookingRequestStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Accepted', value: 'ACCEPTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Cancelled', value: 'CANCELLED' },
  { label: 'Expired', value: 'EXPIRED' },
];

const statusStyles: Record<BookingRequestStatus, string> = {
  PENDING: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  ACCEPTED: 'bg-sage-500/10 text-sage-400 border-sage-500/20',
  REJECTED: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  CANCELLED: 'bg-ink-700/60 text-ink-400 border-ink-600/40',
  EXPIRED: 'bg-ink-700/60 text-ink-500 border-ink-600/40',
};

function StatusBadge({ status }: { status: BookingRequestStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
        statusStyles[status],
      )}
    >
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ─── Reject dialog ────────────────────────────────────────────────────────────

function RejectDialog({
  booking,
  onClose,
}: {
  booking: BookingRequest | null;
  onClose: () => void;
}) {
  const reject = useRejectBooking();
  const [reason, setReason] = useState('');

  if (!booking) return null;

  return (
    <Modal open={!!booking} onClose={onClose} title="Reject request" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-ink-400">
          Let {booking.learner?.name ?? 'the learner'} know why you can&apos;t take this session.
          A reason is optional but appreciated.
        </p>
        <Textarea
          label="Reason (optional)"
          placeholder="e.g. That time no longer works for me — feel free to propose another."
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            variant="destructive"
            loading={reject.isPending}
            className="flex-1"
            onClick={async () => {
              await reject.mutateAsync({ id: booking.id, reason: reason.trim() || undefined });
              setReason('');
              onClose();
            }}
          >
            Reject request
          </Button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────

function BookingCard({
  booking,
  currentUserId,
  onReject,
}: {
  booking: BookingRequest;
  currentUserId?: string;
  onReject: (b: BookingRequest) => void;
}) {
  const accept = useAcceptBooking();
  const cancel = useCancelBooking();

  const isMentor = booking.mentorId === currentUserId;
  const isLearner = booking.learnerId === currentUserId;
  const counterpart = isMentor ? booking.learner : booking.mentor;
  const isPending = booking.status === 'PENDING';

  const accepting = accept.isPending && accept.variables === booking.id;
  const cancelling = cancel.isPending && cancel.variables === booking.id;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <MentorAvatar
            name={counterpart?.name ?? 'User'}
            avatarUrl={counterpart?.avatarUrl}
            size="md"
          />
          <div className="min-w-0">
            <p className="text-sm font-medium text-ink-200 truncate">
              {counterpart?.name ?? 'Unknown user'}
            </p>
            <p className="text-xs text-ink-500">{isMentor ? 'Learner' : 'Mentor'}</p>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="rounded-xl bg-ink-700/25 p-3.5 space-y-2 text-sm">
        <div className="flex items-center justify-between gap-3">
          <span className="text-ink-300 font-medium truncate">
            {booking.skill?.title ?? 'Skill'}
          </span>
          {typeof booking.skill?.creditCost === 'number' && (
            <CreditCostBadge cost={booking.skill.creditCost} />
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-ink-400">
          <Calendar size={12} />
          {formatDateTime(booking.proposedAt)}
        </div>
      </div>

      {isMentor && booking.message && (
        <div className="mt-3 flex gap-2 text-sm text-ink-400">
          <MessageSquare size={14} className="mt-0.5 shrink-0 text-ink-500" />
          <p className="leading-relaxed">{booking.message}</p>
        </div>
      )}

      {booking.status === 'REJECTED' && booking.reason && (
        <p className="mt-3 text-xs text-ink-500">
          <span className="text-ink-400 font-medium">Reason:</span> {booking.reason}
        </p>
      )}

      {/* Actions */}
      {isPending && isMentor && (
        <div className="mt-4 flex gap-2">
          <Button
            className="flex-1"
            loading={accepting}
            onClick={() => accept.mutate(booking.id)}
          >
            <Check size={15} />
            Accept
          </Button>
          <Button variant="secondary" className="flex-1" onClick={() => onReject(booking)}>
            <X size={15} />
            Reject
          </Button>
        </div>
      )}

      {isPending && isLearner && (
        <div className="mt-4">
          <Button
            variant="secondary"
            className="w-full"
            loading={cancelling}
            onClick={() => cancel.mutate(booking.id)}
          >
            <Ban size={15} />
            Cancel request
          </Button>
        </div>
      )}

      {booking.status === 'ACCEPTED' && (
        <div className="mt-4">
          <Link href={booking.sessionId ? `/sessions/${booking.sessionId}` : '/sessions'}>
            <Button variant="outline" className="w-full">
              View session
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const user = useAuthStore((s) => s.user);
  const isMentor = user?.role === 'MENTOR';

  const [status, setStatus] = useState<BookingRequestStatus>('PENDING');
  const [page, setPage] = useState(1);
  const [rejectTarget, setRejectTarget] = useState<BookingRequest | null>(null);

  const { data, isLoading } = useBookings({ status, page, limit: 10 });
  const bookings = data?.bookings ?? [];
  const pagination = data?.pagination;

  return (
    <div className="min-h-screen">
      <Header
        title="Booking Requests"
        subtitle={isMentor ? 'Requests learners sent you' : 'Session requests you sent'}
      />
      <div className="p-8 max-w-4xl mx-auto">
        {/* Tabs */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setStatus(t.value);
                setPage(1);
              }}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
                status === t.value
                  ? 'bg-accent-500 text-white border-accent-500'
                  : 'border-ink-700 text-ink-400 hover:border-ink-600',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <EmptyState
            icon={<Inbox size={28} />}
            title={`No ${status.toLowerCase()} requests`}
            description={
              isMentor
                ? 'When learners request sessions, they’ll show up here for you to accept or reject.'
                : 'Requests you send to mentors will appear here. Browse mentors to get started.'
            }
            action={
              !isMentor ? (
                <Link href="/mentors">
                  <Button>Find a mentor</Button>
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bookings.map((b) => (
                <BookingCard
                  key={b.id}
                  booking={b}
                  currentUserId={user?.id}
                  onReject={setRejectTarget}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-ink-500">
                  Page {page} of {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <RejectDialog booking={rejectTarget} onClose={() => setRejectTarget(null)} />
    </div>
  );
}
