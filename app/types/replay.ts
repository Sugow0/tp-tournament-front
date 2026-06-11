export interface Replay {
  id: number;
  duelId: number;
  schemaVersion: number;
  recordedAt: string;
  isComplete: boolean;
}

export interface ReplayEvent {
  id: number;
  replayId: number;
  eventOrder: number;
  eventType: string;
  actorPlayerId: number | null;
  targetPlayerId: number | null;
  occurredAtMs: number;
  payload: string | null;
}

export interface AddReplayEventPayload {
  eventType: string;
  occurredAtMs: number;
  actorPlayerId?: number | null;
  targetPlayerId?: number | null;
  payload?: string | null;
}

export interface CosmeticSnapshot {
  duelId: number;
  player1SkinName: string | null;
  player1AssetKey: string | null;
  player2SkinName: string | null;
  player2AssetKey: string | null;
  backgroundSkinName: string | null;
  backgroundAssetKey: string | null;
}
