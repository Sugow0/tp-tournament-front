import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import type { SeasonStatus } from "~/types/season";

const configs: Record<SeasonStatus, { dot: string; badge: string }> = {
  UPCOMING: {
    dot: "bg-[var(--color-draw)] shadow-[0_0_6px_var(--color-draw)]",
    badge:
      "bg-[var(--color-draw)]/10 text-[var(--color-draw)] border border-[var(--color-draw)]/35",
  },
  ACTIVE: {
    dot: "bg-[var(--color-victory)] shadow-[0_0_6px_var(--color-victory)] animate-pulse",
    badge:
      "bg-[var(--color-victory)]/10 text-[var(--color-victory)] border border-[var(--color-victory)]/35",
  },
  ENDED: {
    dot: "bg-[var(--color-text-muted)]/60",
    badge:
      "bg-[var(--color-arena-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
  },
};

interface Props {
  status: SeasonStatus;
}

export function SeasonStatusBadge({ status }: Props) {
  const { t } = useTranslation();
  const config = configs[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-ui font-semibold flex-shrink-0",
        config.badge
      )}
    >
      <span
        aria-hidden="true"
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", config.dot)}
      />
      {t(`season.status.${status}`)}
    </span>
  );
}
