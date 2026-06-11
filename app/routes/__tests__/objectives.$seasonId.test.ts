import { beforeEach, describe, expect, it, vi } from "vitest";
import * as objectivesService from "~/services/objectives.service";
import type { Objective } from "~/types/objective";

vi.mock("~/services/objectives.service");
const mockList = vi.mocked(objectivesService.listSeasonObjectives);

const fakeObjective: Objective = {
  id: 1,
  seasonId: 7,
  name: "Win 5 duels",
  description: "Remporter 5 duels",
  objectiveType: "WIN_DUELS",
  targetValue: 5,
  xpReward: 100,
  resetType: "DAILY",
};

describe("objectives.$seasonId loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls listSeasonObjectives with seasonId from params", async () => {
    mockList.mockResolvedValue([fakeObjective]);
    const { loader } = await import("~/routes/objectives.$seasonId");
    await loader({
      params: { seasonId: "7" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(mockList).toHaveBeenCalledWith(7);
  });

  it("returns objectives array", async () => {
    mockList.mockResolvedValue([fakeObjective]);
    const { loader } = await import("~/routes/objectives.$seasonId");
    const data = await loader({
      params: { seasonId: "7" },
      request: new Request("http://localhost"),
      context: {},
    });
    expect(data.objectives).toEqual([fakeObjective]);
  });
});
