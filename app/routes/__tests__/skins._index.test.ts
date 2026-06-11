import { beforeEach, describe, expect, it, vi } from "vitest";
import * as skinService from "~/services/skins.service";
import type { Skin } from "~/types/skin";

vi.mock("~/services/skins.service");
const mockList = vi.mocked(skinService.listSkins);
const mockCreate = vi.mocked(skinService.createSkin);
const mockDeactivate = vi.mocked(skinService.deactivateSkin);

const fakeSkin: Skin = {
  id: 1,
  category: "PLAYER",
  name: "Dragon Knight",
  assetKey: "dragon-knight",
  isPremium: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00Z",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/skins", { method: "POST", body: form });
}

describe("skins._index loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls listSkins and returns skins", async () => {
    mockList.mockResolvedValue([fakeSkin]);
    const { loader } = await import("~/routes/skins._index");
    const data = await loader();
    expect(mockList).toHaveBeenCalledOnce();
    expect(data.skins).toEqual([fakeSkin]);
  });
});

describe("skins._index action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls createSkin when intent is create", async () => {
    mockCreate.mockResolvedValue(fakeSkin);
    const { action } = await import("~/routes/skins._index");
    const request = makePostRequest({
      intent: "create",
      category: "PLAYER",
      name: "Dragon Knight",
      assetKey: "dragon-knight",
      isPremium: "on",
    });
    await action({ request, params: {}, context: {} });
    expect(mockCreate).toHaveBeenCalledWith({
      category: "PLAYER",
      name: "Dragon Knight",
      assetKey: "dragon-knight",
      isPremium: true,
    });
  });

  it("calls deactivateSkin when intent is deactivate", async () => {
    mockDeactivate.mockResolvedValue(undefined);
    const { action } = await import("~/routes/skins._index");
    const request = makePostRequest({ intent: "deactivate", skinId: "1" });
    await action({ request, params: {}, context: {} });
    expect(mockDeactivate).toHaveBeenCalledWith(1);
  });
});
