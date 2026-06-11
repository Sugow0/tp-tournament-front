import { apiFetch } from "~/lib/http";
import type { AddFriendPayload, User } from "~/types/friend";

export function listFriends(userId: number): Promise<User[]> {
  return apiFetch(`/api/users/${userId}/friends`);
}

export function addFriend(userId: number, payload: AddFriendPayload): Promise<void> {
  return apiFetch(`/api/users/${userId}/friends`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function removeFriend(userId: number, friendUserId: number): Promise<void> {
  return apiFetch(`/api/users/${userId}/friends/${friendUserId}`, {
    method: "DELETE",
  });
}
