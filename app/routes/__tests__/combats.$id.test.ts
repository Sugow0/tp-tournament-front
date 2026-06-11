import { beforeEach, describe, expect, it, vi } from "vitest";
import * as classesService from "~/services/classes.service";
import * as combatsService from "~/services/combats.service";
import type { Combat, CombatantState, Skill } from "~/types/combat";

vi.mock("~/services/combats.service");
vi.mock("~/services/classes.service");
const mockGetCombat = vi.mocked(combatsService.getCombat);
const mockSubmitAction = vi.mocked(combatsService.submitAction);
const mockForfeit = vi.mocked(combatsService.forfeit);
const mockGetClassSkills = vi.mocked(classesService.getClassSkills);

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

const fakeCombat: Combat = {
  id: 5,
  status: "IN_PROGRESS",
  turn: 1,
  winnerSlot: null,
  champion1: makeCombatant({ slot: 1, classId: 1 }),
  champion2: makeCombatant({ slot: 2, name: "Mordred", classId: 2 }),
  log: [],
  createdAt: "2026-01-01T00:00:00Z",
};

const skill1: Skill = {
  id: 10,
  classId: 1,
  name: "Frappe",
  category: "ATTACK",
  power: 20,
  duration: 0,
  auraEffect: null,
  description: "",
};

const skill2: Skill = { ...skill1, id: 20, classId: 2, name: "Bouclier", category: "DEFEND" };

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/combats/5", { method: "POST", body: form });
}

describe("combats.$id loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns combat plus skills for both champion classes", async () => {
    mockGetCombat.mockResolvedValue(fakeCombat);
    mockGetClassSkills.mockImplementation(async (classId: number) =>
      classId === 1 ? [skill1] : [skill2]
    );
    const { loader } = await import("~/routes/combats.$id");
    const request = new Request("http://localhost/combats/5");
    const data = await loader({ params: { id: "5" }, request, context: {} });
    expect(mockGetCombat).toHaveBeenCalledWith(5);
    expect(mockGetClassSkills).toHaveBeenCalledWith(1);
    expect(mockGetClassSkills).toHaveBeenCalledWith(2);
    expect(data.combat).toEqual(fakeCombat);
    expect(data.class1Skills).toEqual([skill1]);
    expect(data.class2Skills).toEqual([skill2]);
  });
});

describe("combats.$id action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls submitAction when intent is submit", async () => {
    mockSubmitAction.mockResolvedValue(fakeCombat);
    const { action } = await import("~/routes/combats.$id");
    await action({
      request: makePostRequest({ intent: "submit", slot: "1", skillId: "10" }),
      params: { id: "5" },
      context: {},
    });
    expect(mockSubmitAction).toHaveBeenCalledWith(5, { slot: 1, skillId: 10 });
  });

  it("calls forfeit when intent is forfeit", async () => {
    mockForfeit.mockResolvedValue({ ...fakeCombat, status: "COMPLETED", winnerSlot: 2 });
    const { action } = await import("~/routes/combats.$id");
    await action({
      request: makePostRequest({ intent: "forfeit", slot: "1" }),
      params: { id: "5" },
      context: {},
    });
    expect(mockForfeit).toHaveBeenCalledWith(5, { slot: 1 });
  });
});
