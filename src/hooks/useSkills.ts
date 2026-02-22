'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '@/lib/api-services';
import { SkillsQuery } from '@/types';
import { toast } from 'sonner';

export const skillKeys = {
  all: ['skills'] as const,
  lists: () => [...skillKeys.all, 'list'] as const,
  list: (filters: SkillsQuery) => [...skillKeys.lists(), filters] as const,
  detail: (id: string) => [...skillKeys.all, 'detail', id] as const,
  categories: () => [...skillKeys.all, 'categories'] as const,
};

export function useSkills(query: SkillsQuery = {}) {
  return useQuery({
    queryKey: skillKeys.list(query),
    queryFn: async () => {
      const res = await skillsApi.getAll(query);
      return res.data.data;
    },
  });
}

export function useSkill(id: string) {
  return useQuery({
    queryKey: skillKeys.detail(id),
    queryFn: async () => {
      const res = await skillsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: skillKeys.categories(),
    queryFn: async () => {
      const res = await skillsApi.getCategories();
      return res.data.data;
    },
  });
}

export function useCreateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: skillKeys.lists() });
      toast.success('Skill created successfully!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create skill'),
  });
}

export function useUpdateSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => skillsApi.update(id, data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: skillKeys.detail(id) });
      qc.invalidateQueries({ queryKey: skillKeys.lists() });
      toast.success('Skill updated!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update skill'),
  });
}

export function useDeleteSkill() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: skillsApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: skillKeys.lists() });
      toast.success('Skill deleted');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to delete skill'),
  });
}
