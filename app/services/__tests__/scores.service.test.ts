import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  getPlayerScore,
  getTournamentChampion,
  getTournamentRanking,
} from "~/services/scores.service";
import type { PlayerScore, RankingResponse } from "~/types/score";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeScore: PlayerScore = {
  playerId: 1,
  playerName: "Arthur",
  finalScore: 12,
  isDisqualified: false,
};

const fakeRanking: RankingResponse = {
  tournamentId: 1,
  ranking: [fakeScore],
};

describe("scores.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  it("getPlayerScore calls GET /api/players/:id/score", async () => {
    mockApiFetch.mockResolvedValue(fakeScore);
    const result = await getPlayerScore(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/players/1/score");
    expect(result).toEqual(fakeScore);
  });

  it("getTournamentRanking calls GET /api/tournaments/:id/ranking", async () => {
    mockApiFetch.mockResolvedValue(fakeRanking);
    const result = await getTournamentRanking(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/ranking");
    expect(result).toEqual(fakeRanking);
  });

  it("getTournamentChampion calls GET /api/tournaments/:id/champion", async () => {
    mockApiFetch.mockResolvedValue(fakeScore);
    const result = await getTournamentChampion(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/champion");
    expect(result).toEqual(fakeScore);
  });
});
