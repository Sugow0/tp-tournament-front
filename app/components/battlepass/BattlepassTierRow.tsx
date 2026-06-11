import { Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import type { BattlepassTier } from "~/types/battlepass";

interface Props {
  tier: BattlepassTier;
}

export function BattlepassTierRow({ tier }: Props) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center gap-4 rounded-sm border px-4 py-3 ${
        tier.isPremium
          ? "border-[var(--color-gold)]/40 bg-[var(--color-gold-muted)]"
          : "border-[var(--color-border)] bg-card"
      }`}
    >
      <div className="flex flex-shrink-0 h-10 w-10 items-center justify-center rounded-sm border border-[var(--color-border)] bg-[var(--color-arena-surface)]">
        <span className="font-heading text-lg text-[var(--color-text-bright)]">
          {tier.tierNumber}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-ui text-sm text-[var(--color-text)]">
            {t("battlepass.tier")} {tier.tierNumber}
          </span>
          {tier.isPremium && (
            <Badge
              variant="outline"
              className="gap-1 border-[var(--color-gold)]/50 text-[var(--color-gold)]"
            >
              <Crown size={12} className="text-[var(--color-gold)]" />
              {t("battlepass.premium")}
            </Badge>
          )}
        </div>
        <p className="font-ui text-xs text-[var(--color-text-muted)]">
          {tier.rewardType} · {tier.rewardData}
        </p>
      </div>

      <div className="flex-shrink-0 text-right">
        <span className="font-ui text-sm text-[var(--color-text-bright)]">{tier.xpRequired}</span>
        <span className="ml-1 font-ui text-xs uppercase text-[var(--color-text-muted)]">
          {t("battlepass.xp")}
        </span>
      </div>
    </div>
  );
}
