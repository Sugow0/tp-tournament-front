import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import type { Player } from "~/types/player";
import {
  addPenalty,
  addPlayer,
  disqualifyPlayer,
  getPlayer,
  listPlayers,
} from "~/services/players.service";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakePlayer: Player = {
  id: 1,
  tournamentId: 1,
  name: "Arthur",
  isDisqualified: false,
  penaltyPoints: 0,
};

describe("players.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  it("listPlayers calls GET /api/tournaments/:tid/players", async () => {
    mockApiFetch.mockResolvedValue([fakePlayer]);
    const result = await listPlayers(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/players");
    expect(result).toEqual([fakePlayer]);
  });

  it("getPlayer calls GET /api/players/:id", async () => {
    mockApiFetch.mockResolvedValue(fakePlayer);
    const result = await getPlayer(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/players/1");
    expect(result).toEqual(fakePlayer);
  });

  it("addPlayer calls POST /api/tournaments/:tid/players with name", async () => {
    mockApiFetch.mockResolvedValue(fakePlayer);
    const result = await addPlayer(1, { name: "Arthur" });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/1/players", {
      method: "POST",
      body: JSON.stringify({ name: "Arthur" }),
    });
    expect(result).toEqual(fakePlayer);
  });

  it("disqualifyPlayer calls POST /api/players/:id/disqualify", async () => {
    mockApiFetch.mockResolvedValue({ ...fakePlayer, isDisqualified: true });
    const result = await disqualifyPlayer(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/players/1/disqualify", {
      method: "POST",
    });
    expect(result.isDisqualified).toBe(true);
  });

  it("addPenalty calls PATCH /api/players/:id/penalties with points", async () => {
    mockApiFetch.mockResolvedValue({ ...fakePlayer, penaltyPoints: 2 });
    const result = await addPenalty(1, { penaltyPoints: 2 });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/players/1/penalties", {
      method: "PATCH",
      body: JSON.stringify({ penaltyPoints: 2 }),
    });
    expect(result.penaltyPoints).toBe(2);
  });
});
