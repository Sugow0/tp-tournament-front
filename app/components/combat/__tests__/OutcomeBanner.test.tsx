import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OutcomeBanner } from "~/components/combat/OutcomeBanner";
import type { Combat, CombatantState } from "~/types/combat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

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

describe("OutcomeBanner", () => {
  it("shows WIN for the winner and LOSS for the loser on a completed combat", () => {
    const combat = makeCombat({
      status: "COMPLETED",
      winnerSlot: 1,
      champion1: makeCombatant({ slot: 1, currentHp: 30 }),
      champion2: makeCombatant({ slot: 2, name: "Mordred", currentHp: 0 }),
    });
    render(<OutcomeBanner combat={combat} />);
    expect(screen.getByText("combat.win")).toBeInTheDocument();
    expect(screen.getByText("combat.loss")).toBeInTheDocument();
    expect(screen.getByText(/\+3/)).toBeInTheDocument();
    expect(screen.getByText(/\+0/)).toBeInTheDocument();
  });

  it("shows DRAW for both on a 10-turn cap with equal HP", () => {
    const combat = makeCombat({
      status: "IN_PROGRESS",
      turn: 11,
      winnerSlot: null,
      champion1: makeCombatant({ slot: 1, currentHp: 50 }),
      champion2: makeCombatant({ slot: 2, name: "Mordred", currentHp: 50 }),
    });
    render(<OutcomeBanner combat={combat} />);
    expect(screen.getAllByText("combat.draw")).toHaveLength(2);
    expect(screen.getAllByText(/\+1/)).toHaveLength(2);
  });
});
