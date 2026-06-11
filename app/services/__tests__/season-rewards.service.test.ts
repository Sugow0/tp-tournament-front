import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  createReward,
  distributeRewards,
  getPlayerRewards,
  listRewards,
} from "~/services/season-rewards.service";
import type { PlayerSeasonReward, SeasonReward } from "~/types/season";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeReward: SeasonReward = {
  id: 1,
  seasonId: 1,
  rankMin: 1,
  rankMax: 3,
  rewardType: "SKIN",
  rewardData: "dragon-knight",
  label: "Top 3 Champions",
};

const fakePlayerReward: PlayerSeasonReward = {
  id: 10,
  playerId: 5,
  seasonId: 1,
  seasonRank: 1,
  seasonRewardId: 1,
  awardedAt: "2026-04-01T00:00:00Z",
};

describe("season-rewards.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listRewards", () => {
    it("calls GET /api/seasons/:seasonId/rewards and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeReward]);
      const result = await listRewards(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/rewards");
      expect(result).toEqual([fakeReward]);
    });
  });

  describe("createReward", () => {
    it("calls POST /api/seasons/:seasonId/rewards with payload", async () => {
      mockApiFetch.mockResolvedValue(fakeReward);
      const payload = {
        rankMin: 1,
        rankMax: 3,
        rewardType: "SKIN",
        rewardData: "dragon-knight",
        label: "Top 3 Champions",
      };
      const result = await createReward(1, payload);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/rewards", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      expect(result).toEqual(fakeReward);
    });
  });

  describe("distributeRewards", () => {
    it("calls POST /api/seasons/:seasonId/rewards/distribute and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakePlayerReward]);
      const result = await distributeRewards(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/rewards/distribute", {
        method: "POST",
      });
      expect(result).toEqual([fakePlayerReward]);
    });
  });

  describe("getPlayerRewards", () => {
    it("calls GET /api/seasons/:seasonId/rewards/players/:playerId", async () => {
      mockApiFetch.mockResolvedValue([fakePlayerReward]);
      const result = await getPlayerRewards(1, 5);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/rewards/players/5");
      expect(result).toEqual([fakePlayerReward]);
    });
  });
});
