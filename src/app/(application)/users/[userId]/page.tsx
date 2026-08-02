import { ProfilePage } from '@/features/users/pages/ProfilePage';

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  return <ProfilePage userId={userId} />;
}
