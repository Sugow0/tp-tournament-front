import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NavbarSession } from "~/components/layout/NavbarSession";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mocks = vi.hoisted(() => ({
  isAuthenticated: vi.fn(),
  clearSession: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
  isAuthenticated: mocks.isAuthenticated,
  clearSession: mocks.clearSession,
}));

describe("NavbarSession", () => {
  beforeEach(() => {
    mocks.isAuthenticated.mockReset();
    mocks.clearSession.mockReset();
  });

  it("shows a Connexion link to /login when logged out", () => {
    mocks.isAuthenticated.mockReturnValue(false);
    renderWithRouter(<NavbarSession />);
    const link = screen.getByRole("link", { name: "nav.login" });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("does not show an avatar when logged out", () => {
    mocks.isAuthenticated.mockReturnValue(false);
    renderWithRouter(<NavbarSession />);
    expect(screen.queryByRole("button", { name: "auth.account" })).toBeNull();
  });

  it("shows an account button (avatar) when logged in", () => {
    mocks.isAuthenticated.mockReturnValue(true);
    renderWithRouter(<NavbarSession />);
    expect(screen.getByRole("button", { name: "auth.account" })).toBeInTheDocument();
  });

  it("reveals a Déconnexion button after opening the menu when logged in", () => {
    mocks.isAuthenticated.mockReturnValue(true);
    renderWithRouter(<NavbarSession />);
    fireEvent.click(screen.getByRole("button", { name: "auth.account" }));
    expect(screen.getByRole("button", { name: "auth.logout" })).toBeInTheDocument();
  });

  it("calls clearSession when the logout button is clicked", () => {
    mocks.isAuthenticated.mockReturnValue(true);
    renderWithRouter(<NavbarSession />);
    fireEvent.click(screen.getByRole("button", { name: "auth.account" }));
    fireEvent.click(screen.getByRole("button", { name: "auth.logout" }));
    expect(mocks.clearSession).toHaveBeenCalledTimes(1);
  });
});
