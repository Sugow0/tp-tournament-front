import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import type { Duel } from "~/types/duel";
import { EndDuelForm } from "./EndDuelForm";
import { SetOutcomeForm } from "./SetOutcomeForm";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

interface Props {
  duel: Duel;
  player1Name: string;
  player2Name: string;
}

export function DuelCard({ duel, player1Name, player2Name }: Props) {
  const { t } = useTranslation();
  const isEnded = duel.durationSeconds !== null;

  return (
    <div className="cr-card relative rounded-xl bg-[var(--color-arena-mid)] border border-[var(--color-border)] p-4 flex flex-col gap-3">
      <div className="flex items-center justify-center gap-3 text-[var(--color-text-bright)] font-heading text-sm font-semibold">
        <span>{player1Name}</span>
        <span className="text-[var(--color-gold)] text-xs">vs</span>
        <span>{player2Name}</span>
      </div>

      <div className="flex items-center justify-between text-xs font-ui">
        {duel.outcome === null ? (
          <span className="text-[var(--color-text-muted)]">{t("duel.pending")}</span>
        ) : (
          <span className="text-[var(--color-victory)] font-semibold">
            {t(`duel.outcome.${duel.outcome}`)}
          </span>
        )}
        {isEnded && (
          <span className="text-[var(--color-text-muted)]">
            {formatDuration(duel.durationSeconds as number)}
          </span>
        )}
      </div>

      {!duel.outcome && (
        <div className="border-t border-[var(--color-border)] pt-3">
          <SetOutcomeForm duelId={duel.id} />
        </div>
      )}

      {duel.outcome && !isEnded && (
        <div className="border-t border-[var(--color-border)] pt-3">
          <EndDuelForm duelId={duel.id} />
        </div>
      )}

      <Link
        to={`/tournaments/${duel.tournamentId}/duels/${duel.id}/replay`}
        className="font-ui text-xs text-[var(--color-gold)] hover:underline self-center"
      >
        {t("replay.view")}
      </Link>
    </div>
  );
}
