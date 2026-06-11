import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DisqualifyButton } from "~/components/player/DisqualifyButton";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("DisqualifyButton", () => {
  it("renders a button", () => {
    renderWithRouter(<DisqualifyButton playerId={1} isDisqualified={false} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("button is disabled when player is already disqualified", () => {
    renderWithRouter(<DisqualifyButton playerId={1} isDisqualified={true} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("button is enabled when player is not disqualified", () => {
    renderWithRouter(<DisqualifyButton playerId={1} isDisqualified={false} />);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
