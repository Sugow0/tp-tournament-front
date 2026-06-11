import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import { getMe, login, refresh, register } from "~/services/auth.service";
import type { AuthResponse, Me } from "~/types/auth";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeAuth: AuthResponse = {
  accessToken: "access-123",
  refreshToken: "refresh-456",
  expiresAt: "2026-12-31T00:00:00Z",
  tokenType: "Bearer",
};

const fakeMe: Me = {
  id: 1,
  email: "arthur@avalon.test",
  playerId: 7,
  createdAt: "2026-01-01T00:00:00Z",
};

describe("auth.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("register", () => {
    it("calls POST /auth/register with credentials", async () => {
      mockApiFetch.mockResolvedValue(fakeAuth);
      const result = await register({ email: "arthur@avalon.test", password: "excalibur" });
      expect(mockApiFetch).toHaveBeenCalledWith("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email: "arthur@avalon.test", password: "excalibur" }),
      });
      expect(result).toEqual(fakeAuth);
    });
  });

  describe("login", () => {
    it("calls POST /auth/login with credentials", async () => {
      mockApiFetch.mockResolvedValue(fakeAuth);
      const result = await login({ email: "arthur@avalon.test", password: "excalibur" });
      expect(mockApiFetch).toHaveBeenCalledWith("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "arthur@avalon.test", password: "excalibur" }),
      });
      expect(result).toEqual(fakeAuth);
    });
  });

  describe("refresh", () => {
    it("calls POST /auth/refresh with refreshToken", async () => {
      mockApiFetch.mockResolvedValue(fakeAuth);
      const result = await refresh("refresh-456");
      expect(mockApiFetch).toHaveBeenCalledWith("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refreshToken: "refresh-456" }),
      });
      expect(result).toEqual(fakeAuth);
    });
  });

  describe("getMe", () => {
    it("calls GET /me", async () => {
      mockApiFetch.mockResolvedValue(fakeMe);
      const result = await getMe();
      expect(mockApiFetch).toHaveBeenCalledWith("/me");
      expect(result).toEqual(fakeMe);
    });
  });
});
