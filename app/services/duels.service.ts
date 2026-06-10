import { apiFetch } from "~/lib/http";
import type {
  CreateDuelPayload,
  Duel,
  EndDuelPayload,
  SetDuelOutcomePayload,
} from "~/types/duel";

export function listDuels(tournamentId: number): Promise<Duel[]> {
  return apiFetch(`/api/tournaments/${tournamentId}/duels`);
}

export function getDuel(id: number): Promise<Duel> {
  return apiFetch(`/api/duels/${id}`);
}

export function createDuel(tournamentId: number, payload: CreateDuelPayload): Promise<Duel> {
  return apiFetch(`/api/tournaments/${tournamentId}/duels`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function setDuelOutcome(id: number, payload: SetDuelOutcomePayload): Promise<Duel> {
  return apiFetch(`/api/duels/${id}/outcome`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function endDuel(id: number, payload: EndDuelPayload): Promise<Duel> {
  return apiFetch(`/api/duels/${id}/end`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
