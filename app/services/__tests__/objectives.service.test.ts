import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  createObjective,
  getObjective,
  getPlayerCompletions,
  getPlayerProgress,
  listSeasonObjectives,
  updatePlayerProgress,
} from "~/services/objectives.service";
import type {
  Objective,
  PlayerObjectiveCompletion,
  PlayerObjectiveProgress,
} from "~/types/objective";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

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

const fakeProgress: PlayerObjectiveProgress = {
  objectiveId: 1,
  playerId: 3,
  currentValue: 2,
  isCompleted: false,
  completedAt: null,
  periodKey: "2026-06-11",
};

const fakeCompletion: PlayerObjectiveCompletion = {
  id: 10,
  playerId: 3,
  objectiveId: 1,
  completedAt: "2026-06-11T00:00:00Z",
  xpAwarded: 100,
  periodKey: "2026-06-11",
};

describe("objectives.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  it("createObjective calls POST /api/objectives with payload", async () => {
    mockApiFetch.mockResolvedValue(fakeObjective);
    const payload = {
      seasonId: 7,
      name: "Win 5 duels",
      description: "Remporter 5 duels",
      objectiveType: "WIN_DUELS",
      targetValue: 5,
      xpReward: 100,
      resetType: "DAILY",
    };
    const result = await createObjective(payload);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/objectives", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    expect(result).toEqual(fakeObjective);
  });

  it("getObjective calls GET /api/objectives/:id", async () => {
    mockApiFetch.mockResolvedValue(fakeObjective);
    const result = await getObjective(1);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/objectives/1");
    expect(result).toEqual(fakeObjective);
  });

  it("listSeasonObjectives calls GET /api/objectives/season/:seasonId", async () => {
    mockApiFetch.mockResolvedValue([fakeObjective]);
    const result = await listSeasonObjectives(7);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/objectives/season/7");
    expect(result).toEqual([fakeObjective]);
  });

  it("getPlayerProgress calls GET /api/objectives/:id/players/:playerId/progress", async () => {
    mockApiFetch.mockResolvedValue(fakeProgress);
    const result = await getPlayerProgress(1, 3);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/objectives/1/players/3/progress");
    expect(result).toEqual(fakeProgress);
  });

  it("getPlayerCompletions calls GET /api/objectives/:id/players/:playerId/completions", async () => {
    mockApiFetch.mockResolvedValue([fakeCompletion]);
    const result = await getPlayerCompletions(1, 3);
    expect(mockApiFetch).toHaveBeenCalledWith("/api/objectives/1/players/3/completions");
    expect(result).toEqual([fakeCompletion]);
  });

  it("updatePlayerProgress calls PATCH /api/objectives/:id/players/:playerId/progress with body", async () => {
    mockApiFetch.mockResolvedValue({ ...fakeProgress, currentValue: 3 });
    const result = await updatePlayerProgress(1, 3, { newValue: 3, periodKey: "2026-06-11" });
    expect(mockApiFetch).toHaveBeenCalledWith("/api/objectives/1/players/3/progress", {
      method: "PATCH",
      body: JSON.stringify({ newValue: 3, periodKey: "2026-06-11" }),
    });
    expect(result.currentValue).toBe(3);
  });
});
