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
    <div className="relative bg-[var(--color-arena-mid)] border-b border-[var(--color-border)] shadow-[0_4px_20px_rgba(0,0,0,0.45)] px-4 py-4 md:py-5">
      {/* Gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-75 pointer-events-none" />

      <div className="max-w-5xl mx-auto">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center flex-wrap gap-1 font-ui text-xs text-[var(--color-text-muted)] mb-2.5 leading-none">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={11} className="opacity-40" />}
                <Link
                  to={crumb.href}
                  className="hover:text-[var(--color-gold)] transition-colors duration-150"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-heading text-2xl md:text-3xl text-[var(--color-text-bright)] leading-tight drop-shadow-[0_0_20px_rgba(240,168,50,0.12)]">
              {title}
            </h1>
            {subtitle && (
              <p className="font-ui text-sm text-[var(--color-text-muted)] mt-1">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
