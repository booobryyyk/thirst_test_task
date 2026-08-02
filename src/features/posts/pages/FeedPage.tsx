import { SectionHeader } from '@/components/layout/SectionHeader';
import { FeedList } from '@/features/posts/components/FeedList';

export function FeedPage() {
  return (
    <>
      <SectionHeader title="Feed" description="Recent available posts" />

      <FeedList />
    </>
  );
}
