import { Sword } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export function Navbar() {
  const location = useLocation();
  const isTournaments = location.pathname.startsWith("/tournaments");

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-parchment-border)] bg-[var(--color-parchment)] shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link
          to="/tournaments"
          className="flex items-center gap-2 text-[var(--color-crimson)] hover:text-[var(--color-crimson-dark)] transition-colors"
        >
          <Sword size={20} />
          <span className="font-heading font-bold text-lg tracking-wide">Arène Fantastique</span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <Link
            to="/tournaments"
            className={cn(
              "font-ui text-sm px-3 py-1.5 rounded-md transition-colors",
              isTournaments
                ? "bg-[var(--color-crimson-muted)] text-[var(--color-crimson)] font-medium"
                : "text-[var(--color-brown-mid)] hover:text-[var(--color-brown)] hover:bg-[var(--color-parchment-dark)]"
            )}
          >
            Tournois
          </Link>
        </div>
      </div>
    </nav>
  );
}
