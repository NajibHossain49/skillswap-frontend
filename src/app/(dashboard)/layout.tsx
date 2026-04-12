'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Sidebar, MobileTopBar } from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="flex min-h-screen bg-ink-900">
      <Sidebar />

      {/* Mobile + content column */}
      <div className="flex-1 min-w-0 flex flex-col overflow-auto">
        {/* Mobile: sticky topbar with hamburger */}
        <MobileTopBar />

        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}