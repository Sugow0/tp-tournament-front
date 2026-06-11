import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SeasonStatusBadge } from "~/components/season/SeasonStatusBadge";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("SeasonStatusBadge", () => {
  it.each([
    "UPCOMING",
    "ACTIVE",
    "ENDED",
  ] as const)("renders translation key for status %s", (status) => {
    render(<SeasonStatusBadge status={status} />);
    expect(screen.getByText(`season.status.${status}`)).toBeInTheDocument();
  });
});
