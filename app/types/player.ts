export interface Player {
  id: number;
  tournamentId: number;
  name: string;
  isDisqualified: boolean;
  penaltyPoints: number;
}

export interface CreatePlayerPayload {
  name: string;
}

export interface AddPenaltyPayload {
  penaltyPoints: number;
}
