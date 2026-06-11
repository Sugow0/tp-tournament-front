import { describe, expect, it } from "vitest";
import { generatePairings } from "~/lib/bracket";
import type { Player } from "~/types/player";

function makePlayer(id: number): Player {
  return { tournamentId: 1, playerId: id, playerName: `P${id}`, classId: 1, level: 1, isDisqualified: false, penaltyPoints: 0 };
}

describe("generatePairings", () => {
  it("returns an empty array when there are fewer than 2 players", () => {
    expect(generatePairings([])).toEqual([]);
    expect(generatePairings([makePlayer(1)])).toEqual([]);
  });

  it("returns a single pair for 2 players with duelOrder 1", () => {
    const pairings = generatePairings([makePlayer(1), makePlayer(2)]);
    expect(pairings).toEqual([{ player1Id: 1, player2Id: 2, duelOrder: 1 }]);
  });

  it("returns 6 unique unordered pairs for 4 players", () => {
    const pairings = generatePairings([makePlayer(1), makePlayer(2), makePlayer(3), makePlayer(4)]);
    expect(pairings).toHaveLength(6);
    expect(pairings.map((p) => p.duelOrder)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(pairings.map((p) => [p.player1Id, p.player2Id])).toEqual([
      [1, 2],
      [1, 3],
      [1, 4],
      [2, 3],
      [2, 4],
      [3, 4],
    ]);
  });

  it("produces only unique unordered pairs (no self, no duplicates)", () => {
    const pairings = generatePairings([makePlayer(7), makePlayer(8), makePlayer(9)]);
    const seen = new Set<string>();
    for (const p of pairings) {
      expect(p.player1Id).not.toBe(p.player2Id);
      const key = [p.player1Id, p.player2Id].sort((a, b) => a - b).join("-");
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
    expect(pairings).toHaveLength(3);
  });
});
