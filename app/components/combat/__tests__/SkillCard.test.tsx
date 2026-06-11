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

  it("does not throw when clicked without an onSelect handler", () => {
    render(<SkillCard skill={fakeSkill} />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  it("reflects the selected state via aria-pressed", () => {
    render(<SkillCard skill={fakeSkill} selected />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("renders the duration when the skill lasts more than one turn", () => {
    render(<SkillCard skill={{ ...fakeSkill, duration: 3 }} />);
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/combat.turn/)).toBeInTheDocument();
  });

  it("does not render the duration when the skill has no duration", () => {
    render(<SkillCard skill={{ ...fakeSkill, duration: 0 }} />);
    expect(screen.queryByText("combat.turn")).not.toBeInTheDocument();
  });
});
