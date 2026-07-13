'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    ArrowRight, Star, Users, BookOpen, Zap, Shield,
    Clock, Award, ChevronDown, Globe,
    CheckCircle, Play, Sparkles, Brain, Wand2, Gauge,
    Check, Calendar, Rocket,
} from 'lucide-react';

/* ══════════════════════════════════════════
   Shared primitives
══════════════════════════════════════════ */
function Eyebrow({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/20 bg-accent-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-300">
            <Sparkles size={12} />
            {children}
        </div>
    );
}

function SectionHeading({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: React.ReactNode; subtitle?: string; center?: boolean }) {
    return (
        <div className={center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'}>
            {eyebrow && <div className={center ? 'flex justify-center' : ''}><Eyebrow>{eyebrow}</Eyebrow></div>}
            <h2 className="mt-5 font-display text-3xl font-black tracking-tight text-ink-900 dark:text-ink-100 sm:text-4xl">
                {title}
            </h2>
            {subtitle && <p className="mt-4 text-base leading-relaxed text-paper-600 dark:text-ink-400">{subtitle}</p>}
        </div>
    );
}

/* ══════════════════════════════════════════
   1. HERO
══════════════════════════════════════════ */
export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-paper-100 dark:bg-ink-900">
            {/* Aurora background */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-40 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-accent-500/20 blur-[120px] animate-aurora dark:bg-accent-500/25" />
                <div className="absolute -right-24 top-24 h-96 w-96 rounded-full bg-sage-500/15 blur-[100px] animate-float-slow" />
                <div className="absolute -left-24 top-40 h-80 w-80 rounded-full bg-accent-400/10 blur-[100px] animate-float" />
            </div>
            <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-70" />

            <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-36 text-center lg:px-8">
                <div className="flex justify-center animate-fade-up">
                    <Link href="/how-it-works" className="group inline-flex items-center gap-2 rounded-full border border-accent-500/25 bg-white/60 px-4 py-1.5 text-sm font-medium text-accent-600 shadow-soft backdrop-blur transition-all hover:border-accent-500/50 dark:bg-ink-800/60 dark:text-accent-300 dark:shadow-none">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-500/15">
                            <Zap size={11} className="text-accent-500 dark:text-accent-400" />
                        </span>
                        AI-powered skill exchange for developers
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

                <h1 className="mx-auto mt-8 max-w-4xl animate-fade-up font-display text-4xl font-black leading-[1.05] tracking-tight text-ink-900 dark:text-ink-100 sm:text-6xl lg:text-7xl">
                    Learn faster by
                    <br className="hidden sm:block" />{' '}
                    <span className="text-gradient">swapping skills</span>
                </h1>

                <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-lg leading-relaxed text-paper-600 dark:text-ink-400 stagger-1">
                    Match with expert mentors through AI, book 1-on-1 sessions in seconds, and trade
                    what you know for what you need. No subscriptions — just skill for skill.
                </p>

                <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 stagger-2 sm:flex-row">
                    <Link
                        href="/register"
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 px-7 py-3.5 font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg hover:brightness-110 active:scale-95 sm:w-auto"
                    >
                        Get Started
                        <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                        href="/login"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-paper-300 bg-white/70 px-7 py-3.5 font-semibold text-ink-900 backdrop-blur transition-all hover:border-paper-400 hover:bg-white dark:border-ink-700 dark:bg-ink-800/40 dark:text-ink-100 dark:hover:border-ink-600 sm:w-auto"
                    >
                        <Play size={15} className="text-accent-500 dark:text-accent-400" /> Sign In
                    </Link>
                </div>

                {/* Trust row */}
                <div className="mt-8 flex animate-fade-up flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-paper-600 dark:text-ink-500 stagger-3">
                    <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-sage-500" /> No credit card required</span>
                    <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-sage-500" /> Free skill swaps</span>
                    <span className="inline-flex items-center gap-1.5"><Check size={14} className="text-sage-500" /> Cancel anytime</span>
                </div>

                {/* Product preview mockup */}
                <div className="relative mx-auto mt-16 max-w-5xl animate-scale-in stagger-4">
                    <div className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-b from-accent-500/20 to-transparent blur-2xl" />
                    <div className="relative overflow-hidden rounded-3xl border border-paper-200 bg-white/80 shadow-soft-lg backdrop-blur-xl dark:border-ink-700/60 dark:bg-ink-800/50 dark:shadow-glow">
                        {/* Window chrome */}
                        <div className="flex items-center gap-2 border-b border-paper-200 px-4 py-3 dark:border-ink-700/60">
                            <span className="h-3 w-3 rounded-full bg-rose-400" />
                            <span className="h-3 w-3 rounded-full bg-amber" />
                            <span className="h-3 w-3 rounded-full bg-sage-500" />
                            <div className="ml-3 flex-1">
                                <div className="mx-auto w-56 rounded-md bg-paper-200 py-1 text-center text-[10px] text-paper-500 dark:bg-ink-900/60 dark:text-ink-500">
                                    app.skillswap.com/dashboard
                                </div>
                            </div>
                        </div>
                        {/* Body */}
                        <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 md:grid-cols-3">
                            <div className="rounded-2xl border border-accent-500/20 bg-accent-500/5 p-4 text-left">
                                <div className="flex items-center gap-2 text-accent-600 dark:text-accent-300">
                                    <Brain size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">AI Match</span>
                                </div>
                                <p className="mt-3 text-sm font-semibold text-ink-900 dark:text-ink-100">3 mentors matched to your goals</p>
                                <div className="mt-3 space-y-2">
                                    {['React Performance', 'System Design', 'TypeScript Deep-Dive'].map((t, i) => (
                                        <div key={t} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs shadow-sm dark:bg-ink-900/60">
                                            <span className="text-ink-700 dark:text-ink-300">{t}</span>
                                            <span className="font-semibold text-accent-500">{95 - i * 4}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="rounded-2xl border border-paper-200 bg-white p-4 text-left dark:border-ink-700/60 dark:bg-ink-900/40">
                                <div className="flex items-center gap-2 text-sage-600 dark:text-sage-400">
                                    <Calendar size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Next session</span>
                                </div>
                                <p className="mt-3 text-sm font-semibold text-ink-900 dark:text-ink-100">Today · 4:00 PM</p>
                                <div className="mt-3 flex items-center gap-3 rounded-lg bg-paper-100 px-3 py-2.5 dark:bg-ink-900/60">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-[10px] font-bold text-white">SC</div>
                                    <div>
                                        <p className="text-xs font-medium text-ink-900 dark:text-ink-100">Sarah Chen</p>
                                        <p className="text-[10px] text-paper-500 dark:text-ink-500">React Mentor · 4.9★</p>
                                    </div>
                                </div>
                                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-paper-200 dark:bg-ink-800">
                                    <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-accent-500 to-sage-500" />
                                </div>
                                <p className="mt-2 text-[10px] text-paper-500 dark:text-ink-500">Skill progress · 75%</p>
                            </div>
                            <div className="rounded-2xl border border-paper-200 bg-white p-4 text-left dark:border-ink-700/60 dark:bg-ink-900/40">
                                <div className="flex items-center gap-2 text-amber">
                                    <Gauge size={16} />
                                    <span className="text-xs font-semibold uppercase tracking-wide">Productivity</span>
                                </div>
                                <p className="mt-3 text-2xl font-black text-ink-900 dark:text-ink-100 font-display">+38%</p>
                                <p className="text-[11px] text-paper-500 dark:text-ink-500">faster learning this month</p>
                                <div className="mt-4 flex items-end gap-1.5">
                                    {[40, 65, 45, 80, 60, 95, 75].map((h, i) => (
                                        <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-accent-500/40 to-accent-500" style={{ height: `${h * 0.5}px` }} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Floating chips */}
                    <div className="absolute -left-4 top-1/3 hidden animate-float rounded-2xl border border-paper-200 bg-white/90 px-4 py-3 shadow-soft-lg backdrop-blur dark:border-ink-700/60 dark:bg-ink-800/90 md:block">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sage-500/15 text-sage-500"><CheckCircle size={16} /></span>
                            <div className="text-left">
                                <p className="text-xs font-semibold text-ink-900 dark:text-ink-100">Session booked</p>
                                <p className="text-[10px] text-paper-500 dark:text-ink-500">in 12 seconds</p>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -right-4 bottom-10 hidden animate-float-slow rounded-2xl border border-paper-200 bg-white/90 px-4 py-3 shadow-soft-lg backdrop-blur dark:border-ink-700/60 dark:bg-ink-800/90 md:block">
                        <div className="flex items-center gap-2">
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/15 text-accent-500"><Wand2 size={16} /></span>
                            <div className="text-left">
                                <p className="text-xs font-semibold text-ink-900 dark:text-ink-100">Smart suggestions</p>
                                <p className="text-[10px] text-paper-500 dark:text-ink-500">powered by AI</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   2. LOGO CLOUD / TRUSTED BY
══════════════════════════════════════════ */
export function LogoCloudSection() {
    const stats = [
        { value: '2,400+', label: 'Active Mentors' },
        { value: '18k+', label: 'Sessions Completed' },
        { value: '95%', label: 'Satisfaction Rate' },
        { value: '120+', label: 'Skills Available' },
    ];
    return (
        <section className="border-y border-paper-200 bg-white py-12 dark:border-ink-800/60 dark:bg-ink-950">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-paper-500 dark:text-ink-500">
                    Trusted by developers at leading teams
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="font-display text-3xl font-black text-ink-900 dark:text-ink-100">{s.value}</p>
                            <p className="mt-1 text-sm text-paper-600 dark:text-ink-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   3. FEATURES — AI / productivity bento grid
══════════════════════════════════════════ */
export function FeaturesSection() {
    return (
        <section id="features" className="bg-paper-100 py-24 dark:bg-ink-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading
                    eyebrow="Built for flow"
                    title={<>Everything you need to <span className="text-gradient">level up</span></>}
                    subtitle="Intelligent tools that remove the friction between you and your next skill."
                />

                <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-6">
                    {/* Large: AI assistance */}
                    <div className="group relative overflow-hidden rounded-3xl border border-paper-200 bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-ink-700/60 dark:bg-ink-800/40 dark:shadow-none dark:hover:border-accent-500/40 md:col-span-3 lg:col-span-2 md:row-span-2">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/15 blur-2xl transition-opacity group-hover:opacity-100" />
                        <div className="relative">
                            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-400 to-accent-600 text-white shadow-glow-sm">
                                <Brain size={22} />
                            </div>
                            <h3 className="font-display text-xl font-bold text-ink-900 dark:text-ink-100">AI coding assistance</h3>
                            <p className="mt-2 text-sm leading-relaxed text-paper-600 dark:text-ink-400">
                                Get instant, context-aware guidance during sessions. Our assistant explains
                                concepts, reviews code, and surfaces the right mentor for every problem.
                            </p>
                            <div className="mt-6 space-y-2.5">
                                {['Explain this function', 'Review my PR', 'Suggest a mentor'].map((t) => (
                                    <div key={t} className="flex items-center gap-2 rounded-xl border border-paper-200 bg-paper-100 px-3 py-2.5 text-xs text-ink-700 dark:border-ink-700/60 dark:bg-ink-900/50 dark:text-ink-300">
                                        <Sparkles size={13} className="text-accent-500" /> {t}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Smart autocomplete */}
                    <FeatureCard
                        className="md:col-span-3 lg:col-span-2"
                        icon={Wand2}
                        title="Smart autocomplete"
                        desc="Type a goal and watch SkillSwap complete the plan — matching skills, mentors, and time slots automatically."
                    />

                    {/* Productivity */}
                    <FeatureCard
                        className="md:col-span-3 lg:col-span-2"
                        icon={Gauge}
                        title="Productivity tools"
                        desc="Track streaks, milestones, and session insights in one focused dashboard built to keep you moving."
                    />

                    {/* Smaller row */}
                    <FeatureCard className="md:col-span-2" icon={Shield} title="Verified mentors" desc="Every mentor is vetted for real, hands-on expertise." />
                    <FeatureCard className="md:col-span-2" icon={Clock} title="Flexible scheduling" desc="Timezone-aware booking that fits your calendar." />
                    <FeatureCard className="md:col-span-2" icon={Globe} title="Global community" desc="Learners and mentors from 80+ countries." />
                </div>
            </div>
        </section>
    );
}

function FeatureCard({ icon: Icon, title, desc, className = '' }: { icon: React.ElementType; title: string; desc: string; className?: string }) {
    return (
        <div className={`group relative overflow-hidden rounded-3xl border border-paper-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-ink-700/60 dark:bg-ink-800/40 dark:shadow-none dark:hover:border-accent-500/40 ${className}`}>
            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-600 transition-transform group-hover:scale-110 dark:text-accent-400">
                <Icon size={20} />
            </div>
            <h3 className="font-semibold text-ink-900 dark:text-ink-100">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-paper-600 dark:text-ink-400">{desc}</p>
        </div>
    );
}

/* ══════════════════════════════════════════
   4. HOW IT WORKS
══════════════════════════════════════════ */
export function HowItWorksSection() {
    const steps = [
        { icon: BookOpen, step: '01', title: 'Browse Skills', desc: 'Explore hundreds of skills across development, design, data, and more.' },
        { icon: Users, step: '02', title: 'Match with a Mentor', desc: 'AI pairs you with the perfect mentor by expertise and availability.' },
        { icon: Clock, step: '03', title: 'Book a Session', desc: 'Schedule a 1-on-1 session at a time that works for you.' },
        { icon: Award, step: '04', title: 'Learn & Grow', desc: 'Complete the session, leave a review, and level up your career.' },
    ];

    return (
        <section className="bg-white py-24 dark:bg-ink-950">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading eyebrow="How it works" title="Start learning in four steps" subtitle="From discovery to mastery — a workflow designed to keep you in flow." />
                <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map(({ icon: Icon, step, title, desc }, i) => (
                        <div key={step} className="group relative rounded-3xl border border-paper-200 bg-paper-100 p-6 transition-all hover:-translate-y-1 hover:border-accent-500/30 hover:shadow-soft dark:border-ink-700/60 dark:bg-ink-800/40 dark:shadow-none">
                            <span className="absolute right-5 top-4 font-display text-4xl font-black text-paper-200 transition-colors group-hover:text-accent-500/20 dark:text-ink-700">{step}</span>
                            <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-500/10 text-accent-600 dark:text-accent-400">
                                <Icon size={20} />
                            </div>
                            <h3 className="font-semibold text-ink-900 dark:text-ink-100">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-paper-600 dark:text-ink-400">{desc}</p>
                            {i < steps.length - 1 && (
                                <ArrowRight size={16} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-paper-300 dark:text-ink-700 lg:block" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   5. FEATURED SKILLS
══════════════════════════════════════════ */
const skills = [
    { title: 'React & Next.js', category: 'Frontend', mentors: 48, rating: 4.9, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
    { title: 'Python & ML', category: 'Data Science', mentors: 36, rating: 4.8, color: 'text-amber', bg: 'bg-amber/10' },
    { title: 'UI/UX Design', category: 'Design', mentors: 29, rating: 4.9, color: 'text-pink-500', bg: 'bg-pink-500/10' },
    { title: 'Node.js & APIs', category: 'Backend', mentors: 41, rating: 4.7, color: 'text-sage-500', bg: 'bg-sage-500/10' },
    { title: 'DevOps & CI/CD', category: 'Infrastructure', mentors: 22, rating: 4.8, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'iOS Development', category: 'Mobile', mentors: 17, rating: 4.6, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Blockchain & Web3', category: 'Emerging', mentors: 14, rating: 4.7, color: 'text-accent-500', bg: 'bg-accent-500/10' },
    { title: 'System Design', category: 'Architecture', mentors: 31, rating: 4.9, color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

export function FeaturedSkillsSection() {
    return (
        <section className="bg-paper-100 py-24 dark:bg-ink-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
                    <SectionHeading center={false} eyebrow="Popular skills" title="Learn what's in demand" subtitle="Top-rated skills with verified mentors, ready when you are." />
                    <Link href="/skills" className="hidden items-center gap-1.5 text-sm font-medium text-accent-600 transition-colors hover:text-accent-500 dark:text-accent-400 sm:flex">
                        View all skills <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {skills.map((skill) => (
                        <Link
                            key={skill.title}
                            href="/skills"
                            className="group flex flex-col rounded-3xl border border-paper-200 bg-white p-5 shadow-soft transition-all duration-200 hover:-translate-y-1 hover:shadow-soft-lg dark:border-ink-700/60 dark:bg-ink-800/40 dark:shadow-none dark:hover:border-accent-500/40"
                        >
                            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${skill.bg}`}>
                                <BookOpen size={18} className={skill.color} />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs uppercase tracking-wider text-paper-500 dark:text-ink-500">{skill.category}</span>
                                <h3 className="mb-3 mt-1 font-semibold text-ink-900 transition-colors group-hover:text-accent-600 dark:text-ink-100 dark:group-hover:text-accent-400">{skill.title}</h3>
                            </div>
                            <div className="flex items-center justify-between text-xs text-paper-600 dark:text-ink-500">
                                <span className="flex items-center gap-1"><Users size={11} /> {skill.mentors} mentors</span>
                                <span className="flex items-center gap-1"><Star size={11} className="fill-amber text-amber" /> {skill.rating}</span>
                            </div>
                            <div className="mt-3 border-t border-paper-200 pt-3 dark:border-ink-700/60">
                                <span className="text-xs font-semibold text-accent-600 dark:text-accent-400">Free Swap →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   6. STATS
══════════════════════════════════════════ */
export function StatsSection() {
    const stats = [
        { value: '2,400+', label: 'Expert Mentors', icon: Users },
        { value: '18,000+', label: 'Sessions Completed', icon: CheckCircle },
        { value: '120+', label: 'Skill Categories', icon: BookOpen },
        { value: '4.9★', label: 'Average Rating', icon: Star },
    ];

    return (
        <section className="bg-white py-20 dark:bg-ink-950">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-accent-500/15 bg-gradient-to-br from-accent-500/10 via-accent-500/5 to-transparent p-10">
                    <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/15 blur-3xl" />
                    <div className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {stats.map(({ value, label, icon: Icon }) => (
                            <div key={label} className="text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-accent-500/20 bg-accent-500/10 text-accent-600 dark:text-accent-400">
                                    <Icon size={22} />
                                </div>
                                <p className="mb-1 font-display text-3xl font-black text-ink-900 dark:text-ink-100">{value}</p>
                                <p className="text-sm text-paper-600 dark:text-ink-400">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   7. TESTIMONIALS
══════════════════════════════════════════ */
const testimonials = [
    { name: 'Sarah Chen', role: 'Frontend Developer', avatar: 'SC', text: 'SkillSwap helped me level up my React skills in just 3 sessions. My mentor was incredibly knowledgeable and patient.', rating: 5 },
    { name: 'Marcus Rivera', role: 'Data Scientist', avatar: 'MR', text: 'I traded my Python expertise for UI/UX mentoring. Best decision I made — the swap model is brilliant.', rating: 5 },
    { name: 'Priya Nair', role: 'Full Stack Engineer', avatar: 'PN', text: 'Found an amazing mentor for system design prep. Landed my dream job at a FAANG after just 4 sessions!', rating: 5 },
    { name: 'James Okafor', role: 'DevOps Engineer', avatar: 'JO', text: 'The quality of mentors here is exceptional. Every session is structured, actionable, and worth every minute.', rating: 5 },
];

export function TestimonialsSection() {
    return (
        <section className="bg-paper-100 py-24 dark:bg-ink-900">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading eyebrow="Loved by learners" title="Real stories from our community" subtitle="Thousands of developers grow their careers on SkillSwap every month." />
                <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {testimonials.map((t) => (
                        <figure key={t.name} className="flex flex-col rounded-3xl border border-paper-200 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg dark:border-ink-700/60 dark:bg-ink-800/40 dark:shadow-none">
                            <div className="mb-4 flex gap-0.5">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} size={14} className="fill-amber text-amber" />
                                ))}
                            </div>
                            <blockquote className="mb-5 flex-1 text-sm leading-relaxed text-paper-700 dark:text-ink-300">&ldquo;{t.text}&rdquo;</blockquote>
                            <figcaption className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-400 to-accent-600 text-xs font-bold text-white">{t.avatar}</div>
                                <div>
                                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{t.name}</p>
                                    <p className="text-xs text-paper-500 dark:text-ink-500">{t.role}</p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   8. PRICING PREVIEW
══════════════════════════════════════════ */
const plans = [
    {
        name: 'Starter', price: 'Free', period: 'forever', desc: 'For curious learners getting started.', cta: 'Get Started', href: '/register', featured: false,
        features: ['Unlimited skill swaps', 'AI mentor matching', '2 sessions / month', 'Community access'],
    },
    {
        name: 'Pro', price: '$19', period: '/month', desc: 'For developers serious about growth.', cta: 'Start Pro trial', href: '/register', featured: true,
        features: ['Everything in Starter', 'Unlimited sessions', 'AI coding assistant', 'Priority mentor access', 'Progress analytics'],
    },
    {
        name: 'Team', price: '$49', period: '/seat', desc: 'For teams learning together.', cta: 'Contact sales', href: '/contact', featured: false,
        features: ['Everything in Pro', 'Shared team dashboard', 'Admin & reporting', 'SSO & security', 'Dedicated support'],
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="relative overflow-hidden bg-white py-24 dark:bg-ink-950">
            <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <SectionHeading eyebrow="Pricing" title={<>Simple, transparent <span className="text-gradient">pricing</span></>} subtitle="Start free and upgrade when you're ready. No hidden fees, cancel anytime." />
                <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={
                                plan.featured
                                    ? 'relative overflow-hidden rounded-3xl border border-accent-500/40 bg-gradient-to-b from-accent-500/10 to-transparent p-8 shadow-glow-sm lg:-mt-4 lg:mb-4'
                                    : 'relative rounded-3xl border border-paper-200 bg-paper-100 p-8 dark:border-ink-700/60 dark:bg-ink-800/40'
                            }
                        >
                            {plan.featured && (
                                <span className="absolute right-6 top-6 rounded-full bg-accent-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-glow-sm">
                                    Most popular
                                </span>
                            )}
                            <h3 className="font-display text-lg font-bold text-ink-900 dark:text-ink-100">{plan.name}</h3>
                            <p className="mt-1 text-sm text-paper-600 dark:text-ink-400">{plan.desc}</p>
                            <div className="mt-5 flex items-end gap-1">
                                <span className="font-display text-4xl font-black text-ink-900 dark:text-ink-100">{plan.price}</span>
                                <span className="mb-1 text-sm text-paper-500 dark:text-ink-500">{plan.period}</span>
                            </div>
                            <Link
                                href={plan.href}
                                className={
                                    plan.featured
                                        ? 'mt-6 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-95'
                                        : 'mt-6 flex items-center justify-center gap-2 rounded-2xl border border-paper-300 bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-all hover:border-accent-500/40 hover:text-accent-600 dark:border-ink-700 dark:bg-ink-900/40 dark:text-ink-100 dark:hover:text-accent-400'
                                }
                            >
                                {plan.cta} <ArrowRight size={15} />
                            </Link>
                            <ul className="mt-7 space-y-3">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2.5 text-sm text-paper-700 dark:text-ink-300">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sage-500/15 text-sage-500"><Check size={12} /></span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   9. FAQ
══════════════════════════════════════════ */
const faqs = [
    { q: 'How does the skill swap model work?', a: 'You offer a skill you know in exchange for learning a skill you want. Both parties agree on a fair exchange before sessions begin — no money needed.' },
    { q: 'Do I need to pay for sessions?', a: 'Not with the skill-swap model. If you prefer cash-based sessions, mentors can optionally set hourly rates. Most basic sessions are free through skill exchange.' },
    { q: 'How are mentors verified?', a: 'All mentors go through a portfolio review and skill assessment before being listed. We also monitor ratings and session feedback continuously.' },
    { q: 'What if I\'m not happy with a session?', a: 'We have a satisfaction guarantee. If a session doesn\'t meet expectations, report it within 24 hours and we\'ll arrange a free replacement.' },
    { q: 'Can I become a mentor?', a: 'Absolutely. Sign up, complete your profile, list your skills, and pass a short verification. Most mentors are approved within 48 hours.' },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="bg-paper-100 py-24 dark:bg-ink-900">
            <div className="mx-auto max-w-3xl px-6 lg:px-8">
                <SectionHeading eyebrow="FAQ" title="Frequently asked questions" subtitle="Everything you need to know about SkillSwap." />
                <div className="mt-12 flex flex-col gap-3">
                    {faqs.map((faq, i) => {
                        const open = openIndex === i;
                        return (
                            <div key={i} className="overflow-hidden rounded-2xl border border-paper-200 bg-white transition-colors dark:border-ink-700/60 dark:bg-ink-800/40">
                                <button
                                    onClick={() => setOpenIndex(open ? null : i)}
                                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className="text-sm font-medium text-ink-900 dark:text-ink-100">{faq.q}</span>
                                    <ChevronDown size={16} className={`shrink-0 text-paper-500 transition-transform duration-300 dark:text-ink-500 ${open ? 'rotate-180 text-accent-500 dark:text-accent-400' : ''}`} />
                                </button>
                                <div className={`grid transition-all duration-300 ease-out ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden">
                                        <p className="border-t border-paper-200 px-5 py-4 text-sm leading-relaxed text-paper-600 dark:border-ink-700/60 dark:text-ink-400">{faq.a}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   10. CTA
══════════════════════════════════════════ */
export function CTASection() {
    return (
        <section className="bg-white py-24 dark:bg-ink-950">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-[2rem] border border-accent-500/20 bg-gradient-to-br from-accent-500/15 via-accent-500/5 to-transparent p-10 text-center sm:p-16">
                    <div className="pointer-events-none absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-accent-500/20 blur-3xl" />
                    <div className="pointer-events-none absolute inset-0 bg-dots opacity-30" />
                    <div className="relative">
                        <div className="flex justify-center"><Eyebrow>Join 5,000+ learners</Eyebrow></div>
                        <h2 className="mx-auto mt-6 max-w-2xl font-display text-3xl font-black tracking-tight text-ink-900 dark:text-ink-100 sm:text-5xl">
                            Ready to start your <span className="text-gradient">skill journey?</span>
                        </h2>
                        <p className="mx-auto mt-4 max-w-md text-base text-paper-600 dark:text-ink-400">
                            Create a free account today and book your first session in minutes.
                        </p>

                        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 rounded-2xl border border-paper-300 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-paper-500 transition-colors focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 dark:border-ink-700 dark:bg-ink-900/60 dark:text-ink-100 dark:placeholder:text-ink-500"
                            />
                            <Link
                                href="/register"
                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-gradient-to-r from-accent-500 to-accent-600 px-6 py-3 text-sm font-semibold text-white shadow-glow-sm transition-all hover:shadow-glow hover:brightness-110 active:scale-95"
                            >
                                <Rocket size={16} /> Get Early Access
                            </Link>
                        </div>
                        <p className="mt-4 text-xs text-paper-500 dark:text-ink-600">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* Backwards-compatible alias */
export const NewsletterSection = CTASection;
