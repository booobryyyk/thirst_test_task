import { ReactNode } from 'react';

export function AuthFrame({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <>
      <h1 className="mt-8 text-2xl font-semibold tracking-tight">{title}</h1>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      {children}
    </>
  );
}
