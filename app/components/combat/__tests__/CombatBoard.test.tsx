import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CombatBoard } from "~/components/combat/CombatBoard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Combat, CombatantState, Skill } from "~/types/combat";

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

const skill = (overrides: Partial<Skill>): Skill => ({
  id: 1,
  classId: 1,
  name: "Frappe",
  category: "ATTACK",
  power: 20,
  duration: 0,
  auraEffect: null,
  description: "",
  ...overrides,
});

const class1Skills: Skill[] = [
  skill({ id: 10, classId: 1, name: "Frappe lourde" }),
  skill({ id: 11, classId: 1, name: "Taillade" }),
];
const class2Skills: Skill[] = [
  skill({ id: 20, classId: 2, name: "Boule de feu", category: "ATTACK" }),
  skill({ id: 21, classId: 2, name: "Bouclier magique", category: "DEFEND" }),
];

function renderBoard(combat: Combat) {
  return renderWithRouter(
    <CombatBoard
      combat={combat}
      class1Skills={class1Skills}
      class2Skills={class2Skills}
      combatId={combat.id}
    />
  );
}

describe("CombatBoard active slot derivation", () => {
  it("shows slot 1 (champion1) hand when champion1 has not submitted", () => {
    renderBoard(makeCombat());
    const hand = screen.getByTestId("combat-hand");
    expect(within(hand).getByText("Frappe lourde")).toBeInTheDocument();
    expect(within(hand).getByText("Taillade")).toBeInTheDocument();
    expect(within(hand).queryByText("Boule de feu")).not.toBeInTheDocument();
    expect(screen.getByTestId("active-champion-name")).toHaveTextContent("Arthur");
  });

  it("shows slot 2 (champion2) hand when champion1 has submitted", () => {
    renderBoard(
      makeCombat({
        champion1: makeCombatant({ slot: 1, classId: 1, name: "Arthur", hasSubmittedAction: true }),
      })
    );
    const hand = screen.getByTestId("combat-hand");
    expect(within(hand).getByText("Boule de feu")).toBeInTheDocument();
    expect(within(hand).getByText("Bouclier magique")).toBeInTheDocument();
    expect(within(hand).queryByText("Frappe lourde")).not.toBeInTheDocument();
    expect(screen.getByTestId("active-champion-name")).toHaveTextContent("Mordred");
  });

  it("shows the opponent (non-active slot) at the top of the board", () => {
    renderBoard(makeCombat());
    const opponent = screen.getByTestId("opponent-panel");
    expect(within(opponent).getByText("Mordred")).toBeInTheDocument();
  });
});

describe("CombatBoard card selection", () => {
  it("does not render a center card before any selection", () => {
    renderBoard(makeCombat());
    expect(screen.queryByTestId("center-card")).not.toBeInTheDocument();
  });

  it("moves the clicked card to the center stage and removes it from the hand", () => {
    renderBoard(makeCombat());
    fireEvent.click(screen.getByRole("button", { name: /Frappe lourde/ }));

    const center = screen.getByTestId("center-card");
    expect(within(center).getByText("Frappe lourde")).toBeInTheDocument();

    const hand = screen.getByTestId("combat-hand");
    expect(within(hand).queryByText("Frappe lourde")).not.toBeInTheDocument();
    expect(within(hand).getByText("Taillade")).toBeInTheDocument();
  });

  it("replaces the center card when another hand card is clicked", () => {
    renderBoard(makeCombat());
    fireEvent.click(screen.getByRole("button", { name: /Frappe lourde/ }));
    fireEvent.click(screen.getByRole("button", { name: /Taillade/ }));

    const center = screen.getByTestId("center-card");
    expect(within(center).getByText("Taillade")).toBeInTheDocument();
    expect(within(center).queryByText("Frappe lourde")).not.toBeInTheDocument();

    const hand = screen.getByTestId("combat-hand");
    expect(within(hand).getByText("Frappe lourde")).toBeInTheDocument();
  });
});

describe("CombatBoard submit form", () => {
  function submitForm() {
    return document.querySelector('[data-testid="play-card-form"]') as HTMLFormElement | null;
  }

  it("disables the play-card button until a card is selected", () => {
    renderBoard(makeCombat());
    const button = screen.getByRole("button", { name: "combat.playCard" });
    expect(button).toBeDisabled();
  });

  it("enables the play-card button once a card is selected", () => {
    renderBoard(makeCombat());
    fireEvent.click(screen.getByRole("button", { name: /Frappe lourde/ }));
    expect(screen.getByRole("button", { name: "combat.playCard" })).toBeEnabled();
  });

  it("carries intent=submit, the active slot and the selected skillId", () => {
    renderBoard(
      makeCombat({
        champion1: makeCombatant({ slot: 1, classId: 1, name: "Arthur", hasSubmittedAction: true }),
      })
    );
    fireEvent.click(screen.getByRole("button", { name: /Boule de feu/ }));

    const form = submitForm();
    expect(form).not.toBeNull();
    const intent = form?.querySelector('input[name="intent"]') as HTMLInputElement;
    const slot = form?.querySelector('input[name="slot"]') as HTMLInputElement;
    const skillId = form?.querySelector('input[name="skillId"]') as HTMLInputElement;
    expect(intent.value).toBe("submit");
    expect(slot.value).toBe("2");
    expect(skillId.value).toBe("20");
  });

  it("includes a hidden combatId input from the prop", () => {
    renderBoard(makeCombat({ id: 99 }));
    const form = submitForm();
    const combatId = form?.querySelector('input[name="combatId"]') as HTMLInputElement;
    expect(combatId).not.toBeNull();
    expect(combatId.value).toBe("99");
  });
});

describe("CombatBoard forfeit", () => {
  it("renders a forfeit form for the active slot", () => {
    renderBoard(makeCombat());
    const forfeitForm = document.querySelector(
      '[data-testid="forfeit-form"]'
    ) as HTMLFormElement | null;
    expect(forfeitForm).not.toBeNull();
    const intent = forfeitForm?.querySelector('input[name="intent"]') as HTMLInputElement;
    const slot = forfeitForm?.querySelector('input[name="slot"]') as HTMLInputElement;
    expect(intent.value).toBe("forfeit");
    expect(slot.value).toBe("1");
  });
});

describe("CombatBoard when combat is over", () => {
  it("renders nothing for the action area when the combat is completed", () => {
    const { container } = renderBoard(makeCombat({ status: "COMPLETED", winnerSlot: 1 }));
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByTestId("combat-hand")).not.toBeInTheDocument();
  });

  it("renders nothing when the turn has exceeded the cap", () => {
    const { container } = renderBoard(makeCombat({ turn: 11 }));
    expect(container).toBeEmptyDOMElement();
  });
});

describe("CombatBoard active effects", () => {
  it("renders the active champion's effect badges in the HP bar", () => {
    renderBoard(
      makeCombat({
        champion1: makeCombatant({
          slot: 1,
          classId: 1,
          name: "Arthur",
          effects: [{ effectType: "ATTACK_UP", magnitude: 5, remainingTurns: 2 }],
        }),
      })
    );
    expect(screen.getByText(/ATTACK_UP/)).toBeInTheDocument();
    expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
  });
});

describe("CombatBoard center card", () => {
  it("clears the selection when the center card is clicked", () => {
    renderBoard(makeCombat());
    fireEvent.click(screen.getByRole("button", { name: /Frappe lourde/ }));

    const center = screen.getByTestId("center-card");
    fireEvent.click(within(center).getByRole("button"));

    expect(screen.queryByTestId("center-card")).not.toBeInTheDocument();
    const hand = screen.getByTestId("combat-hand");
    expect(within(hand).getByText("Frappe lourde")).toBeInTheDocument();
  });

  it("clears the selection on form submit", () => {
    renderBoard(makeCombat());
    fireEvent.click(screen.getByRole("button", { name: /Frappe lourde/ }));
    expect(screen.getByTestId("center-card")).toBeInTheDocument();

    const form = document.querySelector('[data-testid="play-card-form"]') as HTMLFormElement;
    fireEvent.submit(form);

    expect(screen.queryByTestId("center-card")).not.toBeInTheDocument();
  });
});

describe("CombatBoard hot-seat hand-off overlay", () => {
  function makeSlot2Combat() {
    return makeCombat({
      champion1: makeCombatant({
        slot: 1,
        classId: 1,
        name: "Arthur",
        hasSubmittedAction: true,
      }),
    });
  }

  it("shows the hand-off overlay when it becomes slot 2's turn", () => {
    renderBoard(makeSlot2Combat());
    expect(screen.getByText("combat.handoff")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "combat.handoffReady" })).toBeInTheDocument();
  });

  it("dismisses the overlay once the ready button is clicked", () => {
    renderBoard(makeSlot2Combat());
    fireEvent.click(screen.getByRole("button", { name: "combat.handoffReady" }));
    expect(screen.queryByText("combat.handoff")).not.toBeInTheDocument();
  });
});
