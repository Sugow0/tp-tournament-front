import { apiFetch } from "~/lib/http";
import type { Combat, CombatantSpec } from "~/types/combat";

export interface StartCombatPayload {
  champion1: CombatantSpec;
  champion2: CombatantSpec;
}

export interface SubmitActionPayload {
  slot: 1 | 2;
  skillId: number;
}

export interface ForfeitPayload {
  slot: 1 | 2;
}

export function startCombat(payload: StartCombatPayload): Promise<Combat> {
  return apiFetch("/api/combats", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listCombats(): Promise<Combat[]> {
  return apiFetch("/api/combats");
}

export function getCombat(id: number): Promise<Combat> {
  return apiFetch(`/api/combats/${id}`);
}

export function submitAction(id: number, payload: SubmitActionPayload): Promise<Combat> {
  return apiFetch(`/api/combats/${id}/actions`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function forfeit(id: number, payload: ForfeitPayload): Promise<Combat> {
  return apiFetch(`/api/combats/${id}/forfeit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
