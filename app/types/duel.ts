export type DuelOutcome = "PLAYER1_WIN" | "PLAYER2_WIN" | "DRAW";

export interface Duel {
  id: number;
  tournamentId: number;
  player1Id: number;
  player2Id: number;
  outcome: DuelOutcome | null;
  duelOrder: number;
  playedAt: string;
  durationSeconds: number | null;
}

export interface CreateDuelPayload {
  player1Id: number;
  player2Id: number;
  duelOrder: number;
}

export interface SetDuelOutcomePayload {
  outcome: DuelOutcome;
}

export interface EndDuelPayload {
  durationSeconds: number;
}
