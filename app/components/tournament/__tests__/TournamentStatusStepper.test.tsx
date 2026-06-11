import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TournamentStatusStepper } from "~/components/tournament/TournamentStatusStepper";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("TournamentStatusStepper", () => {
  it("renders three steps", () => {
    const { container } = render(<TournamentStatusStepper status="OPEN" />);
    expect(container.querySelectorAll("li")).toHaveLength(3);
  });

  it.each([
    ["OPEN", "tournament.stepper.open"],
    ["IN_PROGRESS", "tournament.stepper.inProgress"],
    ["CLOSED", "tournament.stepper.closed"],
  ] as const)("marks %s step as aria-current=step", (status, expectedText) => {
    const { container } = render(<TournamentStatusStepper status={status} />);
    const current = container.querySelector('[aria-current="step"]');
    expect(current).toBeInTheDocument();
    expect(current).toHaveTextContent(expectedText);
  });

  it("only one step has aria-current at a time", () => {
    const { container } = render(<TournamentStatusStepper status="IN_PROGRESS" />);
    expect(container.querySelectorAll('[aria-current="step"]')).toHaveLength(1);
  });
});
