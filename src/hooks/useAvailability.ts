'use client';

import { useQuery } from '@tanstack/react-query';
import { availabilityApi } from '@/lib/api-services';

export const availabilityKeys = {
  all: ['availability'] as const,
  mine: () => [...availabilityKeys.all, 'mine'] as const,
  mentor: (mentorId: string) => [...availabilityKeys.all, 'mentor', mentorId] as const,
};

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
