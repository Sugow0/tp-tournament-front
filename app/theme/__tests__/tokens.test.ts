import { describe, expect, it } from "vitest";
import { dndPalette } from "~/theme/tokens";

describe("dndPalette — Dungeons & Dragons theme tokens", () => {
  it("uses the heraldic D&D crimson as the primary color", () => {
    expect(dndPalette.crimson.toLowerCase()).toBe("#b1121f");
  });

  it("uses warm near-black leather backgrounds, not the retired Clash-Royale purple", () => {
    expect(dndPalette.arenaBg.toLowerCase()).toBe("#0e0b09");
    expect(dndPalette.arenaBg.toLowerCase()).not.toBe("#0d0a1e");
  });

  it("uses antique brass gold for ornaments and treasure", () => {
    expect(dndPalette.gold.toLowerCase()).toBe("#c9a44b");
  });

  it("uses parchment tones for text", () => {
    expect(dndPalette.text.toLowerCase()).toBe("#e8dcc0");
    expect(dndPalette.textBright.toLowerCase()).toBe("#f7eed8");
  });

  it("exposes torch ember/light tones for the 3D arena scene", () => {
    expect(dndPalette.ember.toLowerCase()).toBe("#e07820");
    expect(dndPalette.torch.toLowerCase()).toBe("#c85a00");
  });

  it("keeps a blood-red battle tone that is distinct from the primary crimson", () => {
    expect(dndPalette.blood).not.toBe(dndPalette.crimson);
  });
});
