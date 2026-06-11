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
    <nav className="sticky top-0 z-50 bg-[var(--color-arena-mid)] border-b border-[var(--color-border-strong)] shadow-[0_2px_16px_rgba(0,0,0,0.5)]">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
        <Link to="/tournaments" className="flex items-center gap-2 flex-shrink-0 group">
          <Crown
            size={22}
            className="text-[var(--color-gold)] group-hover:text-[var(--color-gold-bright)] transition-colors"
          />
          <span className="font-heading text-lg text-[var(--color-gold)] group-hover:text-[var(--color-gold-bright)] transition-colors">
            {t("nav.brand")}
          </span>
        </Link>

        <div className="hidden md:flex ml-auto items-center gap-1">
          <NavItem to="/tournaments" active={isTournaments} label={t("nav.tournaments")} />
        </div>

        <button
          type="button"
          className="md:hidden ml-auto p-2 rounded-md text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-arena-elevated)] transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-arena-mid)] px-4 py-3 flex flex-col gap-1">
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
        "font-ui text-sm px-3 py-2 rounded-lg transition-colors font-semibold",
        active
          ? "bg-[var(--color-royal-muted)] text-[var(--color-royal)] border border-[var(--color-royal)]/40"
          : "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-arena-elevated)]"
      )}
    >
      {label}
    </Link>
  );
}
