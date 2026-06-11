import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Trophy } from "lucide-react";
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
      <div className="cr-card relative bg-[var(--color-arena-mid)] rounded-xl border border-[var(--color-border)] group-hover:border-[var(--color-gold)]/60 group-hover:shadow-[0_0_20px_var(--color-gold-glow)] transition-all duration-300 cursor-pointer">
        {/* Top gold accent line */}
        <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/50 to-transparent" />

        <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Trophy
              size={16}
              className="text-[var(--color-gold)] flex-shrink-0 group-hover:text-[var(--color-gold-bright)] transition-colors"
            />
            <h2 className="font-heading text-base md:text-lg text-[var(--color-text-bright)] truncate">
              {tournament.name}
            </h2>
          </div>
          <TournamentStatusBadge status={tournament.status} />
        </div>
        <div className="px-4 pb-4">
          <p className="font-ui text-xs text-[var(--color-text-muted)]">{date}</p>
        </div>
      </div>
    </Link>
  );
}
