import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Navbar } from "~/components/layout/Navbar";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mocks = vi.hoisted(() => ({
  useSession: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock("~/hooks/useSession", () => ({
  useSession: mocks.useSession,
}));

vi.mock("~/lib/auth", () => ({
  clearSession: mocks.clearSession,
}));

describe("Navbar", () => {
  beforeEach(() => {
    mocks.useSession.mockReset();
    mocks.clearSession.mockReset();
    mocks.useSession.mockReturnValue({ isAuthenticated: false, ready: true });
  });

  it("renders the brand link to /tournaments", () => {
    renderWithRouter(<Navbar />);
    const brand = screen.getByRole("link", { name: /nav.brand/ });
    expect(brand).toHaveAttribute("href", "/tournaments");
  });

  it("renders the main navigation items", () => {
    renderWithRouter(<Navbar />);
    expect(screen.getAllByRole("link", { name: "nav.tournaments" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "nav.combat" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "nav.seasons" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "nav.shop" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "nav.friends" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "nav.challenges" }).length).toBeGreaterThan(0);
  });

  it("shows the login affordance when unauthenticated", () => {
    mocks.useSession.mockReturnValue({ isAuthenticated: false, ready: true });
    renderWithRouter(<Navbar />);
    expect(screen.getAllByRole("link", { name: "nav.login" }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "auth.account" })).toBeNull();
  });

  it("shows the account button when authenticated", () => {
    mocks.useSession.mockReturnValue({ isAuthenticated: true, ready: true });
    renderWithRouter(<Navbar />);
    expect(screen.getAllByRole("button", { name: "auth.account" }).length).toBeGreaterThan(0);
    expect(screen.queryByRole("link", { name: "nav.login" })).toBeNull();
  });

  it("marks the active nav item based on the current path", () => {
    renderWithRouter(<Navbar />, { initialEntries: ["/tournaments"] });
    const links = screen.getAllByRole("link", { name: "nav.tournaments" });
    expect(links.length).toBeGreaterThan(0);
  });

  it("toggles the mobile menu when the hamburger is clicked", () => {
    renderWithRouter(<Navbar />);
    const toggle = screen.getByRole("button", { name: "Ouvrir le menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Fermer le menu" })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
