import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CreateObjectiveForm } from "~/components/objective/CreateObjectiveForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("CreateObjectiveForm", () => {
  it("contains a hidden intent field with value create", () => {
    renderWithRouter(<CreateObjectiveForm />);
    const input = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe("create");
  });

  it("renders name, description and objectiveType inputs", () => {
    renderWithRouter(<CreateObjectiveForm />);
    expect(document.querySelector('input[name="name"]')).not.toBeNull();
    expect(document.querySelector('[name="description"]')).not.toBeNull();
    expect(document.querySelector('input[name="objectiveType"]')).not.toBeNull();
  });

  it("renders targetValue and xpReward number inputs", () => {
    renderWithRouter(<CreateObjectiveForm />);
    expect(document.querySelector('input[name="targetValue"]')).not.toBeNull();
    expect(document.querySelector('input[name="xpReward"]')).not.toBeNull();
  });

  it("renders a resetType select with DAILY, WEEKLY and SEASONAL options", () => {
    renderWithRouter(<CreateObjectiveForm />);
    const select = document.querySelector('select[name="resetType"]') as HTMLSelectElement;
    expect(select).not.toBeNull();
    const values = Array.from(within(select).getAllByRole("option")).map(
      (o) => (o as HTMLOptionElement).value
    );
    expect(values).toEqual(["DAILY", "WEEKLY", "SEASONAL"]);
  });

  it("renders a submit button", () => {
    renderWithRouter(<CreateObjectiveForm />);
    expect(screen.getByRole("button", { name: "objective.new" })).toBeInTheDocument();
  });
});
