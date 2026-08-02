'use client';

import { SubmitEvent, useRef, useState } from 'react';
import Link from 'next/link';

import { useAuth } from '@/features/auth/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { posts, type PublicPost } from '@/features/posts/posts.api';

const MAX_POST_LENGTH = 500;

export function CreatePostForm({
  onCreated,
}: {
  onCreated: (post: PublicPost) => void;
}) {
  const { status, user } = useAuth();

  const [content, setContent] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const authorId = user?.id;

  if (status === 'loading') {
    return <div className="h-29 animate-pulse border-b bg-muted/40" />;
  }

  if (!authorId) {
    return (
      <div className="border-b px-4 py-4 sm:px-6">
        <p className="text-sm text-muted-foreground">
          <Link
            href="/sign-in?returnTo=/"
            className="font-medium text-foreground hover:underline"
          >
            Sign in
          </Link>{' '}
          to share something with the community.
        </p>
      </div>
    );
  }

  const characterCount = content.length;

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    const currentAuthorId = user?.id;

    if (!currentAuthorId) return;

    const trimmedContent = content.trim();

    setError(undefined);

    if (!trimmedContent) {
      setError('Write something before publishing.');
      textareaRef.current?.focus();
      return;
    }

    if (trimmedContent.length > MAX_POST_LENGTH) {
      setError(`Posts can be up to ${MAX_POST_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const post = await posts.create(trimmedContent, currentAuthorId);
      setContent('');
      onCreated(post);
      textareaRef.current?.focus();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : 'Unable to publish post.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="border-b px-4 py-4 sm:px-6" onSubmit={onSubmit} noValidate>
      <label className="sr-only" htmlFor="new-post">
        What’s on your mind?
      </label>

      <Textarea
        ref={textareaRef}
        id="new-post"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="What’s on your mind?"
        maxLength={MAX_POST_LENGTH + 1}
        disabled={isSubmitting}
        className="min-h-24 resize-y"
      />

      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between gap-3">
        <span
          className={`text-xs ${
            characterCount > MAX_POST_LENGTH
              ? 'text-destructive'
              : 'text-muted-foreground'
          }`}
        >
          {characterCount}/{MAX_POST_LENGTH}
        </span>

        <Button type="submit" disabled={isSubmitting || !content.trim()}>
          {isSubmitting ? 'Publishing…' : 'Publish'}
        </Button>
      </div>
    </form>
  );
}
