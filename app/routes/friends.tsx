import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/shared/EmptyState";
import { ErrorState } from "~/components/shared/ErrorState";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";
import { FriendCard } from "~/components/social/FriendCard";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { createChallenge } from "~/services/challenges.service";
import { addFriend, listFriends, removeFriend } from "~/services/friends.service";
import { listUsers } from "~/services/users.service";
import type { User } from "~/types/friend";

export default function Friends() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();

  const [friends, setFriends] = useState<User[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const userId = user?.id ?? null;

  const load = useCallback(async () => {
    if (userId == null) return;
    setLoading(true);
    setError(false);
    try {
      const [friendList, userList] = await Promise.all([listFriends(userId), listUsers()]);
      setFriends(friendList);
      setUsers(userList);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId != null) load();
  }, [userId, load]);

  const handleAdd = useCallback(
    async (target: User) => {
      if (userId == null) return;
      setBusy(true);
      try {
        await addFriend(userId, { friendUserId: target.id });
        await load();
      } finally {
        setBusy(false);
      }
    },
    [userId, load]
  );

  const handleRemove = useCallback(
    async (target: User) => {
      if (userId == null) return;
      setBusy(true);
      try {
        await removeFriend(userId, target.id);
        await load();
      } finally {
        setBusy(false);
      }
    },
    [userId, load]
  );

  const handleChallenge = useCallback(
    async (target: User) => {
      if (userId == null) return;
      setBusy(true);
      try {
        const challenge = await createChallenge({
          challengerUserId: userId,
          opponentUserId: target.id,
        });
        if (challenge.combatId != null) {
          navigate(`/combats/${challenge.combatId}`);
        } else {
          navigate("/challenges");
        }
      } finally {
        setBusy(false);
      }
    },
    [userId, navigate]
  );

  const friendIds = new Set(friends.map((f) => f.id));
  const candidates = users.filter((u) => u.id !== userId && !friendIds.has(u.id));

  return (
    <>
      <PageHeader title={t("friends.title")} />

      <div className="flex flex-col gap-10 px-4 py-8 sm:px-8 md:py-12 lg:px-14 xl:px-20">
        {userLoading ? (
          <LoadingSpinner />
        ) : user == null ? (
          <EmptyState
            title={t("friends.title")}
            description={t("friends.loginPrompt")}
            action={{ label: t("nav.login"), onClick: () => navigate("/login") }}
          />
        ) : loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={t("friends.error")} onRetry={load} />
        ) : (
          <>
            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-lg uppercase tracking-wide text-[var(--color-text-bright)]">
                {t("friends.current")}
              </h2>
              {friends.length === 0 ? (
                <EmptyState
                  title={t("friends.empty.title")}
                  description={t("friends.empty.description")}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {friends.map((friend) => (
                    <FriendCard
                      key={friend.id}
                      user={friend}
                      onChallenge={handleChallenge}
                      onRemove={handleRemove}
                      busy={busy}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="font-heading text-lg uppercase tracking-wide text-[var(--color-text-bright)]">
                {t("friends.discover")}
              </h2>
              {candidates.length === 0 ? (
                <EmptyState
                  title={t("friends.discoverEmpty.title")}
                  description={t("friends.discoverEmpty.description")}
                />
              ) : (
                <div className="flex flex-col gap-3">
                  {candidates.map((candidate) => (
                    <FriendCard key={candidate.id} user={candidate} onAdd={handleAdd} busy={busy} />
                  ))}
                </div>
              )}
            </section>

            <Link
              to="/challenges"
              className="font-ui text-sm text-[var(--color-gold)] underline-offset-4 hover:underline"
            >
              {t("challenges.title")}
            </Link>
          </>
        )}
      </div>
    </>
  );
}
