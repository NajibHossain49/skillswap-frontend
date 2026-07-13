'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sessionsApi } from '@/lib/api-services';
import { SessionsQuery } from '@/types';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { creditKeys } from '@/hooks/useCredits';

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

/**
 * Credit-aware booking. Optimistically holds the credits (decrements the balance
 * badge + store), then reconciles: rolls back on any error, and handles the two
 * race/stale responses specially without a duplicate toast (the axios
 * interceptor already surfaces 409 / insufficient-credit messages).
 */
export function useBookSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string; creditCost: number }) => sessionsApi.book(id),
    onMutate: async ({ creditCost }) => {
      await qc.cancelQueries({ queryKey: creditKeys.balance() });
      const prevBalance = qc.getQueryData<number>(creditKeys.balance());
      const prevUser = useAuthStore.getState().user?.creditBalance;

      if (typeof prevBalance === 'number') {
        qc.setQueryData<number>(creditKeys.balance(), Math.max(0, prevBalance - creditCost));
      }
      if (typeof prevUser === 'number') {
        useAuthStore.getState().setCreditBalance(Math.max(0, prevUser - creditCost));
      }
      return { prevBalance, prevUser };
    },
    onSuccess: (_d, { creditCost }) => {
      toast.success(`Booked! ${creditCost} credit${creditCost === 1 ? '' : 's'} held.`);
    },
    onError: (err, _vars, ctx) => {
      // Roll back the optimistic hold.
      if (ctx?.prevBalance !== undefined) {
        qc.setQueryData(creditKeys.balance(), ctx.prevBalance);
      }
      if (ctx?.prevUser !== undefined) {
        useAuthStore.getState().setCreditBalance(ctx.prevUser);
      }

      const code = err instanceof ApiError ? err.code : undefined;
      if (code === 'CONFLICT') {
        // "Session is no longer available" — the interceptor already toasted the
        // message. Refetch the list so the gone session disappears; balance stays.
        qc.invalidateQueries({ queryKey: sessionKeys.all });
      } else if (code === 'INSUFFICIENT_CREDITS') {
        // Our local balance was stale — pull the real number from the server.
        qc.invalidateQueries({ queryKey: creditKeys.balance() });
      } else {
        toast.error((err as any)?.response?.data?.message || 'Failed to book session');
      }
    },
    onSettled: (_d, _e, { id }) => {
      qc.invalidateQueries({ queryKey: creditKeys.balance() });
      qc.invalidateQueries({ queryKey: sessionKeys.detail(id) });
      qc.invalidateQueries({ queryKey: sessionKeys.lists() });
    },
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
      // Completion pays out the mentor; cancellation may refund the learner.
      qc.invalidateQueries({ queryKey: creditKeys.balance() });
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
