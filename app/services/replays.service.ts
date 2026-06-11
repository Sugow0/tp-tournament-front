import { apiFetch } from "~/lib/http";
import type { AddReplayEventPayload, CosmeticSnapshot, Replay, ReplayEvent } from "~/types/replay";

export function startReplay(duelId: number): Promise<Replay> {
  return apiFetch(`/api/duels/${duelId}/replay`, { method: "POST" });
}

export function getReplay(duelId: number): Promise<Replay> {
  return apiFetch(`/api/duels/${duelId}/replay`);
}

export function addReplayEvent(
  duelId: number,
  payload: AddReplayEventPayload
): Promise<ReplayEvent> {
  return apiFetch(`/api/duels/${duelId}/replay/events`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listReplayEvents(duelId: number): Promise<ReplayEvent[]> {
  return apiFetch(`/api/duels/${duelId}/replay/events`);
}

export function completeReplay(duelId: number): Promise<Replay> {
  return apiFetch(`/api/duels/${duelId}/replay/complete`, { method: "PATCH" });
}

export function getCosmeticSnapshot(duelId: number): Promise<CosmeticSnapshot> {
  return apiFetch(`/api/duels/${duelId}/cosmetic-snapshot`);
}
