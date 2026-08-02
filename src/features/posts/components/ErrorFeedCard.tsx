import { Button } from '@/components/ui/button';

export function ErrorFeedCard({
  message,
  onRetry,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact ? 'border-b px-4 py-5 sm:px-6' : 'px-6 py-16 text-center'
      }
    >
      <p className="text-sm text-destructive">{message}</p>

      <Button className="mt-3" variant="outline" size="sm" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}
