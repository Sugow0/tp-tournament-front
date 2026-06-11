import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SkillCard } from "~/components/combat/SkillCard";
import type { Skill } from "~/types/combat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const fakeSkill: Skill = {
  id: 10,
  classId: 1,
  name: "Frappe lourde",
  category: "ATTACK",
  power: 25,
  duration: 0,
  auraEffect: null,
  description: "Une attaque puissante.",
};

describe("SkillCard", () => {
  it("renders the skill name", () => {
    render(<SkillCard skill={fakeSkill} />);
    expect(screen.getByText("Frappe lourde")).toBeInTheDocument();
  });

  it("renders the power value", () => {
    render(<SkillCard skill={fakeSkill} />);
    expect(screen.getByText("25")).toBeInTheDocument();
  });

  it("renders the category label", () => {
    render(<SkillCard skill={fakeSkill} />);
    expect(screen.getByText("combat.categories.ATTACK")).toBeInTheDocument();
  });

  it("calls onSelect with the skill when clicked", () => {
    const onSelect = vi.fn();
    render(<SkillCard skill={fakeSkill} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(fakeSkill);
  });
});
