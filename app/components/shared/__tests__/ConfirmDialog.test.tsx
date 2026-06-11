import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmDialog } from "~/components/shared/ConfirmDialog";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe("ConfirmDialog", () => {
  it("does not render content when closed", () => {
    render(
      <ConfirmDialog
        open={false}
        onOpenChange={vi.fn()}
        title="Supprimer le tournoi"
        description="Cette action est irréversible."
        onConfirm={vi.fn()}
      />
    );
    expect(screen.queryByText("Supprimer le tournoi")).toBeNull();
  });

  it("renders title and description when open", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Supprimer le tournoi"
        description="Cette action est irréversible."
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByText("Supprimer le tournoi")).toBeInTheDocument();
    expect(screen.getByText("Cette action est irréversible.")).toBeInTheDocument();
  });

  it("uses the default confirm label", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Titre"
        description="Description"
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Confirmer" })).toBeInTheDocument();
  });

  it("uses a custom confirm label", () => {
    render(
      <ConfirmDialog
        open
        onOpenChange={vi.fn()}
        title="Titre"
        description="Description"
        confirmLabel="Supprimer"
        variant="destructive"
        onConfirm={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Supprimer" })).toBeInTheDocument();
  });

  it("calls onConfirm then closes when confirming", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Titre"
        description="Description"
        onConfirm={onConfirm}
      />
    );
    await user.click(screen.getByRole("button", { name: "Confirmer" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("calls onOpenChange(false) when cancelling without confirming", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <ConfirmDialog
        open
        onOpenChange={onOpenChange}
        title="Titre"
        description="Description"
        onConfirm={onConfirm}
      />
    );
    await user.click(screen.getByRole("button", { name: "Annuler" }));
    expect(onConfirm).not.toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
