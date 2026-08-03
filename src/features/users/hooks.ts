import { useCallback, useEffect, useState } from 'react';

import {
  posts as postsService,
  type PublicPost,
} from '@/features/posts/posts.api';
import { authors, type PublicAuthor } from '@/features/users/users.api';

export function useLoadUser(userId: string) {
  const [profile, setProfile] = useState<PublicAuthor | null>();
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [nextToken, setNextToken] = useState<string | null>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const author = await authors.getPublicAuthor(userId);
      setProfile(author);
      if (!author) return;

      const page = await postsService.listByAuthor(userId);
      setPosts(page.items);
      setNextToken(page.nextToken);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const loadMore = useCallback(async () => {
    if (!nextToken) return;

    setIsLoadingMore(true);
    setError(undefined);

    try {
      const page = await postsService.listByAuthor(userId, nextToken);
      setPosts((current) => [...current, ...page.items]);
      setNextToken(page.nextToken);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextToken, userId]);

  return {
    profile,
    posts,
    nextToken,
    error,
    isLoading,
    isLoadingMore,
    loadUser,
    loadMore,
    updateAvatarPath: (avatarPath: string) => {
      setProfile((current) => (current ? { ...current, avatarPath } : current));
      setPosts((current) =>
        current.map((post) =>
          post.author.id === userId
            ? { ...post, author: { ...post.author, avatarPath } }
            : post
        )
      );
    },
  };
}

export function useLoadLikedPosts(userId: string) {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [nextToken, setNextToken] = useState<string | null>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const page = await postsService.listLikedByUser(userId);
      setPosts(page.items);
      setNextToken(page.nextToken);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (!nextToken) return;

    setIsLoadingMore(true);
    setError(undefined);

    try {
      const page = await postsService.listLikedByUser(userId, nextToken);
      setPosts((current) => [...current, ...page.items]);
      setNextToken(page.nextToken);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextToken, userId]);

  return {
    posts,
    nextToken,
    error,
    isLoading,
    isLoadingMore,
    loadInitial,
    loadMore,
  };
}

function messageFrom(cause: unknown) {
  return cause instanceof Error
    ? cause.message
    : 'Something went wrong while loading this profile.';
}
