import { Sparkles, ArrowLeft, ShieldCheck, Zap, Star } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-paper-100 dark:bg-ink-900">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-accent-500/20 blur-[120px] animate-aurora dark:bg-accent-500/25" />
        <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-sage-500/15 blur-[100px] animate-float-slow" />
        <div className="absolute -right-20 top-1/3 h-72 w-72 rounded-full bg-accent-400/10 blur-[100px] animate-float" />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-60" />

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8">
        <Link href="/" className="group inline-flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-400 to-accent-600 shadow-glow-sm transition-transform group-hover:scale-110">
            <Sparkles size={17} className="text-white" />
          </div>
          <span className="font-display text-lg font-black tracking-tight text-ink-900 dark:text-ink-100">
            Skill<span className="text-gradient">Swap</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="hidden items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-medium text-paper-600 transition-colors hover:text-ink-900 dark:text-ink-400 dark:hover:text-ink-100 sm:inline-flex"
          >
            <ArrowLeft size={15} /> Back home
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Centered card */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-5 py-8">
        <div className="w-full max-w-md animate-scale-in">
          <div className="border-gradient rounded-3xl">
            <div className="glass-panel rounded-3xl p-7 shadow-soft-lg dark:shadow-glow sm:p-9">
              {children}
            </div>
          </div>

          {/* Trust strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-paper-500 dark:text-ink-500">
            <span className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-sage-500" /> Secure &amp; encrypted</span>
            <span className="inline-flex items-center gap-1.5"><Zap size={13} className="text-accent-500" /> Free to start</span>
            <span className="inline-flex items-center gap-1.5"><Star size={13} className="fill-amber text-amber" /> 4.9/5 rated</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-5 py-5 text-center text-xs text-paper-500 dark:text-ink-600">
        © {new Date().getFullYear()} SkillSwap. All rights reserved.
      </footer>
    </div>
  );
}
