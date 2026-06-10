import { beforeEach, describe, expect, it, vi } from "vitest";
import * as tournamentService from "~/services/tournaments.service";
import type { Tournament } from "~/types/tournament";

vi.mock("~/services/tournaments.service");
const mockGet = vi.mocked(tournamentService.getTournament);

const fakeTournament: Tournament = {
  id: 7,
  name: "Tournoi des Chevaliers",
  status: "IN_PROGRESS",
  createdAt: "2026-02-10T08:00:00Z",
};

describe("tournaments.$id loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("loads tournament by numeric id from params", async () => {
    mockGet.mockResolvedValue(fakeTournament);
    const { loader } = await import("~/routes/tournaments.$id");
    const request = new Request("http://localhost/tournaments/7");
    const data = await loader({ params: { id: "7" }, request, context: {} });
    expect(mockGet).toHaveBeenCalledWith(7);
    expect(data.tournament).toEqual(fakeTournament);
  });
});
