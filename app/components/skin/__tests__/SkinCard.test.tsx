import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SkinCard } from "~/components/skin/SkinCard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Skin } from "~/types/skin";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const premiumSkin: Skin = {
  id: 1,
  category: "PLAYER",
  name: "Dragon Knight",
  assetKey: "dragon-knight",
  isPremium: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00Z",
};

const freeSkin: Skin = {
  id: 2,
  category: "BACKGROUND",
  name: "Misty Arena",
  assetKey: "misty-arena",
  isPremium: false,
  isActive: true,
  createdAt: "2026-01-01T00:00:00Z",
};

describe("SkinCard", () => {
  it("renders the skin name", () => {
    renderWithRouter(<SkinCard skin={premiumSkin} />);
    expect(screen.getByText("Dragon Knight")).toBeInTheDocument();
  });

  it("renders the category label", () => {
    renderWithRouter(<SkinCard skin={premiumSkin} />);
    expect(screen.getByText("skin.categories.PLAYER")).toBeInTheDocument();
  });

  it("renders the asset key caption", () => {
    renderWithRouter(<SkinCard skin={premiumSkin} />);
    expect(screen.getByText("dragon-knight")).toBeInTheDocument();
  });

  it("shows the premium indicator when isPremium is true", () => {
    renderWithRouter(<SkinCard skin={premiumSkin} />);
    expect(screen.getByText("skin.premium")).toBeInTheDocument();
  });

  it("does not show the premium indicator when isPremium is false", () => {
    renderWithRouter(<SkinCard skin={freeSkin} />);
    expect(screen.queryByText("skin.premium")).not.toBeInTheDocument();
  });
});
