import { beforeEach, describe, expect, it, vi } from "vitest";
import * as duelService from "~/services/duels.service";
import * as playerService from "~/services/players.service";
import * as tournamentService from "~/services/tournaments.service";
import type { Duel } from "~/types/duel";
import type { Player } from "~/types/player";
import type { Tournament } from "~/types/tournament";

vi.mock("~/services/tournaments.service");
vi.mock("~/services/duels.service");
vi.mock("~/services/players.service");
const mockGet = vi.mocked(tournamentService.getTournament);
const mockUpdateStatus = vi.mocked(tournamentService.updateTournamentStatus);
const mockListDuels = vi.mocked(duelService.listDuels);
const mockCreateDuel = vi.mocked(duelService.createDuel);
const mockListPlayers = vi.mocked(playerService.listPlayers);

const fakeTournament: Tournament = {
  id: 7,
  name: "Tournoi des Chevaliers",
  status: "IN_PROGRESS",
  createdAt: "2026-02-10T08:00:00Z",
};

function makePlayer(id: number): Player {
  return { tournamentId: 7, playerId: id, playerName: `P${id}`, classId: 1, level: 1, isDisqualified: false, penaltyPoints: 0 };
}

function makeDuel(id: number): Duel {
  return {
    id,
    tournamentId: 7,
    player1Id: 1,
    player2Id: 2,
    outcome: null,
    duelOrder: 1,
    playedAt: "2026-02-10T08:00:00Z",
    durationSeconds: null,
  };
}

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/tournaments/7", { method: "POST", body: form });
}

describe("tournaments.$id loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads tournament by numeric id from params", async () => {
    mockGet.mockResolvedValue(fakeTournament);
    const { loader } = await import("~/routes/tournaments.$id");
    const request = new Request("http://localhost/tournaments/7");
    const data = await loader({ params: { id: "7" }, request, context: {} });
    expect(mockGet).toHaveBeenCalledWith(7);
    expect(data.tournament).toEqual(fakeTournament);
  });
});

describe("tournaments.$id action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls updateTournamentStatus on advanceStatus intent", async () => {
    mockUpdateStatus.mockResolvedValue({ ...fakeTournament, status: "CLOSED" });
    const { action } = await import("~/routes/tournaments.$id");
    await action({
      request: makePostRequest({ intent: "advanceStatus", status: "CLOSED" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockUpdateStatus).toHaveBeenCalledWith(7, { status: "CLOSED" });
  });

  it("auto-generates a bracket when advancing to IN_PROGRESS with players and no duels", async () => {
    mockUpdateStatus.mockResolvedValue({ ...fakeTournament, status: "IN_PROGRESS" });
    mockListPlayers.mockResolvedValue([makePlayer(1), makePlayer(2), makePlayer(3)]);
    mockListDuels.mockResolvedValue([]);
    mockCreateDuel.mockResolvedValue(makeDuel(1));
    const { action } = await import("~/routes/tournaments.$id");
    await action({
      request: makePostRequest({ intent: "advanceStatus", status: "IN_PROGRESS" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockUpdateStatus).toHaveBeenCalledWith(7, { status: "IN_PROGRESS" });
    // 3 players => 3 unique pairs
    expect(mockCreateDuel).toHaveBeenCalledTimes(3);
    expect(mockCreateDuel).toHaveBeenCalledWith(7, { player1Id: 1, player2Id: 2, duelOrder: 1 });
    expect(mockCreateDuel).toHaveBeenCalledWith(7, { player1Id: 1, player2Id: 3, duelOrder: 2 });
    expect(mockCreateDuel).toHaveBeenCalledWith(7, { player1Id: 2, player2Id: 3, duelOrder: 3 });
  });

  it("does not generate a bracket when duels already exist", async () => {
    mockUpdateStatus.mockResolvedValue({ ...fakeTournament, status: "IN_PROGRESS" });
    mockListPlayers.mockResolvedValue([makePlayer(1), makePlayer(2)]);
    mockListDuels.mockResolvedValue([makeDuel(1)]);
    const { action } = await import("~/routes/tournaments.$id");
    await action({
      request: makePostRequest({ intent: "advanceStatus", status: "IN_PROGRESS" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockCreateDuel).not.toHaveBeenCalled();
  });

  it("does not generate a bracket when advancing to a non IN_PROGRESS status", async () => {
    mockUpdateStatus.mockResolvedValue({ ...fakeTournament, status: "CLOSED" });
    const { action } = await import("~/routes/tournaments.$id");
    await action({
      request: makePostRequest({ intent: "advanceStatus", status: "CLOSED" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockListDuels).not.toHaveBeenCalled();
    expect(mockCreateDuel).not.toHaveBeenCalled();
  });
});
