import { Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PlayerScore } from "~/types/score";

interface Props {
  champion: PlayerScore;
}

export function ChampionBanner({ champion }: Props) {
  const { t } = useTranslation();

  return (
    <div className="relative overflow-hidden rounded-xl border border-[var(--color-gold)]/30 bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] px-6 py-5">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--color-gold)]/30 bg-[var(--color-gold)]/10">
          <Crown size={22} className="text-[var(--color-gold)]" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-ui text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
            {t("ranking.champion")}
          </p>
          <h2 className="shimmer-gold font-heading text-xl font-semibold text-[var(--color-gold)]">
            {champion.playerName}
          </h2>
          <p className="font-ui text-sm text-[var(--color-text-muted)]">
            {t("ranking.score")}: {champion.finalScore}
          </p>
        </div>
      </div>
    </div>
  );
}
