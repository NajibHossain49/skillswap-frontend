"use client"
import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, MapPin, Phone, Sparkles } from 'lucide-react';

const footerLinks = {
    Platform: [
        { href: '/skills', label: 'Browse Skills' },
        { href: '/sessions', label: 'Find Sessions' },
        { href: '/mentors', label: 'Become a Mentor' },
        { href: '/how-it-works', label: 'How It Works' },
    ],
    Company: [
        { href: '/about', label: 'About Us' },
        { href: '/blog', label: 'Blog' },
        { href: '/contact', label: 'Contact' },
        { href: '/careers', label: 'Careers' },
    ],
    Support: [
        { href: '/faq', label: 'FAQ' },
        { href: '/help', label: 'Help Center' },
        { href: '/privacy', label: 'Privacy Policy' },
        { href: '/terms', label: 'Terms of Service' },
    ],
};

export function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-paper-200 bg-paper-100 dark:border-ink-800/60 dark:bg-ink-950">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-accent-500/10 blur-3xl" />
            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
                    {/* Brand col */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="group mb-4 flex items-center gap-2.5">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow-sm">
                                <Sparkles size={17} className="text-white" />
                            </div>
                            <span className="font-display text-lg font-black tracking-tight text-ink-900 dark:text-ink-100">
                                Skill<span className="text-gradient">Swap</span>
                            </span>
                        </Link>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-paper-600 dark:text-ink-500">
                            Connect with expert mentors, swap skills, and accelerate your learning journey with real 1-on-1 sessions.
                        </p>
                        <div className="mb-6 flex flex-col gap-2">
                            <a href="mailto:hello@skillswap.com" className="flex items-center gap-2 text-sm text-paper-600 transition-colors hover:text-accent-500 dark:text-ink-500 dark:hover:text-accent-400">
                                <Mail size={14} /> hello@skillswap.com
                            </a>
                            <span className="flex items-center gap-2 text-sm text-paper-600 dark:text-ink-500">
                                <MapPin size={14} /> San Francisco, CA
                            </span>
                            <span className="flex items-center gap-2 text-sm text-paper-600 dark:text-ink-500">
                                <Phone size={14} /> +1 (555) 000-0000
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            {[
                                { href: 'https://github.com', icon: Github },
                                { href: 'https://twitter.com', icon: Twitter },
                                { href: 'https://linkedin.com', icon: Linkedin },
                            ].map(({ href, icon: Icon }) => (
                                <a
                                    key={href}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-paper-300 bg-white text-paper-600 transition-all hover:-translate-y-0.5 hover:border-accent-500/40 hover:text-accent-500 dark:border-ink-700/60 dark:bg-ink-800/60 dark:text-ink-500 dark:hover:text-accent-400"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="mb-4 text-sm font-semibold text-ink-900 dark:text-ink-300">{title}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-paper-600 transition-colors hover:text-ink-900 dark:text-ink-500 dark:hover:text-ink-200"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col items-center justify-between gap-3 border-t border-paper-200 py-5 dark:border-ink-800/60 sm:flex-row">
                    <p className="text-xs text-paper-500 dark:text-ink-600">
                        © {new Date().getFullYear()} SkillSwap. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-xs text-paper-500 transition-colors hover:text-ink-900 dark:text-ink-600 dark:hover:text-ink-400">Privacy</Link>
                        <Link href="/terms" className="text-xs text-paper-500 transition-colors hover:text-ink-900 dark:text-ink-600 dark:hover:text-ink-400">Terms</Link>
                        <Link href="/cookies" className="text-xs text-paper-500 transition-colors hover:text-ink-900 dark:text-ink-600 dark:hover:text-ink-400">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
