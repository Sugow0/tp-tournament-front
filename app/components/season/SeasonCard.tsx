import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router";
import type { Season } from "~/types/season";
import { SeasonStatusBadge } from "./SeasonStatusBadge";

interface Props {
  season: Season;
}

export function SeasonCard({ season }: Props) {
  const start = format(new Date(season.startDate), "d MMM yyyy", { locale: fr });
  const end = format(new Date(season.endDate), "d MMM yyyy", { locale: fr });

  return (
    <Link to={`/seasons/${season.id}`} className="block">
      <div className="cr-card relative bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] rounded-xl overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-gold)]/50 transition-colors">
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-80" />
        <div className="px-5 pt-5 pb-5 flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-heading text-base font-semibold text-[var(--color-text-bright)] leading-snug truncate">
              {season.name}
            </h3>
            <SeasonStatusBadge status={season.status} />
          </div>
          <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs font-ui tracking-wide">
            <CalendarDays size={12} className="flex-shrink-0" />
            <span className="uppercase">
              {start} → {end}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
