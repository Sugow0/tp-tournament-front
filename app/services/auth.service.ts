import { apiFetch } from "~/lib/http";
import type { AuthResponse, Credentials, Me } from "~/types/auth";

export function register(creds: Credentials): Promise<AuthResponse> {
  return apiFetch("/auth/register", {
    method: "POST",
    body: JSON.stringify(creds),
  });
}

export function login(creds: Credentials): Promise<AuthResponse> {
  return apiFetch("/auth/login", {
    method: "POST",
    body: JSON.stringify(creds),
  });
}

export function refresh(refreshToken: string): Promise<AuthResponse> {
  return apiFetch("/auth/refresh", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });
}

export function getMe(): Promise<Me> {
  return apiFetch("/me");
}
