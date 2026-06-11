import { beforeEach, describe, expect, it } from "vitest";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  isAuthenticated,
  setSession,
} from "~/lib/auth";
import type { AuthResponse } from "~/types/auth";

const fakeAuth: AuthResponse = {
  accessToken: "access-123",
  refreshToken: "refresh-456",
  expiresAt: "2026-12-31T00:00:00Z",
  tokenType: "Bearer",
};

describe("auth token store", () => {
  beforeEach(() => clearSession());

  it("starts unauthenticated with null tokens", () => {
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });

  it("stores tokens after setSession", () => {
    setSession(fakeAuth);
    expect(getAccessToken()).toBe("access-123");
    expect(getRefreshToken()).toBe("refresh-456");
    expect(isAuthenticated()).toBe(true);
  });

  it("mirrors the access token to localStorage", () => {
    setSession(fakeAuth);
    expect(localStorage.getItem("accessToken")).toBe("access-123");
    expect(localStorage.getItem("refreshToken")).toBe("refresh-456");
  });

  it("clearSession resets tokens to null and unauthenticated", () => {
    setSession(fakeAuth);
    clearSession();
    expect(getAccessToken()).toBeNull();
    expect(getRefreshToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
