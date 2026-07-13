'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { isToday, isYesterday, format, formatDistanceToNow } from 'date-fns';
import {
  Check, Trash2, Inbox, ChevronLeft, ChevronRight, CheckCheck, Loader2,
} from 'lucide-react';
import { Header } from '@/app/(dashboard)/layout/Header';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui';
import { ErrorState } from '@/components/ui/ErrorState';
import {
  useNotifications,
  useMarkRead,
  useMarkAllRead,
  useDeleteNotification,
  useUnreadCount,
} from '@/hooks/useNotifications';
import { getNotificationMeta, getNotificationLink } from '@/components/notifications/meta';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';

const PAGE_SIZE = 20;

function dayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
}

function groupByDay(items: Notification[]): [string, Notification[]][] {
  const groups = new Map<string, Notification[]>();
  for (const n of items) {
    const label = dayLabel(n.createdAt);
    const arr = groups.get(label);
    if (arr) arr.push(n);
    else groups.set(label, [n]);
  }
  return Array.from(groups.entries());
}

function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-ink-800/40 border border-ink-800/40">
      <div className="w-10 h-10 rounded-xl bg-ink-700/60 animate-pulse shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 w-1/3 rounded bg-ink-700/60 animate-pulse" />
        <div className="h-3 w-2/3 rounded bg-ink-700/40 animate-pulse" />
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isError, refetch } = useNotifications({
    page,
    unreadOnly,
    limit: PAGE_SIZE,
  });
  const { data: unreadCount = 0 } = useUnreadCount();
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();
  const deleteNotification = useDeleteNotification();

  const notifications = data?.notifications ?? [];
  const pagination = data?.pagination;
  const groups = groupByDay(notifications);

  const changeFilter = (value: boolean) => {
    setUnreadOnly(value);
    setPage(1);
  };

  const handleRowClick = (n: Notification) => {
    if (!n.isRead) markRead.mutate(n.id);
    router.push(getNotificationLink(n));
  };

  return (
    <div className="min-h-screen">
      <Header title="Notifications" subtitle="Stay on top of what's happening" />

      <div className="max-w-3xl mx-auto w-full p-6 lg:p-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="inline-flex rounded-xl border border-ink-800/60 bg-ink-800/40 p-1">
            {[
              { label: 'All', value: false },
              { label: 'Unread', value: true },
            ].map((tab) => (
              <button
                key={tab.label}
                onClick={() => changeFilter(tab.value)}
                className={cn(
                  'px-4 py-1.5 text-sm font-medium rounded-lg transition-all',
                  unreadOnly === tab.value
                    ? 'bg-accent-500/15 text-accent-400'
                    : 'text-ink-400 hover:text-ink-200',
                )}
              >
                {tab.label}
                {tab.value && unreadCount > 0 && (
                  <span className="ml-1.5 text-xs text-ink-500">{unreadCount}</span>
                )}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={unreadCount === 0 || markAllRead.isPending}
            className="text-ink-400 hover:text-accent-400"
          >
            <CheckCheck size={15} />
            Mark all as read
          </Button>
        </div>

        {/* Content */}
        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <RowSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-ink-800/60 bg-ink-900">
            <EmptyState
              icon={<Inbox size={26} />}
              title={unreadOnly ? 'No unread notifications' : 'No notifications yet'}
              description={
                unreadOnly
                  ? 'You’ve read everything. Nice work!'
                  : 'When something happens on SkillSwap, it’ll show up here.'
              }
            />
          </div>
        ) : (
          <div className={cn('space-y-8', isFetching && 'opacity-70 transition-opacity')}>
            {groups.map(([label, items]) => (
              <section key={label}>
                <h2 className="text-xs font-semibold text-ink-500 uppercase tracking-wider mb-3">
                  {label}
                </h2>
                <div className="space-y-2.5">
                  {items.map((n) => {
                    const meta = getNotificationMeta(n.type);
                    const Icon = meta.icon;
                    return (
                      <div
                        key={n.id}
                        className={cn(
                          'group flex items-start gap-4 p-4 rounded-2xl border transition-all',
                          n.isRead
                            ? 'bg-ink-900 border-ink-800/60 hover:border-ink-700/60'
                            : 'bg-accent-500/[0.05] border-accent-500/20 hover:border-accent-500/30',
                        )}
                      >
                        <span
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                            meta.bg,
                            meta.color,
                          )}
                        >
                          <Icon size={18} />
                        </span>

                        <button
                          onClick={() => handleRowClick(n)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-ink-100 truncate">
                              {n.title}
                            </p>
                            {!n.isRead && (
                              <span className="w-2 h-2 rounded-full bg-accent-400 shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-ink-400 mt-0.5">{n.message}</p>
                          <p className="text-xs text-ink-600 mt-1.5">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </p>
                        </button>

                        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!n.isRead && (
                            <button
                              onClick={() => markRead.mutate(n.id)}
                              title="Mark as read"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:text-sage-400 hover:bg-ink-800/60 transition-colors"
                            >
                              <Check size={15} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification.mutate(n.id)}
                            title="Delete"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-500 hover:text-rose-400 hover:bg-ink-800/60 transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
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
                {isFetching && page > 1 ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ChevronLeft size={14} />
                )}
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
  );
}
