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
}

export const authors = AuthorsService.getInstance();
