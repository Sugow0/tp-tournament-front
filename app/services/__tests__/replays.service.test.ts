import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  addReplayEvent,
  completeReplay,
  getCosmeticSnapshot,
  getReplay,
  listReplayEvents,
  startReplay,
} from "~/services/replays.service";
import type { CosmeticSnapshot, Replay, ReplayEvent } from "~/types/replay";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeReplay: Replay = {
  id: 1,
  duelId: 7,
  schemaVersion: 1,
  recordedAt: "2026-01-01T10:00:00Z",
  isComplete: false,
};

const fakeEvent: ReplayEvent = {
  id: 1,
  replayId: 1,
  eventOrder: 1,
  eventType: "ATTACK",
  actorPlayerId: 3,
  targetPlayerId: 4,
  occurredAtMs: 1500,
  payload: null,
};

const fakeSnapshot: CosmeticSnapshot = {
  duelId: 7,
  player1SkinName: "Knight",
  player1AssetKey: "knight.png",
  player2SkinName: "Mage",
  player2AssetKey: "mage.png",
  backgroundSkinName: "Arena",
  backgroundAssetKey: "arena.png",
};

describe("replays.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  it("startReplay calls POST /api/duels/:duelId/replay", async () => {
    mockApiFetch.mockResolvedValue(fakeReplay);
    const result = await startReplay(7);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/7/replay", { method: "POST" });
    expect(result).toEqual(fakeReplay);
  });

  it("getReplay calls GET /api/duels/:duelId/replay", async () => {
    mockApiFetch.mockResolvedValue(fakeReplay);
    const result = await getReplay(7);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/7/replay");
    expect(result).toEqual(fakeReplay);
  });

  it("addReplayEvent calls POST /api/duels/:duelId/replay/events with payload", async () => {
    mockApiFetch.mockResolvedValue(fakeEvent);
    const payload = { eventType: "ATTACK", occurredAtMs: 1500, actorPlayerId: 3, targetPlayerId: 4 };
    const result = await addReplayEvent(7, payload);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/7/replay/events", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(fakeEvent);
  });

  it("listReplayEvents calls GET /api/duels/:duelId/replay/events", async () => {
    mockApiFetch.mockResolvedValue([fakeEvent]);
    const result = await listReplayEvents(7);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/7/replay/events");
    expect(result).toEqual([fakeEvent]);
  });

  it("completeReplay calls PATCH /api/duels/:duelId/replay/complete", async () => {
    mockApiFetch.mockResolvedValue({ ...fakeReplay, isComplete: true });
    const result = await completeReplay(7);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/7/replay/complete", { method: "PATCH" });
    expect(result.isComplete).toBe(true);
  });

  it("getCosmeticSnapshot calls GET /api/duels/:duelId/cosmetic-snapshot", async () => {
    mockApiFetch.mockResolvedValue(fakeSnapshot);
    const result = await getCosmeticSnapshot(7);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/duels/7/cosmetic-snapshot");
    expect(result).toEqual(fakeSnapshot);
  });
});
