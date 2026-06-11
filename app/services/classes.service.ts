import { apiFetch } from "~/lib/http";
import type { ChampionClass, Skill } from "~/types/combat";

export function listClasses(): Promise<ChampionClass[]> {
  return apiFetch("/api/classes");
}

export function getClass(id: number): Promise<ChampionClass> {
  return apiFetch(`/api/classes/${id}`);
}

export function getClassSkills(id: number): Promise<Skill[]> {
  return apiFetch(`/api/classes/${id}/skills`);
}

export function getSkill(id: number): Promise<Skill> {
  return apiFetch(`/api/skills/${id}`);
}
