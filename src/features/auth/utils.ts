export function confirmationHref(email: string, returnTo: string) {
  const query = new URLSearchParams({ email, returnTo });
  return `/confirm-sign-up?${query.toString()}`;
}

export function signInHref(email: string, returnTo: string, confirmed = false) {
  const query = new URLSearchParams({ email, returnTo });

  if (confirmed) {
    query.set('confirmed', '1');
  }

  return `/sign-in?${query.toString()}`;
}

const ERROR_MAP: Record<string, string> = {
  UserNotConfirmedException: 'Confirm your email address before signing in.',
  UsernameExistsException: 'An account already exists for this email address.',
  NotAuthorizedException: 'The email address or password is incorrect.',
  CodeMismatchException: 'That confirmation code is not valid.',
  ExpiredCodeException:
    'That confirmation code has expired. Request a new one and try again.',
  LimitExceededException:
    'Too many attempts. Please wait a moment before trying again.',
};

const FALLBACK_ERROR_MESSAGE = 'Something went wrong. Please try again.';

export function normalizeAuthErrorMessage(cause: unknown) {
  if (!(cause instanceof Error)) {
    return FALLBACK_ERROR_MESSAGE;
  }
  const errorMessage = ERROR_MAP[cause.name] ?? FALLBACK_ERROR_MESSAGE;

  return errorMessage;
}
