export type TournamentStatus = "OPEN" | "IN_PROGRESS" | "CLOSED";

export interface Tournament {
  id: number;
  name: string;
  status: TournamentStatus;
  createdAt: string;
}

export interface CreateTournamentPayload {
  name: string;
}

export interface UpdateTournamentStatusPayload {
  status: TournamentStatus;
}
