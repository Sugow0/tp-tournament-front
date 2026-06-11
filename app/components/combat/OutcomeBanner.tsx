import { useTranslation } from "react-i18next";
import { type Outcome, resolveOutcome } from "~/lib/combat-rules";
import type { Combat } from "~/types/combat";

interface Props {
  combat: Combat;
}

const OUTCOME_KEY: Record<Outcome, string> = {
  WIN: "combat.win",
  DRAW: "combat.draw",
  LOSS: "combat.loss",
};

const OUTCOME_COLOR: Record<Outcome, string> = {
  WIN: "var(--color-victory)",
  DRAW: "var(--color-draw)",
  LOSS: "var(--color-battle)",
};

interface SideProps {
  name: string;
  outcome: Outcome;
  points: number;
}

function OutcomeSide({ name, outcome, points }: SideProps) {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-1 flex-col items-center gap-1 rounded-xl border p-4 ${
        outcome === "WIN"
          ? "shimmer-gold border-[var(--color-gold)]"
          : "border-[var(--color-border)]"
      }`}
    >
      <span className="font-heading text-sm text-[var(--color-text-bright)]">{name}</span>
      <span
        className="font-display text-2xl font-bold uppercase tracking-wide"
        style={{ color: OUTCOME_COLOR[outcome] }}
      >
        {t(OUTCOME_KEY[outcome])}
      </span>
      <span className="font-ui text-sm font-semibold text-[var(--color-gold)]">
        +{points} {t("combat.points")}
      </span>
    </div>
  );
}

export function OutcomeBanner({ combat }: Props) {
  const result = resolveOutcome(combat);

  return (
    <div className="cr-card flex flex-col gap-4 rounded-xl border border-[var(--color-gold)]/50 bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] p-5">
      <div className="flex flex-col gap-3 sm:flex-row">
        <OutcomeSide name={combat.champion1.name} outcome={result.slot1} points={result.points1} />
        <OutcomeSide name={combat.champion2.name} outcome={result.slot2} points={result.points2} />
      </div>
    </div>
  );
}
