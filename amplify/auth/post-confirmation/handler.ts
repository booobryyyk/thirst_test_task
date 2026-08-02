import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { PostAuthenticationTriggerHandler } from 'aws-lambda';
import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import type { Schema } from '../../data/resource';

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

type ProfileProvisionEvent =
  | Parameters<PostConfirmationTriggerHandler>[0]
  | Parameters<PostAuthenticationTriggerHandler>[0];

export const handler = async (event: ProfileProvisionEvent) => {
  if (
    event.triggerSource !== 'PostConfirmation_ConfirmSignUp' &&
    event.triggerSource !== 'PostAuthentication_Authentication'
  ) {
    return event;
  }

  const { given_name: displayName, sub } = event.request.userAttributes;

  if (!sub || !displayName) {
    throw new Error('Confirmed users must have a Cognito sub and given name.');
  }

  const { data: existingUser, errors: getErrors } =
    await client.models.User.get({ id: sub }, { authMode: 'iam' });

  if (getErrors) {
    throw new Error(getErrors.map((error) => error.message).join('; '));
  }

  if (existingUser) {
    return event;
  }

  const { errors } = await client.models.User.create(
    {
      id: sub,
      displayName,
    },
    { authMode: 'iam' }
  );

  if (errors) {
    throw new Error(errors.map((error) => error.message).join('; '));
  }

  return event;
};
