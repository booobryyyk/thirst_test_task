import Link from 'next/link';

import { AuthFrame } from '@/features/auth/components/AuthFrame';
import { SignUpForm } from '@/features/auth/components/SignUpForm';

type Props = {
  email: string;
  returnTo: string;
};

export function SignUpPage({ email, returnTo }: Props) {
  return (
    <AuthFrame
      title="Create your account"
      description="Start with a few details. You can add posts after confirming your email."
    >
      <SignUpForm email={email} returnTo={returnTo} />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in.
        </Link>
      </p>
    </AuthFrame>
  );
}
