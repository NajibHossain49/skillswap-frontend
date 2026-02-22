import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: {
    default: 'SkillSwap — Peer-to-Peer Skill Exchange',
    template: '%s | SkillSwap',
  },
  description: 'Connect with mentors, learn new skills, and grow together.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body antialiased">
        <Providers>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1E1E2D',
                border: '1px solid #303045',
                color: '#E8E8EE',
                fontFamily: 'var(--font-dm-sans)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
