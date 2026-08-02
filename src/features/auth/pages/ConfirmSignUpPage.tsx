import Link from 'next/link';

import { AuthFrame } from '@/features/auth/components/AuthFrame';
import { ConfirmSignUpForm } from '@/features/auth/components/ConfirmSignUpForm';

type Props = {
  email: string;
  returnTo: string;
};

export function ConfirmSignUpPage({ email, returnTo }: Props) {
  return (
    <AuthFrame
      title="Check your email"
      description="Enter the confirmation code we sent to finish creating your account."
    >
      <ConfirmSignUpForm email={email} returnTo={returnTo} />

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link
          href={`/sign-in?returnTo=${encodeURIComponent(returnTo)}`}
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </AuthFrame>
  );
}
