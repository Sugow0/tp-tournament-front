import { ArrowLeft, Swords } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { Link, redirect, useFetcher, useLoaderData } from "react-router";
import { CombatArena } from "~/components/combat/CombatArena";
import { ErrorState } from "~/components/shared/ErrorState";
import { Button } from "~/components/ui/button";
import { isCombatOver, resolveOutcome } from "~/lib/combat-rules";
import { getClassSkills, listClasses } from "~/services/classes.service";
import { getCombat, startCombat, submitAction } from "~/services/combats.service";
import { getDuel, setDuelOutcome } from "~/services/duels.service";
import { listPlayers } from "~/services/players.service";
import type { ChampionClass } from "~/types/combat";
import type { DuelOutcome } from "~/types/duel";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const tournamentId = Number(params.id);
  const duelId = Number(params.duelId);
  const combatId = new URL(request.url).searchParams.get("combatId");

  const [duel, players, classes] = await Promise.all([
    getDuel(duelId),
    listPlayers(tournamentId),
    listClasses(),
  ]);

  if (combatId) {
    const combat = await getCombat(Number(combatId));
    const [class1Skills, class2Skills] = await Promise.all([
      getClassSkills(combat.champion1.classId),
      getClassSkills(combat.champion2.classId),
    ]);
    return { duel, players, classes, combat, class1Skills, class2Skills };
  }

  return { duel, players, classes, combat: null, class1Skills: [], class2Skills: [] };
}

function outcomeFromWinnerSlot(winnerSlot: 1 | 2 | null): DuelOutcome {
  if (winnerSlot === 1) return "PLAYER1_WIN";
  if (winnerSlot === 2) return "PLAYER2_WIN";
  return "DRAW";
}

export async function action({ params, request }: ActionFunctionArgs) {
  const tournamentId = Number(params.id);
  const duelId = Number(params.duelId);
  const form = await request.formData();
  const intent = form.get("intent") as string;
  const urlCombatId = new URL(request.url).searchParams.get("combatId");

  switch (intent) {
    case "startCombat": {
      const combat = await startCombat({
        champion1: {
          name: form.get("champion1Name") as string,
          classId: Number(form.get("champion1ClassId")),
          level: Number(form.get("champion1Level")),
        },
        champion2: {
          name: form.get("champion2Name") as string,
          classId: Number(form.get("champion2ClassId")),
          level: Number(form.get("champion2Level")),
        },
      });
      return redirect(`/tournaments/${tournamentId}/duels/${duelId}/play?combatId=${combat.id}`);
    }
    case "submit": {
      const combatId = Number(form.get("combatId") ?? urlCombatId);
      const slot = Number(form.get("slot")) as 1 | 2;
      const skillId = Number(form.get("skillId"));
      return submitAction(combatId, { slot, skillId });
    }
    case "validateResult": {
      const combatId = Number(form.get("combatId") ?? urlCombatId);
      const combat = await getCombat(combatId);
      const { winnerSlot } = resolveOutcome(combat);
      await setDuelOutcome(duelId, { outcome: outcomeFromWinnerSlot(winnerSlot) });
      return redirect(`/tournaments/${tournamentId}/duels`);
    }
    default:
      return null;
  }
}

function ClassLevelColumn({
  slot,
  playerName,
  classes,
}: {
  slot: 1 | 2;
  playerName: string;
  classes: ChampionClass[];
}) {
  const { t } = useTranslation();
  const prefix = `champion${slot}`;

  return (
    <fieldset className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-arena-surface)] p-4">
      <legend className="px-2 font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-gold)]">
        {playerName}
      </legend>
      <input type="hidden" name={`${prefix}Name`} value={playerName} />

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${prefix}-class`}
          className="font-ui text-sm text-[var(--color-text-muted)]"
        >
          {t("combat.class")}
        </label>
        <select
          id={`${prefix}-class`}
          name={`${prefix}ClassId`}
          defaultValue={classes[0]?.id}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-arena-bg)] px-3 py-2 font-ui text-sm text-[var(--color-text)] focus:ring-2 focus:ring-[var(--color-gold)]/20"
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={`${prefix}-level`}
          className="font-ui text-sm text-[var(--color-text-muted)]"
        >
          {t("combat.level")}
        </label>
        <input
          id={`${prefix}-level`}
          name={`${prefix}Level`}
          type="number"
          min={1}
          defaultValue={1}
          className="rounded-md border border-[var(--color-border)] bg-[var(--color-arena-bg)] px-3 py-2 font-ui text-sm text-[var(--color-text-bright)]"
        />
      </div>
    </fieldset>
  );
}

export default function DuelPlay() {
  const { duel, players, classes, combat, class1Skills, class2Skills } =
    useLoaderData<typeof loader>();
  const { t } = useTranslation();
  const setupFetcher = useFetcher();
  const resultFetcher = useFetcher();

  const playerMap = Object.fromEntries(players.map((p) => [p.id, p.name]));
  const player1Name = playerMap[duel.player1Id] ?? `#${duel.player1Id}`;
  const player2Name = playerMap[duel.player2Id] ?? `#${duel.player2Id}`;

  if (classes.length === 0) {
    return <ErrorState message={t("combat.unavailable")} />;
  }

  const over = combat ? isCombatOver(combat) : false;
  const resultOutcome = combat ? outcomeFromWinnerSlot(resolveOutcome(combat).winnerSlot) : null;

  return (
    <div className="flex flex-col gap-6">
      <Link
        to={`/tournaments/${duel.tournamentId}/duels`}
        className="inline-flex items-center gap-1.5 font-ui text-sm text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-gold)]"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        {t("nav.duels")}
      </Link>

      <h2 className="font-heading text-lg font-semibold text-[var(--color-text-bright)]">
        {player1Name} {t("combat.vs")} {player2Name}
      </h2>

      {!combat ? (
        <setupFetcher.Form method="post" className="flex flex-col gap-4">
          <input type="hidden" name="intent" value="startCombat" />
          <p className="font-ui text-sm text-[var(--color-text-muted)]">{t("duel.setup")}</p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ClassLevelColumn slot={1} playerName={player1Name} classes={classes} />
            <ClassLevelColumn slot={2} playerName={player2Name} classes={classes} />
          </div>
          <Button
            type="submit"
            disabled={setupFetcher.state !== "idle"}
            className="self-start bg-[var(--color-royal)] font-ui font-bold text-white hover:bg-[var(--color-royal)]/80"
          >
            <Swords size={16} aria-hidden="true" />
            {t("duel.play")}
          </Button>
        </setupFetcher.Form>
      ) : (
        <div className="flex flex-col gap-6">
          {/* CombatArena renders CombatBoard, whose plain Form posts intent=submit
              to this route; combatId is supplied as a hidden input (combat.id),
              matching the ?combatId search param the loader/action read. */}
          <CombatArena
            combat={combat}
            class1Skills={class1Skills}
            class2Skills={class2Skills}
            classes={classes}
          />

          {over && (
            <resultFetcher.Form method="post" className="self-center text-center">
              <input type="hidden" name="intent" value="validateResult" />
              <input type="hidden" name="combatId" value={combat.id} />
              {resultOutcome && (
                <p className="mb-2 font-ui text-sm text-[var(--color-text-muted)]">
                  {t(`duel.outcome.${resultOutcome}`)}
                </p>
              )}
              <Button
                type="submit"
                disabled={resultFetcher.state !== "idle"}
                className="bg-[var(--color-victory)] font-ui font-bold text-white"
              >
                {t("duel.validateResult")}
              </Button>
            </resultFetcher.Form>
          )}
        </div>
      )}
    </div>
  );
}

export function ErrorBoundary() {
  const { t } = useTranslation();
  return <ErrorState message={t("combat.unavailable")} />;
}
