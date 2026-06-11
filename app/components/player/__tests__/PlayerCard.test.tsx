import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayerCard } from "~/components/player/PlayerCard";
import type { Player } from "~/types/player";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const base: Player = {
  id: 1,
  tournamentId: 1,
  name: "Arthur Pendragon",
  isDisqualified: false,
  penaltyPoints: 0,
};

describe("PlayerCard", () => {
  it("renders player name", () => {
    render(<PlayerCard player={base} />);
    expect(screen.getByText("Arthur Pendragon")).toBeInTheDocument();
  });

  it("shows penalty badge when penaltyPoints > 0", () => {
    render(<PlayerCard player={{ ...base, penaltyPoints: 3 }} />);
    expect(screen.getByTestId("penalty-badge")).toBeInTheDocument();
    expect(screen.getByTestId("penalty-badge")).toHaveTextContent("3");
  });

  it("does not show penalty badge when penaltyPoints is 0", () => {
    render(<PlayerCard player={base} />);
    expect(screen.queryByTestId("penalty-badge")).not.toBeInTheDocument();
  });

  it("shows disqualified label when isDisqualified is true", () => {
    render(<PlayerCard player={{ ...base, isDisqualified: true }} />);
    expect(screen.getByText("player.disqualified")).toBeInTheDocument();
  });

  it("does not show disqualified label when isDisqualified is false", () => {
    render(<PlayerCard player={base} />);
    expect(screen.queryByText("player.disqualified")).not.toBeInTheDocument();
  });
});
