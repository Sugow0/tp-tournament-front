import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  createTournament,
  getTournament,
  listTournaments,
  updateTournamentStatus,
} from "~/services/tournaments.service";
import type { Tournament } from "~/types/tournament";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeTournament: Tournament = {
  id: 1,
  name: "Avalon Cup",
  status: "OPEN",
  createdAt: "2026-01-01T00:00:00Z",
};

describe("tournaments.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listTournaments", () => {
    it("calls GET /api/tournaments and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeTournament]);
      const result = await listTournaments();
      expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments");
      expect(result).toEqual([fakeTournament]);
    });
  });

  describe("getTournament", () => {
    it("calls GET /api/tournaments/:id", async () => {
      mockApiFetch.mockResolvedValue(fakeTournament);
      const result = await getTournament(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1");
      expect(result).toEqual(fakeTournament);
    });
  });

  describe("createTournament", () => {
    it("calls POST /api/tournaments with name payload", async () => {
      mockApiFetch.mockResolvedValue(fakeTournament);
      const result = await createTournament({ name: "Avalon Cup" });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments", {
        method: "POST",
        body: JSON.stringify({ name: "Avalon Cup" }),
      });
      expect(result).toEqual(fakeTournament);
    });
  });

  describe("updateTournamentStatus", () => {
    it("calls PATCH /api/tournaments/:id/status with status payload", async () => {
      mockApiFetch.mockResolvedValue({ ...fakeTournament, status: "IN_PROGRESS" });
      const result = await updateTournamentStatus(1, { status: "IN_PROGRESS" });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/status", {
        method: "PATCH",
        body: JSON.stringify({ status: "IN_PROGRESS" }),
      });
      expect(result.status).toBe("IN_PROGRESS");
    });
  });
});
