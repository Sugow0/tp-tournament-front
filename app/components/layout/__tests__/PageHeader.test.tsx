import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PageHeader } from "~/components/layout/PageHeader";
import { renderWithRouter } from "~/test/utils/render-with-router";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("PageHeader", () => {
  it("renders the title", () => {
    renderWithRouter(<PageHeader title="Tournois" />);
    expect(screen.getByRole("heading", { name: "Tournois" })).toBeInTheDocument();
  });

  it("renders the subtitle when provided", () => {
    renderWithRouter(<PageHeader title="Tournois" subtitle="Affrontez vos rivaux" />);
    expect(screen.getByText("Affrontez vos rivaux")).toBeInTheDocument();
  });

  it("does not render a subtitle when omitted", () => {
    renderWithRouter(<PageHeader title="Tournois" />);
    expect(screen.queryByText("Affrontez vos rivaux")).toBeNull();
  });

  it("renders the actions when provided", () => {
    renderWithRouter(
      <PageHeader title="Tournois" actions={<button type="button">Nouveau</button>} />
    );
    expect(screen.getByRole("button", { name: "Nouveau" })).toBeInTheDocument();
  });

  it("does not render actions when omitted", () => {
    renderWithRouter(<PageHeader title="Tournois" />);
    expect(screen.queryByRole("button", { name: "Nouveau" })).toBeNull();
  });

  it("renders breadcrumb links when provided", () => {
    renderWithRouter(
      <PageHeader
        title="Détail"
        breadcrumb={[
          { label: "Tournois", href: "/tournaments" },
          { label: "Détail", href: "/tournaments/1" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "Tournois" })).toHaveAttribute(
      "href",
      "/tournaments"
    );
    expect(screen.getByRole("link", { name: "Détail" })).toHaveAttribute(
      "href",
      "/tournaments/1"
    );
  });

  it("does not render a breadcrumb when empty", () => {
    renderWithRouter(<PageHeader title="Tournois" breadcrumb={[]} />);
    expect(screen.queryByRole("link")).toBeNull();
  });
});
