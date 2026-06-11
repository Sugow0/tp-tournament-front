import { useEffect, useState } from "react";
import { useSession } from "~/hooks/useSession";
import { getMe } from "~/services/auth.service";
import type { Me } from "~/types/auth";

export interface CurrentUserState {
  /** The authenticated user, or null when logged out / still loading. */
  user: Me | null;
  /** True while the session is being resolved or `getMe` is in flight. */
  loading: boolean;
}

/**
 * Resolves the current user CLIENT-SIDE. Server loaders have no access to the
 * localStorage token, so authenticated pages use this hook: once the session is
 * ready and authenticated it calls `getMe()` and returns the user.
 */
export function useCurrentUser(): CurrentUserState {
  const { ready, isAuthenticated } = useSession();
  const [user, setUser] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ready) return;

    if (!isAuthenticated) {
      setUser(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    getMe()
      .then((me) => {
        if (!cancelled) setUser(me);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [ready, isAuthenticated]);

  return { user, loading };
}
