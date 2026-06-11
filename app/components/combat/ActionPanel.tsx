import { Flag } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { isCombatOver } from "~/lib/combat-rules";
import type { Combat, Skill } from "~/types/combat";
import { SkillHand } from "./SkillHand";

interface Props {
  combat: Combat;
  class1Skills: Skill[];
  class2Skills: Skill[];
}

export function ActionPanel({ combat, class1Skills, class2Skills }: Props) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (isCombatOver(combat)) return null;

  // Slot 1 validates first, then slot 2.
  const activeSlot: 1 | 2 = combat.champion1.hasSubmitted ? 2 : 1;
  const activeChampion = activeSlot === 1 ? combat.champion1 : combat.champion2;
  const skills = activeSlot === 1 ? class1Skills : class2Skills;

  const handleSelect = (skill: Skill) => setSelectedId(skill.id);

  return (
    <div className="cr-card flex flex-col gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-arena-mid)]/60 p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-base font-semibold text-[var(--color-text-bright)]">
          {activeChampion.name}
        </h3>
        <Form method="post">
          <input type="hidden" name="intent" value="forfeit" />
          <input type="hidden" name="slot" value={activeSlot} />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className="font-ui text-[var(--color-battle)]"
          >
            <Flag size={14} aria-hidden="true" />
            {t("combat.forfeit")}
          </Button>
        </Form>
      </div>

      <SkillHand skills={skills} selectedId={selectedId} onSelect={handleSelect} />

      <Form method="post" onSubmit={() => setSelectedId(null)} className="self-end">
        <input type="hidden" name="intent" value="submit" />
        <input type="hidden" name="slot" value={activeSlot} />
        <input type="hidden" name="skillId" value={selectedId ?? ""} />
        <Button
          type="submit"
          disabled={selectedId == null}
          className="bg-[var(--color-royal)] font-ui font-bold text-white hover:bg-[var(--color-royal)]/80"
        >
          {t("combat.validate")}
        </Button>
      </Form>
    </div>
  );
}
