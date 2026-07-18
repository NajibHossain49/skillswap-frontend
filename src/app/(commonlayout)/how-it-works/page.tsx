'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    UserPlus, Search, CalendarCheck, Video,
    Star, ArrowRight, CheckCircle, Zap,
    BookOpen, Users, Clock, Shield, ChevronRight,
} from 'lucide-react';

/* ══════════════════════════════════════
   SKELETON
══════════════════════════════════════ */
function Skeleton({ className = '' }: { className?: string }) {
    return <div className={`animate-pulse rounded-lg bg-ink-800/60 ${className}`} />;
}

function PageSkeleton() {
    return (
        <div className="min-h-screen bg-ink-900">
            {/* Hero skeleton */}
            <section className="pt-32 pb-20 text-center px-6">
                <Skeleton className="h-5 w-36 mx-auto mb-6 rounded-full" />
                <Skeleton className="h-14 w-2/3 mx-auto mb-4" />
                <Skeleton className="h-14 w-1/2 mx-auto mb-6" />
                <Skeleton className="h-4 w-96 mx-auto mb-2" />
                <Skeleton className="h-4 w-72 mx-auto mb-10" />
                <div className="flex justify-center gap-4">
                    <Skeleton className="h-12 w-40 rounded-xl" />
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
            </section>

            {/* Steps skeleton */}
            <section className="py-24 bg-ink-950 px-6">
                <Skeleton className="h-10 w-56 mx-auto mb-4" />
                <Skeleton className="h-4 w-72 mx-auto mb-16" />
                <div className="max-w-5xl mx-auto flex flex-col gap-12">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className={`flex gap-10 items-center ${i % 2 !== 0 ? 'flex-row-reverse' : ''}`}>
                            <Skeleton className="flex-1 h-52 rounded-2xl" />
                            <div className="flex-1 flex flex-col gap-3">
                                <Skeleton className="h-5 w-16 rounded-full" />
                                <Skeleton className="h-8 w-56" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                                <div className="flex flex-col gap-2 mt-2">
                                    {Array.from({ length: 3 }).map((_, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Skeleton className="w-4 h-4 rounded-full" />
                                            <Skeleton className="h-3 w-40" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Roles skeleton */}
            <section className="py-24 px-6">
                <Skeleton className="h-10 w-64 mx-auto mb-4" />
                <Skeleton className="h-4 w-80 mx-auto mb-14" />
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="p-8 rounded-2xl bg-ink-800/40 border border-ink-700/60">
                            <Skeleton className="w-12 h-12 rounded-xl mb-5" />
                            <Skeleton className="h-6 w-32 mb-3" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-5/6 mb-6" />
                            {Array.from({ length: 4 }).map((_, j) => (
                                <div key={j} className="flex items-center gap-2 mb-2">
                                    <Skeleton className="w-4 h-4 rounded-full" />
                                    <Skeleton className="h-3 w-44" />
                                </div>
                            ))}
                            <Skeleton className="h-11 w-full rounded-xl mt-6" />
                        </div>
                    ))}
                </div>
            </section>

            {/* FAQ skeleton */}
            <section className="py-24 bg-ink-950 px-6">
                <Skeleton className="h-10 w-48 mx-auto mb-14" />
                <div className="max-w-2xl mx-auto flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 w-full rounded-xl" />
                    ))}
                </div>
            </section>
        </div>
    );
}

/* ══════════════════════════════════════
   REAL CONTENT
══════════════════════════════════════ */
const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Create your free account',
        desc: 'Sign up in under a minute. Tell us what you want to learn and what skills you can offer in return.',
        points: [
            'No credit card required',
            'Set your availability and timezone',
            'Build a skill profile that stands out',
        ],
        color: 'text-accent-400',
        bg: 'bg-accent-500/10',
        visual: (
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-ink-800/50 border border-ink-700/60 w-full">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-ink-700/60 border border-ink-600/40">
                    <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center text-xs font-bold text-accent-400">AK</div>
                    <div className="flex-1">
                        <div className="h-2.5 w-24 bg-ink-500/60 rounded mb-1.5" />
                        <div className="h-2 w-16 bg-ink-600/60 rounded" />
                    </div>
                    <span className="text-xs text-accent-400 font-medium px-2 py-1 rounded-lg bg-accent-500/10">Mentor</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {['React', 'TypeScript', 'Node.js', 'Python'].map((s) => (
                        <div key={s} className="px-3 py-1.5 rounded-lg bg-ink-700/60 border border-ink-600/40 text-xs text-ink-300 text-center">{s}</div>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-ink-400">Profile verified</span>
                </div>
            </div>
        ),
    },
    {
        icon: Search,
        step: '02',
        title: 'Find the perfect mentor',
        desc: 'Browse verified mentors by skill, rating, availability, and language. Filter until you find your ideal match.',
        points: [
            'Advanced filters by skill & rating',
            'Read real reviews from past learners',
            'Preview mentor profiles before booking',
        ],
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        visual: (
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-ink-800/50 border border-ink-700/60 w-full">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-ink-700/60 border border-ink-600/40">
                    <Search size={14} className="text-ink-500" />
                    <span className="text-xs text-ink-500">Search skills, mentors...</span>
                </div>
                {[
                    { name: 'Leo Vargas', skill: 'React', rating: '4.9', sessions: '124 sessions' },
                    { name: 'Sofia Chen', skill: 'Python', rating: '4.8', sessions: '89 sessions' },
                ].map((m) => (
                    <div key={m.name} className="flex items-center gap-3 p-3 rounded-xl bg-ink-700/60 border border-ink-600/40">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">
                            {m.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-ink-200">{m.name}</p>
                            <p className="text-[10px] text-ink-500">{m.skill} · {m.sessions}</p>
                        </div>
                        <div className="flex items-center gap-1">
                            <Star size={10} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs text-ink-300">{m.rating}</span>
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
    {
        icon: CalendarCheck,
        step: '03',
        title: 'Book your session',
        desc: 'Pick a time that works, confirm the skill swap, and get a calendar invite instantly. No back-and-forth emails.',
        points: [
            'Real-time availability calendar',
            'Instant booking confirmation',
            'Automated reminders before session',
        ],
        color: 'text-green-400',
        bg: 'bg-green-500/10',
        visual: (
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-ink-800/50 border border-ink-700/60 w-full">
                <p className="text-xs font-medium text-ink-300 mb-1">Pick a time slot</p>
                <div className="grid grid-cols-3 gap-2">
                    {['9:00 AM', '11:00 AM', '2:00 PM', '3:30 PM', '5:00 PM', '7:00 PM'].map((t, i) => (
                        <div
                            key={t}
                            className={`px-2 py-1.5 rounded-lg text-[10px] text-center border transition-all ${i === 2
                                ? 'bg-accent-500/20 border-accent-500/40 text-accent-400 font-medium'
                                : 'bg-ink-700/60 border-ink-600/40 text-ink-400'
                                }`}
                        >
                            {t}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 mt-1">
                    <CheckCircle size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">Session booked for 2:00 PM</span>
                </div>
            </div>
        ),
    },
    {
        icon: Video,
        step: '04',
        title: 'Learn, teach & grow',
        desc: 'Join your session, exchange knowledge, and leave a review. Track your progress and earn badges as you go.',
        points: [
            'Built-in video session support',
            'Session notes & resource sharing',
            'Earn verified skill badges',
        ],
        color: 'text-purple-400',
        bg: 'bg-purple-500/10',
        visual: (
            <div className="flex flex-col gap-3 p-6 rounded-2xl bg-ink-800/50 border border-ink-700/60 w-full">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-ink-300">Session in progress</span>
                    <span className="flex items-center gap-1.5 text-[10px] text-green-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                        Live
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {['AR', 'LV'].map((initials, i) => (
                        <div key={initials} className={`h-20 rounded-xl flex items-center justify-center text-lg font-bold ${i === 0 ? 'bg-accent-500/20 text-accent-400' : 'bg-purple-500/20 text-purple-400'}`}>
                            {initials}
                        </div>
                    ))}
                </div>
                <div className="flex items-center gap-2 pt-2">
                    {[Star, Star, Star, Star, Star].map((S, i) => (
                        <S key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-xs text-ink-400 ml-1">Rate this session</span>
                </div>
            </div>
        ),
    },
];

const faqs = [
    { q: 'Do I need to pay for sessions?', a: 'Not with the skill-swap model. You offer a skill you have in exchange for one you want to learn. If you prefer, some mentors also accept direct bookings for a fee.' },
    { q: 'How long is a typical session?', a: 'Sessions are usually 30–60 minutes. You and your mentor agree on the duration when booking. Most learners find 45 minutes ideal for focused learning.' },
    { q: 'What if my mentor cancels?', a: 'If a mentor cancels within 24 hours, you get automatic priority rebooking at no extra cost. Repeated cancellations affect mentor ratings.' },
    { q: 'Can I be both a learner and a mentor?', a: 'Absolutely — most users are both. Teach what you know, learn what you need. Your profile shows both your offered skills and learning goals.' },
    { q: 'Is there a minimum skill level to join?', a: 'No. Beginners, intermediates, and experts are all welcome. Even entry-level skills like writing, language teaching, or spreadsheet basics are highly valued.' },
];

function PageContent() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-ink-900">

            {/* ── Hero ── */}
            <section className="pt-32 pb-20 text-center px-6 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-accent-500/8 rounded-full blur-3xl" />
                </div>
                <div className="relative max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-8">
                        <Zap size={13} /> Simple. Fast. Effective.
                    </div>
                    <h1 className="font-display font-black text-5xl md:text-6xl text-ink-100 tracking-tight leading-none mb-6">
                        How SkillSwap<br />
                        <span className="text-accent-400">actually works</span>
                    </h1>
                    <p className="text-lg text-ink-400 max-w-xl mx-auto mb-10 leading-relaxed">
                        From signing up to your first session — four simple steps and you&apos;re learning from an expert.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register" className="flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95">
                            Get Started Free <ArrowRight size={16} />
                        </Link>
                        <Link href="/skills" className="flex items-center gap-2 px-7 py-3.5 border border-ink-700 text-ink-300 hover:text-ink-100 hover:border-ink-600 rounded-xl transition-all">
                            <BookOpen size={15} /> Browse Skills
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── Steps ── */}
            <section className="py-24 bg-ink-950">
                <div className="max-w-5xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="font-display font-black text-4xl text-ink-100 mb-3">4 steps to your first session</h2>
                        <p className="text-ink-500">No complicated setup. No hidden fees. Just learning.</p>
                    </div>

                    <div className="flex flex-col gap-20">
                        {steps.map((step, i) => {
                            const Icon = step.icon;
                            const isReversed = i % 2 !== 0;
                            return (
                                <div
                                    key={step.step}
                                    className={`flex flex-col lg:flex-row items-center gap-10 ${isReversed ? 'lg:flex-row-reverse' : ''}`}
                                >
                                    {/* Visual */}
                                    <div className="w-full lg:w-1/2">{step.visual}</div>

                                    {/* Text */}
                                    <div className="w-full lg:w-1/2">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${step.bg} text-xs font-bold mb-4 ${step.color}`}>
                                            STEP {step.step}
                                        </div>
                                        <div className={`w-10 h-10 rounded-xl ${step.bg} flex items-center justify-center mb-4`}>
                                            <Icon size={20} className={step.color} />
                                        </div>
                                        <h3 className="font-display font-black text-2xl text-ink-100 mb-3">{step.title}</h3>
                                        <p className="text-ink-400 leading-relaxed mb-5">{step.desc}</p>
                                        <div className="flex flex-col gap-2.5">
                                            {step.points.map((point) => (
                                                <div key={point} className="flex items-center gap-2.5">
                                                    <CheckCircle size={15} className={step.color} />
                                                    <span className="text-sm text-ink-300">{point}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Roles ── */}
            <section className="py-24 bg-ink-900">
                <div className="max-w-4xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <h2 className="font-display font-black text-4xl text-ink-100 mb-3">Choose your role</h2>
                        <p className="text-ink-500">Join as a learner, a mentor, or both — your choice.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            {
                                icon: BookOpen,
                                title: 'I want to Learn',
                                desc: 'Find expert mentors, book sessions, and fast-track your skills with real 1-on-1 guidance.',
                                color: 'text-accent-400',
                                bg: 'bg-accent-500/10',
                                border: 'hover:border-accent-500/40',
                                points: ['Browse 120+ skill categories', 'Book sessions in minutes', 'Track your learning progress', 'Earn verified badges'],
                                cta: 'Start Learning',
                                href: '/register',
                            },
                            {
                                icon: Users,
                                title: 'I want to Teach',
                                desc: 'Share your expertise, build your reputation, and earn through skill swaps or paid sessions.',
                                color: 'text-purple-400',
                                bg: 'bg-purple-500/10',
                                border: 'hover:border-purple-500/40',
                                points: ['Set your own schedule', 'Receive skill swaps or payment', 'Build a mentor portfolio', 'Join a global community'],
                                cta: 'Become a Mentor',
                                href: '/register',
                            },
                        ].map((role) => {
                            const Icon = role.icon;
                            return (
                                <div key={role.title} className={`p-8 rounded-2xl bg-ink-800/40 border border-ink-700/60 ${role.border} transition-all`}>
                                    <div className={`w-12 h-12 rounded-xl ${role.bg} flex items-center justify-center mb-5`}>
                                        <Icon size={24} className={role.color} />
                                    </div>
                                    <h3 className={`font-display font-black text-2xl ${role.color} mb-3`}>{role.title}</h3>
                                    <p className="text-sm text-ink-400 leading-relaxed mb-6">{role.desc}</p>
                                    <div className="flex flex-col gap-2.5 mb-7">
                                        {role.points.map((pt) => (
                                            <div key={pt} className="flex items-center gap-2.5">
                                                <ChevronRight size={14} className={role.color} />
                                                <span className="text-sm text-ink-300">{pt}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <Link
                                        href={role.href}
                                        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 ${role.bg} ${role.color} border border-current/20`}
                                    >
                                        {role.cta} <ArrowRight size={14} />
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Trust bar ── */}
            <section className="py-14 bg-ink-950 border-y border-ink-800/60">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    {[
                        { icon: Shield, label: 'Verified Mentors', sub: 'Every mentor is screened' },
                        { icon: Clock, label: 'Fast Booking', sub: 'Session in under 5 min' },
                        { icon: Star, label: '4.9 Avg Rating', sub: 'From 18k+ sessions' },
                        { icon: Users, label: '2,400+ Mentors', sub: 'Across 80 countries' },
                    ].map(({ icon: Icon, label, sub }) => (
                        <div key={label}>
                            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mx-auto mb-3">
                                <Icon size={18} className="text-accent-400" />
                            </div>
                            <p className="text-sm font-semibold text-ink-200">{label}</p>
                            <p className="text-xs text-ink-600 mt-0.5">{sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="py-24 bg-ink-900">
                <div className="max-w-2xl mx-auto px-6">
                    <h2 className="font-display font-black text-4xl text-ink-100 text-center mb-14">Quick answers</h2>
                    <div className="flex flex-col gap-3">
                        {faqs.map((faq, i) => (
                            <div key={i} className="rounded-xl border border-ink-700/60 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between px-5 py-4 text-left bg-ink-800/40 hover:bg-ink-800/60 transition-all"
                                >
                                    <span className="text-sm font-medium text-ink-200 pr-4">{faq.q}</span>
                                    <ChevronRight
                                        size={15}
                                        className={`text-ink-500 shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-90' : ''}`}
                                    />
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 py-4 bg-ink-800/20 border-t border-ink-700/60">
                                        <p className="text-sm text-ink-500 leading-relaxed">{faq.a}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="py-24 bg-ink-950">
                <div className="max-w-2xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm mb-6">
                        <Zap size={13} /> Ready to start?
                    </div>
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-4">
                        Your first session is one click away
                    </h2>
                    <p className="text-ink-400 mb-8">Join thousands of learners already growing with SkillSwap.</p>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                    >
                        Create Free Account <ArrowRight size={16} />
                    </Link>
                    <p className="text-xs text-ink-600 mt-4">No credit card · Cancel anytime</p>
                </div>
            </section>
        </div>
    );
}

/* ══════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════ */
export default function HowItWorksPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setLoading(false), 1400);
        return () => clearTimeout(t);
    }, []);

    return loading ? <PageSkeleton /> : <PageContent />;
}