import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
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

  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.97]);
  const borderOpacity = useTransform(scrollY, [0, 80], [0.06, 0.28]);
  const blurAmount = useTransform(scrollY, [0, 80], [0, 18]);

  const navBg = useMotionTemplate`rgba(26, 16, 53, ${bgOpacity})`;
  const navBorder = useMotionTemplate`rgba(240, 168, 50, ${borderOpacity})`;
  const navBlur = useMotionTemplate`blur(${blurAmount}px)`;

  return (
    <motion.nav
      style={{
        backgroundColor: navBg,
        borderBottomColor: navBorder,
        backdropFilter: navBlur,
      }}
      className="sticky top-0 z-50 border-b transition-shadow duration-500 w-full"
    >
      {/* Gold shimmer hairline */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-60 pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 h-16 flex items-center gap-6">
        {/* Brand */}
        <Link to="/tournaments" className="flex items-center gap-3 flex-shrink-0 group">
          <motion.div
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Crown
              size={26}
              className="text-[var(--color-gold)] drop-shadow-[0_0_10px_rgba(240,168,50,0.6)]"
            />
          </motion.div>
          <span
            className="text-[var(--color-gold)] tracking-widest uppercase text-arcane"
            style={{ fontFamily: "var(--font-display)", fontSize: "0.9rem", fontWeight: 700 }}
          >
            {t("nav.brand")}
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex ml-auto items-center gap-1">
          <NavItem to="/tournaments" active={isTournaments} label={t("nav.tournaments")} />
        </div>

        {/* Mobile hamburger */}
        <motion.button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          whileTap={{ scale: 0.9 }}
          className="md:hidden ml-auto p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-gold)] hover:bg-[var(--color-arena-elevated)] transition-colors"
        >
          <motion.div
            animate={{ rotate: open ? 90 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </motion.div>
        </motion.button>
      </div>

      {/* Mobile dropdown */}
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="md:hidden overflow-hidden"
        style={{ borderTop: open ? "1px solid rgba(240,168,50,0.15)" : "none" }}
      >
        <div className="px-4 sm:px-8 py-3 flex flex-col gap-1 bg-[var(--color-arena-mid)]/95">
          <NavItem
            to="/tournaments"
            active={isTournaments}
            label={t("nav.tournaments")}
            onClick={() => setOpen(false)}
          />
        </div>
      </motion.div>
    </motion.nav>
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
        "relative font-ui text-sm px-5 py-2.5 rounded-full transition-colors duration-200 font-bold tracking-widest uppercase text-[0.75rem]",
        active ? "text-white" : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
      )}
    >
      {active && (
        <motion.span
          layoutId="nav-pill"
          className="absolute inset-0 rounded-full bg-[var(--color-royal)] shadow-[0_0_18px_rgba(74,108,247,0.6)]"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
