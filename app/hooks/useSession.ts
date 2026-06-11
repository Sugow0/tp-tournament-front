import { useEffect, useState } from "react";
import { isAuthenticated } from "~/lib/auth";

const AUTH_CHANGE_EVENT = "tournament:auth-change";

export interface SessionState {
  /** True once the component has mounted on the client. */
  ready: boolean;
  /** Live authentication state, re-read on every auth-change / storage event. */
  isAuthenticated: boolean;
}

/**
 * Reactive client-side session state. Sessions live in localStorage and are
 * SSR-guarded, so on the server (and the very first client render) we report
 * "logged out" and only flip to the real value after mounting — avoiding
 * hydration mismatches.
 *
 * After mount we subscribe to the in-app `tournament:auth-change` event (fired
 * by setSession/clearSession) and the native cross-tab `storage` event, so the
 * persistent navbar updates immediately on login/logout without a page reload.
 */
export function useSession(): SessionState {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const sync = () => setAuthed(isAuthenticated());

    setReady(true);
    sync();

    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { ready, isAuthenticated: authed };
}
