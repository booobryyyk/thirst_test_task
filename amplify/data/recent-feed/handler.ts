import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../resource';

const FEED_PARTITION = 'GLOBAL';
const PAGE_SIZE = 20;

type DataClientEnv = {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  AWS_SESSION_TOKEN: string;
  AWS_REGION: string;
  AMPLIFY_DATA_DEFAULT_NAME: string;
};

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  process.env as unknown as DataClientEnv
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

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

function getErrorMessage(errors: readonly { message: string }[] | undefined) {
  return errors?.map((error) => error.message).join('; ');
}

export const handler: Schema['listRecentFeed']['functionHandler'] = async (
  event
) => {
  const { data, errors, nextToken } =
    await client.models.Post.listPostsByFeedPartitionAndPublishedAt(
      { feedPartition: FEED_PARTITION },
      {
        limit: PAGE_SIZE,
        nextToken: event.arguments.nextToken,
        sortDirection: 'DESC',
        selectionSet: postSelection,
        authMode: 'iam',
      }
    );

  if (errors) {
    throw new Error(getErrorMessage(errors) ?? 'Unable to load posts.');
  }

  const viewerId =
    event.identity && 'sub' in event.identity ? event.identity.sub : undefined;

  const postItems = (data ?? []).filter((post) => post.author !== null);

  const likedStates = viewerId
    ? await Promise.all(
        postItems.map(async (post) => {
          const { data: like, errors: likeErrors } =
            await client.models.UserLike.get(
              { userId: viewerId, postId: post.id },
              { authMode: 'iam' }
            );

          if (likeErrors) {
            throw new Error(
              getErrorMessage(likeErrors) ?? 'Unable to load like state.'
            );
          }

          return Boolean(like);
        })
      )
    : postItems.map(() => false);

  return {
    items: postItems.map((post, index) => ({
      id: post.id,
      content: post.content,
      publishedAt: post.publishedAt,
      author: post.author,
      likeCount: post.likeCount ?? 0,
      likedByCurrentUser: likedStates[index],
    })),
    nextToken: nextToken ?? null,
  };
};
