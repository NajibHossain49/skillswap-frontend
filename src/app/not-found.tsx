import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="font-display font-black text-[120px] leading-none text-ink-800 select-none">404</div>
        <div>
          <h1 className="font-display font-black text-2xl text-ink-100">Page not found</h1>
          <p className="text-ink-500 mt-2">The page you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
