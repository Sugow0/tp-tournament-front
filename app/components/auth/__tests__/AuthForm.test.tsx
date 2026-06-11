import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AuthForm } from "~/components/auth/AuthForm";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("AuthForm", () => {
  it("renders email and password fields and a submit button in login mode", () => {
    renderWithRouter(<AuthForm mode="login" />);
    expect(screen.getByLabelText("auth.email")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "auth.submit" })).toBeInTheDocument();
  });

  it("renders email and password fields and a submit button in register mode", () => {
    renderWithRouter(<AuthForm mode="register" />);
    expect(screen.getByLabelText("auth.email")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "auth.submit" })).toBeInTheDocument();
  });

  it("posts to the route action via a method=post form", () => {
    renderWithRouter(<AuthForm mode="login" />);
    const email = screen.getByLabelText("auth.email");
    const form = email.closest("form");
    expect(form).not.toBeNull();
    expect(form?.getAttribute("method")?.toLowerCase()).toBe("post");
  });

  it("uses name attributes email and password for the inputs", () => {
    renderWithRouter(<AuthForm mode="login" />);
    expect(screen.getByLabelText("auth.email")).toHaveAttribute("name", "email");
    expect(screen.getByLabelText("auth.password")).toHaveAttribute("name", "password");
  });

  it("shows the brand name (login-05 branded card)", () => {
    renderWithRouter(<AuthForm mode="login" />);
    expect(screen.getAllByText("nav.brand").length).toBeGreaterThan(0);
  });

  it("links to /register in login mode", () => {
    renderWithRouter(<AuthForm mode="login" />);
    const link = screen.getByRole("link", { name: "auth.register" });
    expect(link).toHaveAttribute("href", "/register");
  });

  it("links to /login in register mode", () => {
    renderWithRouter(<AuthForm mode="register" />);
    const link = screen.getByRole("link", { name: "auth.login" });
    expect(link).toHaveAttribute("href", "/login");
  });
});
