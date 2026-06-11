import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import type { DuelOutcome } from "~/types/duel";

const OUTCOMES: DuelOutcome[] = ["PLAYER1_WIN", "PLAYER2_WIN", "DRAW"];

interface Props {
  duelId: number;
}

export function SetOutcomeForm({ duelId }: Props) {
  const { t } = useTranslation();
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" className="flex items-center gap-2">
      <input type="hidden" name="intent" value="setOutcome" />
      <input type="hidden" name="duelId" value={duelId} />
      <select
        name="outcome"
        defaultValue="PLAYER1_WIN"
        className="rounded bg-[var(--color-arena-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-2 py-1 text-sm font-ui"
      >
        {OUTCOMES.map((o) => (
          <option key={o} value={o}>
            {t(`duel.outcome.${o}`)}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm">
        {t("duel.setOutcome")}
      </Button>
    </fetcher.Form>
  );
}
