'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/utils';

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

const pxSizes: Record<AvatarSize, string> = {
  sm: 'w-7 h-7',
  md: 'w-9 h-9',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

/**
 * Renders a mentor's avatar image with a graceful fallback to initials.
 * Uses a plain <img> (not next/image) so avatars from any host work without
 * having to allow-list every domain in next.config.
 */
export function MentorAvatar({
  name,
  avatarUrl,
  size = 'md',
  className,
}: {
  name: string;
  avatarUrl?: string | null;
  size?: AvatarSize;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (!avatarUrl || broken) {
    return <Avatar name={name} size={size} className={className} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl}
      alt={name}
      onError={() => setBroken(true)}
      className={cn('rounded-full object-cover shrink-0', pxSizes[size], className)}
    />
  );
}
