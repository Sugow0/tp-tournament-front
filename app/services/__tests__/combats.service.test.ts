import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  forfeit,
  getCombat,
  listCombats,
  startCombat,
  submitAction,
} from "~/services/combats.service";
import type { Combat, CombatantState } from "~/types/combat";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const champion1: CombatantState = {
  slot: 1,
  name: "Arthur",
  classId: 1,
  level: 1,
  maxHp: 110,
  currentHp: 110,
  hasSubmitted: false,
  effects: [],
};

const champion2: CombatantState = {
  ...champion1,
  slot: 2,
  name: "Mordred",
  classId: 2,
};

const fakeCombat: Combat = {
  id: 5,
  status: "IN_PROGRESS",
  turn: 1,
  winnerSlot: null,
  champion1,
  champion2,
  log: [],
  createdAt: "2026-01-01T00:00:00Z",
};

describe("combats.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("startCombat", () => {
    it("calls POST /api/combats with the two combatant specs", async () => {
      mockApiFetch.mockResolvedValue(fakeCombat);
      const body = {
        champion1: { name: "Arthur", classId: 1, level: 1 },
        champion2: { name: "Mordred", classId: 2, level: 1 },
      };
      const result = await startCombat(body);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/combats", {
        method: "POST",
        body: JSON.stringify(body),
      });
      expect(result).toEqual(fakeCombat);
    });
  });

  describe("listCombats", () => {
    it("calls GET /api/combats and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeCombat]);
      const result = await listCombats();
      expect(mockApiFetch).toHaveBeenCalledWith("/api/combats");
      expect(result).toEqual([fakeCombat]);
    });
  });

  describe("getCombat", () => {
    it("calls GET /api/combats/:id", async () => {
      mockApiFetch.mockResolvedValue(fakeCombat);
      const result = await getCombat(5);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/combats/5");
      expect(result).toEqual(fakeCombat);
    });
  });

  describe("submitAction", () => {
    it("calls POST /api/combats/:id/actions with slot and skillId", async () => {
      mockApiFetch.mockResolvedValue(fakeCombat);
      const result = await submitAction(5, { slot: 1, skillId: 10 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/combats/5/actions", {
        method: "POST",
        body: JSON.stringify({ slot: 1, skillId: 10 }),
      });
      expect(result).toEqual(fakeCombat);
    });
  });

  describe("forfeit", () => {
    it("calls POST /api/combats/:id/forfeit with slot", async () => {
      mockApiFetch.mockResolvedValue({ ...fakeCombat, status: "COMPLETED", winnerSlot: 2 });
      const result = await forfeit(5, { slot: 1 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/combats/5/forfeit", {
        method: "POST",
        body: JSON.stringify({ slot: 1 }),
      });
      expect(result.status).toBe("COMPLETED");
    });
  });
});
