'use client';

import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { mentorsApi } from '@/lib/api-services';
import { useAuthStore } from '@/store/auth';
import { toast } from 'sonner';

export interface MentorsQuery {
  page?: number;
  limit?: number;
  category?: string;
  minRating?: number;
  search?: string;
  sortBy?: 'rating' | 'sessions' | 'newest';
}

export const mentorKeys = {
  all: ['mentors'] as const,
  lists: () => [...mentorKeys.all, 'list'] as const,
  list: (filters: MentorsQuery) => [...mentorKeys.lists(), filters] as const,
  detail: (id: string) => [...mentorKeys.all, 'detail', id] as const,
  reviews: (id: string, page: number, limit: number) =>
    [...mentorKeys.all, 'reviews', id, page, limit] as const,
  breakdown: (id: string) => [...mentorKeys.all, 'breakdown', id] as const,
};

export function useMentors(query: MentorsQuery = {}) {
  return useQuery({
    queryKey: mentorKeys.list(query),
    queryFn: async () => {
      const res = await mentorsApi.getAll(query);
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useMentor(id: string) {
  return useQuery({
    queryKey: mentorKeys.detail(id),
    queryFn: async () => {
      const res = await mentorsApi.getById(id);
      return res.data.data;
    },
    enabled: !!id,
  });
}

export function useMentorReviews(id: string, page = 1, limit = 5) {
  return useQuery({
    queryKey: mentorKeys.reviews(id, page, limit),
    queryFn: async () => {
      const res = await mentorsApi.getReviews(id, { page, limit });
      return res.data.data;
    },
    enabled: !!id,
    placeholderData: keepPreviousData,
  });
}

/**
 * Derives a per-star breakdown (5★ → 1★ counts) from the mentor's reviews.
 * Pulls a large page so the chart reflects the full history rather than just
 * the paginated list the user is scrolling.
 */
export function useMentorRatingBreakdown(id: string) {
  return useQuery({
    queryKey: mentorKeys.breakdown(id),
    queryFn: async () => {
      const res = await mentorsApi.getReviews(id, { page: 1, limit: 500 });
      const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      for (const review of res.data.data.reviews) {
        const star = Math.round(review.rating);
        if (counts[star] !== undefined) counts[star] += 1;
      }
      return counts;
    },
    enabled: !!id,
  });
}

export function useApplyMentor() {
  const qc = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  return useMutation({
    mutationFn: mentorsApi.apply,
    onSuccess: (res) => {
      // Reflect the new status locally so the profile status card updates
      // immediately without a full reload.
      updateUser(res.data.data);
      qc.invalidateQueries({ queryKey: mentorKeys.lists() });
      toast.success('Application submitted! We\u2019ll review it shortly.');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to submit application'),
  });
}
