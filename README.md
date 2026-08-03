# Postly

Postly is a small social feed built with Next.js and AWS Amplify. Guests can
read the public feed; authenticated users can publish posts, like posts, and
view profiles.

## Prerequisites

- Node.js 20.12 or newer
- pnpm 11.9 (`corepack enable` installs the version declared by the project)
- An AWS account with access to deploy Amplify resources
- AWS CLI v2 configured with credentials or AWS IAM Identity Center (SSO)

Check the local tooling:

```sh
node --version
pnpm --version
aws --version
```

## Install dependencies

From the repository root:

```sh
corepack enable
pnpm install
```

## Start the Amplify backend

The application gets its Cognito, AppSync, and storage configuration from the
root `amplify_outputs.json` file. Amplify creates or updates that file when its
sandbox starts.

If you use AWS IAM Identity Center, first authenticate the profile you plan to
use:

```sh
aws sso login --profile your-profile
```

Start the sandbox from the repository root and keep it running in its own
terminal:

```sh
pnpm exec ampx sandbox --profile your-profile
```

If your default AWS profile is already authenticated, omit `--profile`:

```sh
pnpm exec ampx sandbox
```

Wait for the initial deployment to finish before starting the web app. The
sandbox watches the `amplify/` directory and redeploys backend changes. It
creates real AWS resources in your account.

To delete the sandbox when you no longer need it, run this manually:

```sh
pnpm exec ampx sandbox delete --profile your-profile
```

## Start the web app

In a separate terminal:

```sh
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). If port 3000 is occupied,
Next.js selects another port and prints it in the terminal; pass that address to
Cypress with `--config baseUrl=http://localhost:PORT`.

## Quality checks

```sh
pnpm typecheck
pnpm lint
pnpm build
```

## End-to-end tests

Start both the Amplify sandbox and the Next.js app first. Cypress automatically
loads the root `.env` file, which is ignored by Git.

Create `.env` with a dedicated, already-confirmed Cognito test user:

```env
CYPRESS_testUserEmail=cypress-user@example.test
CYPRESS_testUserPassword=Cypress1!

# Enables the real sign-up test. It creates a new Cognito user.
CYPRESS_enableSignUpTests=true

# Optional when the sandbox is not your default AWS CLI profile.
# CYPRESS_awsProfile=your-profile
```

Run all E2E tests:

```sh
pnpm cy:run
```

Run an individual flow:

```sh
pnpm cy:run -- --spec cypress/e2e/guest.cy.ts
pnpm cy:run -- --spec cypress/e2e/authenticated-flows.cy.ts
pnpm cy:run -- --spec cypress/e2e/sign-up.cy.ts
```

Open the Cypress UI instead:

```sh
pnpm cy:open
```

The suites cover guest feed viewing, sign in, sign up, post creation, author
profile navigation, post likes, and sign out.

### Cognito requirements for tests

- The authenticated-flow test user must belong to the Cognito user pool created
  by the sandbox and must be confirmed.
- The sign-up test submits the real UI form, then confirms its temporary user
  with the AWS CLI. The configured AWS role therefore needs
  `cognito-idp:AdminConfirmSignUp` on that sandbox's Cognito user pool.
- Use a disposable sandbox user: the tests create posts and likes, and the
  sign-up test creates a new Cognito user per run.

For additional Cypress details, see [cypress/README.md](cypress/README.md).

## Component tests

Component tests mount individual React UI components in Cypress. They do not
need the Next.js server or Amplify sandbox running.

Open the Cypress component-test runner:

```sh
pnpm component
```

Run all component tests headlessly:

```sh
pnpm component:headless
```

Component specs use the `*.cy.tsx` naming convention and live next to the
components they test, for example `src/components/ui/buttonButton.cy.tsx`.
