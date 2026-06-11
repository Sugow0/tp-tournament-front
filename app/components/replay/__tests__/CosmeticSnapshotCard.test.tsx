import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CosmeticSnapshotCard } from "~/components/replay/CosmeticSnapshotCard";
import type { CosmeticSnapshot } from "~/types/replay";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const fullSnapshot: CosmeticSnapshot = {
  duelId: 7,
  player1SkinName: "Knight",
  player1AssetKey: "knight.png",
  player2SkinName: "Mage",
  player2AssetKey: "mage.png",
  backgroundSkinName: "Arena",
  backgroundAssetKey: "arena.png",
};

describe("CosmeticSnapshotCard", () => {
  it("renders skin names", () => {
    render(<CosmeticSnapshotCard snapshot={fullSnapshot} />);
    expect(screen.getByText("Knight")).toBeInTheDocument();
    expect(screen.getByText("Mage")).toBeInTheDocument();
    expect(screen.getByText("Arena")).toBeInTheDocument();
  });

  it("shows — fallback for null skin fields", () => {
    const nullSnapshot: CosmeticSnapshot = {
      duelId: 7,
      player1SkinName: null,
      player1AssetKey: null,
      player2SkinName: null,
      player2AssetKey: null,
      backgroundSkinName: null,
      backgroundAssetKey: null,
    };
    render(<CosmeticSnapshotCard snapshot={nullSnapshot} />);
    expect(screen.getAllByText("—")).toHaveLength(3);
  });
});
