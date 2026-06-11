import { CheckCircle2, Target, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import { Progress } from "~/components/ui/progress";
import type { Objective, PlayerObjectiveProgress } from "~/types/objective";

interface Props {
  objective: Objective;
  progress?: PlayerObjectiveProgress;
  children?: React.ReactNode;
}

export function ObjectiveCard({ objective, progress, children }: Props) {
  const { t } = useTranslation();

  const percent =
    progress && objective.targetValue > 0
      ? Math.min(100, Math.round((progress.currentValue / objective.targetValue) * 100))
      : 0;

  return (
    <div className="cr-card relative bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] rounded-xl overflow-hidden border border-[var(--color-border)]">
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-80" />
      <div className="px-5 pt-5 pb-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-base font-semibold text-[var(--color-text-bright)] leading-snug">
            {objective.name}
          </h3>
          {progress?.isCompleted && (
            <span
              className="flex items-center gap-1 text-xs font-ui font-semibold"
              style={{ color: "var(--color-victory)" }}
            >
              <CheckCircle2 size={14} className="flex-shrink-0" />
              {t("objective.completed")}
            </span>
          )}
        </div>

        <p className="font-ui text-xs text-[var(--color-text-muted)] tracking-wide">
          {objective.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-ui text-[var(--color-text-muted)]">
            {t(`objective.reset.${objective.resetType}`)}
          </Badge>
          <span className="flex items-center gap-1 font-ui text-xs text-[var(--color-text-muted)]">
            <Target size={13} className="flex-shrink-0" />
            {t("objective.target")}: {objective.targetValue}
          </span>
          <span className="flex items-center gap-1 font-ui text-xs text-[var(--color-gold)]">
            <Trophy size={13} className="flex-shrink-0" />
            {objective.xpReward} {t("objective.xpReward")}
          </span>
        </div>

        {progress && (
          <div className="flex flex-col gap-1.5">
            <Progress value={percent} className="bg-[var(--color-arena-bg)]" />
            <span className="font-ui text-[0.7rem] text-[var(--color-text-muted)] tabular-nums">
              {progress.currentValue} / {objective.targetValue}
            </span>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
