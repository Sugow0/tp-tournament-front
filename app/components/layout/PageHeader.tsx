import { ChevronRight } from "lucide-react";
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
    <div className="border-b border-[var(--color-parchment-border)] bg-[var(--color-parchment-dark)] px-4 py-4">
      <div className="max-w-5xl mx-auto">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav className="flex items-center gap-1 font-ui text-xs text-[var(--color-brown-mid)] mb-2">
            {breadcrumb.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={12} />}
                <Link
                  to={crumb.href}
                  className="hover:text-[var(--color-brown)] transition-colors"
                >
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-bold text-[var(--color-ink)]">
              {title}
            </h1>
            {subtitle && (
              <p className="font-ui text-sm text-[var(--color-brown-mid)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
