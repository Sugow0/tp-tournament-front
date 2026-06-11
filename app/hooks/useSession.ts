import { useEffect, useState } from "react";
import { isAuthenticated } from "~/lib/auth";

/**
 * Client-side session state. Sessions live in localStorage and are SSR-guarded,
 * so on the server (and the very first client render) we report "logged out" and
 * only flip to the real value after mounting — avoiding hydration mismatches.
 */
export function useSession(): { mounted: boolean; loggedIn: boolean } {
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setLoggedIn(isAuthenticated());
  }, []);

  return { mounted, loggedIn };
}
