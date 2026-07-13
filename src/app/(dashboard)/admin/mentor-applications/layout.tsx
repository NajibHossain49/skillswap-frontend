import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mentor Applications' };

export default function MentorApplicationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
