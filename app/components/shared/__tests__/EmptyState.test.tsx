import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "~/components/shared/EmptyState";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("EmptyState", () => {
  it("renders the title", () => {
    render(<EmptyState title="Aucun tournoi" />);
    expect(screen.getByText("Aucun tournoi")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<EmptyState title="Aucun tournoi" description="Crée ton premier tournoi" />);
    expect(screen.getByText("Crée ton premier tournoi")).toBeInTheDocument();
  });

  it("does not render a description when omitted", () => {
    render(<EmptyState title="Aucun tournoi" />);
    expect(screen.queryByText("Crée ton premier tournoi")).toBeNull();
  });

  it("renders the icon when provided", () => {
    render(<EmptyState title="Aucun tournoi" icon={<span data-testid="empty-icon" />} />);
    expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
  });

  it("does not render an action button when omitted", () => {
    render(<EmptyState title="Aucun tournoi" />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders the action button and fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(<EmptyState title="Aucun tournoi" action={{ label: "Créer", onClick }} />);
    const button = screen.getByRole("button", { name: "Créer" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
