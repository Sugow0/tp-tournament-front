import type { Skill } from "~/types/combat";
import { SkillCard } from "./SkillCard";

interface Props {
  skills: Skill[];
  selectedId: number | null;
  onSelect: (skill: Skill) => void;
  disabled?: boolean;
}

export function SkillHand({ skills, selectedId, onSelect, disabled = false }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {skills.map((skill) => (
        <div key={skill.id} className={disabled ? "pointer-events-none opacity-50" : undefined}>
          <SkillCard skill={skill} selected={skill.id === selectedId} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
