import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RankingTable } from "~/components/ranking/RankingTable";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { PlayerScore } from "~/types/score";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const rows: PlayerScore[] = [
  { playerId: 1, playerName: "Arthur", finalScore: 12, isDisqualified: false },
  { playerId: 2, playerName: "Lancelot", finalScore: 8, isDisqualified: false },
  { playerId: 3, playerName: "Mordred", finalScore: 5, isDisqualified: true },
];

describe("RankingTable", () => {
  it("renders a row per player", () => {
    renderWithRouter(<RankingTable rows={rows} />);
    expect(screen.getByText("Arthur")).toBeInTheDocument();
    expect(screen.getByText("Lancelot")).toBeInTheDocument();
    expect(screen.getByText("Mordred")).toBeInTheDocument();
  });

  it("shows each player's final score", () => {
    renderWithRouter(<RankingTable rows={rows} />);
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("renders the rank for each player", () => {
    renderWithRouter(<RankingTable rows={rows} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("marks the disqualified player", () => {
    renderWithRouter(<RankingTable rows={rows} />);
    expect(screen.getByText("player.disqualified")).toBeInTheDocument();
  });
});
