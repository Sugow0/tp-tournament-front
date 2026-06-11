import { apiFetch } from "~/lib/http";
import type { Challenge, CreateChallengePayload } from "~/types/challenge";

export function createChallenge(payload: CreateChallengePayload): Promise<Challenge> {
  return apiFetch("/api/challenges", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listChallenges(userId: number): Promise<Challenge[]> {
  return apiFetch(`/api/users/${userId}/challenges`);
}

export function acceptChallenge(id: number): Promise<Challenge> {
  return apiFetch(`/api/challenges/${id}/accept`, {
    method: "POST",
  });
}

export function declineChallenge(id: number): Promise<Challenge> {
  return apiFetch(`/api/challenges/${id}/decline`, {
    method: "POST",
  });
}
