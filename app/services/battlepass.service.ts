import { apiFetch } from "~/lib/http";
import type {
  AddTierPayload,
  AddXpPayload,
  Battlepass,
  BattlepassTier,
  CreateBattlepassPayload,
  PlayerBattlepassProgress,
} from "~/types/battlepass";

export function createBattlepass(payload: CreateBattlepassPayload): Promise<Battlepass> {
  return apiFetch("/api/battlepasses", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getBattlepassBySeason(seasonId: number): Promise<Battlepass> {
  return apiFetch(`/api/battlepasses/season/${seasonId}`);
}

export function addTier(id: number, payload: AddTierPayload): Promise<BattlepassTier> {
  return apiFetch(`/api/battlepasses/${id}/tiers`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function listTiers(id: number): Promise<BattlepassTier[]> {
  return apiFetch(`/api/battlepasses/${id}/tiers`);
}

export function getPlayerProgress(id: number, playerId: number): Promise<PlayerBattlepassProgress> {
  return apiFetch(`/api/battlepasses/${id}/players/${playerId}/progress`);
}

export function addXp(
  id: number,
  playerId: number,
  payload: AddXpPayload
): Promise<PlayerBattlepassProgress> {
  return apiFetch(`/api/battlepasses/${id}/players/${playerId}/xp`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
