import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ReplayEventRow } from "~/components/replay/ReplayEventRow";
import type { ReplayEvent } from "~/types/replay";

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

function renderRow(event: ReplayEvent) {
  return render(
    <ul>
      <ReplayEventRow event={event} />
    </ul>
  );
}

describe("ReplayEventRow", () => {
  it("renders the event type and formatted time", () => {
    renderRow(makeEvent({ eventType: "ATTACK", occurredAtMs: 65432 }));
    expect(screen.getByText("ATTACK")).toBeInTheDocument();
    expect(screen.getByText("01:05.432")).toBeInTheDocument();
  });

  it("formats zero milliseconds with padding", () => {
    renderRow(makeEvent({ occurredAtMs: 0 }));
    expect(screen.getByText("00:00.000")).toBeInTheDocument();
  });

  it("renders neither actor nor target when both are null", () => {
    renderRow(makeEvent({ actorPlayerId: null, targetPlayerId: null }));
    expect(screen.queryByText(/^#/)).not.toBeInTheDocument();
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("renders only the actor when target is null", () => {
    renderRow(makeEvent({ actorPlayerId: 7, targetPlayerId: null }));
    expect(screen.getByText("#7")).toBeInTheDocument();
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("renders only the target when actor is null", () => {
    renderRow(makeEvent({ actorPlayerId: null, targetPlayerId: 9 }));
    expect(screen.getByText("#9")).toBeInTheDocument();
    expect(screen.queryByText("→")).not.toBeInTheDocument();
  });

  it("renders actor, arrow and target when both are present", () => {
    renderRow(makeEvent({ actorPlayerId: 7, targetPlayerId: 9 }));
    expect(screen.getByText("#7")).toBeInTheDocument();
    expect(screen.getByText("#9")).toBeInTheDocument();
    expect(screen.getByText("→")).toBeInTheDocument();
  });
});
