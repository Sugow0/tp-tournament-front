import { Check, Swords, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge, type BadgeProps } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import type { Challenge } from "~/types/challenge";

interface ChallengeCardProps {
  challenge: Challenge;
  /** Used to tell incoming (opponent) from outgoing (challenger) challenges. */
  currentUserId: number;
  onAccept?: (challenge: Challenge) => void;
  onDecline?: (challenge: Challenge) => void;
  busy?: boolean;
}

const STATUS_VARIANT: Record<Challenge["status"], BadgeProps["variant"]> = {
  PENDING: "secondary",
  ACCEPTED: "default",
  DECLINED: "destructive",
};

export function ChallengeCard({
  challenge,
  currentUserId,
  onAccept,
  onDecline,
  busy,
}: ChallengeCardProps) {
  const { t } = useTranslation();

  const isIncoming = challenge.opponentUserId === currentUserId;
  const isActionable = isIncoming && challenge.status === "PENDING";

  return (
    <div className="flex flex-col gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-arena-surface)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-3">
        <span className="min-w-0 truncate font-ui text-sm text-[var(--color-text)]">
          {challenge.challengerEmail}
        </span>
        <span className="flex flex-shrink-0 items-center gap-1 font-heading text-xs uppercase tracking-wide text-[var(--color-text-muted)]">
          <Swords size={14} aria-hidden="true" />
          {t("challenges.vs")}
        </span>
        <span className="min-w-0 truncate font-ui text-sm text-[var(--color-text)]">
          {challenge.opponentEmail}
        </span>
      </div>

      <div className="flex flex-shrink-0 items-center gap-2">
        <Badge variant={STATUS_VARIANT[challenge.status]} className="font-ui">
          {t(`challenges.status.${challenge.status}`)}
        </Badge>

        {isActionable && (
          <>
            <Button
              type="button"
              size="sm"
              onClick={() => onAccept?.(challenge)}
              disabled={busy}
              aria-label={t("challenges.accept")}
            >
              <Check aria-hidden="true" />
              {t("challenges.accept")}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onDecline?.(challenge)}
              disabled={busy}
              aria-label={t("challenges.decline")}
            >
              <X aria-hidden="true" />
              {t("challenges.decline")}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
