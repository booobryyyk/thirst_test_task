import { SignUpPage } from '@/features/auth/pages/SignUpPage';
import { getInternalReturnTo, getSingleValue } from '@/lib/utils';

export default async function SignUp({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <SignUpPage
      email={getSingleValue(params.email)}
      returnTo={getInternalReturnTo(params.returnTo)}
    />
  );
}
