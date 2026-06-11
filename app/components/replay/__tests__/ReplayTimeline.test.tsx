import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ReplayTimeline } from "~/components/replay/ReplayTimeline";
import type { ReplayEvent } from "~/types/replay";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

function makeEvent(overrides: Partial<ReplayEvent>): ReplayEvent {
  return {
    id: 1,
    replayId: 1,
    eventOrder: 1,
    eventType: "ATTACK",
    actorPlayerId: null,
    targetPlayerId: null,
    occurredAtMs: 0,
    payload: null,
    ...overrides,
  };
}

describe("ReplayTimeline", () => {
  it("renders one row per event", () => {
    const events = [
      makeEvent({ id: 1, eventOrder: 1, eventType: "START" }),
      makeEvent({ id: 2, eventOrder: 2, eventType: "ATTACK" }),
      makeEvent({ id: 3, eventOrder: 3, eventType: "END" }),
    ];
    render(<ReplayTimeline events={events} />);
    expect(screen.getByText("START")).toBeInTheDocument();
    expect(screen.getByText("ATTACK")).toBeInTheDocument();
    expect(screen.getByText("END")).toBeInTheDocument();
  });

  it("renders events ordered by eventOrder", () => {
    const events = [
      makeEvent({ id: 1, eventOrder: 3, eventType: "THIRD" }),
      makeEvent({ id: 2, eventOrder: 1, eventType: "FIRST" }),
      makeEvent({ id: 3, eventOrder: 2, eventType: "SECOND" }),
    ];
    render(<ReplayTimeline events={events} />);
    const rendered = screen.getAllByText(/FIRST|SECOND|THIRD/).map((el) => el.textContent);
    expect(rendered).toEqual(["FIRST", "SECOND", "THIRD"]);
  });
});
