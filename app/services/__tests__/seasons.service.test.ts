import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  attachTournament,
  createSeason,
  getPlayerSeasonalStats,
  getSeason,
  listSeasons,
  updateSeasonStatus,
} from "~/services/seasons.service";
import type { Season, SeasonalStats } from "~/types/season";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeSeason: Season = {
  id: 1,
  name: "Saison Hivernale",
  status: "UPCOMING",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T00:00:00Z",
  createdAt: "2025-12-01T00:00:00Z",
};

const fakeStats: SeasonalStats = {
  playerId: 5,
  seasonId: 1,
  totalScore: 120,
  tournamentsPlayed: 4,
  totalWins: 9,
  totalLosses: 3,
  totalDraws: 1,
  winStreakBest: 5,
  seasonRank: 2,
};

describe("seasons.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listSeasons", () => {
    it("calls GET /api/seasons and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeSeason]);
      const result = await listSeasons();
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons");
      expect(result).toEqual([fakeSeason]);
    });
  });

  describe("getSeason", () => {
    it("calls GET /api/seasons/:id", async () => {
      mockApiFetch.mockResolvedValue(fakeSeason);
      const result = await getSeason(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1");
      expect(result).toEqual(fakeSeason);
    });
  });

  describe("createSeason", () => {
    it("calls POST /api/seasons with name/startDate/endDate payload", async () => {
      mockApiFetch.mockResolvedValue(fakeSeason);
      const payload = {
        name: "Saison Hivernale",
        startDate: "2026-01-01T00:00:00Z",
        endDate: "2026-03-31T00:00:00Z",
      };
      const result = await createSeason(payload);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      expect(result).toEqual(fakeSeason);
    });
  });

  describe("updateSeasonStatus", () => {
    it("calls PATCH /api/seasons/:id/status with status payload", async () => {
      mockApiFetch.mockResolvedValue({ ...fakeSeason, status: "ACTIVE" });
      const result = await updateSeasonStatus(1, { status: "ACTIVE" });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/status", {
        method: "PATCH",
        body: JSON.stringify({ status: "ACTIVE" }),
      });
      expect(result.status).toBe("ACTIVE");
    });
  });

  describe("attachTournament", () => {
    it("calls POST /api/seasons/:id/tournaments/:tournamentId", async () => {
      mockApiFetch.mockResolvedValue(undefined);
      await attachTournament(1, 42);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/tournaments/42", {
        method: "POST",
      });
    });
  });

  describe("getPlayerSeasonalStats", () => {
    it("calls GET /api/seasons/:id/players/:playerId/stats", async () => {
      mockApiFetch.mockResolvedValue(fakeStats);
      const result = await getPlayerSeasonalStats(1, 5);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/seasons/1/players/5/stats");
      expect(result).toEqual(fakeStats);
    });
  });
});
