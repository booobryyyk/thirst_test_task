import { SignInPage } from '@/features/auth/pages/SignInPage';
import { getInternalReturnTo, getSingleValue } from '@/lib/utils';

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <SignInPage
      email={getSingleValue(params.email)}
      returnTo={getInternalReturnTo(params.returnTo)}
      notice={
        params.confirmed === '1'
          ? 'Your account is confirmed. You can sign in now.'
          : undefined
      }
    />
  );
}
