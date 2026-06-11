import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ObjectiveCard } from "~/components/objective/ObjectiveCard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Objective, PlayerObjectiveProgress } from "~/types/objective";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const objective: Objective = {
  id: 1,
  seasonId: 7,
  name: "Win 5 duels",
  description: "Remporter 5 duels",
  objectiveType: "WIN_DUELS",
  targetValue: 5,
  xpReward: 100,
  resetType: "DAILY",
};

const completedProgress: PlayerObjectiveProgress = {
  objectiveId: 1,
  playerId: 3,
  currentValue: 5,
  isCompleted: true,
  completedAt: "2026-06-11T00:00:00Z",
  periodKey: "2026-06-11",
};

const inProgress: PlayerObjectiveProgress = {
  objectiveId: 1,
  playerId: 3,
  currentValue: 2,
  isCompleted: false,
  completedAt: null,
  periodKey: "2026-06-11",
};

describe("ObjectiveCard", () => {
  it("renders the objective name", () => {
    renderWithRouter(<ObjectiveCard objective={objective} />);
    expect(screen.getByText("Win 5 duels")).toBeInTheDocument();
  });

  it("renders the description", () => {
    renderWithRouter(<ObjectiveCard objective={objective} />);
    expect(screen.getByText("Remporter 5 duels")).toBeInTheDocument();
  });

  it("renders the target value", () => {
    renderWithRouter(<ObjectiveCard objective={objective} />);
    expect(screen.getByText(/objective\.target.*5/)).toBeInTheDocument();
  });

  it("renders the xp reward", () => {
    renderWithRouter(<ObjectiveCard objective={objective} />);
    expect(screen.getByText(/100.*objective\.xpReward/)).toBeInTheDocument();
  });

  it("renders a badge for the reset type", () => {
    renderWithRouter(<ObjectiveCard objective={objective} />);
    expect(screen.getByText("objective.reset.DAILY")).toBeInTheDocument();
  });

  it("shows the completed marker when progress is completed", () => {
    renderWithRouter(<ObjectiveCard objective={objective} progress={completedProgress} />);
    expect(screen.getByText("objective.completed")).toBeInTheDocument();
  });

  it("does not show the completed marker when progress is not completed", () => {
    renderWithRouter(<ObjectiveCard objective={objective} progress={inProgress} />);
    expect(screen.queryByText("objective.completed")).not.toBeInTheDocument();
  });

  it("does not show the completed marker when no progress is given", () => {
    renderWithRouter(<ObjectiveCard objective={objective} />);
    expect(screen.queryByText("objective.completed")).not.toBeInTheDocument();
  });
});
