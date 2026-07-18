'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard, Home, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    authOnly?: boolean;
}

const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/how-it-works', label: 'How it works', icon: Sparkles },
    { href: '/about', label: 'About', icon: BookOpen },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, authOnly: true },
];

function NavLink({ href, label, isActive }: NavItem & { isActive: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                'relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-200',
                isActive
                    ? 'text-ink-900 dark:text-ink-100'
                    : 'text-paper-600 hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100',
            )}
        >
            {label}
            <span
                className={cn(
                    'absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-500 transition-all duration-300',
                    isActive ? 'opacity-100' : 'opacity-0',
                )}
            />
        </Link>
    );
}

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const visibleNavItems = navItems.filter(
        (item) => !item.authOnly || (item.authOnly && isAuthenticated && user),
    );

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-4 sm:pt-4">
            <div
                className={cn(
                    'mx-auto max-w-6xl rounded-2xl transition-all duration-300',
                    scrolled
                        ? 'glass shadow-soft dark:shadow-glow-sm'
                        : 'border border-transparent bg-transparent',
                )}
            >
                <div className="flex h-14 items-center justify-between px-3 sm:px-4">
                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-2.5">
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow-sm transition-transform group-hover:scale-110">
                            <Sparkles size={17} className="text-white" />
                        </div>
                        <span className="font-display text-lg font-black tracking-tight text-ink-900 dark:text-ink-100">
                            Skill<span className="text-gradient">Swap</span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
                        {visibleNavItems.map((item) => (
                            <NavLink key={item.href} {...item} isActive={isActive(item.href)} />
                        ))}
                    </nav>

                    {/* Right */}
                    <div className="hidden items-center gap-2 md:flex">
                        <ThemeToggle />
                        {isAuthenticated && user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="group flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition-all hover:bg-paper-200/70 dark:hover:bg-ink-800/60"
                                >
                                    <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-bold text-white ring-2 ring-accent-500/30 transition-all group-hover:ring-accent-400/60">
                                        {user.avatarUrl ? (
                                            <Image src={user.avatarUrl} alt={user.name} width={32} height={32} className="h-full w-full object-cover" />
                                        ) : (
                                            <span>{getInitials(user.name)}</span>
                                        )}
                                    </div>
                                    <span className="max-w-[100px] truncate text-sm font-medium text-ink-900 dark:text-ink-200">{user.name}</span>
                                    <ChevronDown size={14} className={cn('text-paper-500 transition-transform duration-200 dark:text-ink-500', profileOpen && 'rotate-180')} />
                                </button>

                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-paper-200 bg-white shadow-soft-lg dark:border-ink-800/60 dark:bg-ink-900 dark:shadow-xl">
                                        <div className="border-b border-paper-200 px-4 py-3 dark:border-ink-800/60">
                                            <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-100">{user.name}</p>
                                            <p className="truncate text-xs text-paper-600 dark:text-ink-500">{user.email}</p>
                                        </div>
                                        <Link href="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-paper-700 transition-all hover:bg-paper-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-ink-100">
                                            <LayoutDashboard size={15} /> Dashboard
                                        </Link>
                                        <Link href="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-paper-700 transition-all hover:bg-paper-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-ink-100">
                                            <User size={15} /> My Profile
                                        </Link>
                                        <div className="border-t border-paper-200 dark:border-ink-800/60">
                                            <button onClick={() => { setProfileOpen(false); logout(); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-rose-500 transition-all hover:bg-rose-500/10 dark:text-red-400 dark:hover:text-red-300">
                                                <LogOut size={15} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-paper-700 transition-colors hover:text-ink-900 dark:text-ink-300 dark:hover:text-ink-100">
                                    Sign In
                                </Link>
                                <Link href="/register" className="group inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-2 text-sm font-semibold text-white shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-95">
                                    Get Started
                                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-2 md:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="rounded-xl p-2 text-paper-700 transition-all hover:bg-paper-200/70 dark:text-ink-300 dark:hover:bg-ink-800/60"
                            aria-label="Toggle menu"
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileOpen && (
                    <div className="border-t border-paper-200/70 px-3 pb-3 pt-2 md:hidden dark:border-ink-800/60">
                        <div className="flex flex-col gap-1">
                            {visibleNavItems.map((item) => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setMobileOpen(false)}
                                        className={cn(
                                            'flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                                            active
                                                ? 'bg-accent-500/10 text-accent-600 dark:text-accent-300'
                                                : 'text-paper-700 hover:bg-paper-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-ink-100',
                                        )}
                                    >
                                        <item.icon size={16} className={active ? 'text-accent-500 dark:text-accent-400' : ''} />
                                        {item.label}
                                    </Link>
                                );
                            })}

                            {isAuthenticated && user ? (
                                <div className="mt-2 flex flex-col gap-1 border-t border-paper-200/70 pt-3 dark:border-ink-800/60">
                                    <div className="mb-1 flex items-center gap-3 px-3 py-2">
                                        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-bold text-white">
                                            {user.avatarUrl ? (
                                                <Image src={user.avatarUrl} alt={user.name} width={36} height={36} className="h-full w-full object-cover" />
                                            ) : (
                                                <span>{getInitials(user.name)}</span>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-ink-900 dark:text-ink-100">{user.name}</p>
                                            <p className="truncate text-xs text-paper-600 dark:text-ink-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href="/profile" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-paper-700 transition-all hover:bg-paper-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-ink-100">
                                        <User size={15} /> My Profile
                                    </Link>
                                    <Link href="/settings" onClick={() => setMobileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-paper-700 transition-all hover:bg-paper-100 hover:text-ink-900 dark:text-ink-400 dark:hover:bg-ink-800/60 dark:hover:text-ink-100">
                                        <Settings size={15} /> Settings
                                    </Link>
                                    <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-rose-500 transition-all hover:bg-rose-500/10 dark:text-red-400 dark:hover:text-red-300">
                                        <LogOut size={15} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-2 flex gap-3 border-t border-paper-200/70 pt-3 dark:border-ink-800/60">
                                    <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl border border-paper-300 py-2.5 text-center text-sm font-medium text-paper-700 transition-all hover:bg-paper-100 dark:border-ink-700 dark:text-ink-300 dark:hover:bg-ink-800/60">
                                        Sign In
                                    </Link>
                                    <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 py-2.5 text-center text-sm font-semibold text-white transition-all hover:brightness-110">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
}
