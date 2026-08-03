'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Feather, Home, UserRound } from 'lucide-react';

import { AuthNav } from '@/features/auth/components/AuthNav';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-svh border-r px-5 py-6 md:flex md:flex-col">
      <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
        <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground">
          <Feather className="size-4" aria-hidden="true" />
        </span>
        Postly
      </Link>

      <nav className="mt-10 space-y-2" aria-label="Primary navigation">
        <NavLink
          href="/"
          icon={<Home className="size-5" />}
          active={pathname === '/'}
        >
          Feed
        </NavLink>

        <NavLink
          href="/me"
          icon={<UserRound className="size-5" />}
          active={pathname === '/me'}
        >
          Profile
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
  active,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
        active
          ? 'bg-muted text-foreground'
          : 'hover:bg-muted/70 hover:text-foreground'
      )}
    >
      {icon}
      {children}
    </Link>
  );
}
