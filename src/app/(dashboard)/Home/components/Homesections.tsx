'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
    ArrowRight, Star, Users, BookOpen, Zap, Shield,
    Clock, Award, ChevronDown, TrendingUp, Globe, Heart,
    CheckCircle, Play,
} from 'lucide-react';

/* ══════════════════════════════════════════
   1. HERO SECTION
══════════════════════════════════════════ */
export function HeroSection() {
    return (
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-ink-900">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            {/* Grid pattern */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(#a78bfa 1px, transparent 1px), linear-gradient(90deg, #a78bfa 1px, transparent 1px)',
                    backgroundSize: '60px 60px',
                }}
            />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-8 text-center pt-24 pb-16">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-8">
                    <Zap size={13} />
                    Skill exchange platform for developers
                </div>

                <h1 className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-ink-100 tracking-tight leading-none mb-6">
                    Learn faster by<br />
                    <span className="text-accent-400">swapping skills</span>
                </h1>

                <p className="text-lg text-ink-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                    Connect with expert mentors for 1-on-1 sessions. Teach what you know, learn what you need.
                    No subscriptions — just skill for skill.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                    <Link
                        href="/register"
                        className="flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg"
                    >
                        Start Learning Free <ArrowRight size={16} />
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="flex items-center gap-2 px-7 py-3.5 border border-ink-700 text-ink-300 hover:text-ink-100 hover:border-ink-600 rounded-xl transition-all"
                    >
                        <Play size={15} /> See how it works
                    </Link>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center justify-center gap-8 text-center">
                    {[
                        { value: '2,400+', label: 'Active Mentors' },
                        { value: '18k+', label: 'Sessions Completed' },
                        { value: '95%', label: 'Satisfaction Rate' },
                        { value: '120+', label: 'Skills Available' },
                    ].map((s) => (
                        <div key={s.label}>
                            <p className="text-2xl font-black text-ink-100 font-display">{s.value}</p>
                            <p className="text-xs text-ink-500 mt-0.5">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-ink-600">
                <span className="text-xs">Scroll to explore</span>
                <ChevronDown size={16} className="animate-bounce" />
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   2. HOW IT WORKS
══════════════════════════════════════════ */
export function HowItWorksSection() {
    const steps = [
        { icon: BookOpen, step: '01', title: 'Browse Skills', desc: 'Explore hundreds of skills across development, design, data, and more.' },
        { icon: Users, step: '02', title: 'Match with a Mentor', desc: 'Find the perfect mentor based on expertise, availability, and reviews.' },
        { icon: Clock, step: '03', title: 'Book a Session', desc: 'Schedule a 1-on-1 session at a time that works for you.' },
        { icon: Award, step: '04', title: 'Learn & Grow', desc: 'Complete the session, leave a review, and level up your career.' },
    ];

    return (
        <section className="py-24 bg-ink-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-3">How SkillSwap works</h2>
                    <p className="text-ink-500 max-w-md mx-auto">Four simple steps to start learning from the best.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {steps.map(({ icon: Icon, step, title, desc }) => (
                        <div key={step} className="relative p-6 rounded-2xl bg-ink-800/40 border border-ink-700/60 hover:border-accent-500/30 transition-all group">
                            <div className="absolute top-4 right-4 font-display font-black text-4xl text-ink-800 group-hover:text-ink-700 transition-colors">
                                {step}
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                                <Icon size={20} className="text-accent-400" />
                            </div>
                            <h3 className="font-semibold text-ink-200 mb-2">{title}</h3>
                            <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   3. FEATURED SKILLS (Card Grid)
══════════════════════════════════════════ */
const skills = [
    { title: 'React & Next.js', category: 'Frontend', mentors: 48, rating: 4.9, price: 'Free Swap', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { title: 'Python & ML', category: 'Data Science', mentors: 36, rating: 4.8, price: 'Free Swap', color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { title: 'UI/UX Design', category: 'Design', mentors: 29, rating: 4.9, price: 'Free Swap', color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { title: 'Node.js & APIs', category: 'Backend', mentors: 41, rating: 4.7, price: 'Free Swap', color: 'text-green-400', bg: 'bg-green-500/10' },
    { title: 'DevOps & CI/CD', category: 'Infrastructure', mentors: 22, rating: 4.8, price: 'Free Swap', color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { title: 'iOS Development', category: 'Mobile', mentors: 17, rating: 4.6, price: 'Free Swap', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { title: 'Blockchain & Web3', category: 'Emerging', mentors: 14, rating: 4.7, price: 'Free Swap', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { title: 'System Design', category: 'Architecture', mentors: 31, rating: 4.9, price: 'Free Swap', color: 'text-red-400', bg: 'bg-red-500/10' },
];

export function FeaturedSkillsSection() {
    return (
        <section className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="font-display font-black text-4xl text-ink-100 mb-2">Popular skills</h2>
                        <p className="text-ink-500">Explore top-rated skills with verified mentors</p>
                    </div>
                    <Link href="/skills" className="hidden sm:flex items-center gap-1.5 text-sm text-accent-400 hover:text-accent-300 transition-colors">
                        View all skills <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {skills.map((skill) => (
                        <Link
                            key={skill.title}
                            href="/skills"
                            className="group p-5 rounded-2xl bg-ink-800/40 border border-ink-700/60 hover:border-accent-500/30 hover:-translate-y-1 transition-all duration-200 flex flex-col"
                        >
                            <div className={`w-10 h-10 rounded-xl ${skill.bg} flex items-center justify-center mb-4`}>
                                <BookOpen size={18} className={skill.color} />
                            </div>
                            <div className="flex-1">
                                <span className="text-xs text-ink-600 uppercase tracking-wider">{skill.category}</span>
                                <h3 className="font-semibold text-ink-200 mt-1 mb-3 group-hover:text-accent-400 transition-colors">{skill.title}</h3>
                            </div>
                            <div className="flex items-center justify-between text-xs text-ink-500">
                                <span className="flex items-center gap-1"><Users size={11} /> {skill.mentors} mentors</span>
                                <span className="flex items-center gap-1"><Star size={11} className="text-yellow-400 fill-yellow-400" /> {skill.rating}</span>
                            </div>
                            <div className="mt-3 pt-3 border-t border-ink-700/60">
                                <span className="text-xs font-medium text-accent-400">{skill.price}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   4. FEATURES / WHY SKILLSWAP
══════════════════════════════════════════ */
export function FeaturesSection() {
    const features = [
        { icon: Shield, title: 'Verified Mentors', desc: 'Every mentor is vetted for expertise. Only the best teach on SkillSwap.' },
        { icon: Clock, title: 'Flexible Scheduling', desc: 'Book sessions that fit your calendar. Timezone-aware and fully async-friendly.' },
        { icon: Globe, title: 'Global Community', desc: 'Connect with mentors and learners from 80+ countries worldwide.' },
        { icon: Heart, title: 'Skill-for-Skill Model', desc: 'No cash needed. Trade your expertise for someone else\'s — everyone wins.' },
        { icon: TrendingUp, title: 'Track Progress', desc: 'Dashboard insights, session history, and skill milestones all in one place.' },
        { icon: Award, title: 'Earn Recognition', desc: 'Complete sessions, earn badges, and build a verifiable skill portfolio.' },
    ];

    return (
        <section className="py-24 bg-ink-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-3">Why choose SkillSwap?</h2>
                    <p className="text-ink-500 max-w-md mx-auto">Everything you need to learn, teach, and grow your career.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="p-6 rounded-2xl bg-ink-800/30 border border-ink-700/50 hover:bg-ink-800/50 transition-all">
                            <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center mb-4">
                                <Icon size={20} className="text-accent-400" />
                            </div>
                            <h3 className="font-semibold text-ink-200 mb-2">{title}</h3>
                            <p className="text-sm text-ink-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   5. STATISTICS SECTION
══════════════════════════════════════════ */
export function StatsSection() {
    const stats = [
        { value: '2,400+', label: 'Expert Mentors', icon: Users },
        { value: '18,000+', label: 'Sessions Completed', icon: CheckCircle },
        { value: '120+', label: 'Skill Categories', icon: BookOpen },
        { value: '4.9★', label: 'Average Rating', icon: Star },
    ];

    return (
        <section className="py-20 bg-accent-500/5 border-y border-accent-500/10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map(({ value, label, icon: Icon }) => (
                        <div key={label} className="text-center">
                            <div className="w-12 h-12 rounded-2xl bg-accent-500/10 border border-accent-500/20 flex items-center justify-center mx-auto mb-4">
                                <Icon size={22} className="text-accent-400" />
                            </div>
                            <p className="font-display font-black text-3xl text-ink-100 mb-1">{value}</p>
                            <p className="text-sm text-ink-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   6. TESTIMONIALS
══════════════════════════════════════════ */
const testimonials = [
    {
        name: 'Sarah Chen', role: 'Frontend Developer', avatar: 'SC',
        text: 'SkillSwap helped me level up my React skills in just 3 sessions. My mentor was incredibly knowledgeable and patient.',
        rating: 5,
    },
    {
        name: 'Marcus Rivera', role: 'Data Scientist', avatar: 'MR',
        text: 'I traded my Python expertise for UI/UX mentoring. Best decision I made — the swap model is brilliant.',
        rating: 5,
    },
    {
        name: 'Priya Nair', role: 'Full Stack Engineer', avatar: 'PN',
        text: 'Found an amazing mentor for system design prep. Landed my dream job at a FAANG after just 4 sessions!',
        rating: 5,
    },
    {
        name: 'James Okafor', role: 'DevOps Engineer', avatar: 'JO',
        text: 'The quality of mentors here is exceptional. Every session is structured, actionable, and worth every minute.',
        rating: 5,
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-3">Loved by learners</h2>
                    <p className="text-ink-500">Real stories from our community</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {testimonials.map((t) => (
                        <div key={t.name} className="p-6 rounded-2xl bg-ink-800/40 border border-ink-700/60 flex flex-col">
                            <div className="flex gap-0.5 mb-4">
                                {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} size={13} className="text-yellow-400 fill-yellow-400" />
                                ))}
                            </div>
                            <p className="text-sm text-ink-400 leading-relaxed flex-1 mb-5">"{t.text}"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-accent-500/20 flex items-center justify-center text-xs font-bold text-accent-400">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-ink-200">{t.name}</p>
                                    <p className="text-xs text-ink-600">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   7. FAQ SECTION
══════════════════════════════════════════ */
const faqs = [
    { q: 'How does the skill swap model work?', a: 'You offer a skill you know in exchange for learning a skill you want. Both parties agree on a fair exchange before sessions begin — no money needed.' },
    { q: 'Do I need to pay for sessions?', a: 'Not with the skill-swap model. If you prefer cash-based sessions, mentors can optionally set hourly rates. Most basic sessions are free through skill exchange.' },
    { q: 'How are mentors verified?', a: 'All mentors go through a portfolio review and skill assessment before being listed. We also monitor ratings and session feedback continuously.' },
    { q: 'What if I\'m not happy with a session?', a: 'We have a satisfaction guarantee. If a session doesn\'t meet expectations, report it within 24 hours and we\'ll arrange a free replacement.' },
    { q: 'Can I become a mentor?', a: 'Absolutely. Sign up, complete your profile, list your skills, and pass a short verification. Most mentors are approved within 48 hours.' },
];

export function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-24 bg-ink-900">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-3">Frequently asked questions</h2>
                    <p className="text-ink-500">Everything you need to know about SkillSwap.</p>
                </div>
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, i) => (
                        <div
                            key={i}
                            className="rounded-xl border border-ink-700/60 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left bg-ink-800/40 hover:bg-ink-800/60 transition-all"
                            >
                                <span className="text-sm font-medium text-ink-200">{faq.q}</span>
                                <ChevronDown
                                    size={16}
                                    className={`text-ink-500 transition-transform duration-200 shrink-0 ml-4 ${openIndex === i ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {openIndex === i && (
                                <div className="px-5 py-4 bg-ink-800/20 border-t border-ink-700/60">
                                    <p className="text-sm text-ink-500 leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════════
   8. NEWSLETTER / CTA SECTION
══════════════════════════════════════════ */
export function NewsletterSection() {
    return (
        <section className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="relative rounded-3xl bg-gradient-to-br from-accent-500/20 via-accent-500/5 to-transparent border border-accent-500/20 p-12 text-center overflow-hidden">
                    {/* Glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm mb-6">
                            <Zap size={13} /> Join 5,000+ learners
                        </div>
                        <h2 className="font-display font-black text-4xl text-ink-100 mb-4">
                            Ready to start your skill journey?
                        </h2>
                        <p className="text-ink-400 max-w-md mx-auto mb-8">
                            Create a free account today and book your first session in minutes.
                        </p>

                        {/* Email subscribe */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-8">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl bg-ink-800/60 border border-ink-700 text-ink-200 placeholder-ink-600 text-sm focus:outline-none focus:border-accent-500/60 transition-colors"
                            />
                            <button className="px-6 py-3 bg-accent-500 hover:bg-accent-400 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                                Get Early Access
                            </button>
                        </div>

                        <Link
                            href="/register"
                            className="inline-flex items-center gap-2 px-8 py-3.5 bg-ink-100 hover:bg-white text-ink-900 font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                        >
                            Create Free Account <ArrowRight size={16} />
                        </Link>

                        <p className="text-xs text-ink-600 mt-4">No credit card required · Cancel anytime</p>
                    </div>
                </div>
            </div>
        </section>
    );
}