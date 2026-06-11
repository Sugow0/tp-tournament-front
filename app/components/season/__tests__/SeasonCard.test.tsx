import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeasonCard } from "~/components/season/SeasonCard";
import { renderWithRouter } from "~/test/utils/render-with-router";
import type { Season } from "~/types/season";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const fakeSeason: Season = {
  id: 1,
  name: "Saison Hivernale",
  status: "ACTIVE",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T00:00:00Z",
  createdAt: "2025-12-01T00:00:00Z",
};

describe("SeasonCard", () => {
  it("renders the season name", () => {
    renderWithRouter(<SeasonCard season={fakeSeason} />);
    expect(screen.getByText("Saison Hivernale")).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    renderWithRouter(<SeasonCard season={fakeSeason} />);
    expect(screen.getByText("season.status.ACTIVE")).toBeInTheDocument();
  });
});
