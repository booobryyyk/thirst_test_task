'use client';

import { ChangeEvent, SubmitEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUp } from 'aws-amplify/auth';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { amplifyClient } from '@/lib/amplify-client';
import { FormField } from '@/components/ui/formField';
import { FormError } from '@/components/ui/formError';
import {
  confirmationHref,
  signInHref,
  normalizeAuthErrorMessage,
} from '@/features/auth/utils';

type Props = {
  email: string;
  returnTo: string;
};

export function SignUpForm({ email: initialEmail, returnTo }: Props) {
  const router = useRouter();

  const [fields, setFields] = useState({
    displayName: '',
    email: initialEmail,
    birthdate: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  function onFieldChange(
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = event.currentTarget;
    setFields((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event: SubmitEvent) {
    event.preventDefault();

    setError(undefined);

    const trimmedName = fields.displayName.trim();
    const trimmedEmail = fields.email.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !fields.password ||
      !fields.confirmPassword
    ) {
      setError('Complete all required fields.');
      return;
    }

    if (fields.password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    if (fields.password !== fields.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      await amplifyClient.ensureConfigured();

      const output = await signUp({
        username: trimmedEmail,
        password: fields.password,
        options: {
          userAttributes: {
            email: trimmedEmail,
            given_name: trimmedName,
            ...(fields.birthdate && { birthdate: fields.birthdate }),
            ...(fields.gender && { gender: fields.gender }),
          },
        },
      });

      if (output.nextStep.signUpStep === 'DONE') {
        router.replace(signInHref(trimmedEmail, returnTo, true));
        return;
      }

      router.replace(confirmationHref(trimmedEmail, returnTo));
    } catch (cause) {
      setError(normalizeAuthErrorMessage(cause));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
      <FormError message={error} />

      <FormField id="display-name" label="Display name">
        <Input
          id="display-name"
          name="displayName"
          autoComplete="name"
          value={fields.displayName}
          onChange={onFieldChange}
          required
        />
      </FormField>

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

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="birthdate" label="Birthdate (optional)">
          <Input
            id="birthdate"
            name="birthdate"
            type="date"
            autoComplete="bday"
            value={fields.birthdate}
            onChange={onFieldChange}
          />
        </FormField>

        <FormField id="gender" label="Gender (optional)">
          <select
            id="gender"
            name="gender"
            value={fields.gender}
            onChange={onFieldChange}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Prefer not to say</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
            <option value="nonbinary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </FormField>
      </div>

      <FormField id="password" label="Password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={fields.password}
          onChange={onFieldChange}
          required
        />
      </FormField>

      <FormField id="confirm-password" label="Confirm password">
        <Input
          id="confirm-password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={fields.confirmPassword}
          onChange={onFieldChange}
          required
        />
      </FormField>

      <Button className="w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating account…' : 'Create account'}
      </Button>
    </form>
  );
}
