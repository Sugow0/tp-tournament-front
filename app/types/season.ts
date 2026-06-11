export type SeasonStatus = "UPCOMING" | "ACTIVE" | "ENDED";

export interface Season {
  id: number;
  name: string;
  status: SeasonStatus;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CreateSeasonPayload {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateSeasonStatusPayload {
  status: SeasonStatus;
}

export interface SeasonalStats {
  playerId: number;
  seasonId: number;
  totalScore: number;
  tournamentsPlayed: number;
  totalWins: number;
  totalLosses: number;
  totalDraws: number;
  winStreakBest: number;
  seasonRank: number | null;
}

export interface SeasonReward {
  id: number;
  seasonId: number;
  rankMin: number;
  rankMax: number | null;
  rewardType: string;
  rewardData: string;
  label: string;
}

export interface CreateSeasonRewardPayload {
  rankMin: number;
  rankMax?: number;
  rewardType: string;
  rewardData: string;
  label: string;
}

export interface PlayerSeasonReward {
  id: number;
  playerId: number;
  seasonId: number;
  seasonRank: number;
  seasonRewardId: number;
  awardedAt: string;
}
