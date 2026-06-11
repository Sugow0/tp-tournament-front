import { useTranslation } from "react-i18next";
import type { LoaderFunctionArgs } from "react-router";
import { NavLink, Outlet, useLoaderData } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { AdvanceTournamentButton } from "~/components/tournament/AdvanceTournamentButton";
import { TournamentStatusStepper } from "~/components/tournament/TournamentStatusStepper";
import { cn } from "~/lib/utils";
import { getTournament } from "~/services/tournaments.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const tournament = await getTournament(Number(params.id));
  return { tournament };
}

const TABS = [
  { to: "", label: "nav.overview", end: true },
  { to: "players", label: "nav.players", end: false },
  { to: "duels", label: "nav.duels", end: false },
  { to: "ranking", label: "nav.ranking", end: false },
  { to: "cosmetics", label: "nav.cosmetics", end: false },
];

export default function TournamentDetail() {
  const { tournament } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <>
      <PageHeader
        title={tournament.name}
        breadcrumb={[
          { label: t("tournament.title"), href: "/tournaments" },
          { label: tournament.name, href: `/tournaments/${tournament.id}` },
        ]}
        actions={
          <AdvanceTournamentButton tournamentId={tournament.id} status={tournament.status} />
        }
      />
      <div className="px-4 md:px-6 pt-4">
        <TournamentStatusStepper status={tournament.status} />
      </div>
      <nav className="px-4 md:px-6 mt-4 flex gap-1 border-b border-[var(--color-border)]">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              cn(
                "px-4 py-2 text-sm font-ui rounded-t transition-colors",
                isActive
                  ? "border-b-2 border-[var(--color-battle)] text-[var(--color-battle)] font-semibold"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-bright)]"
              )
            }
          >
            {t(tab.label)}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 md:p-6">
        <Outlet context={{ tournament }} />
      </div>
    </>
  );
}
