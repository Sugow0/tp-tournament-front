import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ErrorState } from "~/components/shared/ErrorState";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ErrorState", () => {
  it("renders the default message when none is provided", () => {
    render(<ErrorState />);
    expect(screen.getByText("Une erreur est survenue.")).toBeInTheDocument();
  });

  it("renders a custom message when provided", () => {
    render(<ErrorState message="Échec du chargement" />);
    expect(screen.getByText("Échec du chargement")).toBeInTheDocument();
  });

  it("does not render a retry button when onRetry is omitted", () => {
    render(<ErrorState />);
    expect(screen.queryByRole("button", { name: "Réessayer" })).toBeNull();
  });

  it("renders the retry button and fires onRetry when clicked", () => {
    const onRetry = vi.fn();
    render(<ErrorState onRetry={onRetry} />);
    const button = screen.getByRole("button", { name: "Réessayer" });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
