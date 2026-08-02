import { Skeleton } from '@/components/ui/skeleton';

export function PostListSkeleton() {
  return (
    <div aria-label="Loading posts">
      {[0, 1, 2].map((item) => (
        <div className="flex gap-3 border-b px-4 py-5 sm:px-6" key={item}>
          <Skeleton className="size-8 shrink-0 rounded-full" />

          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-32" />

            <Skeleton className="h-4 w-full" />

            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
