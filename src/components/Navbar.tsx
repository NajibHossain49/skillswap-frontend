'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Zap, Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';

// ─── Role → Dashboard path mapping ─────────────────────────────────────────────
const ROLE_DASHBOARD: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    MENTOR: '/mentor/dashboard',
    LEARNER: '/learner/dashboard',
};

function getDashboardPath(role?: string) {
    return ROLE_DASHBOARD[role?.toUpperCase() ?? ''] ?? '/dashboard';
}

const navLinks = [
    { href: '/sessions', label: 'Sessions' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];

function getInitials(name: string) {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// Role badge styles
const roleBadge: Record<string, string> = {
    ADMIN: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    MENTOR: 'bg-accent-500/20 text-accent-400 border border-accent-500/30',
    LEARNER: 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
};

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef<HTMLDivElement>(null);
    const { user, isAuthenticated, logout } = useAuth();

    const dashboardPath = getDashboardPath(user?.role);
    const roleKey = user?.role?.toUpperCase() ?? '';

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
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

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled
                    ? 'bg-ink-900/95 backdrop-blur-md border-b border-ink-800/60 shadow-lg'
                    : 'bg-transparent',
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* ── Logo ── */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Zap size={16} className="text-white" />
                        </div>
                        <span className="font-display font-black text-lg text-ink-100 tracking-tight">
                            Skill<span className="text-accent-400">Swap</span>
                        </span>
                    </Link>

                    {/* ── Desktop Nav ── */}
                    <nav className="hidden md:flex items-center gap-1">
                        {/* Dashboard — only shown when logged in, path based on role */}
                        {isAuthenticated && user && (
                            <Link
                                href={dashboardPath}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
                            >
                                <LayoutDashboard size={14} />
                                Dashboard
                            </Link>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-4 py-2 rounded-lg text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* ── Right side: Auth-aware ── */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated && user ? (
                            <div className="relative" ref={profileRef}>
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-ink-800/60 transition-all group"
                                >
                                    {/* Avatar */}
                                    <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-accent-500/30 group-hover:ring-accent-400/60 transition-all overflow-hidden">
                                        {user.avatar ? (
                                            <Image src={user.avatar} alt={user.name} width={32} height={32} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{getInitials(user.name)}</span>
                                        )}
                                    </div>

                                    {/* Name + role badge */}
                                    <div className="flex flex-col items-start gap-0.5">
                                        <span className="text-sm text-ink-200 font-medium max-w-[100px] truncate leading-tight">
                                            {user.name}
                                        </span>
                                        {roleKey && (
                                            <span className={cn('text-[10px] px-1.5 py-px rounded-full font-semibold leading-tight', roleBadge[roleKey] ?? 'bg-ink-700 text-ink-400')}>
                                                {user.role}
                                            </span>
                                        )}
                                    </div>

                                    <ChevronDown
                                        size={14}
                                        className={cn('text-ink-500 transition-transform duration-200', profileOpen && 'rotate-180')}
                                    />
                                </button>

                                {/* Profile dropdown */}
                                {profileOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-56 bg-ink-900 border border-ink-800/60 rounded-xl shadow-xl overflow-hidden">
                                        {/* Header */}
                                        <div className="px-4 py-3 border-b border-ink-800/60">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className="text-sm font-medium text-ink-100 truncate">{user.name}</p>
                                                {roleKey && (
                                                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0 ml-2', roleBadge[roleKey] ?? 'bg-ink-700 text-ink-400')}>
                                                        {user.role}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-ink-500 truncate">{user.email}</p>
                                        </div>

                                        {/* Role-aware dashboard link */}
                                        <Link
                                            href={dashboardPath}
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
                                        >
                                            <LayoutDashboard size={15} />
                                            Dashboard
                                        </Link>

                                        <Link
                                            href="/MyProfile"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
                                        >
                                            <User size={15} />
                                            My Profile
                                        </Link>

                                        <Link
                                            href="/settings"
                                            onClick={() => setProfileOpen(false)}
                                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
                                        >
                                            <Settings size={15} />
                                            Settings
                                        </Link>

                                        <div className="border-t border-ink-800/60">
                                            <button
                                                onClick={() => { setProfileOpen(false); logout(); }}
                                                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                                            >
                                                <LogOut size={15} />
                                                Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <>
                                <Link href="/login" className="px-4 py-2 text-sm text-ink-300 hover:text-ink-100 transition-colors">
                                    Sign In
                                </Link>
                                <Link href="/register" className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95">
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile toggle */}
                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="md:hidden p-2 rounded-lg text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 transition-all"
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ── Mobile Menu ── */}
            {mobileOpen && (
                <div className="md:hidden bg-ink-900/98 backdrop-blur-md border-b border-ink-800/60">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">

                        {/* Role-based dashboard link */}
                        {isAuthenticated && user && (
                            <Link
                                href={dashboardPath}
                                onClick={() => setMobileOpen(false)}
                                className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 rounded-lg transition-all"
                            >
                                <LayoutDashboard size={15} />
                                Dashboard
                            </Link>
                        )}

                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 rounded-lg transition-all"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile auth section */}
                        {isAuthenticated && user ? (
                            <div className="pt-3 border-t border-ink-800/60 mt-2 flex flex-col gap-1">
                                {/* User info */}
                                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                                    <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                                        {user.avatar ? (
                                            <Image src={user.avatar} alt={user.name} width={36} height={36} className="w-full h-full object-cover" />
                                        ) : (
                                            <span>{getInitials(user.name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-medium text-ink-100 truncate">{user.name}</p>
                                            {roleKey && (
                                                <span className={cn('text-[10px] px-1.5 py-px rounded-full font-bold flex-shrink-0', roleBadge[roleKey] ?? 'bg-ink-700 text-ink-400')}>
                                                    {user.role}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-ink-500 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <Link href="/MyProfile" onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 rounded-lg transition-all">
                                    <User size={15} /> My Profile
                                </Link>
                                <Link href="/settings" onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 rounded-lg transition-all">
                                    <Settings size={15} /> Settings
                                </Link>
                                <button
                                    onClick={() => { setMobileOpen(false); logout(); }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <LogOut size={15} /> Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 pt-3 border-t border-ink-800/60 mt-2">
                                <Link href="/login" onClick={() => setMobileOpen(false)}
                                    className="flex-1 py-2.5 text-center text-sm text-ink-300 border border-ink-700 rounded-lg hover:bg-ink-800/60 transition-all">
                                    Sign In
                                </Link>
                                <Link href="/register" onClick={() => setMobileOpen(false)}
                                    className="flex-1 py-2.5 text-center text-sm text-white bg-accent-500 rounded-lg hover:bg-accent-400 transition-all">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}