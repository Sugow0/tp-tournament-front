import { apiFetch } from "~/lib/http";
import type {
  CreateTournamentPayload,
  Tournament,
  UpdateTournamentStatusPayload,
} from "~/types/tournament";

export function listTournaments(): Promise<Tournament[]> {
  return apiFetch("/api/tournaments");
}

export function getTournament(id: number): Promise<Tournament> {
  return apiFetch(`/api/tournaments/${id}`);
}

export function createTournament(payload: CreateTournamentPayload): Promise<Tournament> {
  return apiFetch("/api/tournaments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateTournamentStatus(
  id: number,
  payload: UpdateTournamentStatusPayload
): Promise<Tournament> {
  return apiFetch(`/api/tournaments/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
