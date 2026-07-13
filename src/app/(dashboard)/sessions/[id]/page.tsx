'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Star, User, CheckCircle, XCircle, BookOpen, Coins, Video, CalendarPlus, ArrowUpRight, ArrowDownRight, Flag } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar, Skeleton, Modal } from '@/components/ui';
import { OverflowMenu } from '@/components/ui/OverflowMenu';
import { ErrorState } from '@/components/ui/ErrorState';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { BookSessionButton } from '@/components/credits/BookSessionButton';
import { CancelSessionDialog } from '@/components/credits/CancelSessionDialog';
import { useSession, useUpdateSessionStatus, useAddFeedback } from '@/hooks/useSessions';
import { useAuthStore } from '@/store/auth';
import { formatDateTime, formatDuration, timeAgo } from '@/lib/utils';
import { downloadIcs } from '@/lib/ics';
import { Session } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui';

function formatCountdown(ms: number): string {
  const totalMinutes = Math.max(0, Math.floor(ms / 60_000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days}d`);
  if (days || hours) parts.push(`${hours}h`);
  parts.push(`${minutes}m`);
  return parts.join(' ');
}

/**
 * "Join session" CTA. Enabled from 10 minutes before the start until 30 minutes
 * after the session ends; otherwise disabled with a live countdown.
 */
function JoinSessionCard({ session }: { session: Session }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const start = new Date(session.scheduledAt).getTime();
  const end = start + session.duration * 60_000;
  const windowStart = start - 10 * 60_000;
  const windowEnd = end + 30 * 60_000;

  const isOpen = now >= windowStart && now <= windowEnd;
  const hasEnded = now > windowEnd;
  const hasLink = !!session.meetingLink;

  return (
    <Card className="p-5">
      <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-4">
        Meeting
      </h4>

      {!hasLink ? (
        <div className="rounded-xl border border-dashed border-ink-700 p-3.5 text-sm text-ink-500">
          The meeting link will appear here once it&apos;s ready.
        </div>
      ) : isOpen ? (
        <Button asChild className="w-full">
          <a href={session.meetingLink!} target="_blank" rel="noreferrer">
            <Video size={16} />
            Join session
          </a>
        </Button>
      ) : hasEnded ? (
        <Button disabled className="w-full">
          <Video size={16} />
          Session ended
        </Button>
      ) : (
        <div className="space-y-2">
          <Button disabled className="w-full cursor-not-allowed">
            <Video size={16} />
            Starts in {formatCountdown(windowStart - now)}
          </Button>
          <p className="text-xs text-ink-600 text-center">
            The join button unlocks 10 minutes before the start.
          </p>
        </div>
      )}

      <Button
        variant="outline"
        className="w-full mt-2"
        onClick={() => downloadIcs(session)}
      >
        <CalendarPlus size={15} />
        Add to calendar
      </Button>
    </Card>
  );
}

/** Once completed, shows who earned/spent the session's credits. */
function CreditOutcomeCard({ session }: { session: Session }) {
  const cost = session.skill.creditCost ?? 0;
  return (
    <Card className="p-6">
      <h3 className="font-display font-bold text-ink-200 mb-4">Credits</h3>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-3 rounded-xl bg-sage-500/10 border border-sage-500/20 p-3">
          <div className="flex items-center gap-2 min-w-0">
            <ArrowUpRight size={16} className="text-sage-400 shrink-0" />
            <span className="text-sm text-ink-300 truncate">{session.mentor.name} earned</span>
          </div>
          <span className="text-sm font-bold text-sage-400 tabular-nums">
            +{cost}
          </span>
        </div>
        {session.learner && (
          <div className="flex items-center justify-between gap-3 rounded-xl bg-ink-700/30 border border-ink-700/60 p-3">
            <div className="flex items-center gap-2 min-w-0">
              <ArrowDownRight size={16} className="text-ink-400 shrink-0" />
              <span className="text-sm text-ink-300 truncate">{session.learner.name} spent</span>
            </div>
            <span className="text-sm font-bold text-ink-300 tabular-nums">
              −{cost}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}>
          <Star
            size={24}
            className={cn('transition-colors', star <= value ? 'fill-amber-400 text-amber-400' : 'text-ink-600')}
          />
        </button>
      ))}
    </div>
  );
}

function FeedbackModal({ open, onClose, sessionId }: { open: boolean; onClose: () => void; sessionId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const addFeedback = useAddFeedback();

  const onSubmit = async () => {
    await addFeedback.mutateAsync({ id: sessionId, data: { rating, comment: comment || undefined } });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Leave Feedback" size="sm">
      <div className="space-y-5">
        <div>
          <p className="text-sm text-ink-400 mb-3">How would you rate this session?</p>
          <StarRating value={rating} onChange={setRating} />
        </div>
        <Textarea
          label="Comment (optional)"
          placeholder="Share your experience..."
          rows={4}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
          <Button onClick={onSubmit} loading={addFeedback.isPending} className="flex-1">Submit</Button>
        </div>
      </div>
    </Modal>
  );
}

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: session, isLoading, isError, refetch } = useSession(id);
  const updateStatus = useUpdateSessionStatus();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Session Detail" />
        <div className="p-8 max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-40 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-40 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <Header title="Session Detail" />
        <div className="p-8 max-w-4xl mx-auto">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isMentor = user?.id === session.mentorId;
  const isLearner = user?.id === session.learnerId;
  const isAdmin = user?.role === 'ADMIN';
  const canBook = user?.role === 'LEARNER' && !session.learnerId && session.status === 'PENDING';
  const canCancel = (isMentor || isLearner || isAdmin) && ['PENDING', 'SCHEDULED'].includes(session.status);
  const canComplete = (isMentor || isAdmin) && session.status === 'SCHEDULED';
  const canFeedback = isLearner && session.status === 'COMPLETED' && !session.feedback;

  return (
    <div className="min-h-screen">
      <Header title="Session Detail" />
      <div className="p-8 max-w-4xl mx-auto">
        <Link href="/sessions">
          <Button variant="ghost" size="sm" className="mb-6">
            Back to Sessions
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-ink-500 bg-ink-700/60 px-2.5 py-1 rounded-full">
                      {session.skill.category}
                    </span>
                    <Badge status={session.status}>{session.status}</Badge>
                  </div>
                  <h2 className="font-display font-black text-2xl text-ink-100">{session.title}</h2>
                </div>
                <OverflowMenu
                  items={[
                    {
                      label: 'Report session',
                      icon: <Flag size={14} />,
                      onClick: () => setReportOpen(true),
                      destructive: true,
                    },
                  ]}
                />
              </div>

              {session.description && (
                <p className="text-ink-400 leading-relaxed mb-4">{session.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4 p-4 bg-ink-700/30 rounded-xl">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={15} className="text-accent-400" />
                  <div>
                    <p className="text-xs text-ink-500">Scheduled</p>
                    <p className="text-ink-200 font-medium">{formatDateTime(session.scheduledAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={15} className="text-sage-400" />
                  <div>
                    <p className="text-xs text-ink-500">Duration</p>
                    <p className="text-ink-200 font-medium">{formatDuration(session.duration)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen size={15} className="text-amber-400" />
                  <div>
                    <p className="text-xs text-ink-500">Skill</p>
                    <p className="text-ink-200 font-medium">{session.skill.title}</p>
                  </div>
                </div>
                {typeof session.skill.creditCost === 'number' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Coins size={15} className="text-amber-400" />
                    <div>
                      <p className="text-xs text-ink-500">Credit cost</p>
                      <p className="text-ink-200 font-medium">
                        {session.skill.creditCost} credit{session.skill.creditCost === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Participants */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-ink-200 mb-4">Participants</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-700/30">
                  <Avatar name={session.mentor.name} size="md" />
                  <div>
                    <p className="font-medium text-ink-200">{session.mentor.name}</p>
                    <p className="text-xs text-ink-500">{session.mentor.email} · Mentor</p>
                  </div>
                </div>
                {session.learner ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-700/30">
                    <Avatar name={session.learner.name} size="md" />
                    <div>
                      <p className="font-medium text-ink-200">{session.learner.name}</p>
                      <p className="text-xs text-ink-500">{session.learner.email} · Learner</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-dashed border-ink-700">
                    <div className="w-10 h-10 rounded-full bg-ink-700 flex items-center justify-center">
                      <User size={18} className="text-ink-600" />
                    </div>
                    <p className="text-ink-600 text-sm">No learner booked yet</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Credit outcome */}
            {session.status === 'COMPLETED' && <CreditOutcomeCard session={session} />}

            {/* Feedback */}
            {session.feedback && (
              <Card className="p-6">
                <h3 className="font-display font-bold text-ink-200 mb-4">Feedback</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={18}
                        className={cn(s <= session.feedback!.rating ? 'fill-amber-400 text-amber-400' : 'text-ink-700')}
                      />
                    ))}
                    <span className="text-sm font-bold text-ink-200 ml-1">{session.feedback.rating}/5</span>
                  </div>
                  {session.feedback.comment && (
                    <p className="text-ink-400 text-sm leading-relaxed mt-2">&quot;{session.feedback.comment}&quot;</p>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Actions sidebar */}
          <div className="space-y-4">
            {(session.status === 'SCHEDULED' || session.status === 'COMPLETED') && (
              <JoinSessionCard session={session} />
            )}

            <Card className="p-5">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-4">Actions</h4>
              <div className="space-y-2">
                {canBook && <BookSessionButton session={session} className="w-full" />}
                {canComplete && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => updateStatus.mutate({ id, status: 'COMPLETED' })}
                    loading={updateStatus.isPending}
                  >
                    <CheckCircle size={16} />
                    Mark Completed
                  </Button>
                )}
                {canFeedback && (
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setFeedbackOpen(true)}
                  >
                    <Star size={16} />
                    Leave Feedback
                  </Button>
                )}
                {canCancel && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setCancelOpen(true)}
                  >
                    <XCircle size={16} />
                    Cancel Session
                  </Button>
                )}
                {!canBook && !canComplete && !canFeedback && !canCancel && (
                  <p className="text-ink-600 text-sm text-center py-2">No actions available</p>
                )}
              </div>
            </Card>

            <Card className="p-5">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">Timeline</h4>
              <div className="space-y-2 text-xs text-ink-500">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span>{timeAgo(session.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated</span>
                  <span>{timeAgo(session.updatedAt)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} sessionId={id} />

      <CancelSessionDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        session={session}
        loading={updateStatus.isPending}
        onConfirm={() => {
          updateStatus.mutate({ id, status: 'CANCELLED' });
          setCancelOpen(false);
        }}
      />

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        sessionId={session.id}
        targetLabel={session.title}
      />
    </div>
  );
}
