import { describe, expect, it } from "vitest";
import { hpPercent, isCombatOver, MAX_TURNS, pointsFor, resolveOutcome } from "~/lib/combat-rules";
import type { Combat, CombatantState } from "~/types/combat";

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

function makeCombat(overrides: Partial<Combat> = {}): Combat {
  return {
    id: 1,
    status: "IN_PROGRESS",
    turn: 1,
    winnerSlot: null,
    champion1: makeCombatant({ slot: 1 }),
    champion2: makeCombatant({ slot: 2, name: "Mordred" }),
    log: [],
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("combat-rules", () => {
  describe("MAX_TURNS", () => {
    it("is 10", () => {
      expect(MAX_TURNS).toBe(10);
    });
  });

  describe("isCombatOver", () => {
    it("is false for an in-progress combat within turn cap", () => {
      expect(isCombatOver(makeCombat({ status: "IN_PROGRESS", turn: 3 }))).toBe(false);
    });

    it("is true for a completed combat", () => {
      expect(isCombatOver(makeCombat({ status: "COMPLETED", turn: 4 }))).toBe(true);
    });

    it("is true once turn exceeds MAX_TURNS", () => {
      expect(isCombatOver(makeCombat({ status: "IN_PROGRESS", turn: 11 }))).toBe(true);
    });

    it("is false on exactly turn 10", () => {
      expect(isCombatOver(makeCombat({ status: "IN_PROGRESS", turn: 10 }))).toBe(false);
    });
  });

  describe("resolveOutcome", () => {
    it("awards WIN +3 to the winner slot and LOSS +0 to the other when COMPLETED", () => {
      const combat = makeCombat({
        status: "COMPLETED",
        winnerSlot: 1,
        champion1: makeCombatant({ slot: 1, currentHp: 40 }),
        champion2: makeCombatant({ slot: 2, currentHp: 0 }),
      });
      const result = resolveOutcome(combat);
      expect(result.winnerSlot).toBe(1);
      expect(result.slot1).toBe("WIN");
      expect(result.slot2).toBe("LOSS");
      expect(result.points1).toBe(3);
      expect(result.points2).toBe(0);
    });

    it("awards WIN to slot 2 when winnerSlot is 2", () => {
      const combat = makeCombat({
        status: "COMPLETED",
        winnerSlot: 2,
        champion1: makeCombatant({ slot: 1, currentHp: 0 }),
        champion2: makeCombatant({ slot: 2, currentHp: 55 }),
      });
      const result = resolveOutcome(combat);
      expect(result.winnerSlot).toBe(2);
      expect(result.slot1).toBe("LOSS");
      expect(result.slot2).toBe("WIN");
      expect(result.points1).toBe(0);
      expect(result.points2).toBe(3);
    });

    it("compares HP at the 10-turn cap: higher HP wins", () => {
      const combat = makeCombat({
        status: "IN_PROGRESS",
        turn: 11,
        winnerSlot: null,
        champion1: makeCombatant({ slot: 1, currentHp: 70 }),
        champion2: makeCombatant({ slot: 2, currentHp: 30 }),
      });
      const result = resolveOutcome(combat);
      expect(result.winnerSlot).toBe(1);
      expect(result.slot1).toBe("WIN");
      expect(result.slot2).toBe("LOSS");
      expect(result.points1).toBe(3);
      expect(result.points2).toBe(0);
    });

    it("declares slot 2 the winner when it has higher HP at the cap", () => {
      const combat = makeCombat({
        status: "IN_PROGRESS",
        turn: 11,
        winnerSlot: null,
        champion1: makeCombatant({ slot: 1, currentHp: 20 }),
        champion2: makeCombatant({ slot: 2, currentHp: 90 }),
      });
      const result = resolveOutcome(combat);
      expect(result.winnerSlot).toBe(2);
      expect(result.slot1).toBe("LOSS");
      expect(result.slot2).toBe("WIN");
    });

    it("declares a DRAW +1 for both when HP is equal at the cap", () => {
      const combat = makeCombat({
        status: "IN_PROGRESS",
        turn: 11,
        winnerSlot: null,
        champion1: makeCombatant({ slot: 1, currentHp: 50 }),
        champion2: makeCombatant({ slot: 2, currentHp: 50 }),
      });
      const result = resolveOutcome(combat);
      expect(result.winnerSlot).toBeNull();
      expect(result.slot1).toBe("DRAW");
      expect(result.slot2).toBe("DRAW");
      expect(result.points1).toBe(1);
      expect(result.points2).toBe(1);
    });
  });

  describe("pointsFor", () => {
    it("maps WIN to 3", () => {
      expect(pointsFor("WIN")).toBe(3);
    });

    it("maps DRAW to 1", () => {
      expect(pointsFor("DRAW")).toBe(1);
    });

    it("maps LOSS to 0", () => {
      expect(pointsFor("LOSS")).toBe(0);
    });
  });

  describe("hpPercent", () => {
    it("returns the percentage of currentHp over maxHp", () => {
      expect(hpPercent(makeCombatant({ currentHp: 55, maxHp: 110 }))).toBe(50);
    });

    it("clamps to 100 when currentHp exceeds maxHp", () => {
      expect(hpPercent(makeCombatant({ currentHp: 200, maxHp: 110 }))).toBe(100);
    });

    it("clamps to 0 when currentHp is negative", () => {
      expect(hpPercent(makeCombatant({ currentHp: -20, maxHp: 110 }))).toBe(0);
    });
  });
});
