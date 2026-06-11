import { motion } from "framer-motion";
import { Flag } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { hpPercent, isCombatOver } from "~/lib/combat-rules";
import type { Combat, CombatantState, Skill } from "~/types/combat";
import { HandCard } from "./HandCard";
import { SkillCard } from "./SkillCard";

interface Props {
  combat: Combat;
  class1Skills: Skill[];
  class2Skills: Skill[];
  /**
   * Combat id, threaded into the submit form as a hidden input so the action
   * works on the duel play route too (which reads combatId from the form/query).
   */
  combatId: number;
}

/** Compact HP bar used at the top (opponent) and bottom (active player). */
function HpBar({ champion, align }: { champion: CombatantState; align: "top" | "bottom" }) {
  const { t } = useTranslation();
  const pct = hpPercent(champion);

  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={`flex items-center gap-2 font-heading text-sm font-semibold text-[var(--color-text-bright)] ${
          align === "bottom" ? "justify-center" : "justify-start"
        }`}
      >
        <span>{champion.name}</span>
        <span className="font-ui text-xs text-[var(--color-text-muted)]">
          {champion.currentHp} / {champion.maxHp} {t("combat.hp", "HP")}
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--color-arena-mid)]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-battle)] to-[var(--color-victory)] transition-all"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={champion.currentHp}
          aria-valuemin={0}
          aria-valuemax={champion.maxHp}
        />
      </div>
      {champion.effects.length > 0 && (
        <div className={`flex flex-wrap gap-1.5 ${align === "bottom" ? "justify-center" : ""}`}>
          {champion.effects.map((effect) => (
            <span
              key={`${effect.effectType}-${effect.remainingTurns}`}
              className="inline-flex items-center gap-1 rounded-full bg-[var(--color-magic)]/15 px-2 py-0.5 font-ui text-[0.6rem] uppercase tracking-wide text-[var(--color-magic)]"
            >
              {effect.effectType} ({effect.remainingTurns})
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CombatBoard({ combat, class1Skills, class2Skills, combatId }: Props) {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Slot 1 plays first, then slot 2.
  const activeSlot: 1 | 2 = combat.champion1.hasSubmittedAction ? 2 : 1;
  const activeChampion = activeSlot === 1 ? combat.champion1 : combat.champion2;
  const opponent = activeSlot === 1 ? combat.champion2 : combat.champion1;
  const skills = activeSlot === 1 ? class1Skills : class2Skills;

  // Hot-seat secrecy: when it becomes slot 2's turn, hide the board behind a
  // hand-off overlay so the second player doesn't see leftover state.
  const [handoffAcked, setHandoffAcked] = useState(false);
  useEffect(() => {
    setSelectedId(null);
    setHandoffAcked(false);
  }, []);

  if (isCombatOver(combat)) return null;

  const selectedSkill =
    selectedId == null ? null : (skills.find((s) => s.id === selectedId) ?? null);
  const handSkills = skills.filter((s) => s.id !== selectedId);
  const needsHandoff = activeSlot === 2 && !handoffAcked;

  return (
    <div className="relative flex flex-col gap-6">
      {/* Top: opponent (the non-active slot). */}
      <section
        data-testid="opponent-panel"
        className="cr-card mx-auto w-full max-w-md rounded-xl border border-[var(--color-border)] bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] p-4"
      >
        <HpBar champion={opponent} align="top" />
      </section>

      {/* Center stage: enlarged selected card + "play" button. */}
      <section className="flex min-h-[14rem] items-center justify-center gap-6">
        {selectedSkill ? (
          <motion.div
            key={selectedSkill.id}
            layout
            layoutId={`card-${selectedSkill.id}`}
            data-testid="center-card"
            className="w-48 sm:w-56"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, scale: 1.05 }}
          >
            <SkillCard skill={selectedSkill} selected onSelect={() => setSelectedId(null)} />
          </motion.div>
        ) : (
          <p className="font-ui text-sm italic text-[var(--color-text-muted)]">
            {t("combat.selectCardHint")}
          </p>
        )}

        <Form method="post" data-testid="play-card-form" onSubmit={() => setSelectedId(null)}>
          <input type="hidden" name="intent" value="submit" />
          <input type="hidden" name="slot" value={activeSlot} />
          <input type="hidden" name="skillId" value={selectedId ?? ""} />
          <input type="hidden" name="combatId" value={combatId} />
          <Button
            type="submit"
            disabled={selectedId == null}
            className="bg-[var(--color-royal)] font-ui font-bold text-white hover:bg-[var(--color-royal)]/80"
          >
            {t("combat.playCard")}
          </Button>
        </Form>
      </section>

      {/* Bottom: active player's name + HP, then the fanned hand. */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <span
            data-testid="active-champion-name"
            className="font-heading text-base font-semibold text-[var(--color-gold)]"
          >
            {activeChampion.name}
          </span>
          <Form method="post" data-testid="forfeit-form">
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

        <div className="mx-auto w-full max-w-md">
          <HpBar champion={activeChampion} align="bottom" />
        </div>

        {/* Fanned hand with a 3D feel. */}
        <div
          data-testid="combat-hand"
          className="flex items-end justify-center pt-10"
          style={{ perspective: "1000px" }}
        >
          {handSkills.map((skill, index) => (
            <HandCard
              key={skill.id}
              skill={skill}
              index={index}
              count={handSkills.length}
              onSelect={(s) => setSelectedId(s.id)}
            />
          ))}
        </div>
      </section>

      {/* Hot-seat hand-off overlay (nice-to-have). */}
      {needsHandoff && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-4 rounded-xl bg-[var(--color-arena-bg)]/95 backdrop-blur-sm">
          <p className="font-heading text-lg font-semibold text-[var(--color-text-bright)]">
            {t("combat.handoff", { name: activeChampion.name })}
          </p>
          <Button
            type="button"
            onClick={() => setHandoffAcked(true)}
            className="bg-[var(--color-royal)] font-ui font-bold text-white hover:bg-[var(--color-royal)]/80"
          >
            {t("combat.handoffReady")}
          </Button>
        </div>
      )}
    </div>
  );
}
