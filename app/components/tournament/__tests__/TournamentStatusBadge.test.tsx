import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TournamentStatusBadge } from "~/components/tournament/TournamentStatusBadge";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("TournamentStatusBadge", () => {
  it.each([
    "OPEN",
    "IN_PROGRESS",
    "CLOSED",
  ] as const)("renders translation key for status %s", (status) => {
    render(<TournamentStatusBadge status={status} />);
    expect(screen.getByText(`tournament.status.${status}`)).toBeInTheDocument();
  });
});
