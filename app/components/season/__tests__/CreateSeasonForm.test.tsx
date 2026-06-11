import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CreateSeasonForm } from "~/components/season/CreateSeasonForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("CreateSeasonForm", () => {
  it("contains a hidden intent field with value create", () => {
    renderWithRouter(<CreateSeasonForm />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("create");
  });

  it("renders name, start and end inputs plus hidden iso fields", () => {
    renderWithRouter(<CreateSeasonForm />);
    expect(document.querySelector('input[name="name"]')).not.toBeNull();
    expect(document.querySelector('input[name="startDate"]')).not.toBeNull();
    expect(document.querySelector('input[name="endDate"]')).not.toBeNull();
  });

  it("disables submit while any field is empty", () => {
    renderWithRouter(<CreateSeasonForm />);
    expect(screen.getByRole("button", { name: "season.new" })).toBeDisabled();
  });

  it("keeps submit disabled when only the name is filled", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateSeasonForm />);
    await user.type(document.querySelector('input[name="name"]') as HTMLInputElement, "Saison");
    expect(screen.getByRole("button", { name: "season.new" })).toBeDisabled();
  });

  it("enables submit and updates the iso hidden fields once all fields are filled", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateSeasonForm />);

    const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
    const startInput = document.getElementById("season-start") as HTMLInputElement;
    const endInput = document.getElementById("season-end") as HTMLInputElement;

    await user.type(nameInput, "Saison Hivernale");
    await user.type(startInput, "2026-01-01T10:00");
    await user.type(endInput, "2026-03-31T10:00");

    expect(nameInput.value).toBe("Saison Hivernale");
    expect(screen.getByRole("button", { name: "season.new" })).toBeEnabled();

    const startHidden = document.querySelector('input[name="startDate"]') as HTMLInputElement;
    const endHidden = document.querySelector('input[name="endDate"]') as HTMLInputElement;
    expect(startHidden.value).not.toBe("");
    expect(endHidden.value).not.toBe("");
  });

  it("keeps submit disabled when name is only whitespace", async () => {
    const user = userEvent.setup();
    renderWithRouter(<CreateSeasonForm />);
    await user.type(document.querySelector('input[name="name"]') as HTMLInputElement, "   ");
    await user.type(document.getElementById("season-start") as HTMLInputElement, "2026-01-01T10:00");
    await user.type(document.getElementById("season-end") as HTMLInputElement, "2026-03-31T10:00");
    expect(screen.getByRole("button", { name: "season.new" })).toBeDisabled();
  });
});
