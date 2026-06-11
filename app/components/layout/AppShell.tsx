import { lazy, Suspense, useEffect, useState } from "react";
import { Navbar } from "./Navbar";

const ArenaScene = lazy(() =>
  import("~/components/background/ArenaScene").then((m) => ({ default: m.ArenaScene }))
);

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative min-h-screen bg-[var(--color-arena-bg)] overflow-x-hidden">
      {/* Three.js arena background — client only */}
      {mounted && (
        <Suspense fallback={null}>
          <ArenaScene />
        </Suspense>
      )}

      {/* Noise texture overlay for depth */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.025,
        }}
      />

      {/* Radial vignette */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 2,
          background:
            "radial-gradient(ellipse 120% 100% at 50% 0%, transparent 40%, rgba(13,10,30,0.7) 100%)",
        }}
      />

      <div className="relative" style={{ zIndex: 10 }}>
        <Navbar />
        <main className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28">{children}</main>
      </div>
    </div>
  );
}
