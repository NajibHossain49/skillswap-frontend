'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api-services';
import { BookingRequest, BookingRequestStatus, Pagination } from '@/types';
import { sessionKeys } from '@/hooks/useSessions';
import { creditKeys } from '@/hooks/useCredits';
import { ApiError } from '@/lib/api';
import { toast } from 'sonner';

// Errors already surfaced as a toast by the axios interceptor (429/409/etc.).
function toastUnlessHandled(e: any, fallback: string) {
  if (e instanceof ApiError) return;
  toast.error(e?.response?.data?.message || fallback);
}

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: { status?: BookingRequestStatus; page: number }) =>
    [...bookingKeys.lists(), filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

type BookingsPage = { bookings: BookingRequest[]; pagination: Pagination };

export function useBookings(
  query: { status?: BookingRequestStatus; page?: number; limit?: number } = {},
) {
  const { status, page = 1, limit = 10 } = query;
  return useQuery({
    queryKey: bookingKeys.list({ status, page }),
    queryFn: async () => {
      const res = await bookingsApi.getAll({ status, page, limit });
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
      toast.success('Session request sent! The mentor will respond soon.');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to send session request'),
  });
}

// ─── Optimistic status transitions ──────────────────────────────────────────

type ListSnapshot = [readonly unknown[], BookingsPage | undefined];

function patchCachedStatus(
  qc: ReturnType<typeof useQueryClient>,
  id: string,
  status: BookingRequestStatus,
): ListSnapshot[] {
  const snapshots = qc.getQueriesData<BookingsPage>({ queryKey: bookingKeys.lists() });
  snapshots.forEach(([key, data]) => {
    if (!data) return;
    qc.setQueryData<BookingsPage>(key, {
      ...data,
      bookings: data.bookings.map((b) => (b.id === id ? { ...b, status } : b)),
    });
  });
  return snapshots;
}

function rollback(qc: ReturnType<typeof useQueryClient>, snapshots?: ListSnapshot[]) {
  snapshots?.forEach(([key, data]) => qc.setQueryData(key, data));
}

/**
 * Mentor accepts a request → the server creates a Session. Optimistically flips
 * the badge, then invalidates BOTH bookings and sessions on settle.
 */
export function useAcceptBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.accept(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: bookingKeys.lists() });
      return { snapshots: patchCachedStatus(qc, id, 'ACCEPTED') };
    },
    onError: (e: any, _id, ctx) => {
      rollback(qc, ctx?.snapshots);
      toastUnlessHandled(e, 'Failed to accept request');
    },
    onSuccess: () => toast.success('Request accepted — a session has been created.'),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
      qc.invalidateQueries({ queryKey: sessionKeys.all });
    },
  });
}

export function useRejectBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      bookingsApi.reject(id, { reason: reason ?? '' }),
    onMutate: async ({ id }) => {
      await qc.cancelQueries({ queryKey: bookingKeys.lists() });
      return { snapshots: patchCachedStatus(qc, id, 'REJECTED') };
    },
    onError: (e: any, _vars, ctx) => {
      rollback(qc, ctx?.snapshots);
      toastUnlessHandled(e, 'Failed to reject request');
    },
    onSuccess: () => toast.success('Request rejected'),
    onSettled: () => qc.invalidateQueries({ queryKey: bookingKeys.lists() }),
  });
}

/** Learner cancels their own pending request. */
export function useCancelBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => bookingsApi.cancel(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: bookingKeys.lists() });
      return { snapshots: patchCachedStatus(qc, id, 'CANCELLED') };
    },
    onError: (e: any, _id, ctx) => {
      rollback(qc, ctx?.snapshots);
      toastUnlessHandled(e, 'Failed to cancel request');
    },
    onSuccess: () => toast.success('Request cancelled'),
    onSettled: () => {
      qc.invalidateQueries({ queryKey: bookingKeys.lists() });
      // A cancel after acceptance may refund held credits.
      qc.invalidateQueries({ queryKey: creditKeys.balance() });
    },
  });
}
