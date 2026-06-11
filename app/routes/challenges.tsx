import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { PageHeader } from "~/components/layout/PageHeader";
import { EmptyState } from "~/components/shared/EmptyState";
import { ErrorState } from "~/components/shared/ErrorState";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";
import { ChallengeCard } from "~/components/social/ChallengeCard";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { acceptChallenge, declineChallenge, listChallenges } from "~/services/challenges.service";
import type { Challenge } from "~/types/challenge";

export default function Challenges() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, loading: userLoading } = useCurrentUser();

  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(false);

  const userId = user?.id ?? null;

  const load = useCallback(async () => {
    if (userId == null) return;
    setLoading(true);
    setError(false);
    try {
      setChallenges(await listChallenges(userId));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId != null) load();
  }, [userId, load]);

  const handleAccept = useCallback(
    async (challenge: Challenge) => {
      setBusy(true);
      try {
        const updated = await acceptChallenge(challenge.id);
        if (updated.combatId != null) {
          navigate(`/combats/${updated.combatId}`);
          return;
        }
        await load();
      } finally {
        setBusy(false);
      }
    },
    [navigate, load]
  );

  const handleDecline = useCallback(
    async (challenge: Challenge) => {
      setBusy(true);
      try {
        await declineChallenge(challenge.id);
        await load();
      } finally {
        setBusy(false);
      }
    },
    [load]
  );

  return (
    <>
      <PageHeader title={t("challenges.title")} />

      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8 md:py-12 lg:px-14 xl:px-20">
        {userLoading ? (
          <LoadingSpinner />
        ) : user == null ? (
          <EmptyState
            title={t("challenges.title")}
            description={t("challenges.loginPrompt")}
            action={{ label: t("nav.login"), onClick: () => navigate("/login") }}
          />
        ) : loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorState message={t("challenges.error")} onRetry={load} />
        ) : challenges.length === 0 ? (
          <EmptyState
            title={t("challenges.empty.title")}
            description={t("challenges.empty.description")}
          />
        ) : (
          <div className="flex flex-col gap-3">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                currentUserId={user.id}
                onAccept={handleAccept}
                onDecline={handleDecline}
                busy={busy}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
