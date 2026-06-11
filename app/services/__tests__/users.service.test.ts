import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import { listUsers } from "~/services/users.service";
import type { User } from "~/types/friend";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeUser: User = { id: 1, email: "knight@avalon.io" };

describe("users.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listUsers", () => {
    it("calls GET /api/users and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeUser]);
      const result = await listUsers();
      expect(mockApiFetch).toHaveBeenCalledWith("/api/users");
      expect(result).toEqual([fakeUser]);
    });
  });
});
