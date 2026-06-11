import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CombatArena } from "~/components/combat/CombatArena";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Combat, CombatantState, Skill } from "~/types/combat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("~/components/combat/CombatBoard", () => ({
  CombatBoard: () => <div data-testid="mock-combat-board" />,
}));

vi.mock("~/components/combat/OutcomeBanner", () => ({
  OutcomeBanner: () => <div data-testid="mock-outcome-banner" />,
}));

vi.mock("~/components/combat/CombatLog", () => ({
  CombatLog: () => <div data-testid="mock-combat-log" />,
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
    id: 7,
    status: "IN_PROGRESS",
    turn: 1,
    winnerSlot: null,
    champion1: makeCombatant({ slot: 1, classId: 1, name: "Arthur" }),
    champion2: makeCombatant({ slot: 2, classId: 2, name: "Mordred" }),
    log: [],
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const class1Skills: Skill[] = [];
const class2Skills: Skill[] = [];

function renderArena(combat: Combat) {
  return renderWithRouter(
    <CombatArena combat={combat} class1Skills={class1Skills} class2Skills={class2Skills} />
  );
}

describe("CombatArena", () => {
  it("renders the turn counter capped at MAX_TURNS", () => {
    renderArena(makeCombat({ turn: 3 }));
    expect(screen.getByText(/combat.turn/)).toHaveTextContent("combat.turn 3 / 10");
  });

  it("caps the displayed turn at MAX_TURNS", () => {
    renderArena(makeCombat({ status: "COMPLETED", turn: 25 }));
    expect(screen.getByText(/combat.turn/)).toHaveTextContent("combat.turn 10 / 10");
  });

  it("renders the CombatLog", () => {
    renderArena(makeCombat());
    expect(screen.getByTestId("mock-combat-log")).toBeInTheDocument();
  });

  it("renders the CombatBoard when the combat is ongoing", () => {
    renderArena(makeCombat({ status: "IN_PROGRESS", turn: 1 }));
    expect(screen.getByTestId("mock-combat-board")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-outcome-banner")).not.toBeInTheDocument();
  });

  it("renders the OutcomeBanner when the combat is COMPLETED", () => {
    renderArena(makeCombat({ status: "COMPLETED", winnerSlot: 1 }));
    expect(screen.getByTestId("mock-outcome-banner")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-combat-board")).not.toBeInTheDocument();
  });

  it("renders the OutcomeBanner when the turn exceeds MAX_TURNS", () => {
    renderArena(makeCombat({ status: "IN_PROGRESS", turn: 11 }));
    expect(screen.getByTestId("mock-outcome-banner")).toBeInTheDocument();
    expect(screen.queryByTestId("mock-combat-board")).not.toBeInTheDocument();
  });

  it("accepts the optional classes prop without rendering issues", () => {
    renderWithRouter(
      <CombatArena
        combat={makeCombat()}
        class1Skills={class1Skills}
        class2Skills={class2Skills}
        classes={[{ id: 1, name: "Guerrier", description: "", skillCount: 4 }]}
      />
    );
    expect(screen.getByTestId("mock-combat-board")).toBeInTheDocument();
  });
});
