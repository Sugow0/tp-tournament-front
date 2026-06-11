import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeasonRewardList } from "~/components/season/SeasonRewardList";
import type { SeasonReward } from "~/types/season";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const baseReward: SeasonReward = {
  id: 1,
  seasonId: 1,
  rankMin: 1,
  rankMax: 3,
  rewardType: "SKIN",
  rewardData: "dragon",
  label: "Récompense du dragon",
};

describe("SeasonRewardList", () => {
  it("renders an empty state when there are no rewards", () => {
    render(<SeasonRewardList rewards={[]} />);
    expect(screen.getByText("season.rewards.empty.title")).toBeInTheDocument();
    expect(screen.getByText("season.rewards.empty.description")).toBeInTheDocument();
  });

  it("renders a rank range when rankMax differs from rankMin", () => {
    render(<SeasonRewardList rewards={[baseReward]} />);
    expect(screen.getByText("#1–3")).toBeInTheDocument();
    expect(screen.getByText("Récompense du dragon")).toBeInTheDocument();
    expect(screen.getByText("SKIN")).toBeInTheDocument();
  });

  it("renders a single rank when rankMax is null", () => {
    render(<SeasonRewardList rewards={[{ ...baseReward, id: 2, rankMax: null }]} />);
    expect(screen.getByText("#1")).toBeInTheDocument();
  });

  it("renders a single rank when rankMax equals rankMin", () => {
    render(
      <SeasonRewardList rewards={[{ ...baseReward, id: 3, rankMin: 5, rankMax: 5 }]} />
    );
    expect(screen.getByText("#5")).toBeInTheDocument();
  });

  it("renders one list item per reward", () => {
    render(
      <SeasonRewardList
        rewards={[baseReward, { ...baseReward, id: 4, rankMax: null, rankMin: 10 }]}
      />
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });
});
