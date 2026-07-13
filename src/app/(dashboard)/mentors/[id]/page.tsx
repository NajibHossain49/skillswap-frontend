'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MapPin,
  CalendarDays,
  GraduationCap,
  MoreVertical,
  Flag,
  Star,
  Clock,
  MessageSquare,
  CalendarPlus,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Cell,
  Tooltip,
} from 'recharts';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Skeleton, EmptyState } from '@/components/ui';
import { CreditCostBadge } from '@/components/credits/CreditCostBadge';
import { MentorAvatar } from '@/components/mentors/MentorAvatar';
import { StarRating } from '@/components/mentors/StarRating';
import { RequestSessionDialog } from '@/components/bookings/RequestSessionDialog';
import { ReportUserDialog } from '@/components/reports/ReportUserDialog';
import {
  useMentor,
  useMentorReviews,
  useMentorRatingBreakdown,
} from '@/hooks/useMentors';
import { useMentorAvailability } from '@/hooks/useAvailability';
import { useAuthStore } from '@/store/auth';
import { SkillLevel, MentorReview, Availability } from '@/types';
import { cn, formatDate, timeAgo } from '@/lib/utils';

type Tab = 'skills' | 'reviews' | 'availability';

const levelStyles: Record<SkillLevel, string> = {
  BEGINNER: 'bg-sage-500/15 text-sage-400 border-sage-500/30',
  INTERMEDIATE: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
  ADVANCED: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatSlotTime(time: string): string {
  // Times arrive as "HH:mm" (24h). Render as a friendly 12h label.
  const [hRaw, m] = time.split(':');
  const h = Number(hRaw);
  if (Number.isNaN(h)) return time;
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m ?? '00'} ${period}`;
}

// ─── Overflow menu ──────────────────────────────────────────────────────────

function OverflowMenu({ onReport }: { onReport: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="More options"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical size={18} />
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-ink-700 bg-ink-800 p-1 shadow-xl">
            <button
              onClick={() => {
                setOpen(false);
                onReport();
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <Flag size={14} />
              Report this user
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Reviews tab ──────────────────────────────────────────────────────────────

function RatingBreakdown({ id, total }: { id: string; total: number }) {
  const { data: counts, isLoading } = useMentorRatingBreakdown(id);

  if (isLoading) return <Skeleton className="h-40 w-full rounded-xl" />;
  if (!counts) return null;

  const data = [5, 4, 3, 2, 1].map((star) => ({
    star: `${star}\u2605`,
    value: star,
    count: counts[star] ?? 0,
  }));

  const tallied = data.reduce((a, d) => a + d.count, 0);
  const average = tallied > 0 ? data.reduce((a, d) => a + d.count * d.value, 0) / tallied : 0;

  return (
    <div>
      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-display font-black text-3xl text-ink-100">
          {average.toFixed(1)}
        </span>
        <span className="text-sm text-ink-500">
          from {total} review{total === 1 ? '' : 's'}
        </span>
      </div>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 12, top: 0, bottom: 0 }}>
            <XAxis type="number" hide allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="star"
              width={32}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: '#1f2430',
                border: '1px solid #2d3444',
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: '#e5e7eb' }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill="#f59e0b" />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: MentorReview }) {
  return (
    <div className="flex gap-3 py-4 border-b border-ink-700/50 last:border-0">
      <MentorAvatar
        name={review.learner?.name ?? 'Learner'}
        avatarUrl={review.learner?.avatarUrl}
        size="md"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <p className="text-sm font-medium text-ink-200">
            {review.learner?.name ?? 'Anonymous learner'}
          </p>
          <span className="text-xs text-ink-500">{timeAgo(review.createdAt)}</span>
        </div>
        <StarRating value={review.rating} size={12} showValue={false} className="my-1" />
        {review.comment && (
          <p className="text-sm text-ink-400 leading-relaxed mt-1">{review.comment}</p>
        )}
      </div>
    </div>
  );
}

function ReviewsTab({ id, total }: { id: string; total: number }) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useMentorReviews(id, page, 5);
  const reviews = data?.reviews ?? [];
  const pagination = data?.pagination;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-5 lg:col-span-1 h-fit">
        <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-4">
          Rating breakdown
        </h4>
        {total > 0 ? (
          <RatingBreakdown id={id} total={total} />
        ) : (
          <p className="text-sm text-ink-500 py-8 text-center">No ratings yet.</p>
        )}
      </Card>

      <Card className="p-5 lg:col-span-2">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-9 h-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquare size={26} />}
            title="No reviews yet"
            description="This mentor hasn't received any reviews so far."
          />
        ) : (
          <>
            <div>
              {reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </div>
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-5">
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
      </Card>
    </div>
  );
}

// ─── Availability tab ──────────────────────────────────────────────────────────

function AvailabilityTab({ id, onRequest }: { id: string; onRequest: () => void }) {
  const { data, isLoading } = useMentorAvailability(id);

  const byDay = (data ?? []).reduce<Record<number, Availability[]>>((acc, slot) => {
    (acc[slot.dayOfWeek] ??= []).push(slot);
    return acc;
  }, {});
  const hasAny = (data?.length ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="p-6 lg:col-span-2">
        <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-4">
          Weekly availability
        </h4>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-xl" />
            ))}
          </div>
        ) : !hasAny ? (
          <p className="text-sm text-ink-500 py-6 text-center">
            This mentor hasn&apos;t published a schedule. You can still request a session and
            propose a time.
          </p>
        ) : (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => {
              const slots = byDay[day] ?? [];
              return (
                <div
                  key={day}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border px-4 py-3',
                    slots.length
                      ? 'border-ink-700/60 bg-ink-800/40'
                      : 'border-ink-800/40 opacity-50',
                  )}
                >
                  <span className="w-24 shrink-0 text-sm font-medium text-ink-300">
                    {DAY_NAMES[day]}
                  </span>
                  {slots.length ? (
                    <div className="flex flex-wrap gap-2">
                      {slots
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map((slot) => (
                          <span
                            key={slot.id}
                            className="flex items-center gap-1.5 text-xs font-medium text-accent-300 bg-accent-500/10 border border-accent-500/20 px-2.5 py-1 rounded-lg"
                          >
                            <Clock size={11} />
                            {formatSlotTime(slot.startTime)} – {formatSlotTime(slot.endTime)}
                          </span>
                        ))}
                    </div>
                  ) : (
                    <span className="text-xs text-ink-600">Unavailable</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card className="p-6 h-fit">
        <h4 className="font-display font-bold text-ink-100 mb-2">Ready to learn?</h4>
        <p className="text-sm text-ink-500 mb-4 leading-relaxed">
          Send a session request with a skill and a proposed time. The mentor will confirm.
        </p>
        <Button className="w-full" onClick={onRequest}>
          <CalendarPlus size={15} />
          Request a session
        </Button>
      </Card>
    </div>
  );
}

// ─── Loading / page ─────────────────────────────────────────────────────────────

function ProfileSkeleton() {
  return (
    <div className="min-h-screen">
      <Header title="Mentor Profile" />
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <Skeleton className="h-6 w-32" />
        <Card className="p-6">
          <div className="flex gap-5">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    </div>
  );
}

export default function MentorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const user = useAuthStore((s) => s.user);
  const { data: mentor, isLoading, isError } = useMentor(id);

  const [tab, setTab] = useState<Tab>('skills');
  const [requestOpen, setRequestOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  if (isLoading) return <ProfileSkeleton />;

  if (isError || !mentor) {
    return (
      <div className="min-h-screen">
        <Header title="Mentor Profile" />
        <div className="p-8 max-w-5xl mx-auto">
          <Link href="/mentors">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft size={15} />
              Back to Mentors
            </Button>
          </Link>
          <EmptyState
            icon={<GraduationCap size={28} />}
            title="Mentor not found"
            description="This mentor profile doesn't exist or is no longer available."
            action={
              <Link href="/mentors">
                <Button>Browse mentors</Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const isOwnProfile = user?.id === mentor.id;

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'skills', label: 'Skills', count: mentor.skills.length },
    { id: 'reviews', label: 'Reviews', count: mentor.ratingCount },
    { id: 'availability', label: 'Availability' },
  ];

  return (
    <div className="min-h-screen">
      <Header title="Mentor Profile" />
      <div className="p-8 max-w-5xl mx-auto">
        <Link href="/mentors">
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft size={15} />
            Back to Mentors
          </Button>
        </Link>

        {/* ── Header card ── */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <MentorAvatar name={mentor.name} avatarUrl={mentor.avatarUrl} size="xl" />

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-display font-black text-2xl text-ink-100">{mentor.name}</h2>
                  {mentor.headline && (
                    <p className="text-ink-400 mt-1">{mentor.headline}</p>
                  )}
                </div>
                {!isOwnProfile && <OverflowMenu onReport={() => setReportOpen(true)} />}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm text-ink-500">
                <StarRating value={mentor.ratingAvg} count={mentor.ratingCount} />
                <span className="flex items-center gap-1.5">
                  <GraduationCap size={13} />
                  {mentor.totalSessionsTaught} session
                  {mentor.totalSessionsTaught === 1 ? '' : 's'} taught
                </span>
                {mentor.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />
                    {mentor.location}
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  Member since {formatDate(mentor.createdAt, 'MMMM yyyy')}
                </span>
              </div>

              {mentor.bio && (
                <p className="text-sm text-ink-400 leading-relaxed mt-4">{mentor.bio}</p>
              )}

              {!isOwnProfile && (
                <div className="mt-5">
                  <Button onClick={() => setRequestOpen(true)}>
                    <CalendarPlus size={15} />
                    Request a session
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ── Tabs ── */}
        <div className="flex items-center gap-1 border-b border-ink-800 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'relative px-4 py-2.5 text-sm font-medium transition-colors',
                tab === t.id ? 'text-accent-400' : 'text-ink-500 hover:text-ink-300',
              )}
            >
              {t.label}
              {typeof t.count === 'number' && (
                <span className="ml-1.5 text-xs text-ink-600">{t.count}</span>
              )}
              {tab === t.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-accent-500 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* ── Tab content ── */}
        {tab === 'skills' && (
          <div>
            {mentor.skills.length === 0 ? (
              <EmptyState
                icon={<Star size={26} />}
                title="No skills listed"
                description="This mentor hasn't published any skills yet."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentor.skills.map((skill) => (
                  <Link key={skill.id} href={`/skills/${skill.id}`}>
                    <Card hover className="p-5 h-full flex flex-col group">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-display font-bold text-ink-100 group-hover:text-accent-300 transition-colors">
                          {skill.title}
                        </h3>
                        <CreditCostBadge cost={skill.creditCost} />
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className={cn(
                            'px-2 py-0.5 text-[11px] font-semibold rounded-md border',
                            levelStyles[skill.level],
                          )}
                        >
                          {skill.level}
                        </span>
                        <span className="text-xs text-ink-500">{skill.category}</span>
                      </div>
                      <p className="text-sm text-ink-500 line-clamp-2 flex-1">
                        {skill.description}
                      </p>
                      {skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-ink-700/60">
                          {skill.tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag}
                              className="text-[11px] text-ink-400 bg-ink-700/60 px-2 py-0.5 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'reviews' && <ReviewsTab id={mentor.id} total={mentor.ratingCount} />}

        {tab === 'availability' && (
          <AvailabilityTab id={mentor.id} onRequest={() => setRequestOpen(true)} />
        )}
      </div>

      <RequestSessionDialog
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        mentor={mentor}
      />
      <ReportUserDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reportedUserId={mentor.id}
        userName={mentor.name}
      />
    </div>
  );
}
