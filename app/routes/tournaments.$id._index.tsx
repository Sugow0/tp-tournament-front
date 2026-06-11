import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import type { Tournament } from "~/types/tournament";

interface OutletContext {
  tournament: Tournament;
}

export default function TournamentOverview() {
  const { tournament } = useOutletContext<OutletContext>();
  const { t } = useTranslation();

  const createdAt = format(new Date(tournament.createdAt), "d MMMM yyyy 'à' HH:mm", {
    locale: fr,
  });

  return (
    <Card className="border-[var(--color-parchment-border)] bg-[var(--color-parchment-dark)]">
      <CardHeader>
        <h2 className="font-heading text-base font-semibold text-[var(--color-ink)]">
          {tournament.name}
        </h2>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3 text-sm font-ui">
          <div>
            <dt className="text-[var(--color-brown-mid)]">{t("tournament.stepper.open")}</dt>
            <dd className="text-[var(--color-ink)] font-medium">{createdAt}</dd>
          </div>
          <div>
            <dt className="text-[var(--color-brown-mid)]">Statut</dt>
            <dd className="text-[var(--color-ink)] font-medium">
              {t(`tournament.status.${tournament.status}`)}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
