'use client';

import { useState } from 'react';
import {
  Coins, TrendingUp, TrendingDown, RotateCcw, Wallet, GraduationCap,
  ChevronLeft, ChevronRight, Sparkles,
} from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui';
import { useCreditBalance, useCreditTransactions } from '@/hooks/useCredits';
import { formatDateTime, cn } from '@/lib/utils';
import { CreditTransaction, CreditTxnType } from '@/types';

const PAGE_SIZE = 15;

const txnMeta: Record<CreditTxnType, { label: string; badge: string }> = {
  EARNED: { label: 'Earned', badge: 'bg-sage-500/10 text-sage-400 border-sage-500/20' },
  SPENT: { label: 'Spent', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  REFUND: { label: 'Refund', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
  SIGNUP_BONUS: { label: 'Signup bonus', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  ADMIN_ADJUSTMENT: { label: 'Adjustment', badge: 'bg-ink-700/60 text-ink-300 border-ink-600/60' },
};

function signedAmount(amount: number): string {
  return amount >= 0 ? `+${amount}` : `−${Math.abs(amount)}`;
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="bg-ink-900 border border-ink-800/60 rounded-2xl p-5">
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-3', accent)}>
        <Icon size={16} />
      </div>
      <p className="font-display font-black text-2xl text-ink-100 tabular-nums">{value}</p>
      <p className="text-xs text-ink-500 mt-0.5">{label}</p>
    </div>
  );
}

function LedgerSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-4 rounded-xl bg-ink-800/40 border border-ink-800/40"
        >
          <div className="w-9 h-9 rounded-xl bg-ink-700/60 animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-ink-700/60 animate-pulse" />
            <div className="h-3 w-1/4 rounded bg-ink-700/40 animate-pulse" />
          </div>
          <div className="h-4 w-12 rounded bg-ink-700/60 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function CreditsPage() {
  const [page, setPage] = useState(1);

  const { data: balance = 0 } = useCreditBalance();
  const { data, isLoading, isFetching } = useCreditTransactions({ page, limit: PAGE_SIZE });
  // A wider, unfiltered pull to derive lifetime-ish summary totals.
  const { data: summaryData } = useCreditTransactions({ page: 1, limit: 100 });

  const transactions = data?.transactions ?? [];
  const pagination = data?.pagination;

  const summaryTxns: CreditTransaction[] = summaryData?.transactions ?? [];
  const totalEarned = summaryTxns
    .filter((t) => t.type === 'EARNED' && t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalSpent = summaryTxns
    .filter((t) => t.type === 'SPENT')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalRefunded = summaryTxns
    .filter((t) => t.type === 'REFUND')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="min-h-screen">
      <Header title="Credits" subtitle="Your SkillSwap wallet" />

      <div className="max-w-4xl mx-auto w-full p-6 lg:p-8 space-y-6">
        {/* Balance + explainer */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-ink-900 to-ink-900 p-7">
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-amber-500/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 text-amber-300/80 mb-2">
                <Wallet size={16} />
                <span className="text-xs font-semibold uppercase tracking-wider">Current balance</span>
              </div>
              <div className="flex items-end gap-2">
                <Coins size={32} className="text-amber-400 mb-1.5" />
                <span className="font-display font-black text-5xl text-ink-100 tabular-nums leading-none">
                  {balance}
                </span>
                <span className="text-ink-500 mb-1.5">credits</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-ink-800/60 bg-ink-900 p-5">
            <div className="w-9 h-9 rounded-xl bg-accent-500/10 text-accent-400 flex items-center justify-center mb-3">
              <Sparkles size={16} />
            </div>
            <p className="text-sm font-semibold text-ink-200 mb-1">How credits work</p>
            <p className="text-xs text-ink-500 leading-relaxed flex items-center gap-1.5">
              <GraduationCap size={13} className="text-sage-400 shrink-0" />
              Teach a session to earn credits.
            </p>
            <p className="text-xs text-ink-500 leading-relaxed flex items-center gap-1.5 mt-1">
              <Coins size={13} className="text-amber-400 shrink-0" />
              Spend credits to learn.
            </p>
          </div>
        </div>

        {/* Summary tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SummaryTile
            icon={TrendingUp}
            label="Total earned"
            value={totalEarned}
            accent="bg-sage-500/10 text-sage-400"
          />
          <SummaryTile
            icon={TrendingDown}
            label="Total spent"
            value={totalSpent}
            accent="bg-rose-500/10 text-rose-400"
          />
          <SummaryTile
            icon={RotateCcw}
            label="Total refunded"
            value={totalRefunded}
            accent="bg-sky-500/10 text-sky-400"
          />
        </div>

        {/* Ledger */}
        <div>
          <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
            Transaction history
          </h2>

          {isLoading ? (
            <LedgerSkeleton />
          ) : transactions.length === 0 ? (
            <div className="rounded-2xl border border-ink-800/60 bg-ink-900">
              <EmptyState
                icon={<Coins size={26} />}
                title="No transactions yet"
                description="Book or teach a session and your credit activity will show up here."
              />
            </div>
          ) : (
            <div className={cn('overflow-hidden rounded-2xl border border-ink-800/60', isFetching && 'opacity-70 transition-opacity')}>
              {/* Table header (desktop) */}
              <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto] gap-4 px-4 py-2.5 bg-ink-800/40 text-[11px] font-semibold text-ink-500 uppercase tracking-wider">
                <span>Description</span>
                <span className="w-24">Type</span>
                <span className="w-16 text-right">Amount</span>
                <span className="w-20 text-right">Balance</span>
              </div>

              <div className="divide-y divide-ink-800/40">
                {transactions.map((t) => {
                  const meta = txnMeta[t.type];
                  const positive = t.amount >= 0;
                  return (
                    <div
                      key={t.id}
                      className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto_auto] gap-2 sm:gap-4 items-center px-4 py-3.5 bg-ink-900"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-ink-200 truncate">
                          {t.description || meta.label}
                        </p>
                        <p className="text-xs text-ink-600 mt-0.5">{formatDateTime(t.createdAt)}</p>
                      </div>
                      <span
                        className={cn(
                          'justify-self-start sm:w-24 inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border',
                          meta.badge,
                        )}
                      >
                        {meta.label}
                      </span>
                      <span
                        className={cn(
                          'sm:w-16 text-sm font-semibold tabular-nums sm:text-right',
                          positive ? 'text-sage-400' : 'text-rose-400',
                        )}
                      >
                        {signedAmount(t.amount)}
                      </span>
                      <span className="sm:w-20 text-sm text-ink-400 tabular-nums sm:text-right">
                        {t.balanceAfter}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <p className="text-xs text-ink-500">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft size={14} />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight size={14} />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
