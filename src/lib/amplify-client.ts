'use client';

import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';

import type { Schema } from '../../amplify/data/resource';

/** Configures and provides access to the browser Amplify client. */
export class AmplifyClientService {
  private static instance: AmplifyClientService | undefined;
  private client: ReturnType<typeof generateClient<Schema>> | undefined;
  private configuration: Promise<void> | undefined;

  private constructor() {}

  static getInstance(): AmplifyClientService {
    return (this.instance ??= new AmplifyClientService());
  }

  async ensureConfigured() {
    if (!this.configuration) {
      this.configuration = fetch('/api/amplify-outputs', { cache: 'no-store' })
        .then(async (response) => {
          if (!response.ok) {
            const body = (await response.json()) as { message?: string };

            throw new Error(
              body.message ?? 'Unable to load Amplify configuration.'
            );
          }

          Amplify.configure(await response.json());
        })
        .catch((error: unknown) => {
          this.configuration = undefined;

          throw error;
        });
    }

    return this.configuration;
  }

  async getDataClient() {
    await this.ensureConfigured();

    this.client ??= generateClient<Schema>();

    return this.client;
  }

  async getReadAuthMode() {
    await this.ensureConfigured();

    const session = await fetchAuthSession();

    return session.tokens ? 'userPool' : 'identityPool';
  }

  async getStorageUrl(path: string) {
    await this.ensureConfigured();

    const { getUrl } = await import('aws-amplify/storage');
    const result = await getUrl({ path });

    return result.url.toString();
  }
}

export const amplifyClient = AmplifyClientService.getInstance();
