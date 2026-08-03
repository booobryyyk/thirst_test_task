import { Button } from '@/components/ui/button';
import { PostCard } from '@/features/posts/components/PostCard';
import type { PublicPost } from '@/features/posts/posts.api';
import { ProfileSkeleton } from '@/features/users/pages/ProfileSkeleton';

export function ProfilePostsList({
  posts,
  isLoading,
  isLoadingMore,
  error,
  nextToken,
  emptyMessage,
  onLoadMore,
}: {
  posts: PublicPost[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error?: string;
  nextToken?: string | null;
  emptyMessage: string;
  onLoadMore: () => void;
}) {
  if (isLoading) return <ProfileSkeleton />;

  return (
    <>
      {posts.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {emptyMessage}
        </p>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}

      {error && (
        <p className="px-6 py-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {nextToken && !error && (
        <div className="flex justify-center px-4 py-5">
          <Button
            variant="outline"
            disabled={isLoadingMore}
            onClick={onLoadMore}
          >
            {isLoadingMore ? 'Loading…' : 'Load more'}
          </Button>
        </div>
      )}
    </>
  );
}
