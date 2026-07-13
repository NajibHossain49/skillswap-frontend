'use client';

import { useState } from 'react';
import {
  GraduationCap,
  ExternalLink,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from 'lucide-react';
import { Card, Avatar, EmptyState, Modal, Textarea, SkeletonCard } from '@/components/ui';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/ErrorState';
import { useMentorApplications, useReviewApplication } from '@/hooks/useAdmin';
import { MentorStatus, User } from '@/types';
import { cn, formatDate } from '@/lib/utils';

const STATUS_TABS: { label: string; value: MentorStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

type ReviewMode = 'APPROVED' | 'REJECTED';

function ReviewModal({
  applicant,
  mode,
  onClose,
}: {
  applicant: User | null;
  mode: ReviewMode;
  onClose: () => void;
}) {
  const review = useReviewApplication();
  const [note, setNote] = useState('');

  const submit = async () => {
    if (!applicant) return;
    await review.mutateAsync({ userId: applicant.id, status: mode, note: note.trim() || undefined });
    setNote('');
    onClose();
  };

  return (
    <Modal
      open={!!applicant}
      onClose={onClose}
      title={mode === 'APPROVED' ? 'Approve application' : 'Reject application'}
      size="sm"
    >
      {applicant && (
        <div className="space-y-4">
          <p className="text-sm text-ink-400">
            {mode === 'APPROVED' ? (
              <>
                Approve <strong className="text-ink-200">{applicant.name}</strong> as a mentor? Their
                role will be upgraded so they can create skills and teach.
              </>
            ) : (
              <>
                Reject <strong className="text-ink-200">{applicant.name}</strong>&apos;s application?
                They&apos;ll be able to re-apply.
              </>
            )}
          </p>
          <Textarea
            label="Note (optional)"
            rows={3}
            placeholder={
              mode === 'APPROVED'
                ? 'Add a welcome note...'
                : 'Explain what they can improve before re-applying...'
            }
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              variant={mode === 'REJECTED' ? 'destructive' : 'default'}
              onClick={submit}
              loading={review.isPending}
              className="flex-1"
            >
              {mode === 'APPROVED' ? 'Approve' : 'Reject'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}

function ApplicationCard({
  applicant,
  onReview,
}: {
  applicant: User;
  onReview: (a: User, mode: ReviewMode) => void;
}) {
  const isPending = applicant.mentorStatus === 'PENDING';

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Avatar name={applicant.name} size="lg" />
        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-ink-100">{applicant.name}</h3>
              {applicant.headline && <p className="text-sm text-ink-400 mt-0.5">{applicant.headline}</p>}
            </div>
            <span className="text-xs text-ink-500 flex items-center gap-1.5 shrink-0">
              <CalendarDays size={12} />
              {formatDate(applicant.createdAt, 'MMM d, yyyy')}
            </span>
          </div>

          {applicant.experience && (
            <div>
              <p className="text-xs text-ink-500 uppercase tracking-wider mb-1">Experience</p>
              <p className="text-sm text-ink-300 leading-relaxed whitespace-pre-wrap">
                {applicant.experience}
              </p>
            </div>
          )}

          {applicant.linkedinUrl && (
            <a
              href={applicant.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300"
            >
              <ExternalLink size={13} />
              LinkedIn profile
            </a>
          )}

          {isPending ? (
            <div className="flex gap-3 pt-1">
              <Button size="sm" onClick={() => onReview(applicant, 'APPROVED')}>
                <Check size={14} />
                Approve
              </Button>
              <Button variant="destructive" size="sm" onClick={() => onReview(applicant, 'REJECTED')}>
                <X size={14} />
                Reject
              </Button>
            </div>
          ) : (
            <span
              className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border',
                applicant.mentorStatus === 'APPROVED'
                  ? 'bg-sage-500/10 text-sage-400 border-sage-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20',
              )}
            >
              {applicant.mentorStatus}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function MentorApplicationsPage() {
  const [status, setStatus] = useState<MentorStatus>('PENDING');
  const [page, setPage] = useState(1);
  const [review, setReview] = useState<{ applicant: User; mode: ReviewMode } | null>(null);

  const { data, isLoading, isError, isFetching, refetch } = useMentorApplications({ status, page });

  const applications = data?.applications ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-5">
      <div className="flex gap-1 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
            className={cn(
              'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
              status === tab.value
                ? 'bg-accent-500/15 text-accent-300'
                : 'text-ink-500 hover:text-ink-300 hover:bg-ink-800',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={<GraduationCap size={28} />}
          title="No applications here"
          description="Mentor applications in this state will show up here for review."
        />
      ) : (
        <>
          <div className={cn('space-y-4', isFetching && 'opacity-70 transition-opacity')}>
            {applications.map((a) => (
              <ApplicationCard
                key={a.id}
                applicant={a}
                onReview={(applicant, mode) => setReview({ applicant, mode })}
              />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft size={14} />
                Previous
              </Button>
              <span className="text-sm text-ink-500">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button variant="secondary" size="sm" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
                <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </>
      )}

      <ReviewModal
        applicant={review?.applicant ?? null}
        mode={review?.mode ?? 'APPROVED'}
        onClose={() => setReview(null)}
      />
    </div>
  );
}
