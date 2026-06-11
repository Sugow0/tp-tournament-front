import { ScrollText } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { CombatLogEntry } from "~/types/combat";

interface Props {
  log: CombatLogEntry[];
}

export function CombatLog({ log }: Props) {
  const { t } = useTranslation();

  const byTurn = new Map<number, string[]>();
  for (const entry of log) {
    const list = byTurn.get(entry.turn) ?? [];
    list.push(entry.message);
    byTurn.set(entry.turn, list);
  }
  const turns = [...byTurn.keys()].sort((a, b) => b - a);

  return (
    <div className="cr-card flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-arena-mid)]/60 p-4">
      <h3 className="flex items-center gap-2 font-heading text-sm font-semibold uppercase tracking-wide text-[var(--color-gold)]">
        <ScrollText size={14} aria-hidden="true" />
        {t("combat.log")}
      </h3>
      <ol className="flex flex-col gap-3">
        {turns.map((turn) => (
          <li key={turn} className="flex flex-col gap-1">
            <span className="font-ui text-[0.65rem] uppercase tracking-widest text-[var(--color-text-muted)]">
              {t("combat.turn")} {turn}
            </span>
            {(byTurn.get(turn) ?? []).map((message, i) => (
              <p
                // biome-ignore lint/suspicious/noArrayIndexKey: log entries within a turn are append-only and never reordered
                key={`${turn}-${i}-${message}`}
                className="font-ui text-sm leading-snug text-[var(--color-text)]"
              >
                {message}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </div>
  );
}
