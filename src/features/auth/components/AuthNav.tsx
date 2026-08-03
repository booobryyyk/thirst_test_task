'use client';

import Link from 'next/link';
import { LogOut, UserRound } from 'lucide-react';

import { Button, buttonVariants } from '@/components/ui/button';
import { useAuth } from '@/features/auth/providers/AuthProvider';
import { cn } from '@/lib/utils';

export function AuthNav({ compact = false }: { compact?: boolean }) {
  const { status, user, signOut } = useAuth();

  if (status === 'loading') {
    return (
      <div
        className={
          compact
            ? 'h-8 w-24 animate-pulse rounded-md bg-muted'
            : 'h-20 animate-pulse rounded-xl bg-muted'
        }
      />
    );
  }

  if (status === 'authenticated' && user) {
    return (
      <div
        className={cn(
          compact ? 'flex items-center gap-2' : 'rounded-xl border bg-card p-3'
        )}
      >
        {!compact && (
          <Link
            href="/me"
            className="mb-3 flex items-center gap-2 text-sm font-medium hover:underline"
          >
            <UserRound className="size-4" aria-hidden="true" />
            <span className="truncate">{user.displayName}</span>
          </Link>
        )}

        {compact && (
          <Link
            href="/me"
            className={buttonVariants({ variant: 'outline', size: 'icon-sm' })}
            aria-label="Your profile"
          >
            <UserRound className="size-4" aria-hidden="true" />
          </Link>
        )}

        <Button
          className={compact ? 'h-8 px-2 text-xs' : 'w-full'}
          variant="outline"
          size={compact ? 'sm' : 'default'}
          onClick={() => void signOut()}
        >
          <LogOut className="size-4" aria-hidden="true" />
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div
      className={
        compact ? 'flex items-center gap-2' : 'rounded-xl border bg-card p-3'
      }
    >
      {!compact && (
        <p className="mb-3 text-sm text-muted-foreground">
          Join the conversation.
        </p>
      )}

      <div className={cn('flex gap-2', !compact && 'flex-col')}>
        <Link
          href="/sign-in"
          className={cn(
            buttonVariants({ variant: 'outline', size: 'sm' }),
            !compact && 'w-full'
          )}
        >
          Sign in
        </Link>

        <Link
          href="/sign-up"
          className={cn(buttonVariants({ size: 'sm' }), !compact && 'w-full')}
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
