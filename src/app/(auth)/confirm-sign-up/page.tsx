import { ConfirmSignUpPage } from '@/features/auth/pages/ConfirmSignUpPage';
import { getInternalReturnTo, getSingleValue } from '@/lib/utils';

export default async function ConfirmSignUp({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  return (
    <ConfirmSignUpPage
      email={getSingleValue(params.email)}
      returnTo={getInternalReturnTo(params.returnTo)}
    />
  );
}
