import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BattlepassTierRow } from "~/components/battlepass/BattlepassTierRow";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { BattlepassTier } from "~/types/battlepass";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const freeTier: BattlepassTier = {
  id: 11,
  battlepassId: 7,
  tierNumber: 4,
  xpRequired: 400,
  isPremium: false,
  rewardType: "SKIN",
  rewardData: "knight_gold",
};

const premiumTier: BattlepassTier = {
  ...freeTier,
  id: 12,
  tierNumber: 5,
  xpRequired: 500,
  isPremium: true,
};

describe("BattlepassTierRow", () => {
  it("renders the tier number", () => {
    renderWithRouter(<BattlepassTierRow tier={freeTier} />);
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText(/battlepass.tier 4/)).toBeInTheDocument();
  });

  it("renders the xp required", () => {
    renderWithRouter(<BattlepassTierRow tier={freeTier} />);
    expect(screen.getByText(/400/)).toBeInTheDocument();
  });

  it("renders the reward type and data", () => {
    renderWithRouter(<BattlepassTierRow tier={freeTier} />);
    expect(screen.getByText(/SKIN/)).toBeInTheDocument();
    expect(screen.getByText(/knight_gold/)).toBeInTheDocument();
  });

  it("shows a premium indicator for premium tiers", () => {
    renderWithRouter(<BattlepassTierRow tier={premiumTier} />);
    expect(screen.getByText("battlepass.premium")).toBeInTheDocument();
  });

  it("does not show a premium indicator for free tiers", () => {
    renderWithRouter(<BattlepassTierRow tier={freeTier} />);
    expect(screen.queryByText("battlepass.premium")).not.toBeInTheDocument();
  });
});
