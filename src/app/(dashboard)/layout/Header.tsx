'use client';

import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { Avatar } from '@/components/ui';

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
        <button className="w-9 h-9 rounded-xl bg-ink-800/60 border border-ink-700/60 flex items-center justify-center text-ink-500 hover:text-ink-300 hover:border-ink-600 transition-all">
          <Bell size={16} />
        </button>
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
