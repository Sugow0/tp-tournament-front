import { Crown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import type { Skin } from "~/types/skin";

interface Props {
  skin: Skin;
  children?: React.ReactNode;
}

export function SkinCard({ skin, children }: Props) {
  const { t } = useTranslation();

  return (
    <div className="cr-card relative bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] rounded-xl overflow-hidden border border-[var(--color-border)]">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-80" />
      <div className="px-5 pt-5 pb-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base font-semibold text-[var(--color-text-bright)] leading-snug truncate">
            {skin.name}
          </h3>
          {skin.isPremium && (
            <span className="flex items-center gap-1 text-[var(--color-gold)] text-xs font-ui font-semibold">
              <Crown size={14} className="flex-shrink-0" />
              {t("skin.premium")}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-ui text-[var(--color-text-muted)]">
            {t(`skin.categories.${skin.category}`)}
          </Badge>
        </div>
        <p className="font-ui text-xs text-[var(--color-text-muted)] tracking-wide truncate">
          {skin.assetKey}
        </p>
        {children}
      </div>
    </div>
  );
}
