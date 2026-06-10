import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithRouter } from "~/test/utils/render-with-router";
import { TournamentCard } from "~/components/tournament/TournamentCard";
import type { Tournament } from "~/types/tournament";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const fakeTournament: Tournament = {
  id: 42,
  name: "Coupe d'Avalon",
  status: "OPEN",
  createdAt: "2026-01-15T10:00:00Z",
};

describe("TournamentCard", () => {
  it("renders the tournament name", () => {
    render(<TournamentCard tournament={fakeTournament} />);
    expect(screen.getByText("Coupe d'Avalon")).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    render(<TournamentCard tournament={fakeTournament} />);
    expect(screen.getByText("tournament.status.OPEN")).toBeInTheDocument();
  });

  it("links to the tournament detail page", () => {
    renderWithRouter(<TournamentCard tournament={fakeTournament} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/tournaments/42");
  });

  it("displays the creation date", () => {
    render(<TournamentCard tournament={fakeTournament} />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
