import { Navbar } from "./Navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-arena-bg)]">
      <Navbar />
      <main className="w-full max-w-5xl mx-auto px-0 sm:px-2 lg:px-4">{children}</main>
    </div>
  );
}
