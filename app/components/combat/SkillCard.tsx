import { Heart, Shield, Sparkles, Sword } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Skill, SkillCategory } from "~/types/combat";

interface Props {
  skill: Skill;
  selected?: boolean;
  onSelect?: (skill: Skill) => void;
}

const CATEGORY_COLOR: Record<SkillCategory, string> = {
  ATTACK: "var(--color-battle)",
  DEFEND: "var(--color-royal)",
  HEAL: "var(--color-victory)",
  AURA: "var(--color-magic)",
};

const CATEGORY_ICON: Record<SkillCategory, typeof Sword> = {
  ATTACK: Sword,
  DEFEND: Shield,
  HEAL: Heart,
  AURA: Sparkles,
};

export function SkillCard({ skill, selected = false, onSelect }: Props) {
  const { t } = useTranslation();
  const color = CATEGORY_COLOR[skill.category];
  const Icon = CATEGORY_ICON[skill.category];

  return (
    <button
      type="button"
      onClick={() => onSelect?.(skill)}
      aria-pressed={selected}
      className={`cr-card group relative flex w-full flex-col gap-2 rounded-xl border bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] p-3 text-left transition-all ${
        selected
          ? "border-[var(--color-gold)] shadow-[0_0_18px_var(--color-gold-glow)] glow-gold"
          : "border-[var(--color-border)] hover:border-[var(--color-gold)]/60"
      }`}
      style={{ borderTopColor: color, borderTopWidth: "3px" }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-ui text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--color-text-bright)]"
          style={{ backgroundColor: color }}
        >
          <Icon size={11} aria-hidden="true" />
          {t(`combat.categories.${skill.category}`)}
        </span>
        <span
          className="font-heading text-2xl font-bold leading-none"
          style={{ color: "var(--color-gold)" }}
        >
          {skill.power}
        </span>
      </div>

      <h4 className="font-heading text-sm font-semibold text-[var(--color-text-bright)]">
        {skill.name}
      </h4>

      {skill.duration > 0 && (
        <span className="font-ui text-[0.65rem] uppercase tracking-wide text-[var(--color-text-muted)]">
          {skill.duration} {t("combat.turn")}
        </span>
      )}

      <p className="font-ui text-xs leading-snug text-[var(--color-text-muted)]">
        {skill.description}
      </p>
    </button>
  );
}
