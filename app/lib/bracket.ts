import type { Player } from "~/types/player";

export interface Pairing {
  player1Id: number;
  player2Id: number;
  duelOrder: number;
}

/**
 * Generates a round-robin bracket: one duel per unique unordered pair of
 * players, with an incremental duelOrder starting at 1. Returns an empty array
 * when there are fewer than 2 players.
 */
export function generatePairings(players: Player[]): Pairing[] {
  if (players.length < 2) return [];

  const pairings: Pairing[] = [];
  let duelOrder = 1;

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      pairings.push({
        player1Id: players[i].playerId,
        player2Id: players[j].playerId,
        duelOrder: duelOrder++,
      });
    }
  }

  return pairings;
}
