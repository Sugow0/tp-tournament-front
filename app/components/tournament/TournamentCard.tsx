import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Calendar, ChevronRight, Trophy } from "lucide-react";
import { Link } from "react-router";
import type { Tournament } from "~/types/tournament";
import { TournamentStatusBadge } from "./TournamentStatusBadge";

interface Props {
  tournament: Tournament;
}

export function TournamentCard({ tournament }: Props) {
  const date = format(new Date(tournament.createdAt), "d MMM yyyy", { locale: fr });

  // Mouse position relative to card center [-0.5, 0.5]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring-smoothed 3D rotation
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [14, -14]), {
    stiffness: 260,
    damping: 28,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 260,
    damping: 28,
  });

  // Holographic glare that follows the cursor
  const glareX = useMotionValue("50%");
  const glareY = useMotionValue("50%");
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 215, 0, 0.13) 0%, rgba(255, 255, 255, 0.04) 40%, transparent 70%)`;

  // Subtle chromatic glow shift
  const shadowX = useTransform(mouseX, [-0.5, 0.5], [-8, 8]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [-8, 8]);
  const cardShadow = useMotionTemplate`0 ${shadowY}px 40px rgba(74, 108, 247, 0.2), ${shadowX}px 0px 30px rgba(240, 168, 50, 0.12), 0 24px 60px rgba(0,0,0,0.6)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;
    const relY = (e.clientY - rect.top) / rect.height;
    mouseX.set(relX - 0.5);
    mouseY.set(relY - 0.5);
    glareX.set(`${relX * 100}%`);
    glareY.set(`${relY * 100}%`);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    glareX.set("50%");
    glareY.set("50%");
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1100,
        boxShadow: cardShadow,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.04, z: 30 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className="cursor-pointer rounded-2xl"
    >
      <Link to={`/tournaments/${tournament.id}`} className="block">
        <div className="cr-card relative bg-gradient-to-br from-[var(--color-arena-surface)] via-[var(--color-arena-mid)] to-[var(--color-arena-bg)] rounded-2xl overflow-hidden border border-[var(--color-border)]">
          {/* Gold top accent bar */}
          <div className="h-[3px] bg-gradient-to-r from-[var(--color-gold-dark)]/60 via-[var(--color-gold-bright)] to-[var(--color-gold-dark)]/60" />

          {/* Content */}
          <div className="px-5 pt-5 pb-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[var(--color-gold)]/10 border border-[var(--color-gold)]/25 flex items-center justify-center">
                  <Trophy size={17} className="text-[var(--color-gold)]" />
                </div>
                <h2 className="font-heading text-lg text-[var(--color-text-bright)] leading-tight truncate">
                  {tournament.name}
                </h2>
              </div>
              <TournamentStatusBadge status={tournament.status} />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs font-ui">
                <Calendar size={11} className="flex-shrink-0" />
                <span>{date}</span>
              </div>
              <ChevronRight size={14} className="text-[var(--color-text-muted)]" />
            </div>
          </div>

          {/* Holographic glare overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ background: glare }}
          />

          {/* Bottom edge shimmer */}
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
}
