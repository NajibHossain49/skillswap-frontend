'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '@/lib/api-services';
import { SessionsQuery } from '@/types';
import { toast } from 'sonner';

export const sessionKeys = {
  all: ['sessions'] as const,
  lists: () => [...sessionKeys.all, 'list'] as const,
  list: (filters: SessionsQuery) => [...sessionKeys.lists(), filters] as const,
  detail: (id: string) => [...sessionKeys.all, 'detail', id] as const,
  stats: () => [...sessionKeys.all, 'stats'] as const,
};

export function useSessions(query: SessionsQuery = {}) {
  return useQuery({
    queryKey: sessionKeys.list(query),
    queryFn: async () => {
      const res = await sessionsApi.getAll(query);
      return res.data.data;
    },
  });
}

export function useSession(id: string) {
  return useQuery({
    queryKey: sessionKeys.detail(id),
    queryFn: async () => {
      const res = await sessionsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useSessionStats() {
  return useQuery({
    queryKey: sessionKeys.stats(),
    queryFn: async () => {
      const res = await sessionsApi.getStats();
      return res.data.data;
    },
  });
}

export function useCreateSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Session created!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to create session'),
  });
}

export function useBookSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sessionsApi.book,
    onSuccess: (_d, id) => {
      qc.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Session booked!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to book session'),
  });
}

export function useUpdateSessionStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      sessionsApi.updateStatus(id, status),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: sessionKeys.lists() });
      toast.success('Status updated!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to update status'),
  });
}

export function useAddFeedback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { rating: number; comment?: string } }) =>
      sessionsApi.addFeedback(id, data),
    onSuccess: (_d, { id }) => {
      qc.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      toast.success('Feedback submitted!');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to submit feedback'),
  });
}
