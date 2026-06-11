import { beforeEach, describe, expect, it, vi } from "vitest";
import * as scoresService from "~/services/scores.service";
import type { RankingResponse } from "~/types/score";

vi.mock("~/services/scores.service");
const mockGetRanking = vi.mocked(scoresService.getTournamentRanking);

const fakeRanking: RankingResponse = {
  tournamentId: 42,
  ranking: [
    { playerId: 1, playerName: "Arthur", finalScore: 12, isDisqualified: false },
    { playerId: 2, playerName: "Lancelot", finalScore: 8, isDisqualified: false },
  ],
};

describe("tournaments.$id.ranking loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls getTournamentRanking with tournamentId from params", async () => {
    mockGetRanking.mockResolvedValue(fakeRanking);
    const { loader } = await import("~/routes/tournaments.$id.ranking");
    await loader({
      params: { id: "42" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(mockGetRanking).toHaveBeenCalledWith(42);
  });

  it("returns the ranking object", async () => {
    mockGetRanking.mockResolvedValue(fakeRanking);
    const { loader } = await import("~/routes/tournaments.$id.ranking");
    const data = await loader({
      params: { id: "42" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(data.ranking).toEqual(fakeRanking);
  });
});
