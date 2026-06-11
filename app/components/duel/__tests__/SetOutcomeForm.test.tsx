import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SetOutcomeForm } from "~/components/duel/SetOutcomeForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("SetOutcomeForm", () => {
  it("contains hidden intent field with value setOutcome", () => {
    renderWithRouter(<SetOutcomeForm duelId={1} />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("setOutcome");
  });

  it("contains hidden duelId field", () => {
    renderWithRouter(<SetOutcomeForm duelId={42} />);
    const input = document.querySelector('input[name="duelId"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("42");
  });

  it("renders a select for outcome", () => {
    renderWithRouter(<SetOutcomeForm duelId={1} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderWithRouter(<SetOutcomeForm duelId={1} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
