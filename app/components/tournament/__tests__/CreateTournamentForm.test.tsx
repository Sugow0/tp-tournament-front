import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "~/test/utils/render-with-router";
import { CreateTournamentForm } from "~/components/tournament/CreateTournamentForm";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("CreateTournamentForm", () => {
  it("submit button is disabled when name is empty", () => {
    renderWithRouter(<CreateTournamentForm />);
    expect(screen.getByRole("button", { name: "tournament.create" })).toBeDisabled();
  });

  it("submit button enables when name is filled", async () => {
    renderWithRouter(<CreateTournamentForm />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Coupe d'Avalon");
    expect(screen.getByRole("button", { name: "tournament.create" })).toBeEnabled();
  });

  it("clears submit button disabled state after clearing input", async () => {
    renderWithRouter(<CreateTournamentForm />);
    const input = screen.getByRole("textbox");
    await userEvent.type(input, "Test");
    await userEvent.clear(input);
    expect(screen.getByRole("button", { name: "tournament.create" })).toBeDisabled();
  });
});
