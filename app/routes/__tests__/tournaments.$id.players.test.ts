import { beforeEach, describe, expect, it, vi } from "vitest";
import * as playerService from "~/services/players.service";
import type { Player } from "~/types/player";

vi.mock("~/services/players.service");
const mockList = vi.mocked(playerService.listPlayers);
const mockAdd = vi.mocked(playerService.addPlayer);
const mockDisqualify = vi.mocked(playerService.disqualifyPlayer);
const mockPenalty = vi.mocked(playerService.addPenalty);

const fakePlayer: Player = {
  id: 1,
  tournamentId: 42,
  name: "Arthur",
  isDisqualified: false,
  penaltyPoints: 0,
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/tournaments/42/players", {
    method: "POST",
    body: form,
  });
}

describe("tournaments.$id.players loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls listPlayers with tournamentId from params", async () => {
    mockList.mockResolvedValue([fakePlayer]);
    const { loader } = await import("~/routes/tournaments.$id.players");
    await loader({ params: { id: "42" }, request: new Request("http://localhost"), context: {} });
    expect(mockList).toHaveBeenCalledWith(42);
  });

  it("returns players array", async () => {
    mockList.mockResolvedValue([fakePlayer]);
    const { loader } = await import("~/routes/tournaments.$id.players");
    const data = await loader({
      params: { id: "42" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(data.players).toEqual([fakePlayer]);
  });
});

describe("tournaments.$id.players action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls addPlayer when intent is addPlayer", async () => {
    mockAdd.mockResolvedValue(fakePlayer);
    const { action } = await import("~/routes/tournaments.$id.players");
    await action({
      request: makePostRequest({ intent: "addPlayer", name: "Lancelot" }),
      params: { id: "42" },
      context: {},
    });
    expect(mockAdd).toHaveBeenCalledWith(42, { name: "Lancelot" });
  });

  it("calls disqualifyPlayer when intent is disqualify", async () => {
    mockDisqualify.mockResolvedValue({ ...fakePlayer, isDisqualified: true });
    const { action } = await import("~/routes/tournaments.$id.players");
    await action({
      request: makePostRequest({ intent: "disqualify", playerId: "1" }),
      params: { id: "42" },
      context: {},
    });
    expect(mockDisqualify).toHaveBeenCalledWith(1);
  });

  it("calls addPenalty when intent is addPenalty", async () => {
    mockPenalty.mockResolvedValue({ ...fakePlayer, penaltyPoints: 3 });
    const { action } = await import("~/routes/tournaments.$id.players");
    await action({
      request: makePostRequest({ intent: "addPenalty", playerId: "1", penaltyPoints: "3" }),
      params: { id: "42" },
      context: {},
    });
    expect(mockPenalty).toHaveBeenCalledWith(1, { penaltyPoints: 3 });
  });
});
