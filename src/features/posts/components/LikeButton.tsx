'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Heart } from 'lucide-react';

import { useAuth } from '@/features/auth/providers/AuthProvider';
import { Button, buttonVariants } from '@/components/ui/button';
import { posts } from '@/features/posts/posts.api';
import { cn } from '@/lib/utils';

export function LikeButton({
  postId,
  likeCount,
  initialLiked,
}: {
  postId: string;
  likeCount: number;
  initialLiked: boolean;
}) {
  const pathname = usePathname();
  const { status, user } = useAuth();
  const [liked, setLiked] = useState(initialLiked);
  const [currentLikeCount, setCurrentLikeCount] = useState(likeCount);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();

  const label = liked ? 'Unlike post' : 'Like post';

  if (status === 'guest') {
    return (
      <Link
        href={`/sign-in?returnTo=${encodeURIComponent(pathname)}`}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'sm' }),
          'gap-1'
        )}
        aria-label="Sign in to like this post"
      >
        <Heart className="size-4" aria-hidden="true" />
        <span>{likeCount}</span>
        <span className="sr-only">likes</span>
      </Link>
    );
  }

  async function onClick() {
    if (!user || isSubmitting) return;

    setError(undefined);
    setIsSubmitting(true);

    try {
      const result = await posts.toggleLike(postId);
      setLiked(result.liked);
      setCurrentLikeCount(result.likeCount);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to update like state.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className={cn('gap-1', liked && 'text-rose-600 hover:text-rose-700')}
        aria-label={label}
        aria-pressed={liked}
        disabled={status === 'loading' || isSubmitting}
        onClick={() => void onClick()}
      >
        <Heart
          className="size-4"
          fill={liked ? 'currentColor' : 'none'}
          aria-hidden="true"
        />
        <span>{currentLikeCount}</span>
        <span className="sr-only">likes</span>
      </Button>
      {error && (
        <p className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
