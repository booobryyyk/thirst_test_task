export function formatPostDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const difference = Date.now() - date.getTime();

  if (difference >= 0 && difference < 60_000) return 'now';

  if (difference >= 0 && difference < 3_600_000) {
    return `${Math.floor(difference / 60_000)}m`;
  }

  if (difference >= 0 && difference < 86_400_000) {
    return `${Math.floor(difference / 3_600_000)}h`;
  }

  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year:
      date.getFullYear() === new Date().getFullYear() ? undefined : 'numeric',
  }).format(date);
}
