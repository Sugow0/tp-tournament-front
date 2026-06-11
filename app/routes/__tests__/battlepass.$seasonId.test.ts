import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "~/lib/http";
import * as battlepassService from "~/services/battlepass.service";
import type { Battlepass, BattlepassTier } from "~/types/battlepass";

vi.mock("~/services/battlepass.service");
const mockGetBySeason = vi.mocked(battlepassService.getBattlepassBySeason);
const mockListTiers = vi.mocked(battlepassService.listTiers);

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

describe("battlepass.$seasonId loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns the battlepass and its tiers when found", async () => {
    mockGetBySeason.mockResolvedValue(fakeBattlepass);
    mockListTiers.mockResolvedValue([fakeTier]);
    const { loader } = await import("~/routes/battlepass.$seasonId");
    const data = await loader({
      params: { seasonId: "3" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(mockGetBySeason).toHaveBeenCalledWith(3);
    expect(mockListTiers).toHaveBeenCalledWith(7);
    expect(data.battlepass).toEqual(fakeBattlepass);
    expect(data.tiers).toEqual([fakeTier]);
  });

  it("returns null battlepass and empty tiers when getBattlepassBySeason throws ApiError 404", async () => {
    mockGetBySeason.mockRejectedValue(new ApiError(404, { message: "not found" }));
    const { loader } = await import("~/routes/battlepass.$seasonId");
    const data = await loader({
      params: { seasonId: "3" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(data.battlepass).toBeNull();
    expect(data.tiers).toEqual([]);
    expect(mockListTiers).not.toHaveBeenCalled();
  });
});
