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
    <ol className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        return (
          <li
            key={step.status}
            aria-current={isCurrent ? "step" : undefined}
            className={cn(
              "flex items-center gap-2 text-sm font-ui px-3 py-1.5 rounded-full transition-colors",
              isCurrent && "bg-[var(--color-crimson)] text-white font-semibold",
              isDone && "text-[var(--color-gold)]",
              !isCurrent && !isDone && "text-[var(--color-brown-mid)]"
            )}
          >
            <span
              className={cn(
                "w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs",
                isCurrent && "border-white bg-white text-[var(--color-crimson)]",
                isDone && "border-[var(--color-gold)] bg-[var(--color-gold)] text-white",
                !isCurrent && !isDone && "border-current"
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
