import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, ChevronRight, Trophy } from "lucide-react";
import { Link } from "react-router";
import type { Tournament } from "~/types/tournament";
import { TournamentStatusBadge } from "./TournamentStatusBadge";

interface Props {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: Props) {
  const date = format(new Date(tournament.createdAt), "d MMM yyyy", { locale: fr });

  return (
    <Link to={`/tournaments/${tournament.id}`} className="block group">
      <div className="relative bg-gradient-to-br from-[var(--color-arena-surface)] via-[var(--color-arena-mid)] to-[var(--color-arena-bg)] rounded-2xl overflow-hidden border border-[var(--color-border)] group-hover:border-[var(--color-gold)]/70 group-hover:shadow-[0_0_28px_rgba(240,168,50,0.2),0_8px_40px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer">
        {/* Gold top accent bar — brightens on hover */}
        <div className="h-[3px] bg-gradient-to-r from-[var(--color-gold)]/40 via-[var(--color-gold-bright)] to-[var(--color-gold)]/40 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="px-4 pt-4 pb-3">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Trophy icon box */}
              <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/25 flex items-center justify-center group-hover:bg-[var(--color-gold)]/20 group-hover:shadow-[0_0_10px_rgba(240,168,50,0.15)] transition-all duration-300">
                <Trophy
                  size={16}
                  className="text-[var(--color-gold)] group-hover:text-[var(--color-gold-bright)] transition-colors"
                />
              </div>
              <h2 className="font-heading text-base md:text-lg text-[var(--color-text-bright)] leading-tight truncate">
                {tournament.name}
              </h2>
            </div>
            <TournamentStatusBadge status={tournament.status} />
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs font-ui">
              <Calendar size={11} className="flex-shrink-0" />
              <span>{date}</span>
            </div>
            <ChevronRight
              size={15}
              className="text-[var(--color-text-muted)] group-hover:text-[var(--color-gold)] group-hover:translate-x-0.5 transition-all duration-200"
            />
          </div>
        </div>

        {/* Bottom shimmer line */}
        <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/15 to-transparent" />
      </div>
    </Link>
  );
}
