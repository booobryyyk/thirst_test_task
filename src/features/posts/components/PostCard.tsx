import Link from 'next/link';
import { Heart } from 'lucide-react';

import { ProfileAvatar } from '@/features/users/components/ProfileAvatar';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import type { PublicPost } from '@/features/posts/posts.api';
import { formatPostDate } from '@/features/posts/utils';

export function PostCard({ post }: { post: PublicPost }) {
  const author = post.author;
  const authorName = author.displayName;

  return (
    <article className="px-4 py-3 sm:px-6">
      <Card size="sm">
        <CardHeader className="flex flex-row gap-3">
          <Link
            href={`/users/${author.id}`}
            aria-label={`View ${authorName}'s profile`}
          >
            <ProfileAvatar name={authorName} path={author.avatarPath} />
          </Link>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
              <Link
                href={`/users/${author.id}`}
                className="font-semibold hover:underline"
              >
                {authorName}
              </Link>

              <time
                className="text-muted-foreground"
                dateTime={post.publishedAt}
              >
                {formatPostDate(post.publishedAt)}
              </time>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-[0.9375rem] leading-6 break-words whitespace-pre-wrap">
            {post.content}
          </p>
        </CardContent>

        <CardFooter className="gap-1 text-muted-foreground">
          <Heart className="size-4" aria-hidden="true" />

          <span>{post.likeCount}</span>

          <span className="sr-only">likes</span>
        </CardFooter>
      </Card>
    </article>
  );
}
