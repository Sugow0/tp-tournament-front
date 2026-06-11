import { Swords, UserMinus, UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import type { User } from "~/types/friend";

interface FriendCardProps {
  user: User;
  /** When provided, shows a "Défier" button (existing friends). */
  onChallenge?: (user: User) => void;
  /** When provided, shows a "Retirer" button (existing friends). */
  onRemove?: (user: User) => void;
  /** When provided, shows an "Ajouter" button (candidate users). */
  onAdd?: (user: User) => void;
  /** Disables all actions while a request is in flight. */
  busy?: boolean;
}

export function FriendCard({ user, onChallenge, onRemove, onAdd, busy }: FriendCardProps) {
  const { t } = useTranslation();
  const initial = user.email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-3 rounded-sm border border-[var(--color-border)] bg-[var(--color-arena-surface)] px-4 py-3">
      <Avatar className="bg-[var(--color-arena-elevated)]">
        <AvatarFallback className="bg-[var(--color-arena-elevated)] font-heading text-[var(--color-gold)]">
          {initial}
        </AvatarFallback>
      </Avatar>

      <span className="min-w-0 flex-1 truncate font-ui text-sm text-[var(--color-text)]">
        {user.email}
      </span>

      <div className="flex flex-shrink-0 items-center gap-2">
        {onChallenge && (
          <Button
            type="button"
            size="sm"
            onClick={() => onChallenge(user)}
            disabled={busy}
            aria-label={t("friends.challenge")}
          >
            <Swords aria-hidden="true" />
            {t("friends.challenge")}
          </Button>
        )}
        {onAdd && (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => onAdd(user)}
            disabled={busy}
            aria-label={t("friends.add")}
          >
            <UserPlus aria-hidden="true" />
            {t("friends.add")}
          </Button>
        )}
        {onRemove && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => onRemove(user)}
            disabled={busy}
            aria-label={t("friends.remove")}
          >
            <UserMinus aria-hidden="true" />
            {t("friends.remove")}
          </Button>
        )}
      </div>
    </div>
  );
}
