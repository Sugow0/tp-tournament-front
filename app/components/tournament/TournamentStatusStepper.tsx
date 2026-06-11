import { useTranslation } from "react-i18next";
import { cn } from "~/lib/utils";
import type { TournamentStatus } from "~/types/tournament";

const STEPS: { status: TournamentStatus; key: string }[] = [
  { status: "OPEN", key: "tournament.stepper.open" },
  { status: "IN_PROGRESS", key: "tournament.stepper.inProgress" },
  { status: "CLOSED", key: "tournament.stepper.closed" },
];

const ORDER: Record<TournamentStatus, number> = {
  OPEN: 0,
  IN_PROGRESS: 1,
  CLOSED: 2,
};

interface Props {
  status: TournamentStatus;
}

export function TournamentStatusStepper({ status }: Props) {
  const { t } = useTranslation();
  const current = ORDER[status];

  return (
    <ol className="flex items-center gap-1 overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        return (
          <li
            key={step.status}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 text-sm font-ui px-3 py-1.5 rounded-full transition-all whitespace-nowrap",
              isCurrent &&
                "bg-[var(--color-royal)] text-white font-bold shadow-[0_0_12px_var(--color-royal-muted)]",
              isDone && "text-[var(--color-gold)] font-semibold",
              !isCurrent && !isDone && "text-[var(--color-text-muted)]"
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs flex-shrink-0",
                isCurrent && "border-white bg-white text-[var(--color-royal)]",
                isDone && "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-arena-bg)]",
                !isCurrent && !isDone && "border-[var(--color-border-strong)]"
              )}
            >
              {isDone ? "✓" : i + 1}
            </span>
            {t(step.key)}
          </li>
        );
      })}
    </ol>
  );
}
