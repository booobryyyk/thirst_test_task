import { amplifyClient } from '@/lib/amplify-client';
import { getCurrentUser } from 'aws-amplify/auth';
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
  likedByCurrentUser: boolean;
};

export type LikeResult = {
  liked: boolean;
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

    const { data, errors } = await client.queries.listRecentFeed(
      nextToken ? { nextToken } : {},
      { authMode }
    );

    if (errors) {
      throw new Error(formatErrorMessage(errors) ?? 'Unable to load posts.');
    }

    return {
      items: (data?.items ?? []) as PublicPost[],
      nextToken: data?.nextToken ?? null,
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

    const viewerId = await this.getViewerId();
    const items = (data ?? []).map((post) =>
      this.normalizePost(post as QueryPost)
    );

    return {
      items: await this.addViewerLikeState(items, viewerId),
      nextToken: pageToken ?? null,
    };
  }

  async listLikedByUser(
    userId: string,
    nextToken?: string | null
  ): Promise<PostsPage> {
    const client = await amplifyClient.getDataClient();
    const {
      data,
      errors,
      nextToken: pageToken,
    } = await client.models.UserLike.list({
      filter: { userId: { eq: userId } },
      limit: PAGE_SIZE,
      nextToken,
      selectionSet: [
        'post.id',
        'post.content',
        'post.publishedAt',
        'post.author.id',
        'post.author.displayName',
        'post.author.description',
        'post.author.avatarPath',
        'post.likeCount',
      ],
      authMode: 'userPool',
    });

    if (errors) {
      throw new Error(
        formatErrorMessage(errors) ?? 'Unable to load liked posts.'
      );
    }

    return {
      items: (data ?? [])
        .map((like) => like.post)
        .filter((post): post is NonNullable<typeof post> => Boolean(post))
        .map((post) => ({
          ...this.normalizePost(post as QueryPost),
          likedByCurrentUser: true,
        })),
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

  async toggleLike(postId: string): Promise<LikeResult> {
    const client = await amplifyClient.getDataClient();
    const { data, errors } = await client.mutations.toggleLike(
      { postId },
      { authMode: 'userPool' }
    );

    if (errors) {
      throw new Error(
        formatErrorMessage(errors) ?? 'Unable to update like state.'
      );
    }
    if (!data) {
      throw new Error('Unable to update like state.');
    }

    return data as LikeResult;
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
      likedByCurrentUser: false,
    };
  }

  private async getViewerId(): Promise<string | null> {
    try {
      return (await getCurrentUser()).userId;
    } catch {
      return null;
    }
  }

  private async addViewerLikeState(
    postItems: PublicPost[],
    viewerId: string | null
  ): Promise<PublicPost[]> {
    if (!viewerId || postItems.length === 0) return postItems;

    const client = await amplifyClient.getDataClient();
    const likeStates = await Promise.all(
      postItems.map(async (post) => {
        const { data, errors } = await client.models.UserLike.get(
          { userId: viewerId, postId: post.id },
          { authMode: 'userPool' }
        );

        if (errors) {
          throw new Error(
            formatErrorMessage(errors) ?? 'Unable to load like state.'
          );
        }

        return Boolean(data);
      })
    );

    return postItems.map((post, index) => ({
      ...post,
      likedByCurrentUser: likeStates[index],
    }));
  }
}

export const posts = PostsService.getInstance();
