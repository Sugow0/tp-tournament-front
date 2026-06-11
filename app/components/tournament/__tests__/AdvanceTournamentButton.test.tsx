import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AdvanceTournamentButton } from "~/components/tournament/AdvanceTournamentButton";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("AdvanceTournamentButton", () => {
  it("shows start button when status is OPEN", () => {
    renderWithRouter(<AdvanceTournamentButton tournamentId={1} status="OPEN" />);
    expect(screen.getByRole("button")).toHaveTextContent("tournament.advance.start");
  });

  it("shows close button when status is IN_PROGRESS", () => {
    renderWithRouter(<AdvanceTournamentButton tournamentId={1} status="IN_PROGRESS" />);
    expect(screen.getByRole("button")).toHaveTextContent("tournament.advance.close");
  });

  it("renders nothing when status is CLOSED", () => {
    const { container } = renderWithRouter(
      <AdvanceTournamentButton tournamentId={1} status="CLOSED" />
    );
    expect(container.querySelector("button")).toBeNull();
  });
});
