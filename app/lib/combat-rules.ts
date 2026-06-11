import type { Combat, CombatantState } from "~/types/combat";

export const MAX_TURNS = 10;

export type Outcome = "WIN" | "DRAW" | "LOSS";

export interface OutcomeResult {
  winnerSlot: 1 | 2 | null;
  slot1: Outcome;
  slot2: Outcome;
  points1: number;
  points2: number;
}

export function isCombatOver(combat: Combat): boolean {
  return combat.status === "COMPLETED" || combat.turn > MAX_TURNS;
}

export function pointsFor(outcome: Outcome): number {
  switch (outcome) {
    case "WIN":
      return 3;
    case "DRAW":
      return 1;
    case "LOSS":
      return 0;
  }
}

export function resolveOutcome(combat: Combat): OutcomeResult {
  if (combat.status === "COMPLETED" && combat.winnerSlot != null) {
    const winnerSlot = combat.winnerSlot === 2 ? 2 : 1;
    const slot1: Outcome = winnerSlot === 1 ? "WIN" : "LOSS";
    const slot2: Outcome = winnerSlot === 2 ? "WIN" : "LOSS";
    return {
      winnerSlot,
      slot1,
      slot2,
      points1: pointsFor(slot1),
      points2: pointsFor(slot2),
    };
  }

  // 10-turn cap reached with both alive: compare current HP.
  const hp1 = combat.champion1.currentHp;
  const hp2 = combat.champion2.currentHp;

  if (hp1 === hp2) {
    return { winnerSlot: null, slot1: "DRAW", slot2: "DRAW", points1: 1, points2: 1 };
  }

  const winnerSlot: 1 | 2 = hp1 > hp2 ? 1 : 2;
  const slot1: Outcome = winnerSlot === 1 ? "WIN" : "LOSS";
  const slot2: Outcome = winnerSlot === 2 ? "WIN" : "LOSS";
  return {
    winnerSlot,
    slot1,
    slot2,
    points1: pointsFor(slot1),
    points2: pointsFor(slot2),
  };
}

export function hpPercent(c: CombatantState): number {
  const pct = (c.currentHp / c.maxHp) * 100;
  return Math.max(0, Math.min(100, pct));
}
