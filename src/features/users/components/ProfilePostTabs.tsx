'use client';

import { Heart, UserRound } from 'lucide-react';

import { cn } from '@/lib/utils';

export type ProfilePostTab = 'posts' | 'likes';

export function ProfilePostTabs({
  value,
  onChange,
}: {
  value: ProfilePostTab;
  onChange: (tab: ProfilePostTab) => void;
}) {
  return (
    <div className="flex border-b px-4 sm:px-6" role="tablist">
      <TabButton
        active={value === 'posts'}
        icon={<UserRound className="size-4" />}
        label="Posts"
        onClick={() => onChange('posts')}
      />
      <TabButton
        active={value === 'likes'}
        icon={<Heart className="size-4" />}
        label="Liked"
        onClick={() => onChange('likes')}
      />
    </div>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
        active
          ? 'border-primary text-foreground'
          : 'border-transparent text-muted-foreground hover:text-foreground'
      )}
    >
      {icon}
      {label}
    </button>
  );
}
