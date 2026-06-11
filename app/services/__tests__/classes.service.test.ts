import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import { getClass, getClassSkills, getSkill, listClasses } from "~/services/classes.service";
import type { ChampionClass, Skill } from "~/types/combat";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeClass: ChampionClass = {
  id: 1,
  name: "Guerrier",
  description: "Maître du combat rapproché.",
  skillCount: 4,
};

const fakeSkill: Skill = {
  id: 10,
  classId: 1,
  name: "Frappe lourde",
  category: "ATTACK",
  power: 25,
  duration: 0,
  auraEffect: null,
  description: "Une attaque puissante.",
};

describe("classes.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listClasses", () => {
    it("calls GET /api/classes and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeClass]);
      const result = await listClasses();
      expect(mockApiFetch).toHaveBeenCalledWith("/api/classes");
      expect(result).toEqual([fakeClass]);
    });
  });

  describe("getClass", () => {
    it("calls GET /api/classes/:id", async () => {
      mockApiFetch.mockResolvedValue(fakeClass);
      const result = await getClass(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/classes/1");
      expect(result).toEqual(fakeClass);
    });
  });

  describe("getClassSkills", () => {
    it("calls GET /api/classes/:id/skills", async () => {
      mockApiFetch.mockResolvedValue([fakeSkill]);
      const result = await getClassSkills(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/classes/1/skills");
      expect(result).toEqual([fakeSkill]);
    });
  });

  describe("getSkill", () => {
    it("calls GET /api/skills/:id", async () => {
      mockApiFetch.mockResolvedValue(fakeSkill);
      const result = await getSkill(10);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/skills/10");
      expect(result).toEqual(fakeSkill);
    });
  });
});
