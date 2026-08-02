import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
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
  process.env as DataClientEnv,
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();
const genderValues = new Set(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);

export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') {
    return event;
  }

  const { birthdate, gender, given_name: displayName, sub } =
    event.request.userAttributes;

  if (!sub || !displayName) {
    throw new Error('Confirmed users must have a Cognito sub and given name.');
  }

  if (gender && !genderValues.has(gender)) {
    throw new Error('The supplied gender is not a supported profile sex value.');
  }

  const { data: existingUser, errors: getErrors } = await client.models.User.get(
    { id: sub },
  );

  if (getErrors) {
    throw new Error(getErrors.map((error) => error.message).join('; '));
  }

  if (existingUser) {
    return event;
  }

  const { errors } = await client.models.User.create({
    id: sub,
    displayName,
    birthdate,
    gender: gender as Schema['User']['type']['gender'],
  });

  if (errors) {
    throw new Error(errors.map((error) => error.message).join('; '));
  }

  return event;
};
