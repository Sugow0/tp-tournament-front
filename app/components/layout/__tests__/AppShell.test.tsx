import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "~/components/layout/AppShell";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("~/components/background/ArenaScene", () => ({
  ArenaScene: () => null,
}));

vi.mock("~/components/layout/Navbar", () => ({
  Navbar: () => <nav data-testid="navbar-stub" />,
}));

describe("AppShell", () => {
  it("renders its children", () => {
    render(
      <AppShell>
        <div data-testid="shell-child">Contenu</div>
      </AppShell>
    );
    expect(screen.getByTestId("shell-child")).toBeInTheDocument();
    expect(screen.getByText("Contenu")).toBeInTheDocument();
  });

  it("renders the navbar", () => {
    render(
      <AppShell>
        <div>Contenu</div>
      </AppShell>
    );
    expect(screen.getByTestId("navbar-stub")).toBeInTheDocument();
  });
});
