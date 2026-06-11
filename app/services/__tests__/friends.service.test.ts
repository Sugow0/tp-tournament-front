import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import { addFriend, listFriends, removeFriend } from "~/services/friends.service";
import type { User } from "~/types/friend";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeUser: User = { id: 2, email: "friend@avalon.io" };

describe("friends.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listFriends", () => {
    it("calls GET /api/users/:userId/friends", async () => {
      mockApiFetch.mockResolvedValue([fakeUser]);
      const result = await listFriends(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/users/1/friends");
      expect(result).toEqual([fakeUser]);
    });
  });

  describe("addFriend", () => {
    it("calls POST /api/users/:userId/friends with friendUserId body", async () => {
      mockApiFetch.mockResolvedValue(undefined);
      await addFriend(1, { friendUserId: 2 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/users/1/friends", {
        method: "POST",
        body: JSON.stringify({ friendUserId: 2 }),
      });
    });
  });

  describe("removeFriend", () => {
    it("calls DELETE /api/users/:userId/friends/:friendUserId", async () => {
      mockApiFetch.mockResolvedValue(undefined);
      await removeFriend(1, 2);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/users/1/friends/2", {
        method: "DELETE",
      });
    });
  });
});
