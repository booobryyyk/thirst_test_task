'use client';

import { useEffect, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { amplifyClient } from '@/lib/amplify-client';

type Props = {
  name: string;
  path?: string | null;
  size?: 'sm' | 'default' | 'lg';
  className?: string;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
}

export function ProfileAvatar({
  name,
  path,
  size = 'default',
  className,
}: Props) {
  const [resolvedAvatar, setResolvedAvatar] = useState<{
    path: string;
    url: string;
  }>();

  useEffect(() => {
    let mounted = true;

    if (!path)
      return () => {
        mounted = false;
      };

    void amplifyClient
      .getStorageUrl(path)
      .then((url) => {
        if (mounted) setResolvedAvatar({ path, url });
      })
      .catch(() => {
        // A missing avatar should never block public profile rendering.
      });

    return () => {
      mounted = false;
    };
  }, [path]);

  const url =
    resolvedAvatar && resolvedAvatar.path === path
      ? resolvedAvatar.url
      : undefined;

  return (
    <Avatar size={size} className={className}>
      {url && <AvatarImage src={url} alt={`${name}'s avatar`} />}
      <AvatarFallback>{initials(name) || '?'}</AvatarFallback>
    </Avatar>
  );
}
