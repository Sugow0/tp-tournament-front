import { useTranslation } from "react-i18next";
import { Progress } from "~/components/ui/progress";
import type { PlayerBattlepassProgress } from "~/types/battlepass";

interface Props {
  progress: PlayerBattlepassProgress;
  totalTiers: number;
}

export function PlayerProgressPanel({ progress, totalTiers }: Props) {
  const { t } = useTranslation();
  const pct = totalTiers > 0 ? Math.min(100, (progress.currentTier / totalTiers) * 100) : 0;

  return (
    <div className="rounded-sm border border-[var(--color-border)] bg-card p-5">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="font-ui text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("battlepass.progress")}
          </p>
          <p className="font-heading text-xl text-[var(--color-text-bright)]">
            {t("battlepass.tier")} {progress.currentTier} / {totalTiers}
          </p>
        </div>
        <p className="font-ui text-sm text-[var(--color-text)]">
          {progress.currentXp} {t("battlepass.xp")}
        </p>
      </div>
      <Progress value={pct} />
    </div>
  );
}
