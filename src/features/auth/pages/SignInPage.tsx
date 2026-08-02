import Link from 'next/link';

import { AuthFrame } from '@/features/auth/components/AuthFrame';
import { SignInForm } from '@/features/auth/components/SignInForm';

type Props = {
  email: string;
  returnTo: string;
  notice?: string;
};

export function SignInPage({ email, returnTo, notice }: Props) {
  return (
    <AuthFrame
      title="Welcome back"
      description="Sign in to your Thirst account."
    >
      {notice && (
        <p className="mt-6 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
          {notice}
        </p>
      )}

      <SignInForm email={email} returnTo={returnTo} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Thirst?{' '}
        <Link
          href={`/sign-up?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account.
        </Link>
      </p>
    </AuthFrame>
  );
}
