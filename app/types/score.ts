export interface PlayerScore {
  playerId: number;
  playerName: string;
  finalScore: number;
  isDisqualified: boolean;
}

export interface RankingResponse {
  tournamentId: number;
  ranking: PlayerScore[];
}
