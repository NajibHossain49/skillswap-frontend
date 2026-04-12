import Link from 'next/link';
import { Zap, Github, Twitter, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

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
        <footer className="bg-ink-950 border-t border-ink-800/60">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main grid */}
                <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                    {/* Brand col */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2.5 group mb-4">
                            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                                <Zap size={16} className="text-white" />
                            </div>
                            <span className="font-display font-black text-lg text-ink-100 tracking-tight">
                                Skill<span className="text-accent-400">Swap</span>
                            </span>
                        </Link>
                        <p className="text-sm text-ink-500 leading-relaxed max-w-xs mb-6">
                            Connect with expert mentors, swap skills, and accelerate your learning journey with real 1-on-1 sessions.
                        </p>
                        {/* Contact */}
                        <div className="flex flex-col gap-2 mb-6">
                            <a href="mailto:hello@skillswap.com" className="flex items-center gap-2 text-sm text-ink-500 hover:text-accent-400 transition-colors">
                                <Mail size={14} /> hello@skillswap.com
                            </a>
                            <span className="flex items-center gap-2 text-sm text-ink-500">
                                <MapPin size={14} /> San Francisco, CA
                            </span>
                            <span className="flex items-center gap-2 text-sm text-ink-500">
                                <Phone size={14} /> +1 (555) 000-0000
                            </span>
                        </div>
                        {/* Social */}
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
                                    className="w-9 h-9 rounded-lg bg-ink-800/60 border border-ink-700/60 flex items-center justify-center text-ink-500 hover:text-accent-400 hover:border-accent-500/40 transition-all"
                                >
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link cols */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="text-sm font-semibold text-ink-300 mb-4">{title}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {links.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-ink-500 hover:text-ink-200 transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div className="py-5 border-t border-ink-800/60 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-ink-600">
                        © {new Date().getFullYear()} SkillSwap. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <Link href="/privacy" className="text-xs text-ink-600 hover:text-ink-400 transition-colors">Privacy</Link>
                        <Link href="/terms" className="text-xs text-ink-600 hover:text-ink-400 transition-colors">Terms</Link>
                        <Link href="/cookies" className="text-xs text-ink-600 hover:text-ink-400 transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}