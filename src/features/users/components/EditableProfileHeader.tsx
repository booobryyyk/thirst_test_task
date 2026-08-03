'use client';

import { ChangeEvent, useRef, useState } from 'react';
import { Camera } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ProfileAvatar } from '@/features/users/components/ProfileAvatar';
import type { PublicAuthor } from '@/features/users/users.api';
import { authors } from '@/features/users/users.api';

export function EditableProfileHeader({
  userId,
  profile,
  onAvatarUpdated,
}: {
  userId: string;
  profile: PublicAuthor;
  onAvatarUpdated: (path: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  async function onImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    setUploadError(undefined);

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setUploadError('Choose a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Profile images must be 5 MB or smaller.');
      return;
    }

    setIsUploading(true);

    try {
      const path = await authors.updateAvatar(userId, file, profile.avatarPath);
      onAvatarUpdated(path);
    } catch (cause) {
      setUploadError(
        cause instanceof Error
          ? cause.message
          : 'Unable to update profile image.'
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <section className="border-b px-4 py-6 sm:px-6">
      <div className="flex items-start gap-4">
        <div className="relative">
          <ProfileAvatar
            name={profile.displayName}
            path={profile.avatarPath}
            size="lg"
          />

          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onImageChange}
          />

          <Button
            type="button"
            size="icon-sm"
            className="absolute -right-1 -bottom-1 rounded-full"
            aria-label="Update profile image"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <Camera className="size-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-semibold tracking-tight">
            {profile.displayName}
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">Your profile</p>
        </div>
      </div>

      {uploadError && (
        <p className="mt-3 text-sm text-destructive" role="alert">
          {uploadError}
        </p>
      )}
    </section>
  );
}
