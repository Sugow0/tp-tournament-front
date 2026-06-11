import { Crown, Menu, X } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isTournaments = location.pathname.startsWith("/tournaments");

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-[var(--color-arena-mid)]/95 border-b border-[var(--color-border)] shadow-[0_4px_24px_rgba(0,0,0,0.7)]">
      {/* Gold shimmer hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-70 pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Brand */}
        <Link to="/tournaments" className="flex items-center gap-2.5 flex-shrink-0 group">
          <Crown
            size={22}
            className="text-[var(--color-gold)] group-hover:text-[var(--color-gold-bright)] transition-colors drop-shadow-[0_0_8px_rgba(240,168,50,0.5)]"
          />
          <span className="font-heading text-[1.1rem] text-[var(--color-gold)] group-hover:text-[var(--color-gold-bright)] transition-colors tracking-wide">
            {t("nav.brand")}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex ml-auto items-center gap-1">
          <NavItem to="/tournaments" active={isTournaments} label={t("nav.tournaments")} />
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="md:hidden ml-auto p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-arena-elevated)] transition-all duration-150"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-arena-mid)] px-4 py-3 flex flex-col gap-1 shadow-[0_8px_20px_rgba(0,0,0,0.5)]">
          <NavItem
            to="/tournaments"
            active={isTournaments}
            label={t("nav.tournaments")}
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </nav>
  );
}

interface NavItemProps {
  to: string;
  active: boolean;
  label: string;
  onClick?: () => void;
}

function NavItem({ to, active, label, onClick }: NavItemProps) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "font-ui text-sm px-4 py-2 rounded-full transition-all duration-200 font-semibold tracking-wide",
        active
          ? "bg-[var(--color-royal)] text-white shadow-[0_0_14px_rgba(74,108,247,0.55)] border border-[var(--color-royal-dark)]"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-arena-elevated)]"
      )}
    >
      {label}
    </Link>
  );
}
