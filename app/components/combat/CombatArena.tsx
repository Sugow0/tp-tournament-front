import { useTranslation } from "react-i18next";
import { isCombatOver, MAX_TURNS } from "~/lib/combat-rules";
import type { ChampionClass, Combat, Skill } from "~/types/combat";
import { ActionPanel } from "./ActionPanel";
import { ChampionPanel } from "./ChampionPanel";
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

  const className = (classId: number) =>
    classes.find((c) => c.id === classId)?.name ?? `#${classId}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="text-center font-heading text-sm uppercase tracking-[0.25em] text-[var(--color-gold)]">
        {t("combat.turn")} {turn} / {MAX_TURNS}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
        <ChampionPanel
          champion={combat.champion1}
          className={className(combat.champion1.classId)}
        />
        <div className="flex items-center justify-center font-display text-2xl font-bold uppercase text-[var(--color-battle)]">
          {t("combat.vs")}
        </div>
        <ChampionPanel
          champion={combat.champion2}
          className={className(combat.champion2.classId)}
        />
      </div>

      {over ? (
        <OutcomeBanner combat={combat} />
      ) : (
        <ActionPanel combat={combat} class1Skills={class1Skills} class2Skills={class2Skills} />
      )}

      <CombatLog log={combat.log} />
    </div>
  );
}
