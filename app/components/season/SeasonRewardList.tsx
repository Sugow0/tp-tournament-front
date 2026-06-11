import { useTranslation } from "react-i18next";
import { EmptyState } from "~/components/shared/EmptyState";
import { Badge } from "~/components/ui/badge";
import type { SeasonReward } from "~/types/season";

interface Props {
  rewards: SeasonReward[];
}

function formatRange(reward: SeasonReward) {
  if (reward.rankMax == null || reward.rankMax === reward.rankMin) {
    return `#${reward.rankMin}`;
  }
  return `#${reward.rankMin}–${reward.rankMax}`;
}

export function SeasonRewardList({ rewards }: Props) {
  const { t } = useTranslation();

  if (rewards.length === 0) {
    return (
      <EmptyState
        title={t("season.rewards.empty.title")}
        description={t("season.rewards.empty.description")}
      />
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {rewards.map((reward) => (
        <li
          key={reward.id}
          className="flex items-center justify-between gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-arena-mid)] px-4 py-3"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="font-heading text-sm font-semibold text-[var(--color-gold)] flex-shrink-0">
              {formatRange(reward)}
            </span>
            <span className="font-ui text-sm text-[var(--color-text-bright)] truncate">
              {reward.label}
            </span>
          </div>
          <Badge variant="outline" className="font-ui text-[var(--color-text-muted)] flex-shrink-0">
            {reward.rewardType}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
