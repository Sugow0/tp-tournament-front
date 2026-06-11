import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AddTierForm } from "~/components/battlepass/AddTierForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("AddTierForm", () => {
  it("contains a hidden intent field with value addTier", () => {
    renderWithRouter(<AddTierForm />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("addTier");
  });

  it("renders tierNumber and xpRequired number inputs", () => {
    renderWithRouter(<AddTierForm />);
    expect(document.querySelector('input[name="tierNumber"]')).not.toBeNull();
    expect(document.querySelector('input[name="xpRequired"]')).not.toBeNull();
  });

  it("renders a premium checkbox", () => {
    renderWithRouter(<AddTierForm />);
    const checkbox = document.querySelector('input[name="isPremium"]') as HTMLInputElement;
    expect(checkbox).not.toBeNull();
    expect(checkbox.type).toBe("checkbox");
  });

  it("renders rewardType and rewardData inputs", () => {
    renderWithRouter(<AddTierForm />);
    expect(document.querySelector('input[name="rewardType"]')).not.toBeNull();
    expect(document.querySelector('input[name="rewardData"]')).not.toBeNull();
  });

  it("renders a submit button", () => {
    renderWithRouter(<AddTierForm />);
    expect(screen.getByRole("button", { name: "battlepass.addTier" })).toBeInTheDocument();
  });
});
