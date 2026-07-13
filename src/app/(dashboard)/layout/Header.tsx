'use client';

import { useAuthStore } from '@/store/auth';
import { Avatar } from '@/components/ui';
import { NotificationBell } from '@/components/notifications/NotificationBell';
import { CreditBadge } from '@/components/credits/CreditBadge';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b border-ink-800/60 bg-ink-900/40 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="font-display font-black text-2xl text-ink-100 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <CreditBadge />
        <NotificationBell />
        {user && (
          <div className="flex items-center gap-2.5 pl-3 border-l border-ink-800">
            <Avatar name={user.name} size="sm" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-ink-200 leading-none">{user.name}</p>
              <p className="text-xs text-ink-500 mt-0.5">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
