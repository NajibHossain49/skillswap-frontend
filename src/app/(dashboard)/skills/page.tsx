'use client';

import { useState } from 'react';
import { Plus, Search, BookOpen, Users, Calendar } from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, Badge, SkeletonCard, EmptyState, Modal, Textarea, Select } from '@/components/ui';
import { useSkills, useCategories, useCreateSkill, useDeleteSkill } from '@/hooks/useSkills';
import { useAuthStore } from '@/store/auth';
import { Skill } from '@/types';
import { cn, getCategoryGradient, timeAgo } from '@/lib/utils';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input as FormInput } from '@/components/ui/Input';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1, 'Select a category'),
});
type FormData = z.infer<typeof schema>;

const CATEGORIES = ['Programming', 'Design', 'Marketing', 'Business', 'Music', 'Language', 'Science', 'Math', 'Other'];

function SkillCard({ skill, canEdit }: { skill: Skill; canEdit: boolean }) {
  const deleteSkill = useDeleteSkill();
  const gradient = getCategoryGradient(skill.category);

  return (
    <Link href={`/skills/${skill.id}`}>
      <Card hover className="p-5 h-full flex flex-col group overflow-hidden relative">
        <div className={cn('absolute inset-x-0 top-0 h-1 bg-gradient-to-r', gradient)} />

        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg shrink-0', gradient)}>
            📚
          </div>
          <span className="text-xs text-ink-500 bg-ink-700/60 px-2.5 py-1 rounded-full">
            {skill.category}
          </span>
        </div>

        <h3 className="font-display font-bold text-ink-100 text-base mb-2 group-hover:text-accent-300 transition-colors line-clamp-2">
          {skill.title}
        </h3>
        <p className="text-ink-500 text-sm leading-relaxed flex-1 line-clamp-3 mb-4">
          {skill.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-ink-700/60">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center text-[10px] font-bold text-accent-400">
              {skill.createdBy.name[0]}
            </div>
            <span className="text-xs text-ink-500 truncate max-w-[100px]">{skill.createdBy.name}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-ink-600">
            <Calendar size={11} />
            {skill._count?.sessions || 0} sessions
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CreateSkillModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const create = useCreateSkill();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await create.mutateAsync(data);
    reset();
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create New Skill" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput label="Title" placeholder="e.g. TypeScript Fundamentals" error={errors.title?.message} {...register('title')} />
        <Textarea label="Description" placeholder="Describe what learners will gain..." rows={4} error={errors.description?.message} {...register('description')} />
        <Select
          label="Category"
          error={errors.category?.message}
          options={[{ label: 'Select category...', value: '' }, ...CATEGORIES.map(c => ({ label: c, value: c }))]}
          {...register('category')}
        />
        <div className="flex gap-3 pt-2">
          <Button variant="secondary" type="button" onClick={onClose} className="flex-1">Cancel</Button>
          <Button type="submit" loading={create.isPending} className="flex-1">Create Skill</Button>
        </div>
      </form>
    </Modal>
  );
}

export default function SkillsPage() {
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);

  const { data, isLoading } = useSkills({ search, category, page, limit: 12 });
  const { data: categories } = useCategories();

  const canCreate = user?.role === 'MENTOR' || user?.role === 'ADMIN';

  return (
    <div className="min-h-screen">
      <Header title="Skills Library" subtitle="Discover skills and find your next learning adventure" />
      <div className="p-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search skills..."
              icon={<Search size={15} />}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCategory('')}
              className={cn('px-3 py-2 rounded-xl text-xs font-medium border transition-all', category === '' ? 'bg-accent-500 text-white border-accent-500' : 'border-ink-700 text-ink-400 hover:border-ink-600')}
            >
              All
            </button>
            {categories?.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat === category ? '' : cat); setPage(1); }}
                className={cn('px-3 py-2 rounded-xl text-xs font-medium border transition-all', category === cat ? 'bg-accent-500 text-white border-accent-500' : 'border-ink-700 text-ink-400 hover:border-ink-600')}
              >
                {cat}
              </button>
            ))}
          </div>
          {canCreate && (
            <Button onClick={() => setCreateOpen(true)}>
              Add Skill
            </Button>
          )}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data?.skills.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={28} />}
            title="No skills found"
            description={search ? `No results for "${search}"` : 'Be the first to add a skill!'}
            action={canCreate ? <Button onClick={() => setCreateOpen(true)}>Add Skill</Button> : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data?.skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} canEdit={canCreate && skill.createdById === user?.id} />
              ))}
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="secondary" size="sm" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous</Button>
                <span className="text-sm text-ink-500">Page {page} of {data.pagination.totalPages}</span>
                <Button variant="secondary" size="sm" disabled={page === data.pagination.totalPages} onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateSkillModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  );
}
