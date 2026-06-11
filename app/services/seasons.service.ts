import { apiFetch } from "~/lib/http";
import type {
  CreateSeasonPayload,
  Season,
  SeasonalStats,
  UpdateSeasonStatusPayload,
} from "~/types/season";

export function listSeasons(): Promise<Season[]> {
  return apiFetch("/api/seasons");
}

export function getSeason(id: number): Promise<Season> {
  return apiFetch(`/api/seasons/${id}`);
}

export function createSeason(payload: CreateSeasonPayload): Promise<Season> {
  return apiFetch("/api/seasons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateSeasonStatus(
  id: number,
  payload: UpdateSeasonStatusPayload
): Promise<Season> {
  return apiFetch(`/api/seasons/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function attachTournament(seasonId: number, tournamentId: number): Promise<void> {
  return apiFetch(`/api/seasons/${seasonId}/tournaments/${tournamentId}`, {
    method: "POST",
  });
}

export function getPlayerSeasonalStats(seasonId: number, playerId: number): Promise<SeasonalStats> {
  return apiFetch(`/api/seasons/${seasonId}/players/${playerId}/stats`);
}
