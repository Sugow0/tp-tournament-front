import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import type { Player } from "~/types/player";

interface Props {
  players: Player[];
  nextOrder: number;
}

export function CreateDuelForm({ players, nextOrder }: Props) {
  const { t } = useTranslation();

  return (
    <Form method="post" className="flex flex-wrap items-end gap-3">
      <input type="hidden" name="intent" value="createDuel" />
      <input type="hidden" name="duelOrder" value={nextOrder} />
      <div className="flex flex-col gap-1">
        <label htmlFor="duel-player1" className="text-xs font-ui text-[var(--color-text-muted)]">
          {t("duel.player1Label")}
        </label>
        <select
          id="duel-player1"
          name="player1Id"
          className="rounded bg-[var(--color-arena-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-2 py-1 text-sm font-ui"
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="duel-player2" className="text-xs font-ui text-[var(--color-text-muted)]">
          {t("duel.player2Label")}
        </label>
        <select
          id="duel-player2"
          name="player2Id"
          className="rounded bg-[var(--color-arena-surface)] border border-[var(--color-border)] text-[var(--color-text)] px-2 py-1 text-sm font-ui"
        >
          {players.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>
      <Button type="submit">{t("duel.new")}</Button>
    </Form>
  );
}
