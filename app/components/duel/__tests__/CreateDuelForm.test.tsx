import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateDuelForm } from "~/components/duel/CreateDuelForm";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Player } from "~/types/player";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const players: Player[] = [
  {
    tournamentId: 1,
    playerId: 1,
    playerName: "Arthur",
    classId: 1,
    level: 1,
    isDisqualified: false,
    penaltyPoints: 0,
  },
  {
    tournamentId: 1,
    playerId: 2,
    playerName: "Lancelot",
    classId: 1,
    level: 1,
    isDisqualified: false,
    penaltyPoints: 0,
  },
];

describe("CreateDuelForm", () => {
  it("contains hidden intent field with value createDuel", () => {
    renderWithRouter(<CreateDuelForm players={players} nextOrder={1} />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("createDuel");
  });

  it("renders two selects for player1 and player2", () => {
    renderWithRouter(<CreateDuelForm players={players} nextOrder={1} />);
    expect(screen.getAllByRole("combobox")).toHaveLength(2);
  });

  it("renders player names as options", () => {
    renderWithRouter(<CreateDuelForm players={players} nextOrder={1} />);
    expect(screen.getAllByText("Arthur").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Lancelot").length).toBeGreaterThan(0);
  });

  it("renders a submit button", () => {
    renderWithRouter(<CreateDuelForm players={players} nextOrder={1} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
