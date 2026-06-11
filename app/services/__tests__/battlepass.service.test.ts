import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  addTier,
  addXp,
  createBattlepass,
  getBattlepassBySeason,
  getPlayerProgress,
  listTiers,
} from "~/services/battlepass.service";
import type { Battlepass, BattlepassTier, PlayerBattlepassProgress } from "~/types/battlepass";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeBattlepass: Battlepass = {
  id: 7,
  seasonId: 3,
  totalTiers: 50,
  hasPremiumTrack: true,
};

const fakeTier: BattlepassTier = {
  id: 11,
  battlepassId: 7,
  tierNumber: 1,
  xpRequired: 100,
  isPremium: false,
  rewardType: "SKIN",
  rewardData: "knight_gold",
};

const fakeProgress: PlayerBattlepassProgress = {
  id: 5,
  playerId: 42,
  battlepassId: 7,
  currentXp: 250,
  currentTier: 3,
  isPremiumUnlocked: false,
};

describe("battlepass.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("createBattlepass", () => {
    it("calls POST /api/battlepasses with payload", async () => {
      mockApiFetch.mockResolvedValue(fakeBattlepass);
      const result = await createBattlepass({
        seasonId: 3,
        totalTiers: 50,
        hasPremiumTrack: true,
      });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/battlepasses", {
        method: "POST",
        body: JSON.stringify({ seasonId: 3, totalTiers: 50, hasPremiumTrack: true }),
      });
      expect(result).toEqual(fakeBattlepass);
    });
  });

  describe("getBattlepassBySeason", () => {
    it("calls GET /api/battlepasses/season/:seasonId", async () => {
      mockApiFetch.mockResolvedValue(fakeBattlepass);
      const result = await getBattlepassBySeason(3);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/battlepasses/season/3");
      expect(result).toEqual(fakeBattlepass);
    });
  });

  describe("addTier", () => {
    it("calls POST /api/battlepasses/:id/tiers with payload", async () => {
      mockApiFetch.mockResolvedValue(fakeTier);
      const result = await addTier(7, {
        tierNumber: 1,
        xpRequired: 100,
        isPremium: false,
        rewardType: "SKIN",
        rewardData: "knight_gold",
      });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/battlepasses/7/tiers", {
        method: "POST",
        body: JSON.stringify({
          tierNumber: 1,
          xpRequired: 100,
          isPremium: false,
          rewardType: "SKIN",
          rewardData: "knight_gold",
        }),
      });
      expect(result).toEqual(fakeTier);
    });
  });

  describe("listTiers", () => {
    it("calls GET /api/battlepasses/:id/tiers and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeTier]);
      const result = await listTiers(7);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/battlepasses/7/tiers");
      expect(result).toEqual([fakeTier]);
    });
  });

  describe("getPlayerProgress", () => {
    it("calls GET /api/battlepasses/:id/players/:playerId/progress", async () => {
      mockApiFetch.mockResolvedValue(fakeProgress);
      const result = await getPlayerProgress(7, 42);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/battlepasses/7/players/42/progress");
      expect(result).toEqual(fakeProgress);
    });
  });

  describe("addXp", () => {
    it("calls POST /api/battlepasses/:id/players/:playerId/xp with payload", async () => {
      mockApiFetch.mockResolvedValue({ ...fakeProgress, currentXp: 500 });
      const result = await addXp(7, 42, { xpAmount: 250 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/battlepasses/7/players/42/xp", {
        method: "POST",
        body: JSON.stringify({ xpAmount: 250 }),
      });
      expect(result.currentXp).toBe(500);
    });
  });
});
