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
    <div className="relative w-full bg-[var(--color-arena-mid)]/70 backdrop-blur-sm border-b border-[var(--color-border)] shadow-[0_8px_40px_rgba(0,0,0,0.5)] px-4 sm:px-8 lg:px-14 xl:px-20 2xl:px-28 py-8 md:py-12 overflow-hidden">
      {/* Gold accent top line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent" />

      {/* Ambient glow behind title */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-40%",
          left: "10%",
          width: "40%",
          height: "200%",
          background: "radial-gradient(ellipse, rgba(74,108,247,0.07) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-40%",
          right: "5%",
          width: "30%",
          height: "200%",
          background: "radial-gradient(ellipse, rgba(240,168,50,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative">
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center flex-wrap gap-1 font-ui text-xs text-[var(--color-text-muted)] mb-3 leading-none uppercase tracking-widest"
          >
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} className="opacity-40" />}
                <Link
                  to={crumb.href}
                  className="hover:text-[var(--color-gold)] transition-colors duration-150"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </motion.nav>
        )}

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="min-w-0"
          >
            <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl text-[var(--color-text-bright)] leading-none tracking-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="font-ui text-base text-[var(--color-text-muted)] mt-2">{subtitle}</p>
            )}
          </motion.div>

          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex items-center gap-3 flex-shrink-0"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
