import { motion } from "framer-motion";
import type { Skill } from "~/types/combat";
import { SkillCard } from "./SkillCard";

interface Props {
  skill: Skill;
  /** Index of this card within the hand (for the fan rotation). */
  index: number;
  /** Total number of cards in the hand (for centering the fan). */
  count: number;
  onSelect: (skill: Skill) => void;
}

/**
 * A single fanned hand card. Wraps {@link SkillCard} with a semi-3D layout:
 * each card is rotated/translated to overlap its neighbours (Hearthstone-style),
 * and lifts + raises its z-index on hover via framer-motion `whileHover`.
 *
 * `layoutId` is shared with the center card so framer animates the card flying
 * from the hand to the center stage when it is played.
 */
export function HandCard({ skill, index, count, onSelect }: Props) {
  // Fan the hand around its center: middle cards upright, edges rotated outward.
  const mid = (count - 1) / 2;
  const offset = index - mid;
  const rotate = offset * 5;
  // Edge cards sit a little lower so the row reads as an arc.
  const translateY = Math.abs(offset) * 10;

  return (
    <motion.div
      layout
      layoutId={`card-${skill.id}`}
      className="relative -mx-3 first:ml-0 last:mr-0"
      style={{ zIndex: index }}
      initial={false}
      animate={{ rotate, y: translateY }}
      whileHover={{
        rotate: 0,
        y: translateY - 28,
        scale: 1.12,
        zIndex: 50,
        transition: { type: "spring", stiffness: 320, damping: 22 },
      }}
    >
      <div className="w-32 sm:w-36">
        <SkillCard skill={skill} onSelect={onSelect} />
      </div>
    </motion.div>
  );
}
