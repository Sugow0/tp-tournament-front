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

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), {
    stiffness: 240,
    damping: 26,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 240,
    damping: 26,
  });

  const glareX = useMotionValue("50%");
  const glareY = useMotionValue("50%");
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 200, 80, 0.11) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)`;

  const shadowX = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
  const shadowY = useTransform(mouseY, [-0.5, 0.5], [-10, 10]);
  const cardShadow = useMotionTemplate`${shadowX}px ${shadowY}px 40px rgba(240,168,50,0.1), 0 20px 60px rgba(0,0,0,0.7)`;

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
      style={{ rotateX, rotateY, transformPerspective: 1000, boxShadow: cardShadow }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.03, z: 25 }}
      transition={{ type: "spring", stiffness: 360, damping: 26 }}
      className="cursor-pointer rounded-xl"
    >
      <Link to={`/tournaments/${tournament.id}`} className="block">
        <div className="cr-card relative bg-gradient-to-b from-[var(--color-arena-surface)] to-[var(--color-arena-bg)] rounded-xl overflow-hidden border border-[var(--color-border)]">
          {/* Gold top bar */}
          <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent opacity-80" />

          <div className="px-5 pt-5 pb-5">
            {/* ─── D&D corner brackets ─── */}
            <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-[var(--color-gold)]/45 pointer-events-none" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t border-r border-[var(--color-gold)]/45 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b border-l border-[var(--color-gold)]/45 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-[var(--color-gold)]/45 pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--color-gold)]/8 border border-[var(--color-gold)]/20 flex items-center justify-center">
                  <Trophy size={16} className="text-[var(--color-gold)]" />
                </div>
                <h2
                  className="text-[0.95rem] text-[var(--color-text-bright)] leading-snug truncate"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                  }}
                >
                  {tournament.name}
                </h2>
              </div>
              <TournamentStatusBadge status={tournament.status} />
            </div>

            {/* Ornamental separator */}
            <div className="dnd-divider mb-4">
              <svg
                width="8"
                height="8"
                viewBox="0 0 8 8"
                className="flex-shrink-0 fill-[var(--color-gold)]/40"
                aria-hidden="true"
              >
                <path d="M4 0L5 3H8L5.5 5L6.5 8L4 6L1.5 8L2.5 5L0 3H3Z" />
              </svg>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[var(--color-text-muted)] text-xs font-ui tracking-wide">
                <Calendar size={11} className="flex-shrink-0" />
                <span className="uppercase">{date}</span>
              </div>
              <ChevronRight size={13} className="text-[var(--color-text-muted)]/60" />
            </div>
          </div>

          {/* Holographic glare overlay */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{ background: glare }}
          />
        </div>
      </Link>
    </motion.div>
  );
}
