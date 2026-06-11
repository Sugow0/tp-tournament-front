import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { NavLink, Outlet, useLoaderData } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { AdvanceTournamentButton } from "~/components/tournament/AdvanceTournamentButton";
import { TournamentStatusStepper } from "~/components/tournament/TournamentStatusStepper";
import { generatePairings } from "~/lib/bracket";
import { cn } from "~/lib/utils";
import { createDuel, listDuels } from "~/services/duels.service";
import { listPlayers } from "~/services/players.service";
import { getTournament, updateTournamentStatus } from "~/services/tournaments.service";
import type { TournamentStatus } from "~/types/tournament";

export async function loader({ params }: LoaderFunctionArgs) {
  const tournament = await getTournament(Number(params.id));
  return { tournament };
}

async function generateBracket(tournamentId: number) {
  const [players, duels] = await Promise.all([listPlayers(tournamentId), listDuels(tournamentId)]);
  if (duels.length > 0) return;
  const pairings = generatePairings(players);
  for (const pairing of pairings) {
    await createDuel(tournamentId, pairing);
  }
}

export async function action({ params, request }: ActionFunctionArgs) {
  const tournamentId = Number(params.id);
  const form = await request.formData();
  const intent = form.get("intent") as string;

  if (intent === "advanceStatus") {
    const status = form.get("status") as TournamentStatus;
    const tournament = await updateTournamentStatus(tournamentId, { status });
    if (status === "IN_PROGRESS") {
      await generateBracket(tournamentId);
    }
    return tournament;
  }

  return null;
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
        actions={<AdvanceTournamentButton status={tournament.status} />}
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
