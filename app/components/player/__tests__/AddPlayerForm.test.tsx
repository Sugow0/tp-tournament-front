import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AddPlayerForm } from "~/components/player/AddPlayerForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("AddPlayerForm", () => {
  it("submit button is disabled when name is empty", () => {
    renderWithRouter(<AddPlayerForm />);
    expect(screen.getByRole("button", { name: "player.add" })).toBeDisabled();
  });

  it("submit button is enabled when name is filled", async () => {
    const user = userEvent.setup();
    renderWithRouter(<AddPlayerForm />);
    await user.type(screen.getByLabelText("player.nameLabel"), "Lancelot");
    expect(screen.getByRole("button", { name: "player.add" })).not.toBeDisabled();
  });

  it("form contains hidden intent field with value addPlayer", () => {
    renderWithRouter(<AddPlayerForm />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("addPlayer");
  });
});
