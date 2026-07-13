'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bell, CheckCheck, Loader2, Inbox } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import {
  useNotifications,
  useUnreadCount,
  useMarkRead,
  useMarkAllRead,
} from '@/hooks/useNotifications';
import { getNotificationMeta, getNotificationLink } from './meta';
import { cn } from '@/lib/utils';
import { Notification } from '@/types';

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data, isLoading } = useNotifications({ page: 1, limit: 10 });
  const markRead = useMarkRead();
  const markAllRead = useMarkAllRead();

  const notifications = data?.notifications ?? [];

  const handleRowClick = (n: Notification) => {
    if (!n.isRead) markRead.mutate(n.id);
    setOpen(false);
    router.push(getNotificationLink(n));
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Notifications"
          className="relative w-9 h-9 rounded-xl bg-ink-800/60 border border-ink-700/60 flex items-center justify-center text-ink-500 hover:text-ink-300 hover:border-ink-600 transition-all"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-ink-900">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-full sm:max-w-md p-0 gap-0 bg-ink-900 border-l border-ink-800/60"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-800/60">
          <div>
            <SheetTitle className="font-display font-black text-lg text-ink-100">
              Notifications
            </SheetTitle>
            <SheetDescription className="text-xs text-ink-500">
              {unreadCount > 0 ? `${unreadCount} unread` : 'You’re all caught up'}
            </SheetDescription>
          </div>
          <button
            onClick={() => markAllRead.mutate()}
            disabled={unreadCount === 0 || markAllRead.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-400 hover:text-accent-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-ink-500">
              <Loader2 size={22} className="animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-ink-800 flex items-center justify-center text-ink-500">
                <Inbox size={24} />
              </div>
              <div>
                <p className="text-ink-200 font-semibold">No notifications yet</p>
                <p className="text-xs text-ink-500 mt-1">
                  We&apos;ll let you know when something happens.
                </p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-ink-800/40">
              {notifications.map((n) => {
                const meta = getNotificationMeta(n.type);
                const Icon = meta.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleRowClick(n)}
                      className={cn(
                        'w-full flex items-start gap-3 px-5 py-3.5 text-left transition-colors hover:bg-ink-800/40',
                        !n.isRead && 'bg-accent-500/[0.04]',
                      )}
                    >
                      <span
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                          meta.bg,
                          meta.color,
                        )}
                      >
                        <Icon size={16} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-ink-200 truncate">{n.title}</p>
                        <p className="text-xs text-ink-500 line-clamp-2 mt-0.5">{n.message}</p>
                        <p className="text-[11px] text-ink-600 mt-1">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-accent-400 mt-1.5 shrink-0" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-5 py-3.5 border-t border-ink-800/60">
          <button
            onClick={() => markAllRead.mutate()}
            disabled={unreadCount === 0 || markAllRead.isPending}
            className="text-xs font-medium text-ink-400 hover:text-accent-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Mark all as read
          </button>
          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="text-xs font-medium text-accent-400 hover:text-accent-300 transition-colors"
          >
            View all
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
