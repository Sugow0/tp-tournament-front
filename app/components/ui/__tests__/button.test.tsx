import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "~/components/ui/button";

describe("Button — consistent D&D styling", () => {
  it("uses a small radius (rounded-sm) by default", () => {
    render(<Button>Action</Button>);
    expect(screen.getByRole("button").className).toContain("rounded-sm");
  });

  it("keeps rounded-sm on the small size (no rounded-md leak)", () => {
    render(
      <Button size="sm">Action</Button>,
    );
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("rounded-sm");
    expect(cls).not.toContain("rounded-md");
  });

  it("renders the default variant as a solid (non-transparent) primary button", () => {
    render(<Button>Action</Button>);
    expect(screen.getByRole("button").className).toContain("bg-primary");
  });

  it("renders the outline variant as a bordered surface button, not a bare link", () => {
    render(<Button variant="outline">Action</Button>);
    const cls = screen.getByRole("button").className;
    expect(cls).toContain("border");
    expect(cls).toContain("var(--color-arena-surface)");
    expect(cls).not.toContain("underline");
  });
});
