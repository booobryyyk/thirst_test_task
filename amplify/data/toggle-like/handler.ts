import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../resource';

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

function getErrorMessage(errors: readonly { message: string }[] | undefined) {
  return errors?.map((error) => error.message).join('; ');
}

export const handler: Schema['toggleLike']['functionHandler'] = async (
  event
) => {
  const userId =
    event.identity && 'sub' in event.identity ? event.identity.sub : undefined;

  if (!userId) {
    throw new Error('You must be signed in to like a post.');
  }

  const { postId } = event.arguments;
  const { data: post, errors: postErrors } = await client.models.Post.get(
    { id: postId },
    { authMode: 'iam' }
  );

  if (postErrors) {
    throw new Error(getErrorMessage(postErrors) ?? 'Unable to load post.');
  }
  if (!post) {
    throw new Error('This post no longer exists.');
  }

  const { data: existingLike, errors: existingLikeErrors } =
    await client.models.UserLike.get({ userId, postId }, { authMode: 'iam' });

  if (existingLikeErrors) {
    throw new Error(
      getErrorMessage(existingLikeErrors) ?? 'Unable to load like state.'
    );
  }

  const liked = !existingLike;
  const likeOperation = liked
    ? client.models.UserLike.create({ userId, postId }, { authMode: 'iam' })
    : client.models.UserLike.delete({ userId, postId }, { authMode: 'iam' });
  const { errors: likeErrors } = await likeOperation;

  if (likeErrors) {
    throw new Error(
      getErrorMessage(likeErrors) ?? 'Unable to update like state.'
    );
  }

  const likeCount = Math.max(0, (post.likeCount ?? 0) + (liked ? 1 : -1));
  const { errors: updateErrors } = await client.models.Post.update(
    { id: postId, likeCount },
    { authMode: 'iam' }
  );

  if (updateErrors) {
    throw new Error(
      getErrorMessage(updateErrors) ?? 'Unable to update like count.'
    );
  }

  return { liked, likeCount };
};
