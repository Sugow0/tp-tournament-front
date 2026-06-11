import { useTranslation } from "react-i18next";
import { isCombatOver, MAX_TURNS } from "~/lib/combat-rules";
import type { ChampionClass, Combat, Skill } from "~/types/combat";
import { CombatBoard } from "./CombatBoard";
import { CombatLog } from "./CombatLog";
import { OutcomeBanner } from "./OutcomeBanner";

interface Props {
  combat: Combat;
  class1Skills: Skill[];
  class2Skills: Skill[];
  classes?: ChampionClass[];
}

export function CombatArena({ combat, class1Skills, class2Skills, classes = [] }: Props) {
  const { t } = useTranslation();
  const over = isCombatOver(combat);
  const turn = Math.min(combat.turn, MAX_TURNS);
  // `classes` is kept for prop compatibility with both call sites; the
  // semi-3D board derives class skills from class1Skills/class2Skills.
  void classes;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center font-heading text-sm uppercase tracking-[0.25em] text-[var(--color-gold)]">
        {t("combat.turn")} {turn} / {MAX_TURNS}
      </div>

      {over ? (
        <OutcomeBanner combat={combat} />
      ) : (
        <CombatBoard
          combat={combat}
          class1Skills={class1Skills}
          class2Skills={class2Skills}
          combatId={combat.id}
        />
      )}

      <CombatLog log={combat.log} />
    </div>
  );
}
