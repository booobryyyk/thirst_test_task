import { defineConfig } from 'cypress';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

if (existsSync('.env')) {
  process.loadEnvFile('.env');
}

const cypressEnv = Object.fromEntries(
  Object.entries({
    testUserEmail: process.env.CYPRESS_testUserEmail,
    testUserPassword: process.env.CYPRESS_testUserPassword,
    enableSignUpTests: process.env.CYPRESS_enableSignUpTests,
    awsProfile: process.env.CYPRESS_awsProfile,
  }).filter(([, value]) => value !== undefined)
);

type AmplifyOutputs = {
  auth?: { aws_region?: string; user_pool_id?: string };
};

export default defineConfig({
  allowCypressEnv: false,
  env: cypressEnv,

  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('task', {
        async confirmCognitoUser(username: string) {
          if (!username) throw new Error('A Cognito username is required.');

          const outputs = JSON.parse(
            await readFile('amplify_outputs.json', 'utf8')
          ) as AmplifyOutputs;
          const userPoolId = outputs.auth?.user_pool_id;
          const region = outputs.auth?.aws_region;

          if (!userPoolId || !region) {
            throw new Error(
              'amplify_outputs.json does not contain the Cognito user-pool configuration.'
            );
          }

          const args = [
            'cognito-idp',
            'admin-confirm-sign-up',
            '--user-pool-id',
            userPoolId,
            '--username',
            username,
            '--region',
            region,
          ];
          const profile = config.env.awsProfile;
          if (typeof profile === 'string' && profile)
            args.push('--profile', profile);

          await execFileAsync('aws', args);
          return null;
        },
      });
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
});
