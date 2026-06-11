export interface Player {
  tournamentId: number;
  playerId: number;
  playerName: string;
  classId: number;
  level: number;
  isDisqualified: boolean;
  penaltyPoints: number;
}

export interface CreatePlayerPayload {
  name: string;
}

export interface AddPenaltyPayload {
  penaltyPoints: number;
}
