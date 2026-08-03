import { amplifyClient } from '@/lib/amplify-client';
import { formatErrorMessage } from '@/lib/utils';

export type PublicAuthor = {
  id: string;
  displayName: string;
  description: string | null;
  avatarPath: string | null;
};

/** Shared service for public author data operations. */
export class AuthorsService {
  private static instance: AuthorsService | undefined;

  private constructor() {}

  static getInstance(): AuthorsService {
    return (this.instance ??= new AuthorsService());
  }

  async getPublicAuthor(userId: string): Promise<PublicAuthor | null> {
    const client = await amplifyClient.getDataClient();
    const authMode = await amplifyClient.getReadAuthMode();
    const { data, errors } = await client.models.User.get(
      { id: userId },
      {
        selectionSet: ['id', 'displayName', 'description', 'avatarPath'],
        authMode: authMode,
      }
    );

    if (errors) {
      throw new Error(
        formatErrorMessage(errors) ?? 'Unable to load this profile.'
      );
    }
    return data as PublicAuthor | null;
  }

  async updateAvatar(
    userId: string,
    file: File,
    previousPath: string | null
  ): Promise<string> {
    const client = await amplifyClient.getDataClient();
    const { uploadData, remove } = await import('aws-amplify/storage');
    const extension =
      file.type === 'image/png'
        ? 'png'
        : file.type === 'image/webp'
          ? 'webp'
          : 'jpg';
    const fileName = `profile-${crypto.randomUUID()}.${extension}`;

    const { path } = await uploadData({
      // `{entity_id}` in the storage rule is the Identity Pool ID, not the
      // User Pool `sub`. Let Amplify resolve it for the current user.
      path: ({ identityId }) => `avatars/${identityId}/${fileName}`,
      data: file,
      options: { contentType: file.type },
    }).result;

    const { errors } = await client.models.User.update(
      { id: userId, avatarPath: path },
      { authMode: 'userPool' }
    );

    if (errors) {
      await remove({ path }).catch(() => undefined);
      throw new Error(
        formatErrorMessage(errors) ?? 'Unable to update profile image.'
      );
    }

    if (previousPath?.startsWith('avatars/')) {
      void remove({ path: previousPath });
    }

    return path;
  }
}

export const authors = AuthorsService.getInstance();
