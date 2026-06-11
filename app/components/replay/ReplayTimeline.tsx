import type { ReplayEvent } from "~/types/replay";
import { ReplayEventRow } from "./ReplayEventRow";

interface Props {
  events: ReplayEvent[];
}

export function ReplayTimeline({ events }: Props) {
  const ordered = [...events].sort((a, b) => a.eventOrder - b.eventOrder);

  return (
    <ol className="relative border-l border-[var(--color-border)] pl-2">
      {ordered.map((event) => (
        <ReplayEventRow key={event.id} event={event} />
      ))}
    </ol>
  );
}
