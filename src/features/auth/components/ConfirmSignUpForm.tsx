'use client';

import { ChangeEvent, SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { amplifyClient } from '@/lib/amplify-client';
import { FormField } from '@/components/ui/formField';
import { normalizeAuthErrorMessage, signInHref } from '@/features/auth/utils';
import { FormError } from '@/components/ui/formError';

type Props = {
  email: string;
  returnTo: string;
};

export function ConfirmSignUpForm({ email: initialEmail, returnTo }: Props) {
  const router = useRouter();
  const [fields, setFields] = useState({ email: initialEmail, code: '' });
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  function onFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;

    setFields((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    setError(undefined);

    if (!fields.email.trim() || !fields.code.trim()) {
      setError('Enter your email address and confirmation code.');

      return;
    }

    setIsSubmitting(true);

    try {
      await amplifyClient.ensureConfigured();

      const output = await confirmSignUp({
        username: fields.email.trim(),
        confirmationCode: fields.code.trim(),
      });

      if (output.nextStep.signUpStep === 'DONE') {
        router.replace(signInHref(fields.email.trim(), returnTo, true));

        return;
      }

      setError('Your account still needs an additional confirmation step.');
    } catch (cause) {
      setError(normalizeAuthErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resendCode() {
    if (!fields.email.trim()) {
      setError('Enter your email address before requesting another code.');
      return;
    }

    setError(undefined);
    setMessage(undefined);
    setIsResending(true);

    try {
      await amplifyClient.ensureConfigured();

      await resendSignUpCode({ username: fields.email.trim() });

      setMessage('A new confirmation code has been sent.');
    } catch (cause) {
      setError(normalizeAuthErrorMessage(cause));
    } finally {
      setIsResending(false);
    }
  }

  return (
    <>
      <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
        <FormError message={error} />

        {message && (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {message}
          </p>
        )}

        <FormField id="email" label="Email address">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={onFieldChange}
            required
          />
        </FormField>

        <FormField id="confirmation-code" label="Confirmation code">
          <Input
            id="confirmation-code"
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={fields.code}
            onChange={onFieldChange}
            required
          />
        </FormField>

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Confirming…' : 'Confirm account'}
        </Button>
      </form>

      <div className="mt-5 text-center text-sm text-muted-foreground">
        Didn’t receive a code?{' '}
        <button
          type="button"
          className="font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
          onClick={() => void resendCode()}
          disabled={isResending}
        >
          {isResending ? 'Sending…' : 'Resend code'}
        </button>
      </div>
    </>
  );
}
