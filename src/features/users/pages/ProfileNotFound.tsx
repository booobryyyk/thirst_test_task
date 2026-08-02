import Link from 'next/link';

export function ProfileNotFound() {
  return (
    <div className="px-6 py-16 text-center">
      <h1 className="font-semibold">Profile not found</h1>

      <p className="mt-1 text-sm text-muted-foreground">
        This author may no longer be available.
      </p>

      <Link
        href="/"
        className="mt-4 inline-flex h-8 items-center rounded-md border border-border px-2.5 text-sm font-medium shadow-xs hover:bg-muted"
      >
        Return to feed
      </Link>
    </div>
  );
}
