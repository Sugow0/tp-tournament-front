import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PlayerProgressPanel } from "~/components/battlepass/PlayerProgressPanel";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { PlayerBattlepassProgress } from "~/types/battlepass";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const fakeProgress: PlayerBattlepassProgress = {
  id: 5,
  playerId: 42,
  battlepassId: 7,
  currentXp: 250,
  currentTier: 3,
  isPremiumUnlocked: false,
};

describe("PlayerProgressPanel", () => {
  it("shows the current tier out of total tiers", () => {
    renderWithRouter(<PlayerProgressPanel progress={fakeProgress} totalTiers={50} />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/50/)).toBeInTheDocument();
  });

  it("shows the current xp", () => {
    renderWithRouter(<PlayerProgressPanel progress={fakeProgress} totalTiers={50} />);
    expect(screen.getByText(/250/)).toBeInTheDocument();
  });
});
