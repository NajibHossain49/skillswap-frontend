'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { bookingsApi } from '@/lib/api-services';
import { BookingRequestStatus } from '@/types';
import { toast } from 'sonner';

export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters: { status?: BookingRequestStatus; page: number }) =>
    [...bookingKeys.lists(), filters] as const,
  detail: (id: string) => [...bookingKeys.all, 'detail', id] as const,
};

export function useBookings(
  query: { status?: BookingRequestStatus; page?: number; limit?: number } = {},
) {
  const { status, page = 1, limit = 20 } = query;
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
