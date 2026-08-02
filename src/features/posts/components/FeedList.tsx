'use client';

import { Button } from '@/components/ui/button';
import { CreatePostForm } from '@/features/posts/components/CreatePostForm';
import { EmptyFeed } from '@/features/posts/components/EmptyFeedFallback';
import { ErrorFeedCard } from '@/features/posts/components/ErrorFeedCard';
import { PostCard } from '@/features/posts/components/PostCard';
import { PostListSkeleton } from '@/features/posts/components/PostListSkeleton';
import { useLoadPosts } from '@/features/posts/hooks';

export function FeedList() {
  const {
    posts,
    nextToken,
    error,
    isLoading,
    isLoadingMore,
    loadInitial,
    loadMore,
    prependPost,
  } = useLoadPosts();

  if (isLoading) {
    return <PostListSkeleton />;
  }

  const shouldShowPosts = posts.length > 0;

  return (
    <div>
      <CreatePostForm onCreated={prependPost} />

      {shouldShowPosts
        ? posts.map((post) => <PostCard key={post.id} post={post} />)
        : !error && <EmptyFeed />}

      {error && (
        <ErrorFeedCard
          message={error}
          onRetry={() => void (posts.length > 0 ? loadMore() : loadInitial())}
          compact={posts.length > 0}
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

      {!nextToken && (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          You’re all caught up.
        </p>
      )}
    </div>
  );
}
