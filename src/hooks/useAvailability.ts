'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { availabilityApi } from '@/lib/api-services';
import { toast } from 'sonner';

export const availabilityKeys = {
  all: ['availability'] as const,
  mine: () => [...availabilityKeys.all, 'mine'] as const,
  mentor: (mentorId: string) => [...availabilityKeys.all, 'mentor', mentorId] as const,
  slots: (mentorId: string, date: string) =>
    [...availabilityKeys.all, 'slots', mentorId, date] as const,
};

/** The signed-in mentor's own recurring slots (for the availability manager). */
export function useMyAvailability() {
  return useQuery({
    queryKey: availabilityKeys.mine(),
    queryFn: async () => {
      const res = await availabilityApi.getMine();
      return res.data.data;
    },
  });
}

export function useMentorAvailability(mentorId: string) {
  return useQuery({
    queryKey: availabilityKeys.mentor(mentorId),
    queryFn: async () => {
      const res = await availabilityApi.getForMentor(mentorId);
      return res.data.data;
    },
    enabled: !!mentorId,
  });
}

/**
 * Concrete bookable slots for a mentor on a given date. The server already
 * excludes times the mentor is booked, so this is the source of truth — the
 * client must never compute availability itself.
 */
export function useMentorSlots(mentorId: string, date: string, enabled = true) {
  return useQuery({
    queryKey: availabilityKeys.slots(mentorId, date),
    queryFn: async () => {
      const res = await availabilityApi.getSlots(mentorId, date);
      return res.data.data;
    },
    enabled: enabled && !!mentorId && !!date,
    staleTime: 0,
  });
}

export function useCreateAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: availabilityApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.mine() });
      toast.success('Availability slot added');
    },
    // No toast here: the overlap error is surfaced inline by the caller.
  });
}

export function useUpdateAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { dayOfWeek?: number; startTime?: string; endTime?: string; timezone?: string };
    }) => availabilityApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.mine() });
      toast.success('Slot updated');
    },
  });
}

export function useDeleteAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => availabilityApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: availabilityKeys.mine() });
      toast.success('Slot removed');
    },
    onError: (e: any) => toast.error(e.response?.data?.message || 'Failed to remove slot'),
  });
}
