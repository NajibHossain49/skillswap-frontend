'use client';

import { useEffect } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { creditsApi } from '@/lib/api-services';
import { CreditTxnType } from '@/types';
import { useAuthStore } from '@/store/auth';

export const creditKeys = {
  all: ['credits'] as const,
  balance: () => [...creditKeys.all, 'balance'] as const,
  transactions: (filters: { page: number; type?: CreditTxnType; limit: number }) =>
    [...creditKeys.all, 'transactions', filters] as const,
};

/**
 * Live credit balance. This is the single source of truth for the balance shown
 * in the header badge, and it keeps the auth store's `user.creditBalance` in
 * sync so affordability checks elsewhere never read a stale value.
 */
export function useCreditBalance() {
  const setCreditBalance = useAuthStore((s) => s.setCreditBalance);
  const query = useQuery({
    queryKey: creditKeys.balance(),
    queryFn: async () => {
      const res = await creditsApi.getBalance();
      return res.data.data.balance;
    },
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (typeof query.data === 'number') setCreditBalance(query.data);
  }, [query.data, setCreditBalance]);

  return query;
}

export function useCreditTransactions({
  page = 1,
  type,
  limit = 20,
}: { page?: number; type?: CreditTxnType; limit?: number } = {}) {
  return useQuery({
    queryKey: creditKeys.transactions({ page, type, limit }),
    queryFn: async () => {
      const res = await creditsApi.getTransactions({ page, limit, type });
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });
}
