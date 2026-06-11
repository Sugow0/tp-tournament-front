import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import type { TournamentStatus } from "~/types/tournament";

const styleMap: Record<TournamentStatus, string> = {
  OPEN: "bg-[var(--color-victory-muted)] text-[var(--color-victory)] border border-[var(--color-victory)]/40",
  IN_PROGRESS:
    "bg-[var(--color-royal-muted)] text-[var(--color-royal)] border border-[var(--color-royal)]/40",
  CLOSED:
    "bg-[var(--color-arena-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]",
};

interface Props {
  status: TournamentStatus;
}

export function TournamentStatusBadge({ status }: Props) {
  const { t } = useTranslation();
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-ui font-semibold",
        styleMap[status]
      )}
    >
      {t(`tournament.status.${status}`)}
    </span>
  );
}
