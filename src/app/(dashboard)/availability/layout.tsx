import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Availability' };

export default function AvailabilityLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
