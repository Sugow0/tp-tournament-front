import { beforeEach, describe, expect, it, vi } from "vitest";
import * as rewardService from "~/services/season-rewards.service";
import * as seasonService from "~/services/seasons.service";
import type { Season, SeasonReward } from "~/types/season";

vi.mock("~/services/seasons.service");
vi.mock("~/services/season-rewards.service");
const mockGet = vi.mocked(seasonService.getSeason);
const mockUpdateStatus = vi.mocked(seasonService.updateSeasonStatus);
const mockListRewards = vi.mocked(rewardService.listRewards);
const mockCreateReward = vi.mocked(rewardService.createReward);
const mockDistribute = vi.mocked(rewardService.distributeRewards);

const fakeSeason: Season = {
  id: 7,
  name: "Saison Estivale",
  status: "ACTIVE",
  startDate: "2026-06-01T00:00:00Z",
  endDate: "2026-08-31T00:00:00Z",
  createdAt: "2026-05-01T00:00:00Z",
};

const fakeReward: SeasonReward = {
  id: 1,
  seasonId: 7,
  rankMin: 1,
  rankMax: 3,
  rewardType: "SKIN",
  rewardData: "dragon-knight",
  label: "Top 3",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/seasons/7", { method: "POST", body: form });
}

describe("seasons.$id loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns season and rewards", async () => {
    mockGet.mockResolvedValue(fakeSeason);
    mockListRewards.mockResolvedValue([fakeReward]);
    const { loader } = await import("~/routes/seasons.$id");
    const request = new Request("http://localhost/seasons/7");
    const data = await loader({ params: { id: "7" }, request, context: {} });
    expect(mockGet).toHaveBeenCalledWith(7);
    expect(mockListRewards).toHaveBeenCalledWith(7);
    expect(data.season).toEqual(fakeSeason);
    expect(data.rewards).toEqual([fakeReward]);
  });
});

describe("seasons.$id action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("advances status to ACTIVE when current is UPCOMING", async () => {
    mockGet.mockResolvedValue({ ...fakeSeason, status: "UPCOMING" });
    mockUpdateStatus.mockResolvedValue({ ...fakeSeason, status: "ACTIVE" });
    const { action } = await import("~/routes/seasons.$id");
    await action({
      request: makePostRequest({ intent: "advanceStatus", status: "UPCOMING" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockUpdateStatus).toHaveBeenCalledWith(7, { status: "ACTIVE" });
  });

  it("advances status to ENDED when current is ACTIVE", async () => {
    mockUpdateStatus.mockResolvedValue({ ...fakeSeason, status: "ENDED" });
    const { action } = await import("~/routes/seasons.$id");
    await action({
      request: makePostRequest({ intent: "advanceStatus", status: "ACTIVE" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockUpdateStatus).toHaveBeenCalledWith(7, { status: "ENDED" });
  });

  it("calls createReward when intent is createReward", async () => {
    mockCreateReward.mockResolvedValue(fakeReward);
    const { action } = await import("~/routes/seasons.$id");
    await action({
      request: makePostRequest({
        intent: "createReward",
        rankMin: "1",
        rankMax: "3",
        rewardType: "SKIN",
        rewardData: "dragon-knight",
        label: "Top 3",
      }),
      params: { id: "7" },
      context: {},
    });
    expect(mockCreateReward).toHaveBeenCalledWith(7, {
      rankMin: 1,
      rankMax: 3,
      rewardType: "SKIN",
      rewardData: "dragon-knight",
      label: "Top 3",
    });
  });

  it("calls distributeRewards when intent is distribute", async () => {
    mockDistribute.mockResolvedValue([]);
    const { action } = await import("~/routes/seasons.$id");
    await action({
      request: makePostRequest({ intent: "distribute" }),
      params: { id: "7" },
      context: {},
    });
    expect(mockDistribute).toHaveBeenCalledWith(7);
  });
});
