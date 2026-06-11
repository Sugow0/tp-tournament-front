export type SkinCategory = "PLAYER" | "BACKGROUND";

export interface Skin {
  id: number;
  category: SkinCategory;
  name: string;
  assetKey: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface CreateSkinPayload {
  category: SkinCategory;
  name: string;
  assetKey: string;
  isPremium: boolean;
}

export interface PlayerLoadout {
  playerId: number;
  skinId: number | null;
  skinName: string | null;
  assetKey: string | null;
}

export interface TournamentBackground {
  tournamentId: number;
  skinId: number | null;
  skinName: string | null;
  assetKey: string | null;
}

export interface EquipSkinPayload {
  skinId: number;
}

export interface SetBackgroundPayload {
  skinId: number;
}
