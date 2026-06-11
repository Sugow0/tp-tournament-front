import type { ReplayEvent } from "~/types/replay";

function formatMs(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  const millis = ms % 1000;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}.${millis
    .toString()
    .padStart(3, "0")}`;
}

interface Props {
  event: ReplayEvent;
}

export function ReplayEventRow({ event }: Props) {
  const hasActor = event.actorPlayerId !== null;
  const hasTarget = event.targetPlayerId !== null;

  return (
    <li className="relative pl-6 pb-4 last:pb-0">
      <span
        className="absolute left-0 top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-gold)]"
        aria-hidden="true"
      />
      <div className="flex items-center justify-between gap-3">
        <span className="font-heading text-sm font-semibold text-[var(--color-text-bright)]">
          {event.eventType}
        </span>
        <span className="font-ui text-xs tabular-nums text-[var(--color-text-muted)]">
          {formatMs(event.occurredAtMs)}
        </span>
      </div>
      {(hasActor || hasTarget) && (
        <div className="mt-0.5 font-ui text-xs text-[var(--color-text-muted)]">
          {hasActor && <span>#{event.actorPlayerId}</span>}
          {hasActor && hasTarget && (
            <span className="mx-1 text-[var(--color-gold)]" aria-hidden="true">
              →
            </span>
          )}
          {hasTarget && <span>#{event.targetPlayerId}</span>}
        </div>
      )}
    </li>
  );
}
