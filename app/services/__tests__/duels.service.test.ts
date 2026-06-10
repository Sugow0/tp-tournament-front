import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import type { Duel } from "~/types/duel";
import {
  createDuel,
  endDuel,
  getDuel,
  listDuels,
  setDuelOutcome,
} from "~/services/duels.service";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeDuel: Duel = {
  id: 1,
  tournamentId: 1,
  player1Id: 1,
  player2Id: 2,
  outcome: null,
  duelOrder: 1,
  playedAt: "2026-01-01T10:00:00Z",
  durationSeconds: null,
};

describe("duels.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  it("listDuels calls GET /api/tournaments/:tid/duels", async () => {
    mockApiFetch.mockResolvedValue([fakeDuel]);
    const result = await listDuels(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/duels");
    expect(result).toEqual([fakeDuel]);
  });

  it("getDuel calls GET /api/duels/:id", async () => {
    mockApiFetch.mockResolvedValue(fakeDuel);
    const result = await getDuel(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/1");
    expect(result).toEqual(fakeDuel);
  });

  it("createDuel calls POST /api/tournaments/:tid/duels with payload", async () => {
    mockApiFetch.mockResolvedValue(fakeDuel);
    const result = await createDuel(1, { player1Id: 1, player2Id: 2, duelOrder: 1 });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/duels", {
      method: "POST",
      body: JSON.stringify({ player1Id: 1, player2Id: 2, duelOrder: 1 }),
    });
    expect(result).toEqual(fakeDuel);
  });

  it("setDuelOutcome calls PATCH /api/duels/:id/outcome", async () => {
    mockApiFetch.mockResolvedValue({ ...fakeDuel, outcome: "PLAYER1_WIN" });
    const result = await setDuelOutcome(1, { outcome: "PLAYER1_WIN" });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/1/outcome", {
      method: "PATCH",
      body: JSON.stringify({ outcome: "PLAYER1_WIN" }),
    });
    expect(result.outcome).toBe("PLAYER1_WIN");
  });

  it("endDuel calls POST /api/duels/:id/end with duration", async () => {
    mockApiFetch.mockResolvedValue({ ...fakeDuel, durationSeconds: 90 });
    const result = await endDuel(1, { durationSeconds: 90 });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/1/end", {
      method: "POST",
      body: JSON.stringify({ durationSeconds: 90 }),
    });
    expect(result.durationSeconds).toBe(90);
  });
});
