export type ChallengeStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export interface Challenge {
  id: number;
  challengerUserId: number;
  challengerEmail: string;
  opponentUserId: number;
  opponentEmail: string;
  status: ChallengeStatus;
  combatId: number | null;
  createdAt: string;
}

export interface CreateChallengePayload {
  challengerUserId: number;
  opponentUserId: number;
}
