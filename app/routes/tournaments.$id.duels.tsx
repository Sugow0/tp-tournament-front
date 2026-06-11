import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { CreateDuelForm } from "~/components/duel/CreateDuelForm";
import { DuelCard } from "~/components/duel/DuelCard";
import { createDuel, endDuel, listDuels, setDuelOutcome } from "~/services/duels.service";
import { listPlayers } from "~/services/players.service";
import type { DuelOutcome } from "~/types/duel";

export async function loader({ params }: LoaderFunctionArgs) {
  const tournamentId = Number(params.id);
  const [duels, players] = await Promise.all([listDuels(tournamentId), listPlayers(tournamentId)]);
  return { duels, players };
}

export async function action({ params, request }: ActionFunctionArgs) {
  const form = await request.formData();
  const intent = form.get("intent") as string;
  const tournamentId = Number(params.id);

  switch (intent) {
    case "createDuel": {
      const player1Id = Number(form.get("player1Id"));
      const player2Id = Number(form.get("player2Id"));
      const duelOrder = Number(form.get("duelOrder"));
      return createDuel(tournamentId, { player1Id, player2Id, duelOrder });
    }
    case "setOutcome": {
      const duelId = Number(form.get("duelId"));
      const outcome = form.get("outcome") as DuelOutcome;
      return setDuelOutcome(duelId, { outcome });
    }
    case "endDuel": {
      const duelId = Number(form.get("duelId"));
      const durationSeconds = Number(form.get("durationSeconds"));
      return endDuel(duelId, { durationSeconds });
    }
    default:
      return null;
  }
}

export default function TournamentDuels() {
  const { duels, players } = useLoaderData<typeof loader>();
  const { t } = useTranslation();

  const playerMap = Object.fromEntries(players.map((p) => [p.id, p.name]));
  const nextOrder = duels.length + 1;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)] mb-3">
          {t("duel.new")}
        </h2>
        <CreateDuelForm players={players} nextOrder={nextOrder} />
      </section>
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {duels.map((duel) => (
            <DuelCard
              key={duel.id}
              duel={duel}
              player1Name={playerMap[duel.player1Id] ?? `#${duel.player1Id}`}
              player2Name={playerMap[duel.player2Id] ?? `#${duel.player2Id}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
