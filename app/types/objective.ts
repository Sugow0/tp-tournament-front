export interface Objective {
  id: number;
  seasonId: number;
  name: string;
  description: string;
  objectiveType: string;
  targetValue: number;
  xpReward: number;
  resetType: string;
}

export interface CreateObjectivePayload {
  seasonId: number;
  name: string;
  description: string;
  objectiveType: string;
  targetValue: number;
  xpReward: number;
  resetType: string;
}

export interface PlayerObjectiveProgress {
  objectiveId: number;
  playerId: number;
  currentValue: number;
  isCompleted: boolean;
  completedAt: string | null;
  periodKey: string | null;
}

export interface PlayerObjectiveCompletion {
  id: number;
  playerId: number;
  objectiveId: number;
  completedAt: string;
  xpAwarded: number;
  periodKey: string | null;
}

export interface UpdateProgressPayload {
  newValue: number;
  periodKey?: string | null;
}
