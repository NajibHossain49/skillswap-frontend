'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Header } from '@/app/(dashboard)/layout/Header';
import { cn } from '@/lib/utils';

const TABS = [
  { href: '/admin', label: 'Dashboard', exact: true },
  { href: '/admin/reports', label: 'Reports' },
  { href: '/admin/mentor-applications', label: 'Applications' },
  { href: '/admin/users', label: 'Users' },
  { href: '/admin/audit-logs', label: 'Audit Logs' },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <>
      <Header title="Admin Panel" subtitle="System management and analytics" />
      <nav className="px-8 border-b border-ink-800 flex gap-1 overflow-x-auto" aria-label="Admin sections">
        {TABS.map((tab) => {
          const active = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/');
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors',
                active ? 'text-accent-400' : 'text-ink-500 hover:text-ink-300',
              )}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-2 -bottom-px h-0.5 bg-accent-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
