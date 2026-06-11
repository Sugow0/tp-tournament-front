import { Check } from "lucide-react";
import { Fragment } from "react";
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
    <ol className="flex items-center w-full overflow-x-auto pb-1">
      {STEPS.map((step, i) => {
        const isCurrent = i === current;
        const isDone = i < current;
        const isLast = i === STEPS.length - 1;

        return (
          <Fragment key={step.status}>
            <li
              aria-current={isCurrent ? "step" : undefined}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 px-1"
            >
              {/* Circle */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300",
                  isCurrent &&
                    "border-[var(--color-royal)] bg-[var(--color-royal)] text-white shadow-[0_0_14px_rgba(74,108,247,0.7)] scale-110",
                  isDone &&
                    "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-arena-bg)]",
                  !isCurrent &&
                    !isDone &&
                    "border-[var(--color-border-strong)] bg-[var(--color-arena-elevated)] text-[var(--color-text-muted)]"
                )}
                aria-hidden="true"
              >
                {isDone ? <Check size={13} /> : i + 1}
              </div>
              {/* Label */}
              <span
                className={cn(
                  "text-xs font-ui whitespace-nowrap",
                  isCurrent && "text-[var(--color-royal)] font-bold",
                  isDone && "text-[var(--color-gold)] font-semibold",
                  !isCurrent && !isDone && "text-[var(--color-text-muted)]"
                )}
              >
                {t(step.key)}
              </span>
            </li>

            {/* Connector */}
            {!isLast && (
              <div
                aria-hidden="true"
                className="flex-1 min-w-[20px] h-[2px] mb-6 mx-1 rounded-full transition-all duration-500"
                style={{
                  background: isDone
                    ? "linear-gradient(90deg, var(--color-gold), rgba(240,168,50,0.4))"
                    : "var(--color-border)",
                }}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}
