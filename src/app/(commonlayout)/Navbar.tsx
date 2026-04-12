'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { Zap, Menu, X, ChevronDown, LogOut, User, Settings, LayoutDashboard, Home, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

// Navbar hidden on these exact paths
const HIDDEN_PATHS = ['/login', '/register'];

// Navbar hidden on routes that start with these prefixes
const HIDDEN_PREFIXES = ['/dashboard', '/admin', '/mentor', '/learner'];

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
    { href: '/', label: 'HOME', icon: Home },
    { href: '/about', label: 'ABOUT', icon: BookOpen },
    { href: '/dashboard', label: 'DASHBOARD', icon: LayoutDashboard, authOnly: true },
];

function NavLink({ href, label, icon: Icon, isActive }: NavItem & { isActive: boolean }) {
    return (
        <Link
            href={href}
            className={cn(
                'relative flex items-center gap-1.5 px-3 py-2 text-sm font-semibold tracking-widest transition-colors duration-200 group',
                isActive ? 'text-ink-100' : 'text-ink-500 hover:text-ink-100',
            )}
        >
            <Icon size={13} className={cn('transition-colors', isActive ? 'text-accent-400' : 'text-ink-600 group-hover:text-ink-300')} />
            {label}
            {/* Underline */}
            <span
                className={cn(
                    'absolute bottom-0 left-3 right-3 h-px rounded-full transition-all duration-300 origin-left',
                    isActive
                        ? 'bg-accent-400 scale-x-100'
                        : 'bg-ink-400 scale-x-0 group-hover:scale-x-100',
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

    const shouldHide =
        HIDDEN_PATHS.includes(pathname) ||
        HIDDEN_PREFIXES.some((prefix) => pathname.startsWith(prefix));

    if (shouldHide) return null;

    // Filter nav items based on auth
    const visibleNavItems = navItems.filter(
        (item) => !item.authOnly || (item.authOnly && isAuthenticated && user),
    );

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);


    if (
        pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/skills" ||
        pathname === "/sessions" ||
        pathname === "/admin" ||
        pathname.startsWith("/dashboard")
    ) {
        return null;
    }
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
                        {visibleNavItems.map((item) => (
                            <NavLink
                                key={item.href}
                                {...item}
                                isActive={isActive(item.href)}
                            />
                        ))}
                    </nav>

                    {/* ── Right: Auth-aware ── */}
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
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={32}
                                                height={32}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{getInitials(user.name)}</span>
                                        )}
                                    </div>
                                    <span className="text-sm text-ink-200 font-medium max-w-[100px] truncate">
                                        {user.name}
                                    </span>
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            'text-ink-500 transition-transform duration-200',
                                            profileOpen && 'rotate-180',
                                        )}
                                    />
                                </button>

                                {/* Profile dropdown */}
                                {profileOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-52 bg-ink-900 border border-ink-800/60 rounded-xl shadow-xl overflow-hidden">
                                        <div className="px-4 py-3 border-b border-ink-800/60">
                                            <p className="text-sm font-medium text-ink-100 truncate">{user.name}</p>
                                            <p className="text-xs text-ink-500 truncate">{user.email}</p>
                                        </div>

                                        <Link
                                            href="/dashboard"
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

                                      

                                        <div className="border-t border-ink-800/60">
                                            <button
                                                onClick={() => {
                                                    setProfileOpen(false);
                                                    logout();
                                                }}
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
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm text-ink-300 hover:text-ink-100 transition-colors"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 bg-accent-500 hover:bg-accent-400 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
                                >
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

                        {visibleNavItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        'flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold tracking-widest rounded-lg transition-all border-l-2',
                                        active
                                            ? 'text-ink-100 border-accent-400 bg-ink-800/40'
                                            : 'text-ink-500 border-transparent hover:text-ink-100 hover:bg-ink-800/60 hover:border-ink-600',
                                    )}
                                >
                                    <item.icon size={15} className={active ? 'text-accent-400' : 'text-ink-600'} />
                                    {item.label}
                                </Link>
                            );
                        })}

                        {/* Mobile auth section */}
                        {isAuthenticated && user ? (
                            <div className="pt-3 border-t border-ink-800/60 mt-2 flex flex-col gap-1">
                                <div className="flex items-center gap-3 px-3 py-2 mb-1">
                                    <div className="w-9 h-9 rounded-full bg-accent-500 flex items-center justify-center text-white text-xs font-bold overflow-hidden flex-shrink-0">
                                        {user.avatar ? (
                                            <Image
                                                src={user.avatar}
                                                alt={user.name}
                                                width={36}
                                                height={36}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span>{getInitials(user.name)}</span>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-ink-100 truncate">{user.name}</p>
                                        <p className="text-xs text-ink-500 truncate">{user.email}</p>
                                    </div>
                                </div>

                                <Link
                                    href="/MyProfile"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 rounded-lg transition-all"
                                >
                                    <User size={15} />
                                    My Profile
                                </Link>

                                <Link
                                    href="/settings"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-ink-400 hover:text-ink-100 hover:bg-ink-800/60 rounded-lg transition-all"
                                >
                                    <Settings size={15} />
                                    Settings
                                </Link>

                                <button
                                    onClick={() => {
                                        setMobileOpen(false);
                                        logout();
                                    }}
                                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                                >
                                    <LogOut size={15} />
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 pt-3 border-t border-ink-800/60 mt-2">
                                <Link
                                    href="/login"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 py-2.5 text-center text-sm text-ink-300 border border-ink-700 rounded-lg hover:bg-ink-800/60 transition-all"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={() => setMobileOpen(false)}
                                    className="flex-1 py-2.5 text-center text-sm text-white bg-accent-500 rounded-lg hover:bg-accent-400 transition-all"
                                >
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