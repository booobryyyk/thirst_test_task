import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4 px-4 py-6 sm:px-6">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
