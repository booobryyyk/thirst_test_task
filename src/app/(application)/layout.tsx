import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';

export default function ApplicationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-svh bg-background">
      <Header />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 md:grid-cols-[15rem_minmax(0,42rem)]">
        <Sidebar />

        <main className="min-w-0 border-r">{children}</main>
      </div>
    </div>
  );
}
