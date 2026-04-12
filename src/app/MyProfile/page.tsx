'use client';

import { useEffect, useState } from 'react';
import {
    MapPin, Mail, Calendar, Star, BookOpen, Users,
    Award, Clock, Edit3, ExternalLink, Github, Twitter,
    Linkedin, CheckCircle, Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// ─── Skeleton primitives ───────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg bg-ink-800/60',
                'before:absolute before:inset-0 before:-translate-x-full',
                'before:bg-gradient-to-r before:from-transparent before:via-ink-700/40 before:to-transparent',
                'before:animate-[shimmer_1.6s_infinite]',
                className,
            )}
        />
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-ink-950 text-ink-100">
            {/* Cover */}
            <Skeleton className="h-52 w-full rounded-none" />

            <div className="max-w-5xl mx-auto px-6 lg:px-8">
                {/* Avatar + actions row */}
                <div className="flex items-end justify-between -mt-14 mb-6">
                    <Skeleton className="w-28 h-28 rounded-2xl ring-4 ring-ink-950" />
                    <div className="flex gap-2 pb-1">
                        <Skeleton className="w-24 h-9 rounded-lg" />
                        <Skeleton className="w-28 h-9 rounded-lg" />
                    </div>
                </div>

                {/* Name + badge */}
                <div className="mb-8">
                    <Skeleton className="w-48 h-7 mb-2" />
                    <Skeleton className="w-24 h-4 mb-4" />
                    <Skeleton className="w-full max-w-lg h-4 mb-2" />
                    <Skeleton className="w-3/4 max-w-md h-4 mb-5" />

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-3">
                        {[80, 100, 120, 90].map((w, i) => (
                            <Skeleton key={i} className={`h-6 rounded-full`} />
                        ))}
                    </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-2xl" />
                    ))}
                </div>

                {/* Body grid */}
                <div className="grid lg:grid-cols-3 gap-6 pb-16">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <Skeleton className="h-44 rounded-2xl" />
                        <Skeleton className="h-56 rounded-2xl" />
                    </div>
                    <div className="flex flex-col gap-6">
                        <Skeleton className="h-48 rounded-2xl" />
                        <Skeleton className="h-36 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── Mock data types ────────────────────────────────────────────────────────────

interface UserProfile {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    coverImage?: string;
    bio: string;
    role: 'MENTOR' | 'LEARNER';
    location?: string;
    joinedAt: string;
    website?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
    isVerified: boolean;
    stats: {
        sessionsCompleted: number;
        skillsTaught: number;
        skillsLearned: number;
        rating: number;
        totalReviews: number;
        hoursSpent: number;
    };
    skills: { name: string; level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' }[];
    learningGoals: string[];
    recentSessions: {
        id: string;
        title: string;
        partner: string;
        date: string;
        type: 'taught' | 'learned';
        rating?: number;
    }[];
    badges: { label: string; icon: string }[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

const levelColor: Record<string, string> = {
    Beginner: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Intermediate: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
    Advanced: 'bg-violet-500/15 text-violet-400 border-violet-500/30',
    Expert: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
};

// ─── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, accent }: {
    icon: React.ElementType; label: string; value: string | number; accent?: string;
}) {
    return (
        <div className="relative bg-ink-900 border border-ink-800/60 rounded-2xl p-5 overflow-hidden group hover:border-ink-700/60 transition-all">
            <div className={cn('absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity', accent ?? 'bg-accent-500/5')} />
            <div className="relative">
                <Icon size={18} className="text-ink-500 mb-3" />
                <p className="text-2xl font-black text-ink-100 tabular-nums">{value}</p>
                <p className="text-xs text-ink-500 mt-0.5 font-medium">{label}</p>
            </div>
        </div>
    );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="bg-ink-900 border border-ink-800/60 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-ink-400 uppercase tracking-wider mb-4">{title}</h3>
            {children}
        </div>
    );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate API fetch
        const timer = setTimeout(() => {
            setProfile({
                id: '1',
                name: authUser?.name ?? 'Alex Morgan',
                email: authUser?.email ?? 'alex@skillswap.dev',
                avatar: authUser?.avatar
                    ? typeof authUser.avatar === 'string'
                        ? authUser.avatar
                        : undefined
                    : undefined,
                bio: 'Full-stack engineer passionate about open source and teaching. I love breaking down complex concepts into simple, actionable steps. Currently exploring AI/ML and WebAssembly.',
                role: (authUser?.role as 'MENTOR' | 'LEARNER') ?? 'MENTOR',
                location: 'Dhaka, Bangladesh',
                joinedAt: '2024-01-15',
                website: 'https://alexmorgan.dev',
                github: 'alexmorgan',
                twitter: 'alexmorgan_dev',
                linkedin: 'alexmorgan',
                isVerified: true,
                stats: {
                    sessionsCompleted: 48,
                    skillsTaught: 12,
                    skillsLearned: 7,
                    rating: 4.9,
                    totalReviews: 36,
                    hoursSpent: 134,
                },
                skills: [
                    { name: 'React', level: 'Expert' },
                    { name: 'TypeScript', level: 'Expert' },
                    { name: 'Node.js', level: 'Advanced' },
                    { name: 'PostgreSQL', level: 'Advanced' },
                    { name: 'Docker', level: 'Intermediate' },
                    { name: 'Rust', level: 'Beginner' },
                ],
                learningGoals: ['Machine Learning with Python', 'WebAssembly', 'System Design'],
                recentSessions: [
                    { id: '1', title: 'React Hooks Deep Dive', partner: 'Sara K.', date: '2025-04-10', type: 'taught', rating: 5 },
                    { id: '2', title: 'Intro to Rust Ownership', partner: 'James L.', date: '2025-04-06', type: 'learned' },
                    { id: '3', title: 'TypeScript Generics', partner: 'Nina R.', date: '2025-04-01', type: 'taught', rating: 5 },
                ],
                badges: [
                    { label: 'Top Mentor', icon: '🏆' },
                    { label: '50 Sessions', icon: '⚡' },
                    { label: 'Quick Responder', icon: '💬' },
                    { label: 'Community Star', icon: '🌟' },
                ],
            });
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [authUser]);

    if (loading) return <ProfileSkeleton />;
    if (!profile) return null;

    const joinedDate = new Date(profile.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <div className="min-h-screen bg-ink-950 text-ink-100">
            <style>{`
                @keyframes shimmer { 100% { transform: translateX(100%); } }
                @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
                .fade-up { animation: fadeUp 0.5s ease both; }
            `}</style>

            {/* ── Cover ── */}
            <div className="relative h-52 overflow-hidden bg-gradient-to-br from-accent-900/60 via-ink-900 to-ink-900">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-accent-500/20 via-transparent to-transparent" />
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'radial-gradient(circle, #ffffff08 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-8">

                {/* ── Avatar + actions ── */}
                <div className="fade-up flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-6 gap-4">
                    <div className="relative w-28 h-28">
                        <div className="w-28 h-28 rounded-2xl ring-4 ring-ink-950 overflow-hidden bg-accent-500 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                            {profile.avatar
                                ? <Image width={100} height={100} src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                                : <span>{getInitials(profile.name)}</span>}
                        </div>
                        {profile.isVerified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center ring-2 ring-ink-950">
                                <CheckCircle size={14} className="text-white" />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 sm:pb-1">
                        <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-ink-300 border border-ink-700 rounded-lg hover:bg-ink-800/60 transition-all">
                            <Edit3 size={14} />
                            Edit Profile
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 text-sm text-white bg-accent-500 hover:bg-accent-400 rounded-lg transition-all hover:scale-105 active:scale-95">
                            <Zap size={14} />
                            Book Session
                        </button>
                    </div>
                </div>

                {/* ── Name + meta ── */}
                <div className="fade-up mb-8" style={{ animationDelay: '0.08s' }}>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h1 className="text-2xl font-black text-ink-100 tracking-tight">{profile.name}</h1>
                        <span className={cn(
                            'px-2.5 py-0.5 text-xs font-semibold rounded-full',
                            profile.role === 'MENTOR'
                                ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30'
                                : 'bg-sky-500/20 text-sky-400 border border-sky-500/30',
                        )}>
                            {profile.role}
                        </span>
                    </div>

                    <p className="text-sm text-ink-400 mb-4 leading-relaxed max-w-xl">{profile.bio}</p>

                    {/* Meta chips */}
                    <div className="flex flex-wrap gap-2 text-xs text-ink-500">
                        {profile.location && (
                            <span className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full">
                                <MapPin size={11} /> {profile.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full">
                            <Mail size={11} /> {profile.email}
                        </span>
                        <span className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full">
                            <Calendar size={11} /> Joined {joinedDate}
                        </span>
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full hover:border-ink-700 hover:text-ink-300 transition-all">
                                <ExternalLink size={11} /> Website
                            </a>
                        )}
                        {profile.github && (
                            <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full hover:border-ink-700 hover:text-ink-300 transition-all">
                                <Github size={11} /> {profile.github}
                            </a>
                        )}
                        {profile.twitter && (
                            <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full hover:border-ink-700 hover:text-ink-300 transition-all">
                                <Twitter size={11} /> @{profile.twitter}
                            </a>
                        )}
                        {profile.linkedin && (
                            <a href={`https://linkedin.com/in/${profile.linkedin}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-1.5 bg-ink-900 border border-ink-800/60 px-3 py-1.5 rounded-full hover:border-ink-700 hover:text-ink-300 transition-all">
                                <Linkedin size={11} /> LinkedIn
                            </a>
                        )}
                    </div>
                </div>

                {/* ── Stats ── */}
                <div className="fade-up grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8" style={{ animationDelay: '0.14s' }}>
                    <StatCard icon={Star} label="Rating" value={`${profile.stats.rating} ★`} accent="bg-amber-500/5" />
                    <StatCard icon={BookOpen} label="Sessions" value={profile.stats.sessionsCompleted} accent="bg-accent-500/5" />
                    <StatCard icon={Users} label="Taught" value={profile.stats.skillsTaught} accent="bg-emerald-500/5" />
                    <StatCard icon={Award} label="Learned" value={profile.stats.skillsLearned} accent="bg-sky-500/5" />
                    <StatCard icon={Clock} label="Hours" value={profile.stats.hoursSpent} accent="bg-violet-500/5" />
                    <StatCard icon={Star} label="Reviews" value={profile.stats.totalReviews} accent="bg-rose-500/5" />
                </div>

                {/* ── Body ── */}
                <div className="fade-up grid lg:grid-cols-3 gap-6 pb-16" style={{ animationDelay: '0.2s' }}>

                    {/* Left / main */}
                    <div className="lg:col-span-2 flex flex-col gap-6">

                        {/* Skills */}
                        <SectionCard title="Skills">
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((s) => (
                                    <span key={s.name}
                                        className={cn(
                                            'px-3 py-1.5 text-xs font-semibold rounded-lg border',
                                            levelColor[s.level],
                                        )}>
                                        {s.name}
                                        <span className="ml-1.5 opacity-60 font-normal">{s.level}</span>
                                    </span>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Recent Sessions */}
                        <SectionCard title="Recent Sessions">
                            <div className="flex flex-col gap-3">
                                {profile.recentSessions.map((s) => (
                                    <div key={s.id}
                                        className="flex items-center justify-between p-3 bg-ink-800/40 rounded-xl border border-ink-800/40 hover:border-ink-700/60 transition-all group">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                'w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0',
                                                s.type === 'taught' ? 'bg-accent-500/20 text-accent-400' : 'bg-sky-500/20 text-sky-400',
                                            )}>
                                                {s.type === 'taught' ? '↑' : '↓'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-ink-200 group-hover:text-ink-100 transition-colors">{s.title}</p>
                                                <p className="text-xs text-ink-500">with {s.partner} · {new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        {s.rating && (
                                            <span className="text-xs text-amber-400 font-semibold flex items-center gap-0.5">
                                                <Star size={11} className="fill-amber-400" /> {s.rating}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>

                    {/* Right / sidebar */}
                    <div className="flex flex-col gap-6">

                        {/* Badges */}
                        <SectionCard title="Badges">
                            <div className="grid grid-cols-2 gap-2">
                                {profile.badges.map((b) => (
                                    <div key={b.label}
                                        className="flex flex-col items-center gap-1.5 p-3 bg-ink-800/40 rounded-xl border border-ink-800/40 hover:border-ink-700/60 transition-all">
                                        <span className="text-2xl">{b.icon}</span>
                                        <span className="text-xs text-ink-400 text-center leading-tight font-medium">{b.label}</span>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>

                        {/* Learning Goals */}
                        <SectionCard title="Learning Goals">
                            <div className="flex flex-col gap-2">
                                {profile.learningGoals.map((g) => (
                                    <div key={g} className="flex items-center gap-2.5 text-sm text-ink-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent-400 flex-shrink-0" />
                                        {g}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    </div>
                </div>
            </div>
        </div>
    );
}