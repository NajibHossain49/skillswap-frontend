'use client';

import { useState } from 'react';
import { Plus, Calendar, Clock, Filter } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Badge, SkeletonCard, EmptyState, Modal, Textarea, Select } from '@/components/ui';
import { useSessions, useCreateSession } from '@/hooks/useSessions';
import { useSkills } from '@/hooks/useSkills';
import { useAuthStore } from '@/store/auth';
import { Session, SessionStatus } from '@/types';
import { formatDateTime, formatDuration } from '@/lib/utils';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input as FormInput } from '@/components/ui/Input';
import { useSearchParams } from 'next/navigation';
import { Avatar } from '@/components/ui';

const schema = z.object({
  skillId: z.string().uuid('Select a skill'),
  title: z.string().min(3),
  description: z.string().optional(),
  scheduledAt: z.string().min(1, 'Select a date'),
  duration: z.coerce.number().min(15).max(480),
});
type FormData = z.infer<typeof schema>;

const STATUSES: { label: string; value: SessionStatus | '' }[] = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Scheduled', value: 'SCHEDULED' },
  { label: 'Completed', value: 'COMPLETED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

function SessionCard({ session }: { session: Session }) {
  return (
    <Link href={`/sessions/${session.id}`}>
      <Card hover className="p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-ink-100 text-base truncate group-hover:text-accent-300 transition-colors">
              {session.title}
            </h3>
            <p className="text-xs text-ink-500 mt-0.5">{session.skill.title} · {session.skill.category}</p>
          </div>
          <Badge status={session.status}>{session.status}</Badge>
        </div>

        {session.description && (
          <p className="text-ink-500 text-sm line-clamp-2">{session.description}</p>
        )}

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-ink-400">
            <Calendar size={12} />
            {formatDateTime(session.scheduledAt)}
          </div>
          <div className="flex items-center gap-1.5 text-ink-400">
            <Clock size={12} />
            {formatDuration(session.duration)}
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-ink-700/60">
          <div className="flex items-center gap-2">
            <Avatar name={session.mentor.name} size="sm" />
            <div>
              <p className="text-xs font-medium text-ink-300">{session.mentor.name}</p>
              <p className="text-[10px] text-ink-600">Mentor</p>
            </div>
          </div>
          {session.learner && (
            <div className="flex items-center gap-2">
              <Avatar name={session.learner.name} size="sm" />
              <div>
                <p className="text-xs font-medium text-ink-300">{session.learner.name}</p>
                <p className="text-[10px] text-ink-600">Learner</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
}

function CreateSessionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateSession();
  const { data: skillsData } = useSkills({ limit: 100 });
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const dt = new Date(data.scheduledAt).toISOString();
    await create.mutateAsync({ ...data, scheduledAt: dt });
    reset();
    onClose();
  };

  const skillOptions = [
    { label: 'Select a skill...', value: '' },
    ...(skillsData?.skills || []).map(s => ({ label: s.title, value: s.id })),
  ];

  return (
    <Modal open={open} onClose={onClose} title="Create Session" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Select label="Skill" error={errors.skillId?.message} options={skillOptions} {...register('skillId')} />
        <FormInput label="Session Title" placeholder="e.g. Introduction to TypeScript" error={errors.title?.message} {...register('title')} />
        <Textarea label="Description (optional)" placeholder="What will learners gain from this session?" rows={3} {...register('description')} />
        <div className="grid grid-cols-2 gap-4">
          <FormInput label="Scheduled Date & Time" type="datetime-local" error={errors.scheduledAt?.message} {...register('scheduledAt')} />
          <FormInput label="Duration (minutes)" type="number" placeholder="60" min="15" max="480" error={errors.duration?.message} {...register('duration')} />
        </div>
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={create.isPending} className="flex-1">Create Session</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function SessionsPage() {
  const user = useAuthStore((s) => s.user);
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<SessionStatus | ''>('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const skillId = searchParams.get('skillId') || undefined;

  const { data, isLoading } = useSessions({ status: status || undefined, page, limit: 9, skillId });
  const canCreate = user?.role === 'MENTOR' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen">
      <Header title="Sessions" subtitle={user?.role === 'LEARNER' ? 'Find and book sessions with expert mentors' : 'Manage your learning sessions'} />
      <div className="p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={14} className="text-ink-500" />
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatus(s.value); setPage(1); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${status === s.value ? 'bg-accent-500 text-white border-accent-500' : 'border-ink-700 text-ink-400 hover:border-ink-600'}`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {canCreate && (
            <Button onClick={() => setCreateOpen(true)} icon={<Plus size={16} />}>
              New Session
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data?.sessions.length === 0 ? (
          <EmptyState
            icon={<Calendar size={28} />}
            title="No sessions found"
            description={status ? `No ${status.toLowerCase()} sessions` : 'No sessions available yet'}
            action={canCreate ? <Button onClick={() => setCreateOpen(true)} icon={<Plus size={16} />}>Create Session</Button> : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data?.sessions.map((s) => <SessionCard key={s.id} session={s} />)}
            </div>
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="text-sm text-ink-500">Page {page} of {data.pagination.totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateSessionModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
