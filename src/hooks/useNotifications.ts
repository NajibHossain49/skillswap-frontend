'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api-services';
import { Notification, Pagination } from '@/types';
import { toast } from 'sonner';

interface NotificationList {
  notifications: Notification[];
  pagination: Pagination;
}

export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (filters: { page: number; unreadOnly: boolean; limit: number }) =>
    [...notificationKeys.lists(), filters] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
};

// ─── Queries ──────────────────────────────────────────────────────────────────

export function useNotifications({
  page = 1,
  unreadOnly = false,
  limit = 20,
}: { page?: number; unreadOnly?: boolean; limit?: number } = {}) {
  return useQuery({
    queryKey: notificationKeys.list({ page, unreadOnly, limit }),
    queryFn: async () => {
      const res = await notificationsApi.getAll({ page, limit, unreadOnly });
      return res.data.data;
    },
    placeholderData: keepPreviousData,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const res = await notificationsApi.getUnreadCount();
      return res.data.data.count;
    },
    // Simple polling — the backend has no websocket.
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

// ─── Optimistic-update helpers ────────────────────────────────────────────────

type ListSnapshot = [readonly unknown[], NotificationList | undefined][];

function patchLists(
  lists: ListSnapshot,
  updater: (n: Notification) => Notification | null,
): [readonly unknown[], NotificationList][] {
  return lists
    .filter((entry): entry is [readonly unknown[], NotificationList] => !!entry[1])
    .map(([key, value]) => [
      key,
      {
        ...value,
        notifications: value.notifications
          .map((n) => updater(n))
          .filter((n): n is Notification => n !== null),
      },
    ]);
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function useMarkRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: notificationKeys.all });
      const prevCount = qc.getQueryData<number>(notificationKeys.unreadCount());
      const prevLists = qc.getQueriesData<NotificationList>({
        queryKey: notificationKeys.lists(),
      });

      // Only decrement if the target was actually unread.
      const wasUnread = prevLists.some(([, v]) =>
        v?.notifications.some((n) => n.id === id && !n.isRead),
      );
      if (wasUnread) {
        qc.setQueryData<number>(notificationKeys.unreadCount(), (c) =>
          Math.max(0, (c ?? 0) - 1),
        );
      }

      patchLists(prevLists, (n) => (n.id === id ? { ...n, isRead: true } : n)).forEach(
        ([key, value]) => qc.setQueryData(key, value),
      );

      return { prevCount, prevLists };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prevCount !== undefined) {
        qc.setQueryData(notificationKeys.unreadCount(), ctx.prevCount);
      }
      ctx?.prevLists.forEach(([key, value]) => qc.setQueryData(key, value));
      toast.error('Could not mark notification as read');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: notificationKeys.all });
      const prevCount = qc.getQueryData<number>(notificationKeys.unreadCount());
      const prevLists = qc.getQueriesData<NotificationList>({
        queryKey: notificationKeys.lists(),
      });

      qc.setQueryData<number>(notificationKeys.unreadCount(), 0);
      patchLists(prevLists, (n) => ({ ...n, isRead: true })).forEach(([key, value]) =>
        qc.setQueryData(key, value),
      );

      return { prevCount, prevLists };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prevCount !== undefined) {
        qc.setQueryData(notificationKeys.unreadCount(), ctx.prevCount);
      }
      ctx?.prevLists.forEach(([key, value]) => qc.setQueryData(key, value));
      toast.error('Could not mark all as read');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useDeleteNotification() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.remove(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: notificationKeys.all });
      const prevCount = qc.getQueryData<number>(notificationKeys.unreadCount());
      const prevLists = qc.getQueriesData<NotificationList>({
        queryKey: notificationKeys.lists(),
      });

      const wasUnread = prevLists.some(([, v]) =>
        v?.notifications.some((n) => n.id === id && !n.isRead),
      );
      if (wasUnread) {
        qc.setQueryData<number>(notificationKeys.unreadCount(), (c) =>
          Math.max(0, (c ?? 0) - 1),
        );
      }

      patchLists(prevLists, (n) => (n.id === id ? null : n)).forEach(([key, value]) =>
        qc.setQueryData(key, value),
      );

      return { prevCount, prevLists };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prevCount !== undefined) {
        qc.setQueryData(notificationKeys.unreadCount(), ctx.prevCount);
      }
      ctx?.prevLists.forEach(([key, value]) => qc.setQueryData(key, value));
      toast.error('Could not delete notification');
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
