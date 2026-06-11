import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import type { Player } from "~/types/player";

interface Props {
  player: Player;
  children?: ReactNode;
}

export function PlayerCard({ player, children }: Props) {
  const { t } = useTranslation();

  return (
    <div className="cr-card relative rounded-xl bg-[var(--color-arena-mid)] border border-[var(--color-border)] p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="font-heading text-[var(--color-text-bright)] text-base font-semibold">
          {player.name}
        </span>
        {player.penaltyPoints > 0 && (
          <span
            data-testid="penalty-badge"
            className="px-2 py-0.5 rounded-full text-xs font-bold bg-[var(--color-battle)]/20 text-[var(--color-battle)] border border-[var(--color-battle)]/40"
          >
            {player.penaltyPoints}
          </span>
        )}
      </div>
      {player.isDisqualified && (
        <span className="text-xs font-ui text-[var(--color-text-muted)] italic">
          {t("player.disqualified")}
        </span>
      )}
      {children}
    </div>
  );
}
