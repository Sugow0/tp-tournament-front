import { beforeEach, describe, expect, it, vi } from "vitest";
import * as duelService from "~/services/duels.service";
import * as playerService from "~/services/players.service";
import type { Duel } from "~/types/duel";
import type { Player } from "~/types/player";

vi.mock("~/services/duels.service");
vi.mock("~/services/players.service");

const mockListDuels = vi.mocked(duelService.listDuels);
const mockCreateDuel = vi.mocked(duelService.createDuel);
const mockSetOutcome = vi.mocked(duelService.setDuelOutcome);
const mockEndDuel = vi.mocked(duelService.endDuel);
const mockListPlayers = vi.mocked(playerService.listPlayers);

const fakeDuel: Duel = {
  id: 1,
  tournamentId: 42,
  player1Id: 1,
  player2Id: 2,
  outcome: null,
  duelOrder: 1,
  playedAt: "2024-01-01T00:00:00Z",
  durationSeconds: null,
};

const fakePlayers: Player[] = [
  {
    tournamentId: 42,
    playerId: 1,
    playerName: "Arthur",
    classId: 1,
    level: 1,
    isDisqualified: false,
    penaltyPoints: 0,
  },
];

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/tournaments/42/duels", {
    method: "POST",
    body: form,
  });
}

describe("tournaments.$id.duels loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls listDuels with tournamentId from params", async () => {
    mockListDuels.mockResolvedValue([fakeDuel]);
    mockListPlayers.mockResolvedValue(fakePlayers);
    const { loader } = await import("~/routes/tournaments.$id.duels");
    await loader({ params: { id: "42" }, request: new Request("http://localhost"), context: {} });
    expect(mockListDuels).toHaveBeenCalledWith(42);
  });

  it("calls listPlayers with tournamentId from params", async () => {
    mockListDuels.mockResolvedValue([fakeDuel]);
    mockListPlayers.mockResolvedValue(fakePlayers);
    const { loader } = await import("~/routes/tournaments.$id.duels");
    await loader({ params: { id: "42" }, request: new Request("http://localhost"), context: {} });
    expect(mockListPlayers).toHaveBeenCalledWith(42);
  });

  it("returns duels and players arrays", async () => {
    mockListDuels.mockResolvedValue([fakeDuel]);
    mockListPlayers.mockResolvedValue(fakePlayers);
    const { loader } = await import("~/routes/tournaments.$id.duels");
    const data = await loader({
      params: { id: "42" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(data.duels).toEqual([fakeDuel]);
    expect(data.players).toEqual(fakePlayers);
  });
});

describe("tournaments.$id.duels action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls createDuel when intent is createDuel", async () => {
    mockCreateDuel.mockResolvedValue(fakeDuel);
    const { action } = await import("~/routes/tournaments.$id.duels");
    await action({
      request: makePostRequest({
        intent: "createDuel",
        player1Id: "1",
        player2Id: "2",
        duelOrder: "1",
      }),
      params: { id: "42" },
      context: {},
    });
    expect(mockCreateDuel).toHaveBeenCalledWith(42, { player1Id: 1, player2Id: 2, duelOrder: 1 });
  });

  it("calls setDuelOutcome when intent is setOutcome", async () => {
    mockSetOutcome.mockResolvedValue({ ...fakeDuel, outcome: "PLAYER1_WIN" });
    const { action } = await import("~/routes/tournaments.$id.duels");
    await action({
      request: makePostRequest({ intent: "setOutcome", duelId: "1", outcome: "PLAYER1_WIN" }),
      params: { id: "42" },
      context: {},
    });
    expect(mockSetOutcome).toHaveBeenCalledWith(1, { outcome: "PLAYER1_WIN" });
  });

  it("calls endDuel when intent is endDuel", async () => {
    mockEndDuel.mockResolvedValue({ ...fakeDuel, durationSeconds: 90 });
    const { action } = await import("~/routes/tournaments.$id.duels");
    await action({
      request: makePostRequest({ intent: "endDuel", duelId: "1", durationSeconds: "90" }),
      params: { id: "42" },
      context: {},
    });
    expect(mockEndDuel).toHaveBeenCalledWith(1, { durationSeconds: 90 });
  });
});
