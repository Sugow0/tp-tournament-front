import { beforeEach, describe, expect, it, vi } from "vitest";
import * as skinService from "~/services/skins.service";
import type { Skin, TournamentBackground } from "~/types/skin";

vi.mock("~/services/skins.service");
const mockList = vi.mocked(skinService.listSkins);
const mockGetBackground = vi.mocked(skinService.getTournamentBackground);
const mockSetBackground = vi.mocked(skinService.setTournamentBackground);

const fakeSkin: Skin = {
  id: 2,
  category: "BACKGROUND",
  name: "Misty Arena",
  assetKey: "misty-arena",
  isPremium: false,
  isActive: true,
  createdAt: "2026-01-01T00:00:00Z",
};

const fakeBackground: TournamentBackground = {
  tournamentId: 42,
  skinId: 2,
  skinName: "Misty Arena",
  assetKey: "misty-arena",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/tournaments/42/cosmetics", {
    method: "POST",
    body: form,
  });
}

describe("tournaments.$id.cosmetics loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns skins and background", async () => {
    mockList.mockResolvedValue([fakeSkin]);
    mockGetBackground.mockResolvedValue(fakeBackground);
    const { loader } = await import("~/routes/tournaments.$id.cosmetics");
    const data = await loader({
      params: { id: "42" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(mockList).toHaveBeenCalledOnce();
    expect(mockGetBackground).toHaveBeenCalledWith(42);
    expect(data.skins).toEqual([fakeSkin]);
    expect(data.background).toEqual(fakeBackground);
  });
});

describe("tournaments.$id.cosmetics action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls setTournamentBackground when intent is setBackground", async () => {
    mockSetBackground.mockResolvedValue(fakeBackground);
    const { action } = await import("~/routes/tournaments.$id.cosmetics");
    const request = makePostRequest({ intent: "setBackground", skinId: "2" });
    await action({ request, params: { id: "42" }, context: {} });
    expect(mockSetBackground).toHaveBeenCalledWith(42, { skinId: 2 });
  });
});
