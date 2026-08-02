import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatErrorMessage(
  errors: readonly { message: string }[] | null | undefined
) {
  return errors?.map((error) => error.message).join(' ');
}

export function getInternalReturnTo(value: string | string[] | undefined) {
  if (typeof value !== 'string') {
    return '/';
  }

  if (!value.startsWith('/') || value.startsWith('//')) {
    return '/';
  }

  return value;
}

export function getSingleValue(value: string | string[] | undefined) {
  return typeof value === 'string' ? value : '';
}
