import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Tournament } from "~/types/tournament";
import { TournamentStatusBadge } from "./TournamentStatusBadge";

interface Props {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: Props) {
  const date = format(new Date(tournament.createdAt), "d MMM yyyy", { locale: fr });

  return (
    <Link to={`/tournaments/${tournament.id}`}>
      <Card className="hover:shadow-md transition-shadow border-[var(--color-parchment-border)] bg-[var(--color-parchment-dark)] cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <h2 className="font-heading text-lg font-semibold text-[var(--color-ink)]">
            {tournament.name}
          </h2>
          <TournamentStatusBadge status={tournament.status} />
        </CardHeader>
        <CardContent>
          <p className="font-ui text-xs text-[var(--color-brown-mid)]">{date}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
