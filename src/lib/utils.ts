import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { SessionStatus, Role } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy') {
  return format(parseISO(dateStr), fmt);
}

export function formatDateTime(dateStr: string) {
  return format(parseISO(dateStr), 'MMM d, yyyy · h:mm a');
}

export function timeAgo(dateStr: string) {
  return formatDistanceToNow(parseISO(dateStr), { addSuffix: true });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

export const statusColors: Record<SessionStatus, { bg: string; text: string; dot: string }> = {
  PENDING: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
  SCHEDULED: { bg: 'bg-accent-500/10', text: 'text-accent-400', dot: 'bg-accent-400' },
  COMPLETED: { bg: 'bg-sage-500/10', text: 'text-sage-400', dot: 'bg-sage-400' },
  CANCELLED: { bg: 'bg-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-400' },
};

export const roleColors: Record<Role, { bg: string; text: string; dot: string }> = {
  ADMIN: { bg: 'bg-rose-500/10', text: 'text-rose-400', dot: 'bg-rose-400' },
  MENTOR: { bg: 'bg-accent-500/10', text: 'text-accent-400', dot: 'bg-accent-400' },
  LEARNER: { bg: 'bg-sage-500/10', text: 'text-sage-400', dot: 'bg-sage-400' },
};

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarUrl(name: string): string {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=6C63FF&textColor=ffffff&fontSize=40`;
}

export function formatRating(rating: number | null): string {
  if (!rating) return 'N/A';
  return rating.toFixed(1);
}

export const categoryColors: Record<string, string> = {
  Programming: 'from-accent-500/20 to-accent-600/10',
  Design: 'from-rose-500/20 to-rose-600/10',
  Marketing: 'from-amber-500/20 to-amber-600/10',
  Business: 'from-sage-500/20 to-sage-600/10',
  Music: 'from-purple-500/20 to-purple-600/10',
  Language: 'from-sky-500/20 to-sky-600/10',
  default: 'from-ink-600/60 to-ink-700/40',
};

export function getCategoryGradient(category: string): string {
  return categoryColors[category] || categoryColors.default;
}
