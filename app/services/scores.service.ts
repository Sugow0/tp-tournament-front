import { apiFetch } from "~/lib/http";
import type { PlayerScore, RankingResponse } from "~/types/score";

export function getPlayerScore(playerId: number): Promise<PlayerScore> {
  return apiFetch(`/api/players/${playerId}/score`);
}

export function getTournamentRanking(tournamentId: number): Promise<RankingResponse> {
  return apiFetch(`/api/tournaments/${tournamentId}/ranking`);
}

export function getTournamentChampion(tournamentId: number): Promise<PlayerScore> {
  return apiFetch(`/api/tournaments/${tournamentId}/champion`);
}
