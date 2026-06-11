import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { AddPlayerForm } from "~/components/player/AddPlayerForm";
import { DisqualifyButton } from "~/components/player/DisqualifyButton";
import { PenaltyForm } from "~/components/player/PenaltyForm";
import { PlayerCard } from "~/components/player/PlayerCard";
import { addPenalty, addPlayer, disqualifyPlayer, listPlayers } from "~/services/players.service";

export async function loader({ params }: LoaderFunctionArgs) {
  const players = await listPlayers(Number(params.id));
  return { players };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;
  const tournamentId = Number(params.id);

  switch (intent) {
    case "addPlayer": {
      const name = form.get("name") as string;
      return addPlayer(tournamentId, { name });
    }
    case "disqualify": {
      const playerId = Number(form.get("playerId"));
      return disqualifyPlayer(tournamentId, playerId);
    }
    case "addPenalty": {
      const playerId = Number(form.get("playerId"));
      const penaltyPoints = Number(form.get("penaltyPoints"));
      return addPenalty(tournamentId, playerId, { penaltyPoints });
    }
    default:
      return null;
  }
}

export default function TournamentPlayers() {
  const { players } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)] mb-3">
          {t("player.addTitle")}
        </h2>
        <AddPlayerForm />
      </section>
      <section>
        <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)] mb-3">
          {t("player.listTitle")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {players.map((player) => (
            <PlayerCard key={player.playerId} player={player}>
              <div className="flex gap-2 mt-1">
                <DisqualifyButton playerId={player.playerId} isDisqualified={player.isDisqualified} />
                <PenaltyForm playerId={player.playerId} />
              </div>
            </PlayerCard>
          ))}
        </div>
      </section>
    </div>
  );
}
