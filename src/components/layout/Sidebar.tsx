import Link from 'next/link';
import { Feather, Home } from 'lucide-react';

import { AuthNav } from '@/features/auth/components/AuthNav';
import { cn } from '@/lib/utils';

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-svh border-r px-5 py-6 md:flex md:flex-col">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
          <Feather className="size-4" aria-hidden="true" />
        </span>
        Thirst
      </Link>

      <nav className="mt-10 space-y-1" aria-label="Primary navigation">
        <NavLink href="/" icon={<Home className="size-5" />}>
          Feed
        </NavLink>
      </nav>

      <div className="mt-auto">
        <AuthNav />
      </div>
    </aside>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        'bg-muted text-foreground hover:bg-muted/70'
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
