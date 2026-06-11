import { beforeEach, describe, expect, it, vi } from "vitest";
import * as replayService from "~/services/replays.service";
import type { CosmeticSnapshot, ReplayEvent } from "~/types/replay";

vi.mock("~/services/replays.service");
const mockListEvents = vi.mocked(replayService.listReplayEvents);
const mockSnapshot = vi.mocked(replayService.getCosmeticSnapshot);

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

describe("tournaments.$id.duels.$duelId.replay loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls services with duelId from params", async () => {
    mockListEvents.mockResolvedValue([fakeEvent]);
    mockSnapshot.mockResolvedValue(fakeSnapshot);
    const { loader } = await import("~/routes/tournaments.$id.duels.$duelId.replay");
    await loader({
      params: { id: "42", duelId: "7" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(mockListEvents).toHaveBeenCalledWith(7);
    expect(mockSnapshot).toHaveBeenCalledWith(7);
  });

  it("returns events and snapshot", async () => {
    mockListEvents.mockResolvedValue([fakeEvent]);
    mockSnapshot.mockResolvedValue(fakeSnapshot);
    const { loader } = await import("~/routes/tournaments.$id.duels.$duelId.replay");
    const data = await loader({
      params: { id: "42", duelId: "7" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(data).toEqual({ events: [fakeEvent], snapshot: fakeSnapshot });
  });
});
