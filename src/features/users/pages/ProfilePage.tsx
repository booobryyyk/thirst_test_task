'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { ProfileAvatar } from '@/features/users/components/ProfileAvatar';
import { PostCard } from '@/features/posts/components/PostCard';
import { Button } from '@/components/ui/button';
import { useLoadUser } from '@/features/users/hooks';
import { ProfileSkeleton } from '@/features/users/pages/ProfileSkeleton';
import { ProfileNotFound } from '@/features/users/pages/ProfileNotFound';

export function ProfilePage({ userId }: { userId: string }) {
  const {
    profile,
    posts,
    nextToken,
    error,
    isLoading,
    isLoadingMore,
    loadUser,
    loadMore,
  } = useLoadUser(userId);

  return (
    <div>
      <div className="border-b px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to feed
        </Link>
      </div>

      {isLoading && <ProfileSkeleton />}

      {!isLoading && error && (
        <ProfileError message={error} onRetry={() => void loadUser()} />
      )}

      {!isLoading && !error && !profile && <ProfileNotFound />}

      {!isLoading && !error && profile && (
        <>
          <section className="border-b px-4 py-6 sm:px-6">
            <ProfileAvatar
              name={profile.displayName}
              path={profile.avatarPath}
              size="lg"
            />
            <h1 className="mt-3 text-xl font-semibold tracking-tight">
              {profile.displayName}
            </h1>
            {profile.description ? (
              <p className="mt-2 text-sm leading-6 break-words whitespace-pre-wrap text-muted-foreground">
                {profile.description}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                No profile description yet.
              </p>
            )}
          </section>

          <section aria-labelledby="posts-heading">
            <div className="border-b px-4 py-4 sm:px-6">
              <h2 id="posts-heading" className="font-semibold">
                Posts
              </h2>
            </div>
            {posts.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-muted-foreground">
                No posts yet.
              </p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}

            {error && (
              <ProfileError
                message={error}
                onRetry={() => void loadMore()}
                compact
              />
            )}
            {nextToken && !error && (
              <div className="flex justify-center px-4 py-5">
                <Button
                  variant="outline"
                  onClick={() => void loadMore()}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? 'Loading…' : 'Load more'}
                </Button>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ProfileError({
  message,
  onRetry,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact ? 'border-b px-4 py-5 sm:px-6' : 'px-6 py-16 text-center'
      }
    >
      <p className="text-sm text-destructive">{message}</p>
      <Button className="mt-3" variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
