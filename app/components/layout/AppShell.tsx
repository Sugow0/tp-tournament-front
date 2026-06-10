import { Navbar } from "./Navbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-parchment)]">
      <Navbar />
      <main className="max-w-5xl mx-auto">{children}</main>
    </div>
  );
}
