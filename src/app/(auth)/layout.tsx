import Link from 'next/link';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="grid min-h-svh place-items-center bg-muted/30 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight hover:underline"
        >
          Thirst
        </Link>

        {children}
      </section>
    </main>
  );
}
