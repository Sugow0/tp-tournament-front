import { Check, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { hpPercent } from "~/lib/combat-rules";
import type { CombatantState } from "~/types/combat";

interface Props {
  champion: CombatantState;
  /** The champion's class name (display label). */
  className: string;
}

export function ChampionPanel({ champion, className }: Props) {
  const { t } = useTranslation();
  const pct = hpPercent(champion);

  return (
    <div className="cr-card flex flex-col gap-3 rounded-xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate font-heading text-lg font-semibold text-[var(--color-text-bright)]">
            {champion.name}
          </h3>
          <p className="font-ui text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            <Shield size={11} className="mr-1 inline" aria-hidden="true" />
            {className} · {t("combat.level")} {champion.level}
          </p>
        </div>
        {champion.hasSubmitted && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-victory-muted)] px-2 py-0.5 font-ui text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--color-victory)]">
            <Check size={11} aria-hidden="true" />
            {t("combat.validate")}
          </span>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between font-ui text-xs text-[var(--color-text-muted)]">
          <span>HP</span>
          <span className="text-[var(--color-text-bright)]">
            {champion.currentHp} / {champion.maxHp}
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-arena-mid)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-battle)] to-[var(--color-victory)] transition-all"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={champion.currentHp}
            aria-valuemin={0}
            aria-valuemax={champion.maxHp}
          />
        </div>
      </div>

      {champion.effects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {champion.effects.map((effect) => (
            <span
              key={`${effect.effectType}-${effect.remainingTurns}`}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--color-magic)]/15 px-2 py-0.5 font-ui text-[0.6rem] uppercase tracking-wide text-[var(--color-magic)]"
            >
              {effect.effectType} ({effect.remainingTurns})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
