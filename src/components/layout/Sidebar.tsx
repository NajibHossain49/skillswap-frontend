'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, BookOpen, Calendar, Shield,
  Settings, LogOut, Zap, ChevronRight, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, Badge } from '@/components/ui';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '../../components/ui/Button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'MENTOR', 'LEARNER'] },
  { href: '/skills', label: 'Skills', icon: BookOpen, roles: ['ADMIN', 'MENTOR', 'LEARNER'] },
  { href: '/sessions', label: 'Sessions', icon: Calendar, roles: ['ADMIN', 'MENTOR', 'LEARNER'] },
  { href: '/admin', label: 'Admin Panel', icon: Shield, roles: ['ADMIN'] },
  { href: '/profile', label: 'Profile', icon: Settings, roles: ['ADMIN', 'MENTOR', 'LEARNER'] },
];

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false,
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-ink-800/60">
        <Link href="/" onClick={onNavClick} className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-all">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-display font-black text-lg text-ink-100 tracking-tight">
            Skill<span className="text-accent-400">Swap</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                isActive
                  ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
                  : 'text-ink-400 hover:text-ink-200 hover:bg-ink-800/60',
              )}
            >
              <item.icon size={18} className={cn(isActive ? 'text-accent-400' : 'text-ink-500 group-hover:text-ink-300')} />
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="text-accent-500/60" />}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="p-4 border-t border-ink-800/60">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-800/60 border border-ink-700/60 mb-3">
            <Avatar name={user.name} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink-200 truncate">{user.name}</p>
              <Badge role={user.role} className="mt-0.5 text-[10px] py-0.5">{user.role}</Badge>
            </div>
          </div>
          <button
            onClick={() => { logout(); onNavClick?.(); }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-ink-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export function MobileTopBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-ink-900/90 backdrop-blur border-b border-ink-800/60">
      <Link href="/dashboard" className="font-display font-black text-lg text-ink-100 tracking-tight">
        Skill<span className="text-accent-400">Swap</span>
      </Link>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {/* ✅ Menu খোলা থাকলে X, বন্ধ থাকলে Hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </SheetTrigger>

        {/* shadcn এর default close button সম্পূর্ণ সরানো হয়েছে */}
        <SheetContent
          side="left"
          className="w-64 p-0 bg-ink-900 border-r border-ink-800/60 [&>button]:hidden [&>button]:pointer-events-none"
        >
          <SidebarContent onNavClick={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </header>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 h-screen sticky top-0 flex-col bg-ink-900/80 backdrop-blur border-r border-ink-800/60">
      <SidebarContent />
    </aside>
  );
}