import type { AuthResponse } from "~/types/auth";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

let accessToken: string | null = null;
let refreshToken: string | null = null;

const hasWindow = () => typeof window !== "undefined";

export function setSession(auth: AuthResponse): void {
  accessToken = auth.accessToken;
  refreshToken = auth.refreshToken;
  if (hasWindow()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
  }
}

export function getAccessToken(): string | null {
  if (accessToken !== null) return accessToken;
  if (hasWindow()) {
    accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  }
  return accessToken;
}

export function getRefreshToken(): string | null {
  if (refreshToken !== null) return refreshToken;
  if (hasWindow()) {
    refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  }
  return refreshToken;
}

export function clearSession(): void {
  accessToken = null;
  refreshToken = null;
  if (hasWindow()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
