import { Skeleton } from '@/components/ui/skeleton';

export function ProfileSkeleton() {
  return (
    <div className="px-4 py-6 sm:px-6">
      <Skeleton className="size-10 rounded-full" />

      <Skeleton className="mt-3 h-6 w-40" />

      <Skeleton className="mt-3 h-4 w-3/4" />
    </div>
  );
}
