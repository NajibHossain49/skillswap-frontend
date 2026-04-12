'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, BookOpen, Award, Globe, Heart, ArrowRight, Star, Target, Zap } from 'lucide-react';
function Skeleton({ className = '' }: { className?: string }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-ink-800/60 ${className}`}
        />
    );
}

function HeroSkeleton() {
    return (
        <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
            <Skeleton className="h-5 w-40 mx-auto mb-6" />
            <Skeleton className="h-14 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-14 w-1/2 mx-auto mb-6" />
            <Skeleton className="h-4 w-2/3 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-10" />
            <div className="flex justify-center gap-4">
                <Skeleton className="h-12 w-36 rounded-xl" />
                <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
        </section>
    );
}

function StatsSkeleton() {
    return (
        <section className="py-16 border-y border-ink-800/60">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="text-center">
                        <Skeleton className="h-10 w-20 mx-auto mb-2" />
                        <Skeleton className="h-4 w-24 mx-auto" />
                    </div>
                ))}
            </div>
        </section>
    );
}

function MissionSkeleton() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <Skeleton className="h-5 w-28 mb-5" />
                <Skeleton className="h-10 w-3/4 mb-3" />
                <Skeleton className="h-10 w-1/2 mb-6" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6 mb-8" />
                <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-6 w-6 rounded-full shrink-0" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                    ))}
                </div>
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
        </section>
    );
}

function TeamSkeleton() {
    return (
        <section className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-14">
                    <Skeleton className="h-10 w-48 mx-auto mb-3" />
                    <Skeleton className="h-4 w-64 mx-auto" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="p-6 rounded-2xl bg-ink-800/40 border border-ink-700/60">
                            <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
                            <Skeleton className="h-5 w-32 mx-auto mb-2" />
                            <Skeleton className="h-4 w-24 mx-auto mb-4" />
                            <Skeleton className="h-3 w-full mb-1" />
                            <Skeleton className="h-3 w-5/6 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ValuesSkeleton() {
    return (
        <section className="py-24 max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
                <Skeleton className="h-10 w-48 mx-auto mb-3" />
                <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="p-6 rounded-2xl bg-ink-800/30 border border-ink-700/50">
                        <Skeleton className="w-10 h-10 rounded-xl mb-4" />
                        <Skeleton className="h-5 w-32 mb-2" />
                        <Skeleton className="h-3 w-full mb-1" />
                        <Skeleton className="h-3 w-4/5" />
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ══════════════════════════════════════
   REAL CONTENT COMPONENTS
══════════════════════════════════════ */
function HeroContent() {
    return (
        <section className="pt-32 pb-20 px-6 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm font-medium mb-8">
                <Heart size={13} /> Our Story
            </div>
            <h1 className="font-display font-black text-5xl md:text-6xl text-ink-100 tracking-tight leading-none mb-6">
                We believe learning<br />
                <span className="text-accent-400">should be human</span>
            </h1>
            <p className="text-lg text-ink-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                SkillSwap was built on a simple idea — the best way to learn is from someone
                who has already done it. We connect curious learners with expert mentors
                in a community built on generosity and growth.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                    href="/register"
                    className="flex items-center gap-2 px-7 py-3.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95"
                >
                    Join the Community <ArrowRight size={16} />
                </Link>
                <Link
                    href="/skills"
                    className="flex items-center gap-2 px-7 py-3.5 border border-ink-700 text-ink-300 hover:text-ink-100 hover:border-ink-600 rounded-xl transition-all"
                >
                    <BookOpen size={15} /> Browse Skills
                </Link>
            </div>
        </section>
    );
}

function StatsContent() {
    const stats = [
        { value: '2,400+', label: 'Expert Mentors' },
        { value: '80+', label: 'Countries' },
        { value: '18k+', label: 'Sessions Done' },
        { value: '4.9★', label: 'Avg Rating' },
    ];
    return (
        <section className="py-16 border-y border-ink-800/60 bg-ink-950">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((s) => (
                    <div key={s.label} className="text-center">
                        <p className="font-display font-black text-4xl text-ink-100 mb-1">{s.value}</p>
                        <p className="text-sm text-ink-500">{s.label}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

function MissionContent() {
    return (
        <section className="py-24 bg-ink-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-xs font-medium mb-5">
                        <Target size={12} /> Our Mission
                    </div>
                    <h2 className="font-display font-black text-4xl text-ink-100 tracking-tight mb-5 leading-tight">
                        Democratizing access<br />to expertise
                    </h2>
                    <p className="text-ink-400 leading-relaxed mb-4">
                        We started SkillSwap in 2023 after realizing that the gap between
                        knowing something and finding the right person to teach it was enormous.
                        Traditional platforms were expensive, impersonal, and slow.
                    </p>
                    <p className="text-ink-400 leading-relaxed mb-8">
                        We built something different — a community where knowledge flows
                        freely, where a junior developer can learn system design from a
                        senior engineer in exchange for teaching them no-code tools.
                    </p>
                    <div className="flex flex-col gap-3">
                        {[
                            'Free skill-for-skill exchange model',
                            'Verified mentors with real experience',
                            'Sessions completed in 48+ countries',
                        ].map((point) => (
                            <div key={point} className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                                    <div className="w-2 h-2 rounded-full bg-accent-400" />
                                </div>
                                <span className="text-sm text-ink-300">{point}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Visual card */}
                <div className="relative">
                    <div className="rounded-2xl bg-ink-800/40 border border-ink-700/60 p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-500/5 rounded-full blur-2xl pointer-events-none" />
                        <Zap size={32} className="text-accent-400 mb-6" />
                        <h3 className="font-display font-black text-2xl text-ink-100 mb-3">
                            &quot;{"Knowledge shared"}<br />is {"knowledge multiplied"}.&quot;
                        </h3>
                        <p className="text-sm text-ink-500 mb-6">— SkillSwap founding principle</p>
                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-ink-700/60">
                            {[
                                { icon: Globe, label: '80+ countries', color: 'text-blue-400' },
                                { icon: Users, label: '2,400 mentors', color: 'text-green-400' },
                                { icon: Star, label: '4.9 avg rating', color: 'text-yellow-400' },
                                { icon: Award, label: '5,000 badges', color: 'text-purple-400' },
                            ].map(({ icon: Icon, label, color }) => (
                                <div key={label} className="flex items-center gap-2">
                                    <Icon size={15} className={color} />
                                    <span className="text-xs text-ink-400">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

const team = [
    { name: 'Alex Rivera', role: 'CEO & Co-founder', avatar: 'AR', bio: 'Ex-Google engineer. Passionate about making mentorship accessible to everyone.', color: 'bg-purple-500/20 text-purple-400' },
    { name: 'Priya Nair', role: 'CTO & Co-founder', avatar: 'PN', bio: 'Former Stripe engineer. Loves building products that scale and communities that grow.', color: 'bg-blue-500/20 text-blue-400' },
    { name: 'Marcus Chen', role: 'Head of Community', avatar: 'MC', bio: 'Built and grew developer communities at GitHub. 10+ years in DevRel.', color: 'bg-green-500/20 text-green-400' },
    { name: 'Sofia Garcia', role: 'Head of Design', avatar: 'SG', bio: 'Ex-Figma designer. Believes great UX is the best teacher.', color: 'bg-pink-500/20 text-pink-400' },
];

function TeamContent() {
    return (
        <section className="py-24 bg-ink-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-3">Meet the team</h2>
                    <p className="text-ink-500">The people behind SkillSwap&apos;s mission.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {team.map((member) => (
                        <div
                            key={member.name}
                            className="p-6 rounded-2xl bg-ink-800/40 border border-ink-700/60 hover:border-accent-500/30 hover:-translate-y-1 transition-all text-center"
                        >
                            <div className={`w-16 h-16 rounded-full ${member.color} flex items-center justify-center text-lg font-bold mx-auto mb-4`}>
                                {member.avatar}
                            </div>
                            <h3 className="font-semibold text-ink-200 mb-0.5">{member.name}</h3>
                            <p className="text-xs text-accent-400 mb-3">{member.role}</p>
                            <p className="text-xs text-ink-500 leading-relaxed">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

const values = [
    { icon: Heart, title: 'Community First', desc: 'Every decision we make starts with how it serves our learners and mentors.' },
    { icon: Globe, title: 'Radical Access', desc: 'Quality mentorship should be available to everyone, everywhere, in any language.' },
    { icon: Award, title: 'Quality Over Quantity', desc: 'We verify every mentor rigorously so learners never have to guess.' },
    { icon: Users, title: 'Mutual Growth', desc: 'Teaching reinforces your own knowledge. On SkillSwap, everyone grows.' },
    { icon: Zap, title: 'Move with Purpose', desc: 'We ship fast, learn from our community, and iterate relentlessly.' },
    { icon: Star, title: 'Celebrate Progress', desc: 'Every session, badge, and review is a milestone worth celebrating.' },
];

function ValuesContent() {
    return (
        <section className="py-24 bg-ink-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-14">
                    <h2 className="font-display font-black text-4xl text-ink-100 mb-3">What we stand for</h2>
                    <p className="text-ink-500 max-w-md mx-auto">The values that guide every line of code and every community decision.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map(({ icon: Icon, title, desc }) => (
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

function CTAContent() {
    return (
        <section className="py-24 bg-ink-950">
            <div className="max-w-3xl mx-auto px-6 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-400 text-sm mb-6">
                    <Zap size={13} /> Join 5,000+ learners
                </div>
                <h2 className="font-display font-black text-4xl text-ink-100 mb-4">
                    Be part of the story
                </h2>
                <p className="text-ink-400 mb-8 leading-relaxed">
                    Whether you&apos;re here to learn, teach, or both — there&apos;s a place for you in the SkillSwap community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-3.5 bg-accent-500 hover:bg-accent-400 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95">
                        Get Started Free <ArrowRight size={16} />
                    </Link>
                    <Link href="/contact" className="flex items-center justify-center gap-2 px-8 py-3.5 border border-ink-700 text-ink-300 hover:text-ink-100 hover:border-ink-600 rounded-xl transition-all">
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ══════════════════════════════════════
   MAIN ABOUT PAGE
══════════════════════════════════════ */
export default function AboutPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate data fetch
        const timer = setTimeout(() => setLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-ink-900">
            {loading ? (
                <>
                    <HeroSkeleton />
                    <StatsSkeleton />
                    <MissionSkeleton />
                    <TeamSkeleton />
                    <ValuesSkeleton />
                </>
            ) : (
                <>
                    <HeroContent />
                    <StatsContent />
                    <MissionContent />
                    <TeamContent />
                    <ValuesContent />
                    <CTAContent />
                </>
            )}
        </div>
    );
}