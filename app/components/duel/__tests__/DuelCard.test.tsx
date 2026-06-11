import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DuelCard } from "~/components/duel/DuelCard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Duel } from "~/types/duel";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const base: Duel = {
  id: 1,
  tournamentId: 1,
  player1Id: 1,
  player2Id: 2,
  outcome: null,
  duelOrder: 1,
  playedAt: "2024-01-01T00:00:00Z",
  durationSeconds: null,
};

describe("DuelCard", () => {
  it("renders player names", () => {
    renderWithRouter(<DuelCard duel={base} player1Name="Arthur" player2Name="Lancelot" />);
    expect(screen.getByText("Arthur")).toBeInTheDocument();
    expect(screen.getByText("Lancelot")).toBeInTheDocument();
  });

  it("shows pending text when outcome is null", () => {
    renderWithRouter(<DuelCard duel={base} player1Name="Arthur" player2Name="Lancelot" />);
    expect(screen.getByText("duel.pending")).toBeInTheDocument();
  });

  it("shows outcome label when outcome is set", () => {
    renderWithRouter(
      <DuelCard
        duel={{ ...base, outcome: "PLAYER1_WIN" }}
        player1Name="Arthur"
        player2Name="Lancelot"
      />
    );
    expect(screen.getByText("duel.outcome.PLAYER1_WIN")).toBeInTheDocument();
  });

  it("shows duration in mm:ss when durationSeconds is set", () => {
    renderWithRouter(
      <DuelCard
        duel={{ ...base, outcome: "PLAYER1_WIN", durationSeconds: 90 }}
        player1Name="Arthur"
        player2Name="Lancelot"
      />
    );
    expect(screen.getByText("1:30")).toBeInTheDocument();
  });

  it("shows SetOutcomeForm when outcome is null", () => {
    renderWithRouter(<DuelCard duel={base} player1Name="Arthur" player2Name="Lancelot" />);
    expect(document.querySelector('input[name="intent"][value="setOutcome"]')).not.toBeNull();
  });

  it("hides SetOutcomeForm when outcome is set", () => {
    renderWithRouter(
      <DuelCard
        duel={{ ...base, outcome: "PLAYER1_WIN" }}
        player1Name="Arthur"
        player2Name="Lancelot"
      />
    );
    expect(document.querySelector('input[name="intent"][value="setOutcome"]')).toBeNull();
  });

  it("shows EndDuelForm when outcome is set but duel is not ended", () => {
    renderWithRouter(
      <DuelCard
        duel={{ ...base, outcome: "PLAYER1_WIN" }}
        player1Name="Arthur"
        player2Name="Lancelot"
      />
    );
    expect(document.querySelector('input[name="intent"][value="endDuel"]')).not.toBeNull();
  });

  it("hides EndDuelForm when duel is ended", () => {
    renderWithRouter(
      <DuelCard
        duel={{ ...base, outcome: "PLAYER1_WIN", durationSeconds: 90 }}
        player1Name="Arthur"
        player2Name="Lancelot"
      />
    );
    expect(document.querySelector('input[name="intent"][value="endDuel"]')).toBeNull();
  });
});
