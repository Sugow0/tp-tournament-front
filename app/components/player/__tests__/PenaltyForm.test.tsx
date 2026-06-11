import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PenaltyForm } from "~/components/player/PenaltyForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("PenaltyForm", () => {
  it("renders a number input", () => {
    renderWithRouter(<PenaltyForm playerId={1} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderWithRouter(<PenaltyForm playerId={1} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("contains hidden intent field with value addPenalty", () => {
    renderWithRouter(<PenaltyForm playerId={1} />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("addPenalty");
  });
});
