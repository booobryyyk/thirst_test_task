import { amplifyClient } from '@/lib/amplify-client';
import type { PublicAuthor } from '@/features/users/users.api';
import { formatErrorMessage } from '@/lib/utils';

export const FEED_PARTITION = 'GLOBAL';
export const PAGE_SIZE = 20;

export type PublicPost = {
  id: string;
  content: string;
  publishedAt: string;
  author: PublicAuthor;
  likeCount: number;
};

export type PostsPage = {
  items: PublicPost[];
  nextToken: string | null;
};

const postSelection = [
  'id',
  'content',
  'publishedAt',
  'author.id',
  'author.displayName',
  'author.description',
  'author.avatarPath',
  'likeCount',
] as const;

type QueryPost = {
  id: string;
  content: string;
  publishedAt: string;
  author?: PublicAuthor | null;
  likeCount?: number | null;
};

/** Shared service for post and public-profile data operations. */
export class PostsService {
  private static instance: PostsService | undefined;

  private constructor() {}

  static getInstance(): PostsService {
    return (this.instance ??= new PostsService());
  }

  async listRecent(nextToken?: string | null): Promise<PostsPage> {
    const client = await amplifyClient.getDataClient();
    const authMode = await amplifyClient.getReadAuthMode();

    const {
      data,
      errors,
      nextToken: pageToken,
    } = await client.models.Post.listPostsByFeedPartitionAndPublishedAt(
      { feedPartition: FEED_PARTITION },
      {
        limit: PAGE_SIZE,
        nextToken,
        sortDirection: 'DESC',
        selectionSet: postSelection,
        authMode,
      }
    );

    if (errors) {
      throw new Error(formatErrorMessage(errors) ?? 'Unable to load posts.');
    }

    return {
      items: (data ?? []).map((post) => this.normalizePost(post as QueryPost)),
      nextToken: pageToken ?? null,
    };
  }

  async listByAuthor(
    authorId: string,
    nextToken?: string | null
  ): Promise<PostsPage> {
    const client = await amplifyClient.getDataClient();
    const authMode = await amplifyClient.getReadAuthMode();

    const {
      data,
      errors,
      nextToken: pageToken,
    } = await client.models.Post.listPostsByAuthorIdAndPublishedAt(
      { authorId },
      {
        limit: PAGE_SIZE,
        nextToken,
        sortDirection: 'DESC',
        selectionSet: postSelection,
        authMode,
      }
    );

    if (errors)
      throw new Error(formatErrorMessage(errors) ?? 'Unable to load posts.');

    return {
      items: (data ?? []).map((post) => this.normalizePost(post as QueryPost)),
      nextToken: pageToken ?? null,
    };
  }

  async create(content: string, authorId: string): Promise<PublicPost> {
    const client = await amplifyClient.getDataClient();

    const { data, errors } = await client.models.Post.create(
      {
        content,
        authorId,
        feedPartition: FEED_PARTITION,
        publishedAt: new Date().toISOString(),
        likeCount: 0,
      },
      {
        selectionSet: postSelection,
        authMode: 'userPool',
      }
    );

    if (errors) {
      throw new Error(formatErrorMessage(errors) ?? 'Unable to publish post.');
    }

    if (!data) {
      throw new Error('Unable to publish post.');
    }

    return this.normalizePost(data as QueryPost);
  }

  private normalizePost(post: QueryPost): PublicPost {
    if (!post.author) {
      throw new Error('Unable to load the author for this post.');
    }

    return {
      id: post.id,
      content: post.content,
      publishedAt: post.publishedAt,
      author: post.author,
      likeCount: post.likeCount ?? 0,
    };
  }
}

export const posts = PostsService.getInstance();
