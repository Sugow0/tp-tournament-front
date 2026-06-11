import { fireEvent, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NavbarSession } from "~/components/layout/NavbarSession";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mocks = vi.hoisted(() => ({
  clearSession: vi.fn(),
  useSession: vi.fn(),
}));

vi.mock("~/lib/auth", () => ({
  clearSession: mocks.clearSession,
}));

vi.mock("~/hooks/useSession", () => ({
  useSession: mocks.useSession,
}));

function loggedOut() {
  mocks.useSession.mockReturnValue({ isAuthenticated: false, ready: true });
}

function loggedIn() {
  mocks.useSession.mockReturnValue({ isAuthenticated: true, ready: true });
}

describe("NavbarSession", () => {
  beforeEach(() => {
    mocks.clearSession.mockReset();
    mocks.useSession.mockReset();
  });

  it("shows a Connexion link to /login when logged out", () => {
    loggedOut();
    renderWithRouter(<NavbarSession />);
    const link = screen.getByRole("link", { name: "nav.login" });
    expect(link).toHaveAttribute("href", "/login");
  });

  it("does not show an avatar when logged out", () => {
    loggedOut();
    renderWithRouter(<NavbarSession />);
    expect(screen.queryByRole("button", { name: "auth.account" })).toBeNull();
  });

  it("shows an account button (avatar) when logged in", () => {
    loggedIn();
    renderWithRouter(<NavbarSession />);
    expect(screen.getByRole("button", { name: "auth.account" })).toBeInTheDocument();
  });

  it("reveals a Déconnexion button after opening the menu when logged in", () => {
    loggedIn();
    renderWithRouter(<NavbarSession />);
    fireEvent.click(screen.getByRole("button", { name: "auth.account" }));
    expect(screen.getByRole("button", { name: "auth.logout" })).toBeInTheDocument();
  });

  it("calls clearSession when the logout button is clicked", () => {
    loggedIn();
    renderWithRouter(<NavbarSession />);
    fireEvent.click(screen.getByRole("button", { name: "auth.account" }));
    fireEvent.click(screen.getByRole("button", { name: "auth.logout" }));
    expect(mocks.clearSession).toHaveBeenCalledTimes(1);
  });
});
