import { apiFetch } from "~/lib/http";
import type { User } from "~/types/friend";

export function listUsers(): Promise<User[]> {
  return apiFetch("/api/users");
}
