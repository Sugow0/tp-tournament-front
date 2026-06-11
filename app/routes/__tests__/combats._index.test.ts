import { beforeEach, describe, expect, it, vi } from "vitest";
import * as classesService from "~/services/classes.service";
import * as combatsService from "~/services/combats.service";
import type { ChampionClass, Combat, CombatantState } from "~/types/combat";

vi.mock("~/services/combats.service");
vi.mock("~/services/classes.service");
const mockListCombats = vi.mocked(combatsService.listCombats);
const mockStartCombat = vi.mocked(combatsService.startCombat);
const mockListClasses = vi.mocked(classesService.listClasses);

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

const fakeClass: ChampionClass = {
  id: 1,
  name: "Guerrier",
  description: "",
  skillCount: 4,
};

const fakeCombat: Combat = {
  id: 5,
  status: "IN_PROGRESS",
  turn: 1,
  winnerSlot: null,
  champion1: makeCombatant({ slot: 1 }),
  champion2: makeCombatant({ slot: 2, name: "Mordred", classId: 2 }),
  log: [],
  createdAt: "2026-01-01T00:00:00Z",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/combats", { method: "POST", body: form });
}

describe("combats._index loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns combats and classes", async () => {
    mockListCombats.mockResolvedValue([fakeCombat]);
    mockListClasses.mockResolvedValue([fakeClass]);
    const { loader } = await import("~/routes/combats._index");
    const data = await loader();
    expect(mockListCombats).toHaveBeenCalledOnce();
    expect(mockListClasses).toHaveBeenCalledOnce();
    expect(data.combats).toEqual([fakeCombat]);
    expect(data.classes).toEqual([fakeClass]);
  });
});

describe("combats._index action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("creates a combat and redirects to its detail page", async () => {
    mockStartCombat.mockResolvedValue(fakeCombat);
    const { action } = await import("~/routes/combats._index");
    const request = makePostRequest({
      intent: "create",
      champion1Name: "Arthur",
      champion1ClassId: "1",
      champion1Level: "1",
      champion2Name: "Mordred",
      champion2ClassId: "2",
      champion2Level: "2",
    });
    const response = await action({ request, params: {}, context: {} });
    expect(mockStartCombat).toHaveBeenCalledWith({
      champion1: { name: "Arthur", classId: 1, level: 1 },
      champion2: { name: "Mordred", classId: 2, level: 2 },
    });
    expect(response).toBeInstanceOf(Response);
    expect((response as Response).headers.get("Location")).toBe("/combats/5");
  });
});
