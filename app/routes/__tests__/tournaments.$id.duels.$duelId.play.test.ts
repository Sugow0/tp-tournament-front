import { beforeEach, describe, expect, it, vi } from "vitest";
import * as classesService from "~/services/classes.service";
import * as combatsService from "~/services/combats.service";
import * as duelService from "~/services/duels.service";
import * as playerService from "~/services/players.service";
import type { ChampionClass, Combat, CombatantState } from "~/types/combat";
import type { Duel } from "~/types/duel";
import type { Player } from "~/types/player";

vi.mock("~/services/duels.service");
vi.mock("~/services/players.service");
vi.mock("~/services/classes.service");
vi.mock("~/services/combats.service");

const mockGetDuel = vi.mocked(duelService.getDuel);
const mockSetOutcome = vi.mocked(duelService.setDuelOutcome);
const mockListPlayers = vi.mocked(playerService.listPlayers);
const mockListClasses = vi.mocked(classesService.listClasses);
const mockStartCombat = vi.mocked(combatsService.startCombat);
const mockGetCombat = vi.mocked(combatsService.getCombat);
const mockSubmitAction = vi.mocked(combatsService.submitAction);

const fakeDuel: Duel = {
  id: 3,
  tournamentId: 42,
  player1Id: 1,
  player2Id: 2,
  outcome: null,
  duelOrder: 1,
  playedAt: "2026-01-01T00:00:00Z",
  durationSeconds: null,
};

const fakePlayers: Player[] = [
  { id: 1, tournamentId: 42, name: "Arthur", isDisqualified: false, penaltyPoints: 0 },
  { id: 2, tournamentId: 42, name: "Mordred", isDisqualified: false, penaltyPoints: 0 },
];

const fakeClasses: ChampionClass[] = [
  { id: 1, name: "Guerrier", description: "", skillCount: 4 },
  { id: 2, name: "Mage", description: "", skillCount: 4 },
];

function makeCombatant(overrides: Partial<CombatantState> = {}): CombatantState {
  return {
    slot: 1,
    name: "Arthur",
    classId: 1,
    level: 1,
    maxHp: 110,
    currentHp: 110,
    hasSubmittedAction: false,
    effects: [],
    ...overrides,
  };
}

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/tournaments/42/duels/3/play", {
    method: "POST",
    body: form,
  });
}

describe("tournaments.$id.duels.$duelId.play loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns duel, players and classes", async () => {
    mockGetDuel.mockResolvedValue(fakeDuel);
    mockListPlayers.mockResolvedValue(fakePlayers);
    mockListClasses.mockResolvedValue(fakeClasses);
    const { loader } = await import("~/routes/tournaments.$id.duels.$duelId.play");
    const data = await loader({
      params: { id: "42", duelId: "3" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(mockGetDuel).toHaveBeenCalledWith(3);
    expect(mockListPlayers).toHaveBeenCalledWith(42);
    expect(mockListClasses).toHaveBeenCalledOnce();
    expect(data.duel).toEqual(fakeDuel);
    expect(data.players).toEqual(fakePlayers);
    expect(data.classes).toEqual(fakeClasses);
  });
});

describe("tournaments.$id.duels.$duelId.play action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("starts a combat on intent startCombat", async () => {
    mockStartCombat.mockResolvedValue({
      id: 9,
      status: "IN_PROGRESS",
      turn: 1,
      winnerSlot: null,
      champion1: makeCombatant({ slot: 1, name: "Arthur" }),
      champion2: makeCombatant({ slot: 2, name: "Mordred", classId: 2 }),
      log: [],
      createdAt: "2026-01-01T00:00:00Z",
    });
    const { action } = await import("~/routes/tournaments.$id.duels.$duelId.play");
    await action({
      request: makePostRequest({
        intent: "startCombat",
        champion1Name: "Arthur",
        champion1ClassId: "1",
        champion1Level: "1",
        champion2Name: "Mordred",
        champion2ClassId: "2",
        champion2Level: "1",
      }),
      params: { id: "42", duelId: "3" },
      context: {},
    });
    expect(mockStartCombat).toHaveBeenCalledWith({
      champion1: { name: "Arthur", classId: 1, level: 1 },
      champion2: { name: "Mordred", classId: 2, level: 1 },
    });
  });

  it("submits a combat action on intent submit", async () => {
    mockSubmitAction.mockResolvedValue({
      id: 9,
      status: "IN_PROGRESS",
      turn: 2,
      winnerSlot: null,
      champion1: makeCombatant({ slot: 1 }),
      champion2: makeCombatant({ slot: 2, classId: 2 }),
      log: [],
      createdAt: "2026-01-01T00:00:00Z",
    });
    const { action } = await import("~/routes/tournaments.$id.duels.$duelId.play");
    await action({
      request: makePostRequest({ intent: "submit", combatId: "9", slot: "1", skillId: "10" }),
      params: { id: "42", duelId: "3" },
      context: {},
    });
    expect(mockSubmitAction).toHaveBeenCalledWith(9, { slot: 1, skillId: 10 });
  });

  it("maps a slot-1 winner to PLAYER1_WIN and redirects to the duels tab", async () => {
    const completed: Combat = {
      id: 9,
      status: "COMPLETED",
      turn: 4,
      winnerSlot: 1,
      champion1: makeCombatant({ slot: 1, currentHp: 50 }),
      champion2: makeCombatant({ slot: 2, classId: 2, currentHp: 0 }),
      log: [],
      createdAt: "2026-01-01T00:00:00Z",
    };
    mockGetCombat.mockResolvedValue(completed);
    mockSetOutcome.mockResolvedValue({ ...fakeDuel, outcome: "PLAYER1_WIN" });
    const { action } = await import("~/routes/tournaments.$id.duels.$duelId.play");
    const response = await action({
      request: makePostRequest({ intent: "validateResult", combatId: "9" }),
      params: { id: "42", duelId: "3" },
      context: {},
    });
    expect(mockSetOutcome).toHaveBeenCalledWith(3, { outcome: "PLAYER1_WIN" });
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("Location")).toBe("/tournaments/42/duels");
  });

  it("maps a slot-2 winner to PLAYER2_WIN", async () => {
    const completed: Combat = {
      id: 9,
      status: "COMPLETED",
      turn: 4,
      winnerSlot: 2,
      champion1: makeCombatant({ slot: 1, currentHp: 0 }),
      champion2: makeCombatant({ slot: 2, classId: 2, currentHp: 40 }),
      log: [],
      createdAt: "2026-01-01T00:00:00Z",
    };
    mockGetCombat.mockResolvedValue(completed);
    mockSetOutcome.mockResolvedValue({ ...fakeDuel, outcome: "PLAYER2_WIN" });
    const { action } = await import("~/routes/tournaments.$id.duels.$duelId.play");
    await action({
      request: makePostRequest({ intent: "validateResult", combatId: "9" }),
      params: { id: "42", duelId: "3" },
      context: {},
    });
    expect(mockSetOutcome).toHaveBeenCalledWith(3, { outcome: "PLAYER2_WIN" });
  });

  it("maps a draw (no winner) to DRAW", async () => {
    const drawn: Combat = {
      id: 9,
      status: "COMPLETED",
      turn: 11,
      winnerSlot: null,
      champion1: makeCombatant({ slot: 1, currentHp: 30 }),
      champion2: makeCombatant({ slot: 2, classId: 2, currentHp: 30 }),
      log: [],
      createdAt: "2026-01-01T00:00:00Z",
    };
    mockGetCombat.mockResolvedValue(drawn);
    mockSetOutcome.mockResolvedValue({ ...fakeDuel, outcome: "DRAW" });
    const { action } = await import("~/routes/tournaments.$id.duels.$duelId.play");
    await action({
      request: makePostRequest({ intent: "validateResult", combatId: "9" }),
      params: { id: "42", duelId: "3" },
      context: {},
    });
    expect(mockSetOutcome).toHaveBeenCalledWith(3, { outcome: "DRAW" });
  });
});
