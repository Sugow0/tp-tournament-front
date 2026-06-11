import { apiFetch } from "~/lib/http";
import type {
  CreateObjectivePayload,
  Objective,
  PlayerObjectiveCompletion,
  PlayerObjectiveProgress,
  UpdateProgressPayload,
} from "~/types/objective";

export function createObjective(payload: CreateObjectivePayload): Promise<Objective> {
  return apiFetch("/api/objectives", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getObjective(id: number): Promise<Objective> {
  return apiFetch(`/api/objectives/${id}`);
}

export function listSeasonObjectives(seasonId: number): Promise<Objective[]> {
  return apiFetch(`/api/objectives/season/${seasonId}`);
}

export function getPlayerProgress(id: number, playerId: number): Promise<PlayerObjectiveProgress> {
  return apiFetch(`/api/objectives/${id}/players/${playerId}/progress`);
}

export function getPlayerCompletions(
  id: number,
  playerId: number
): Promise<PlayerObjectiveCompletion[]> {
  return apiFetch(`/api/objectives/${id}/players/${playerId}/completions`);
}

export function updatePlayerProgress(
  id: number,
  playerId: number,
  payload: UpdateProgressPayload
): Promise<PlayerObjectiveProgress> {
  return apiFetch(`/api/objectives/${id}/players/${playerId}/progress`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
