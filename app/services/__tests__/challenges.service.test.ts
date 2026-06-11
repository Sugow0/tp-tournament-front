import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  acceptChallenge,
  createChallenge,
  declineChallenge,
  listChallenges,
} from "~/services/challenges.service";
import type { Challenge } from "~/types/challenge";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeChallenge: Challenge = {
  id: 10,
  challengerUserId: 1,
  challengerEmail: "me@avalon.io",
  opponentUserId: 2,
  opponentEmail: "rival@avalon.io",
  status: "PENDING",
  combatId: null,
  createdAt: "2026-01-01T00:00:00Z",
};

describe("challenges.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("createChallenge", () => {
    it("calls POST /api/challenges with challenger/opponent payload", async () => {
      mockApiFetch.mockResolvedValue(fakeChallenge);
      const result = await createChallenge({ challengerUserId: 1, opponentUserId: 2 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/challenges", {
        method: "POST",
        body: JSON.stringify({ challengerUserId: 1, opponentUserId: 2 }),
      });
      expect(result).toEqual(fakeChallenge);
    });
  });

  describe("listChallenges", () => {
    it("calls GET /api/users/:userId/challenges", async () => {
      mockApiFetch.mockResolvedValue([fakeChallenge]);
      const result = await listChallenges(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/users/1/challenges");
      expect(result).toEqual([fakeChallenge]);
    });
  });

  describe("acceptChallenge", () => {
    it("calls POST /api/challenges/:id/accept", async () => {
      const accepted: Challenge = { ...fakeChallenge, status: "ACCEPTED", combatId: 99 };
      mockApiFetch.mockResolvedValue(accepted);
      const result = await acceptChallenge(10);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/challenges/10/accept", {
        method: "POST",
      });
      expect(result).toEqual(accepted);
    });
  });

  describe("declineChallenge", () => {
    it("calls POST /api/challenges/:id/decline", async () => {
      const declined: Challenge = { ...fakeChallenge, status: "DECLINED" };
      mockApiFetch.mockResolvedValue(declined);
      const result = await declineChallenge(10);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/challenges/10/decline", {
        method: "POST",
      });
      expect(result).toEqual(declined);
    });
  });
});
