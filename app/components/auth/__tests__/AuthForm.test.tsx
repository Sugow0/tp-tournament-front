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
});
