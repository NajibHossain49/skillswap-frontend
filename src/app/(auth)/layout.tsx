import { Zap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-900 flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col w-[480px] bg-ink-800/50 border-r border-ink-700/60 p-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute inset-0 bg-radial-glow" />

        {/* Decorative orbs */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-10 w-48 h-48 bg-sage-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex-1 flex flex-col">
          <Link href="/" className="flex items-center gap-2.5 group w-fit">
            <div className="w-10 h-10 bg-accent-500 rounded-xl flex items-center justify-center shadow-glow transition-all group-hover:shadow-glow-sm">
              <Zap size={20} className="text-white" />
            </div>
            <span className="font-display font-black text-xl text-ink-100">
              Skill<span className="text-accent-400">Swap</span>
            </span>
          </Link>

          <div className="flex-1 flex flex-col justify-center mt-16">
            <div className="space-y-8">
              <div>
                <h2 className="font-display font-black text-4xl text-ink-100 leading-tight">
                  Learn from the
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-sage-400">
                    best mentors.
                  </span>
                </h2>
                <p className="mt-4 text-ink-400 leading-relaxed">
                  Connect with expert mentors, discover new skills, and accelerate your growth
                  through personalized learning sessions.
                </p>
              </div>

              {/* Feature list */}
              <div className="space-y-4">
                {[
                  { icon: '🎯', label: 'Curated Skills Library', desc: 'Hundreds of skills across every domain' },
                  { icon: '👨‍🏫', label: 'Verified Mentors', desc: 'Learn from real practitioners' },
                  { icon: '⚡', label: 'Live Sessions', desc: 'Real-time 1-on-1 learning' },
                ].map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">{f.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-ink-200">{f.label}</p>
                      <p className="text-xs text-ink-500">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-ink-600">© 2026 SkillSwap. All rights reserved.</p>
        </div>
      </div>

      {/* Right: form area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display font-black text-lg text-ink-100">
              Skill<span className="text-accent-400">Swap</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
