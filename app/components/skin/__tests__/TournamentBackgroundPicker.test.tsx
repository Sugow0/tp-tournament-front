import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TournamentBackgroundPicker } from "~/components/skin/TournamentBackgroundPicker";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Skin, TournamentBackground } from "~/types/skin";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function makeSkin(overrides: Partial<Skin>): Skin {
  return {
    id: 1,
    category: "BACKGROUND",
    name: "Forêt enchantée",
    assetKey: "bg-forest",
    isPremium: false,
    isActive: true,
    createdAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

const backgroundSkins: Skin[] = [
  makeSkin({ id: 1, name: "Forêt enchantée" }),
  makeSkin({ id: 2, name: "Château royal" }),
  makeSkin({ id: 3, name: "Skin joueur", category: "PLAYER" }),
];

const background: TournamentBackground = {
  tournamentId: 99,
  skinId: 2,
  skinName: "Château royal",
  assetKey: "bg-castle",
};

describe("TournamentBackgroundPicker", () => {
  it("contains a hidden intent field with value setBackground", () => {
    renderWithRouter(
      <TournamentBackgroundPicker skins={backgroundSkins} background={background} />
    );
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("setBackground");
  });

  it("shows the current background name", () => {
    renderWithRouter(
      <TournamentBackgroundPicker
        skins={backgroundSkins}
        background={{ ...background, skinName: "Donjon obscur" }}
      />
    );
    expect(screen.getByText("Donjon obscur")).toBeInTheDocument();
  });

  it("falls back to a dash when there is no current background name", () => {
    renderWithRouter(
      <TournamentBackgroundPicker
        skins={backgroundSkins}
        background={{ ...background, skinId: null, skinName: null }}
      />
    );
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("only lists BACKGROUND skins as options and defaults to the current skin", () => {
    renderWithRouter(
      <TournamentBackgroundPicker skins={backgroundSkins} background={background} />
    );
    const select = document.querySelector('select[name="skinId"]') as HTMLSelectElement;
    const values = Array.from(within(select).getAllByRole("option")).map(
      (o) => (o as HTMLOptionElement).value
    );
    expect(values).toEqual(["1", "2"]);
    expect(select.value).toBe("2");
  });

  it("defaults the select to empty string when background skinId is null", () => {
    renderWithRouter(
      <TournamentBackgroundPicker
        skins={backgroundSkins}
        background={{ ...background, skinId: null, skinName: null }}
      />
    );
    const select = document.querySelector('select[name="skinId"]') as HTMLSelectElement;
    expect(select.value).toBe("1");
  });

  it("enables the save button when background skins exist", () => {
    renderWithRouter(
      <TournamentBackgroundPicker skins={backgroundSkins} background={background} />
    );
    expect(screen.getByRole("button", { name: "save" })).toBeEnabled();
  });

  it("disables the save button when there are no background skins", () => {
    renderWithRouter(
      <TournamentBackgroundPicker
        skins={[makeSkin({ id: 9, category: "PLAYER" })]}
        background={{ ...background, skinId: null, skinName: null }}
      />
    );
    expect(screen.getByRole("button", { name: "save" })).toBeDisabled();
  });
});
