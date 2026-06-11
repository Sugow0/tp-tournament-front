import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import type React from "react";
import { Link } from "react-router";

interface Breadcrumb {
  label: string;
  href: string;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: Breadcrumb[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="relative w-full bg-[var(--color-arena-mid)]/60 backdrop-blur-sm border-b border-[var(--color-border)] px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 pt-10 pb-8 md:pt-14 md:pb-10 overflow-hidden">
      {/* Gold top line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/70 to-transparent" />

      {/* Ambient blobs */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "-60%",
          left: "5%",
          width: "45%",
          height: "220%",
          background: "radial-gradient(ellipse, rgba(74,108,247,0.06) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          top: "-60%",
          right: "0%",
          width: "35%",
          height: "220%",
          background: "radial-gradient(ellipse, rgba(240,168,50,0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      <div className="relative">
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center flex-wrap gap-1 mb-4 font-ui text-[0.7rem] text-[var(--color-text-muted)] uppercase tracking-[0.18em]"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} className="opacity-35" />}
                <Link to={crumb.href} className="hover:text-[var(--color-gold)] transition-colors">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </motion.nav>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="min-w-0"
          >
            <h1
              className="text-arcane text-[2.6rem] md:text-[3.8rem] lg:text-[5rem] text-[var(--color-text-bright)] leading-none tracking-tight uppercase"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700 }}
            >
              {title}
            </h1>
            {subtitle && (
              <p
                className="text-sm text-[var(--color-text-muted)] mt-3 tracking-widest uppercase"
                style={{ fontFamily: "var(--font-heading)", letterSpacing: "0.2em" }}
              >
                {subtitle}
              </p>
            )}
          </motion.div>

          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.18 }}
              className="flex items-center gap-3 flex-shrink-0 pb-1"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>

      {/* Ornamental bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center px-8 sm:px-16 lg:px-24">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[var(--color-gold)]/40" />
        <svg
          width="14"
          height="14"
          viewBox="0 0 14 14"
          className="mx-3 flex-shrink-0 fill-[var(--color-gold)]/50"
          aria-hidden="true"
        >
          <path d="M7 0L8.5 5.5H14L9.5 8.5L11 14L7 11L3 14L4.5 8.5L0 5.5H5.5Z" />
        </svg>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[var(--color-gold)]/40" />
      </div>
    </div>
  );
}
