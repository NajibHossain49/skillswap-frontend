import {
  CalendarCheck,
  CalendarX,
  Clock,
  CheckCircle2,
  Star,
  Inbox,
  ThumbsUp,
  ThumbsDown,
  GraduationCap,
  Bell,
  type LucideIcon,
} from 'lucide-react';
import { Notification, NotificationType } from '@/types';

interface NotificationMeta {
  icon: LucideIcon;
  color: string;
  bg: string;
}

export const notificationMeta: Record<NotificationType, NotificationMeta> = {
  SESSION_BOOKED: { icon: CalendarCheck, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  SESSION_CANCELLED: { icon: CalendarX, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  SESSION_REMINDER: { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  SESSION_COMPLETED: { icon: CheckCircle2, color: 'text-sage-400', bg: 'bg-sage-500/10' },
  FEEDBACK_RECEIVED: { icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  BOOKING_REQUEST: { icon: Inbox, color: 'text-accent-400', bg: 'bg-accent-500/10' },
  BOOKING_ACCEPTED: { icon: ThumbsUp, color: 'text-sage-400', bg: 'bg-sage-500/10' },
  BOOKING_REJECTED: { icon: ThumbsDown, color: 'text-rose-400', bg: 'bg-rose-500/10' },
  MENTOR_APPROVED: { icon: GraduationCap, color: 'text-sage-400', bg: 'bg-sage-500/10' },
  SYSTEM: { icon: Bell, color: 'text-ink-300', bg: 'bg-ink-700/60' },
};

export function getNotificationMeta(type: NotificationType): NotificationMeta {
  return notificationMeta[type] ?? notificationMeta.SYSTEM;
}

/**
 * Resolves the destination for a notification. Prefers an explicit `link` (or
 * `data.link`), then falls back to a sensible route derived from the type and
 * any ids in `data`.
 */
export function getNotificationLink(n: Notification): string {
  if (n.link) return n.link;

  const data = (n.data ?? {}) as Record<string, unknown>;
  if (typeof data.link === 'string') return data.link;

  const sessionId = typeof data.sessionId === 'string' ? data.sessionId : null;

  switch (n.type) {
    case 'SESSION_BOOKED':
    case 'SESSION_CANCELLED':
    case 'SESSION_REMINDER':
    case 'SESSION_COMPLETED':
    case 'FEEDBACK_RECEIVED':
      return sessionId ? `/sessions/${sessionId}` : '/sessions';
    case 'BOOKING_REQUEST':
    case 'BOOKING_ACCEPTED':
    case 'BOOKING_REJECTED':
      return '/sessions';
    case 'MENTOR_APPROVED':
      return '/profile';
    default:
      return '/notifications';
  }
}
