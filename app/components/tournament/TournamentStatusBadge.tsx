import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import type { TournamentStatus } from "~/types/tournament";

const configs: Record<TournamentStatus, { dot: string; badge: string }> = {
  OPEN: {
    dot: "bg-[var(--color-victory)] shadow-[0_0_6px_var(--color-victory)]",
    badge:
      "bg-[var(--color-victory)]/10 text-[var(--color-victory)] border border-[var(--color-victory)]/35",
  },
  IN_PROGRESS: {
    dot: "bg-[var(--color-royal)] shadow-[0_0_6px_rgba(74,108,247,0.8)] animate-pulse",
    badge:
      "bg-[var(--color-royal)]/10 text-[var(--color-royal)] border border-[var(--color-royal)]/35",
  },
  CLOSED: {
    dot: "bg-[var(--color-text-muted)]/60",
    badge:
      "bg-[var(--color-arena-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
  },
};

interface Props {
  status: TournamentStatus;
}

export function TournamentStatusBadge({ status }: Props) {
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
      {t(`tournament.status.${status}`)}
    </span>
  );
}
