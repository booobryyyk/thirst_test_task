import Link from 'next/link';
import { Feather } from 'lucide-react';

import { AuthNav } from '@/features/auth/components/AuthNav';

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link href="/" className="flex w-fit items-center gap-2 font-semibold">
          <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
            <Feather className="size-4" aria-hidden="true" />
          </span>
          Postly
        </Link>

        <AuthNav compact />
      </div>
    </header>
  );
}
