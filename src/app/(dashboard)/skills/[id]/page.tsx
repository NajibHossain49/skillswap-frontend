'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Edit2, Trash2, Users, BookOpen, Coins, Flag } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Skeleton, Modal, Textarea, Select, Avatar } from '@/components/ui';
import { OverflowMenu } from '@/components/ui/OverflowMenu';
import { ErrorState } from '@/components/ui/ErrorState';
import { ReportDialog } from '@/components/reports/ReportDialog';
import { CreditCostBadge } from '@/components/credits/CreditCostBadge';
import { BookSessionButton } from '@/components/credits/BookSessionButton';
import { useSkill, useUpdateSkill, useDeleteSkill } from '@/hooks/useSkills';
import { useSessions } from '@/hooks/useSessions';
import { useAuthStore } from '@/store/auth';
import { canBookSession } from '@/lib/booking';
import { getCategoryGradient, formatDateTime, formatDuration, canTeach } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input as FormInput } from '@/components/ui/Input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({ title: z.string().min(3), description: z.string().min(10), category: z.string().min(1) });
type FormData = z.infer<typeof schema>;
const CATEGORIES = ['Programming', 'Design', 'Marketing', 'Business', 'Music', 'Language', 'Science', 'Math', 'Other'];

export default function SkillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { data: skill, isLoading, isError, refetch } = useSkill(id);
  const { data: sessionsData } = useSessions({ skillId: id, limit: 5 });
  const updateSkill = useUpdateSkill();
  const deleteSkill = useDeleteSkill();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  const canEdit =
    user?.role === 'ADMIN' ||
    (canTeach(user) && skill?.createdById === user?.id);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: skill ? { title: skill.title, description: skill.description, category: skill.category } : undefined,
  });

  const onEdit = async (data: FormData) => {
    await updateSkill.mutateAsync({ id, data });
    setEditOpen(false);
  };

  const onDelete = async () => {
    await deleteSkill.mutateAsync(id);
    router.push('/skills');
  };

  const gradient = getCategoryGradient(skill?.category || '');

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header title="Skill Detail" />
        <div className="p-8 max-w-5xl mx-auto space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-56 rounded-2xl" />
            </div>
            <Skeleton className="h-48 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen">
        <Header title="Skill Detail" />
        <div className="p-8 max-w-5xl mx-auto">
          <ErrorState onRetry={() => refetch()} />
        </div>
      </div>
    );
  }

  if (!skill) return null;

  return (
    <div className="min-h-screen">
      <Header title="Skill Detail" />
      <div className="p-8 max-w-5xl mx-auto">
        {/* Back */}
        <Link href="/skills">
          <Button variant="ghost" size="sm" className="mb-6">
            Back to Skills
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main */}
          <div className="lg:col-span-2 space-y-6">
            <Card className={cn('p-6 relative overflow-hidden')}>
              <div className={cn('absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r', gradient)} />
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-ink-500 bg-ink-700/60 px-2.5 py-1 rounded-full">{skill.category}</span>
                  </div>
                  <h2 className="font-display font-black text-2xl text-ink-100">{skill.title}</h2>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <>
                      <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>Edit</Button>
                      <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(true)}>Delete</Button>
                    </>
                  )}
                  {user && skill.createdById !== user.id && (
                    <OverflowMenu
                      items={[
                        {
                          label: 'Report skill',
                          icon: <Flag size={14} />,
                          onClick: () => setReportOpen(true),
                          destructive: true,
                        },
                      ]}
                    />
                  )}
                </div>
              </div>
              <p className="text-ink-400 leading-relaxed">{skill.description}</p>

              <div className="flex items-center gap-3 mt-6 pt-6 border-t border-ink-700/60">
                <Avatar name={skill.createdBy.name} size="md" />
                <div>
                  <p className="text-sm font-medium text-ink-200">{skill.createdBy.name}</p>
                  <p className="text-xs text-ink-500">Mentor</p>
                </div>
              </div>
            </Card>

            {/* Sessions for this skill */}
            <Card className="p-6">
              <h3 className="font-display font-bold text-ink-200 mb-4">Available Sessions</h3>
              {sessionsData?.sessions.length === 0 ? (
                <p className="text-ink-600 text-sm text-center py-8">No sessions for this skill yet</p>
              ) : (
                <div className="space-y-3">
                  {sessionsData?.sessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-3 p-3 rounded-xl transition-colors border border-ink-700/40 hover:border-ink-600/60"
                    >
                      <Link href={`/sessions/${s.id}`} className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-200 hover:text-accent-300 transition-colors">{s.title}</p>
                        <p className="text-xs text-ink-500">{formatDateTime(s.scheduledAt)} · {formatDuration(s.duration)}</p>
                      </Link>
                      <CreditCostBadge cost={s.skill.creditCost ?? skill.creditCost} />
                      <Badge status={s.status}>{s.status}</Badge>
                      {canBookSession(s, user) && (
                        <BookSessionButton
                          session={{ ...s, skill: { ...s.skill, creditCost: s.skill.creditCost ?? skill.creditCost } }}
                          size="sm"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4">
                <Link href={`/sessions?skillId=${id}`}>
                  <Button variant="outline" size="sm" className="w-full">View all sessions</Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="p-5">
              <h4 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-4">Stats</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-400">
                    <Calendar size={14} />
                    <span className="text-sm">Sessions</span>
                  </div>
                  <span className="font-bold text-ink-200">{skill._count?.sessions || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-400">
                    <BookOpen size={14} />
                    <span className="text-sm">Category</span>
                  </div>
                  <span className="text-ink-300 text-sm">{skill.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-400">
                    <Coins size={14} />
                    <span className="text-sm">Credit cost</span>
                  </div>
                  <CreditCostBadge cost={skill.creditCost} />
                </div>
              </div>
            </Card>

            {user?.role === 'LEARNER' && (
              <Link href={`/sessions?skillId=${id}`}>
                <Button className="w-full" >Book a Session</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Skill">
        <form onSubmit={handleSubmit(onEdit)} className="space-y-4">
          <FormInput label="Title" error={errors.title?.message} {...register('title')} />
          <Textarea label="Description" rows={4} error={errors.description?.message} {...register('description')} />
          <Select label="Category" error={errors.category?.message} options={CATEGORIES.map(c => ({ label: c, value: c }))} {...register('category')} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setEditOpen(false)} className="flex-1">Cancel</Button>
            <Button type="submit" loading={updateSkill.isPending} className="flex-1">Save Changes</Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Skill" size="sm">
        <p className="text-ink-400 mb-6">Are you sure you want to delete <strong className="text-ink-200">&quot;{skill.title}&quot;</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)} className="flex-1">Cancel</Button>
          <Button variant="secondary" onClick={onDelete} loading={deleteSkill.isPending} className="flex-1">Delete</Button>
        </div>
      </Modal>

      <ReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        reportedUserId={skill.createdById}
        targetLabel={skill.title}
      />
    </div>
  );
}
