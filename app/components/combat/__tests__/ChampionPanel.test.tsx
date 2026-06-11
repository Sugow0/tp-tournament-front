import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChampionPanel } from "~/components/combat/ChampionPanel";
import type { CombatantState } from "~/types/combat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const champion: CombatantState = {
  slot: 1,
  name: "Arthur",
  classId: 1,
  level: 3,
  maxHp: 130,
  currentHp: 65,
  hasSubmittedAction: false,
  effects: [],
};

describe("ChampionPanel", () => {
  it("renders the champion name", () => {
    render(<ChampionPanel champion={champion} className="Guerrier" />);
    expect(screen.getByText("Arthur")).toBeInTheDocument();
  });

  it("renders the current and max HP", () => {
    render(<ChampionPanel champion={champion} className="Guerrier" />);
    expect(screen.getByText(/65/)).toBeInTheDocument();
    expect(screen.getByText(/130/)).toBeInTheDocument();
  });

  it("shows the submitted indicator when hasSubmittedAction is true", () => {
    render(
      <ChampionPanel champion={{ ...champion, hasSubmittedAction: true }} className="Guerrier" />
    );
    expect(screen.getByText("combat.validate")).toBeInTheDocument();
  });
});
