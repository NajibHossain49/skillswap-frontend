import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Become a Mentor' };

export default function BecomeMentorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
