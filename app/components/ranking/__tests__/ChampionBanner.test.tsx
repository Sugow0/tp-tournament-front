import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ChampionBanner } from "~/components/ranking/ChampionBanner";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { PlayerScore } from "~/types/score";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const champion: PlayerScore = {
  playerId: 1,
  playerName: "Arthur",
  finalScore: 12,
  isDisqualified: false,
};

describe("ChampionBanner", () => {
  it("renders the champion name", () => {
    renderWithRouter(<ChampionBanner champion={champion} />);
    expect(screen.getByText("Arthur")).toBeInTheDocument();
  });

  it("renders the champion final score", () => {
    renderWithRouter(<ChampionBanner champion={champion} />);
    expect(screen.getByText(/12/)).toBeInTheDocument();
  });

  it("renders the champion label", () => {
    renderWithRouter(<ChampionBanner champion={champion} />);
    expect(screen.getByText("ranking.champion")).toBeInTheDocument();
  });
});
