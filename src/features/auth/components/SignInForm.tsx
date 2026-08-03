'use client';

import { ChangeEvent, SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'aws-amplify/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { amplifyClient } from '@/lib/amplify-client';
import { FormField } from '@/components/ui/formField';
import { FormError } from '@/components/ui/formError';
import {
  confirmationHref,
  normalizeAuthErrorMessage,
} from '@/features/auth/utils';

type Props = {
  email: string;
  returnTo: string;
};

export function SignInForm({ email: initialEmail, returnTo }: Props) {
  const router = useRouter();
  const [fields, setFields] = useState({
    email: initialEmail,
    password: '',
  });

  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onFieldChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.currentTarget;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(undefined);

    if (!fields.email.trim() || !fields.password) {
      setError('Enter your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await amplifyClient.ensureConfigured();

      const output = await signIn({
        username: fields.email.trim(),
        password: fields.password,
      });

      if (output.isSignedIn) {
        router.replace(returnTo);
        return;
      }

      setError(
        'This account needs an additional sign-in step that is not configured yet.'
      );
    } catch (cause) {
      if (
        cause instanceof Error &&
        cause.name === 'UserNotConfirmedException'
      ) {
        router.replace(confirmationHref(fields.email.trim(), returnTo));
        return;
      }
      setError(normalizeAuthErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
      <FormError message={error} />

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

      <FormField id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={fields.password}
          onChange={onFieldChange}
          required
        />
      </FormField>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
