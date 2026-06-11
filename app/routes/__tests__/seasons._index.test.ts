import { beforeEach, describe, expect, it, vi } from "vitest";
import * as seasonService from "~/services/seasons.service";
import type { Season } from "~/types/season";

vi.mock("~/services/seasons.service");
const mockList = vi.mocked(seasonService.listSeasons);
const mockCreate = vi.mocked(seasonService.createSeason);

const fakeSeason: Season = {
  id: 1,
  name: "Saison Hivernale",
  status: "UPCOMING",
  startDate: "2026-01-01T00:00:00Z",
  endDate: "2026-03-31T00:00:00Z",
  createdAt: "2025-12-01T00:00:00Z",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/seasons", { method: "POST", body: form });
}

describe("seasons._index loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls listSeasons and returns seasons", async () => {
    mockList.mockResolvedValue([fakeSeason]);
    const { loader } = await import("~/routes/seasons._index");
    const data = await loader();
    expect(mockList).toHaveBeenCalledOnce();
    expect(data.seasons).toEqual([fakeSeason]);
  });
});

describe("seasons._index action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls createSeason when intent is create", async () => {
    mockCreate.mockResolvedValue(fakeSeason);
    const { action } = await import("~/routes/seasons._index");
    const request = makePostRequest({
      intent: "create",
      name: "Saison Hivernale",
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-03-31T00:00:00Z",
    });
    await action({ request, params: {}, context: {} });
    expect(mockCreate).toHaveBeenCalledWith({
      name: "Saison Hivernale",
      startDate: "2026-01-01T00:00:00Z",
      endDate: "2026-03-31T00:00:00Z",
    });
  });
});
