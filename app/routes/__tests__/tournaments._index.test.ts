import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError } from "~/lib/http";
import * as tournamentService from "~/services/tournaments.service";
import type { Tournament } from "~/types/tournament";

vi.mock("~/services/tournaments.service");
const mockList = vi.mocked(tournamentService.listTournaments);
const mockCreate = vi.mocked(tournamentService.createTournament);

const fakeTournament: Tournament = {
  id: 1,
  name: "Avalon Cup",
  status: "OPEN",
  createdAt: "2026-01-01T00:00:00Z",
};

function makePostRequest(fields: Record<string, string>) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) form.set(k, v);
  return new Request("http://localhost/tournaments", { method: "POST", body: form });
}

describe("tournaments._index loader", () => {
  beforeEach(() => vi.resetAllMocks());

  it("returns tournaments list from service", async () => {
    mockList.mockResolvedValue([fakeTournament]);
    const { loader } = await import("~/routes/tournaments._index");
    const data = await loader();
    expect(mockList).toHaveBeenCalledOnce();
    expect(data.tournaments).toEqual([fakeTournament]);
  });
});

describe("tournaments._index action", () => {
  beforeEach(() => vi.resetAllMocks());

  it("calls createTournament with name from form data", async () => {
    mockCreate.mockResolvedValue(fakeTournament);
    const { action } = await import("~/routes/tournaments._index");
    const request = makePostRequest({ name: "Avalon Cup" });
    await action({ request, params: {}, context: {} });
    expect(mockCreate).toHaveBeenCalledWith({ name: "Avalon Cup" });
  });

  it("redirects to tournament page after successful create", async () => {
    mockCreate.mockResolvedValue(fakeTournament);
    const { action } = await import("~/routes/tournaments._index");
    const request = makePostRequest({ name: "Avalon Cup" });
    const res = await action({ request, params: {}, context: {} });
    expect((res as Response).status).toBe(302);
  });

  it("returns error object when ApiError is thrown", async () => {
    mockCreate.mockRejectedValue(new ApiError(400, { message: "bad request" }));
    const { action } = await import("~/routes/tournaments._index");
    const request = makePostRequest({ name: "Bad" });
    const res = await action({ request, params: {}, context: {} });
    expect(res).toHaveProperty("error");
  });
});
