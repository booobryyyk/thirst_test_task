import { useCallback, useEffect, useState } from 'react';

import {
  posts as postsService,
  type PublicPost,
} from '@/features/posts/posts.api';

export function useLoadPosts() {
  const [posts, setPosts] = useState<PublicPost[]>([]);
  const [nextToken, setNextToken] = useState<string | null>();
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadInitial = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);

    try {
      const page = await postsService.listRecent();
      setPosts(page.items);
      setNextToken(page.nextToken);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const loadMore = useCallback(async () => {
    if (!nextToken) return;

    setIsLoadingMore(true);
    setError(undefined);

    try {
      const page = await postsService.listRecent(nextToken);

      setPosts((current) => [...current, ...page.items]);
      setNextToken(page.nextToken);
    } catch (cause) {
      setError(messageFrom(cause));
    } finally {
      setIsLoadingMore(false);
    }
  }, [nextToken]);

  const prependPost = useCallback((post: PublicPost) => {
    setPosts((current) => [post, ...current]);
  }, []);

  return {
    posts,
    nextToken,
    error,
    isLoading,
    isLoadingMore,
    loadInitial,
    loadMore,
    prependPost,
  };
}

function messageFrom(cause: unknown) {
  return cause instanceof Error
    ? cause.message
    : 'Something went wrong while loading the feed.';
}
