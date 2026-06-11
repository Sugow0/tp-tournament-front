import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EndDuelForm } from "~/components/duel/EndDuelForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("EndDuelForm", () => {
  it("contains hidden intent field with value endDuel", () => {
    renderWithRouter(<EndDuelForm duelId={1} />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("endDuel");
  });

  it("contains hidden duelId field", () => {
    renderWithRouter(<EndDuelForm duelId={7} />);
    const input = document.querySelector('input[name="duelId"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("7");
  });

  it("renders a number input for durationSeconds", () => {
    renderWithRouter(<EndDuelForm duelId={1} />);
    expect(screen.getByRole("spinbutton")).toBeInTheDocument();
  });

  it("renders a submit button", () => {
    renderWithRouter(<EndDuelForm duelId={1} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
