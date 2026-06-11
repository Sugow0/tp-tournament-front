import { apiFetch } from "~/lib/http";
import type { AddPenaltyPayload, CreatePlayerPayload, Player } from "~/types/player";

interface CreatedPlayerResponse {
  id: number;
  userId: number;
  name: string;
  classId: number;
  level: number;
}

export function listPlayers(tournamentId: number): Promise<Player[]> {
  return apiFetch(`/api/tournaments/${tournamentId}/players`);
}

export function getPlayer(id: number): Promise<CreatedPlayerResponse> {
  return apiFetch(`/api/players/${id}`);
}

export async function addPlayer(
  tournamentId: number,
  payload: CreatePlayerPayload
): Promise<Player> {
  const created = await apiFetch<CreatedPlayerResponse>("/api/players", {
    method: "POST",
    body: JSON.stringify({ name: payload.name, classId: 1, level: 1 }),
  });
  return apiFetch(`/api/tournaments/${tournamentId}/players/${created.id}`, {
    method: "POST",
  });
}

export function disqualifyPlayer(tournamentId: number, playerId: number): Promise<Player> {
  return apiFetch(`/api/tournaments/${tournamentId}/players/${playerId}/disqualify`, {
    method: "POST",
  });
}

export function addPenalty(
  tournamentId: number,
  playerId: number,
  payload: AddPenaltyPayload
): Promise<Player> {
  return apiFetch(`/api/tournaments/${tournamentId}/players/${playerId}/penalties`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
