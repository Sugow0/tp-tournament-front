import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  addPenalty,
  addPlayer,
  disqualifyPlayer,
  getPlayer,
  listPlayers,
} from "~/services/players.service";
import type { Player } from "~/types/player";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakePlayer: Player = {
  tournamentId: 1,
  playerId: 1,
  playerName: "Arthur",
  classId: 1,
  level: 1,
  isDisqualified: false,
  penaltyPoints: 0,
};

const fakeCreatedPlayer = { id: 1, userId: 1, name: "Arthur", classId: 1, level: 1 };

describe("players.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  it("listPlayers calls GET /api/tournaments/:tid/players", async () => {
    mockApiFetch.mockResolvedValue([fakePlayer]);
    const result = await listPlayers(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/players");
    expect(result).toEqual([fakePlayer]);
  });

  it("getPlayer calls GET /api/players/:id", async () => {
    mockApiFetch.mockResolvedValue(fakeCreatedPlayer);
    const result = await getPlayer(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/players/1");
    expect(result).toEqual(fakeCreatedPlayer);
  });

  it("addPlayer creates player then registers in tournament", async () => {
    mockApiFetch.mockResolvedValueOnce(fakeCreatedPlayer);
    mockApiFetch.mockResolvedValueOnce(fakePlayer);
    const result = await addPlayer(1, { name: "Arthur" });
    expect(mockApiFetch).toHaveBeenNthCalledWith(1, "/api/players", {
      method: "POST",
      body: JSON.stringify({ name: "Arthur", classId: 1, level: 1 }),
    });
    expect(mockApiFetch).toHaveBeenNthCalledWith(2, "/api/tournaments/1/players/1", {
      method: "POST",
    });
    expect(result).toEqual(fakePlayer);
  });

  it("disqualifyPlayer calls POST /api/tournaments/:tid/players/:id/disqualify", async () => {
    mockApiFetch.mockResolvedValue({ ...fakePlayer, isDisqualified: true });
    const result = await disqualifyPlayer(42, 1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/42/players/1/disqualify", {
      method: "POST",
    });
    expect(result.isDisqualified).toBe(true);
  });

  it("addPenalty calls PATCH /api/tournaments/:tid/players/:id/penalties with points", async () => {
    mockApiFetch.mockResolvedValue({ ...fakePlayer, penaltyPoints: 2 });
    const result = await addPenalty(42, 1, { penaltyPoints: 2 });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/42/players/1/penalties", {
      method: "PATCH",
      body: JSON.stringify({ penaltyPoints: 2 }),
    });
    expect(result.penaltyPoints).toBe(2);
  });
});
