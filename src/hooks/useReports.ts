'use client';

import { useMutation } from '@tanstack/react-query';
import { reportsApi } from '@/lib/api-services';
import { toast } from 'sonner';

export function useCreateReport() {
  return useMutation({
    mutationFn: reportsApi.create,
    onSuccess: () => {
      toast.success('Report submitted. Our team will take a look.');
    },
    onError: (e: any) =>
      toast.error(e.response?.data?.message || 'Failed to submit report'),
  });
}
