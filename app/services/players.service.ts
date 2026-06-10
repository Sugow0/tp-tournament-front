import { apiFetch } from "~/lib/http";
import type { AddPenaltyPayload, CreatePlayerPayload, Player } from "~/types/player";

export function listPlayers(tournamentId: number): Promise<Player[]> {
  return apiFetch(`/api/tournaments/${tournamentId}/players`);
}

export function getPlayer(id: number): Promise<Player> {
  return apiFetch(`/api/players/${id}`);
}

export function addPlayer(tournamentId: number, payload: CreatePlayerPayload): Promise<Player> {
  return apiFetch(`/api/tournaments/${tournamentId}/players`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function disqualifyPlayer(id: number): Promise<Player> {
  return apiFetch(`/api/players/${id}/disqualify`, { method: "POST" });
}

export function addPenalty(id: number, payload: AddPenaltyPayload): Promise<Player> {
  return apiFetch(`/api/players/${id}/penalties`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
