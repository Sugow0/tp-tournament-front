import { apiFetch } from "~/lib/http";
import type {
  CreateSkinPayload,
  EquipSkinPayload,
  PlayerLoadout,
  SetBackgroundPayload,
  Skin,
  TournamentBackground,
} from "~/types/skin";

export function listSkins(): Promise<Skin[]> {
  return apiFetch("/api/skins");
}

export function getSkin(id: number): Promise<Skin> {
  return apiFetch(`/api/skins/${id}`);
}

export function createSkin(payload: CreateSkinPayload): Promise<Skin> {
  return apiFetch("/api/skins", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deactivateSkin(id: number): Promise<void> {
  return apiFetch(`/api/skins/${id}`, { method: "DELETE" });
}

export function equipPlayerSkin(
  playerId: number,
  payload: EquipSkinPayload
): Promise<PlayerLoadout> {
  return apiFetch(`/api/players/${playerId}/skin`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getPlayerLoadout(playerId: number): Promise<PlayerLoadout> {
  return apiFetch(`/api/players/${playerId}/skin`);
}

export function setTournamentBackground(
  tournamentId: number,
  payload: SetBackgroundPayload
): Promise<TournamentBackground> {
  return apiFetch(`/api/tournaments/${tournamentId}/background`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTournamentBackground(tournamentId: number): Promise<TournamentBackground> {
  return apiFetch(`/api/tournaments/${tournamentId}/background`);
}
