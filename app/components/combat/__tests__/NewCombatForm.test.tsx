import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { NewCombatForm } from "~/components/combat/NewCombatForm";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { ChampionClass } from "~/types/combat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const classes: ChampionClass[] = [
  { id: 1, name: "Guerrier", description: "", skillCount: 4 },
  { id: 2, name: "Mage", description: "", skillCount: 4 },
];

function renderForm(classList: ChampionClass[] = classes) {
  return renderWithRouter(<NewCombatForm classes={classList} />);
}

describe("NewCombatForm", () => {
  it("renders a hidden intent=create input", () => {
    renderForm();
    const intent = document.querySelector('input[name="intent"]') as HTMLInputElement;
    expect(intent).not.toBeNull();
    expect(intent.value).toBe("create");
  });

  it("renders a column for each champion", () => {
    renderForm();
    expect(screen.getByText("combat.champion1")).toBeInTheDocument();
    expect(screen.getByText("combat.champion2")).toBeInTheDocument();
  });

  it("renders name inputs for both champions", () => {
    renderForm();
    expect(document.querySelector('input[name="champion1Name"]')).not.toBeNull();
    expect(document.querySelector('input[name="champion2Name"]')).not.toBeNull();
  });

  it("renders level inputs for both champions", () => {
    renderForm();
    const level1 = document.querySelector('input[name="champion1Level"]') as HTMLInputElement;
    const level2 = document.querySelector('input[name="champion2Level"]') as HTMLInputElement;
    expect(level1).not.toBeNull();
    expect(level2).not.toBeNull();
    expect(level1.value).toBe("1");
  });

  it("renders a class select per champion with one option per class", () => {
    renderForm();
    const select1 = document.querySelector('select[name="champion1ClassId"]') as HTMLSelectElement;
    expect(select1).not.toBeNull();
    expect(select1.querySelectorAll("option")).toHaveLength(2);
    expect(screen.getAllByRole("option", { name: "Guerrier" })).toHaveLength(2);
    expect(screen.getAllByRole("option", { name: "Mage" })).toHaveLength(2);
  });

  it("defaults each class select to the first class", () => {
    renderForm();
    const select1 = document.querySelector('select[name="champion1ClassId"]') as HTMLSelectElement;
    expect(select1.value).toBe("1");
  });

  it("renders the submit button", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /combat.new/ })).toBeInTheDocument();
  });

  it("renders without options when no classes are provided", () => {
    renderForm([]);
    const select1 = document.querySelector('select[name="champion1ClassId"]') as HTMLSelectElement;
    expect(select1.querySelectorAll("option")).toHaveLength(0);
  });
});
