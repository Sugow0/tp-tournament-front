import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("LoadingSpinner", () => {
  it("renders a status element with a default (md) size", () => {
    render(<LoadingSpinner />);
    const status = screen.getByRole("status", { name: "Chargement" });
    expect(status).toBeInTheDocument();
    expect(status.className).toContain("h-8 w-8");
  });

  it("renders a small spinner", () => {
    render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole("status").className).toContain("h-5 w-5");
  });

  it("renders a large spinner", () => {
    render(<LoadingSpinner size="lg" />);
    expect(screen.getByRole("status").className).toContain("h-12 w-12");
  });
});
