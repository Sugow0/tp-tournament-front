import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateSkinForm } from "~/components/skin/CreateSkinForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("CreateSkinForm", () => {
  it("contains a hidden intent field with value create", () => {
    renderWithRouter(<CreateSkinForm />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("create");
  });

  it("renders name and assetKey inputs", () => {
    renderWithRouter(<CreateSkinForm />);
    expect(document.querySelector('input[name="name"]')).not.toBeNull();
    expect(document.querySelector('input[name="assetKey"]')).not.toBeNull();
  });

  it("renders a premium checkbox", () => {
    renderWithRouter(<CreateSkinForm />);
    expect(document.querySelector('input[name="isPremium"]')).not.toBeNull();
  });

  it("renders a category select with exactly PLAYER and BACKGROUND options", () => {
    renderWithRouter(<CreateSkinForm />);
    const select = document.querySelector('select[name="category"]') as HTMLSelectElement;
    expect(select).not.toBeNull();
    const values = Array.from(within(select).getAllByRole("option")).map(
      (o) => (o as HTMLOptionElement).value
    );
    expect(values).toEqual(["PLAYER", "BACKGROUND"]);
  });

  it("renders a submit button", () => {
    renderWithRouter(<CreateSkinForm />);
    expect(screen.getByRole("button", { name: "skin.create" })).toBeInTheDocument();
  });
});
