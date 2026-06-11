import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CombatLog } from "~/components/combat/CombatLog";
import type { CombatLogEntry } from "~/types/combat";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("CombatLog", () => {
  it("renders the log heading", () => {
    render(<CombatLog log={[]} />);
    expect(screen.getByText("combat.log")).toBeInTheDocument();
  });

  it("renders nothing in the list when the log is empty", () => {
    render(<CombatLog log={[]} />);
    const list = document.querySelector("ol");
    expect(list).not.toBeNull();
    expect(list?.querySelectorAll("li")).toHaveLength(0);
  });

  it("renders one message per log entry", () => {
    const log: CombatLogEntry[] = [
      { turn: 1, message: "Arthur frappe Mordred" },
      { turn: 1, message: "Mordred riposte" },
    ];
    render(<CombatLog log={log} />);
    expect(screen.getByText("Arthur frappe Mordred")).toBeInTheDocument();
    expect(screen.getByText("Mordred riposte")).toBeInTheDocument();
  });

  it("groups entries by turn and renders turns in descending order", () => {
    const log: CombatLogEntry[] = [
      { turn: 1, message: "Turn one event" },
      { turn: 2, message: "Turn two event" },
      { turn: 1, message: "Another turn one event" },
    ];
    render(<CombatLog log={log} />);

    const items = document.querySelectorAll("ol > li");
    expect(items).toHaveLength(2);

    // First listed turn should be turn 2 (descending sort).
    const firstTurn = items[0] as HTMLElement;
    expect(within(firstTurn).getByText("Turn two event")).toBeInTheDocument();

    // The turn-1 group keeps both of its messages.
    const secondTurn = items[1] as HTMLElement;
    expect(within(secondTurn).getByText("Turn one event")).toBeInTheDocument();
    expect(within(secondTurn).getByText("Another turn one event")).toBeInTheDocument();
  });
});
