'use client';

import { useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/features/auth/providers/AuthProvider';
import { EditableProfileHeader } from '@/features/users/components/EditableProfileHeader';
import {
  ProfilePostTabs,
  type ProfilePostTab,
} from '@/features/users/components/ProfilePostTabs';
import { ProfilePostsList } from '@/features/users/components/ProfilePostsList';
import { useLoadLikedPosts, useLoadUser } from '@/features/users/hooks';
import { Button, buttonVariants } from '@/components/ui/button';
import { ProfileSkeleton } from '@/features/users/pages/ProfileSkeleton';
import { cn } from '@/lib/utils';

export function MyProfilePage() {
  const { status, user } = useAuth();

  if (status === 'loading') return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="px-6 py-16 text-center">
        <h1 className="font-semibold">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to view your posts and likes.
        </p>
        <Link
          href="/sign-in?returnTo=/me"
          className={cn(buttonVariants(), 'mt-4')}
        >
          Sign in
        </Link>
      </div>
    );
  }

  return <AuthenticatedProfile userId={user.id} />;
}

function AuthenticatedProfile({ userId }: { userId: string }) {
  const [tab, setTab] = useState<ProfilePostTab>('posts');
  const {
    profile,
    posts: authoredPosts,
    nextToken: authoredNextToken,
    error: authoredError,
    isLoading: isLoadingProfile,
    isLoadingMore: isLoadingMoreAuthored,
    loadMore: loadMoreAuthored,
    updateAvatarPath,
  } = useLoadUser(userId);
  const liked = useLoadLikedPosts(userId);

  if (isLoadingProfile) return <ProfileSkeleton />;

  if (!profile) {
    return (
      <div className="px-6 py-16 text-center">
        <h1 className="font-semibold">Profile unavailable</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Try signing out and back in to restore your profile.
        </p>
      </div>
    );
  }

  const isPostsTab = tab === 'posts';
  const activePosts = isPostsTab ? authoredPosts : liked.posts;
  const activeError = isPostsTab ? authoredError : liked.error;
  const activeNextToken = isPostsTab ? authoredNextToken : liked.nextToken;
  const isLoadingMore = isPostsTab
    ? isLoadingMoreAuthored
    : liked.isLoadingMore;
  const loadMore = isPostsTab ? loadMoreAuthored : liked.loadMore;

  return (
    <div>
      <EditableProfileHeader
        userId={userId}
        profile={profile}
        onAvatarUpdated={updateAvatarPath}
      />

      <ProfilePostTabs value={tab} onChange={setTab} />

      <ProfilePostsList
        posts={activePosts}
        isLoading={tab === 'likes' ? liked.isLoading : false}
        isLoadingMore={isLoadingMore}
        error={activeError}
        nextToken={activeNextToken}
        emptyMessage={
          isPostsTab ? 'You have not posted yet.' : 'No liked posts yet.'
        }
        onLoadMore={() => void loadMore()}
      />
    </div>
  );
}
