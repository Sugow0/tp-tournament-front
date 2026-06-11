import { LogOut } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useSession } from "~/hooks/useSession";
import { clearSession } from "~/lib/auth";
import { cn } from "~/lib/utils";

interface NavbarSessionProps {
  /** When true, render full-width stacked items suited to the mobile menu. */
  mobile?: boolean;
  /** Optional callback fired after any session action (used to close the mobile menu). */
  onAction?: () => void;
}

export function NavbarSession({ mobile = false, onAction }: NavbarSessionProps) {
  const { t } = useTranslation();
  const { ready, isAuthenticated } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close the menu when clicking outside of it (nice-to-have).
  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  // SSR / first paint: render the logged-out affordance to avoid hydration mismatch.
  if (!ready || !isAuthenticated) {
    return (
      <Link
        to="/login"
        onClick={onAction}
        className={cn(
          "font-ui text-sm font-bold uppercase tracking-widest text-[0.75rem] transition-colors",
          mobile
            ? "px-5 py-2.5 text-[var(--color-text-muted)] hover:text-[var(--color-gold)]"
            : "rounded-full border border-[var(--color-border)] px-5 py-2 text-[var(--color-text-muted)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
        )}
      >
        {t("nav.login")}
      </Link>
    );
  }

  function handleLogout() {
    clearSession();
    setOpen(false);
    onAction?.();
    navigate("/login");
  }

  return (
    <div ref={containerRef} className={cn("relative", mobile && "w-full")}>
      <button
        type="button"
        aria-label={t("auth.account")}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-3 rounded-full transition-colors",
          mobile
            ? "w-full px-5 py-2.5 text-[var(--color-text)] hover:text-[var(--color-gold)]"
            : "text-[var(--color-text)] hover:text-[var(--color-gold)]"
        )}
      >
        <Avatar className="h-9 w-9 border border-[var(--color-gold)]/40">
          <AvatarFallback className="bg-[var(--color-arena-elevated)] font-heading text-sm font-bold uppercase text-[var(--color-gold)]">
            {t("nav.brand").charAt(0)}
          </AvatarFallback>
        </Avatar>
        {mobile && (
          <span className="font-ui text-sm font-bold uppercase tracking-widest text-[0.75rem]">
            {t("auth.account")}
          </span>
        )}
      </button>

      {open && (
        <div
          className={cn(
            "z-50 flex flex-col rounded-sm border border-[var(--color-border)] bg-[var(--color-arena-elevated)] p-1 shadow-lg",
            mobile ? "mt-1 w-full" : "absolute right-0 mt-2 w-48"
          )}
        >
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-sm px-3 py-2 text-left font-ui text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-arena-hover)] hover:text-[var(--color-gold)]"
          >
            <LogOut className="size-4" />
            {t("auth.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
