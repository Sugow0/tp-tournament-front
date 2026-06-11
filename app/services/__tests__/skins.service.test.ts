import { beforeEach, describe, expect, it, vi } from "vitest";
import * as http from "~/lib/http";
import {
  createSkin,
  deactivateSkin,
  equipPlayerSkin,
  getPlayerLoadout,
  getSkin,
  getTournamentBackground,
  listSkins,
  setTournamentBackground,
} from "~/services/skins.service";
import type { PlayerLoadout, Skin, TournamentBackground } from "~/types/skin";

vi.mock("~/lib/http", () => ({ apiFetch: vi.fn() }));
const mockApiFetch = vi.mocked(http.apiFetch);

const fakeSkin: Skin = {
  id: 1,
  category: "PLAYER",
  name: "Dragon Knight",
  assetKey: "dragon-knight",
  isPremium: true,
  isActive: true,
  createdAt: "2026-01-01T00:00:00Z",
};

const fakeLoadout: PlayerLoadout = {
  playerId: 7,
  skinId: 1,
  skinName: "Dragon Knight",
  assetKey: "dragon-knight",
};

const fakeBackground: TournamentBackground = {
  tournamentId: 42,
  skinId: 2,
  skinName: "Misty Arena",
  assetKey: "misty-arena",
};

describe("skins.service", () => {
  beforeEach(() => mockApiFetch.mockReset());

  describe("listSkins", () => {
    it("calls GET /api/skins and returns array", async () => {
      mockApiFetch.mockResolvedValue([fakeSkin]);
      const result = await listSkins();
      expect(mockApiFetch).toHaveBeenCalledWith("/api/skins");
      expect(result).toEqual([fakeSkin]);
    });
  });

  describe("getSkin", () => {
    it("calls GET /api/skins/:id", async () => {
      mockApiFetch.mockResolvedValue(fakeSkin);
      const result = await getSkin(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/skins/1");
      expect(result).toEqual(fakeSkin);
    });
  });

  describe("createSkin", () => {
    it("calls POST /api/skins with payload", async () => {
      mockApiFetch.mockResolvedValue(fakeSkin);
      const payload = {
        category: "PLAYER" as const,
        name: "Dragon Knight",
        assetKey: "dragon-knight",
        isPremium: true,
      };
      const result = await createSkin(payload);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/skins", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      expect(result).toEqual(fakeSkin);
    });
  });

  describe("deactivateSkin", () => {
    it("calls DELETE /api/skins/:id", async () => {
      mockApiFetch.mockResolvedValue(undefined);
      await deactivateSkin(1);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/skins/1", { method: "DELETE" });
    });
  });

  describe("equipPlayerSkin", () => {
    it("calls POST /api/players/:playerId/skin with skinId payload", async () => {
      mockApiFetch.mockResolvedValue(fakeLoadout);
      const result = await equipPlayerSkin(7, { skinId: 1 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/players/7/skin", {
        method: "POST",
        body: JSON.stringify({ skinId: 1 }),
      });
      expect(result).toEqual(fakeLoadout);
    });
  });

  describe("getPlayerLoadout", () => {
    it("calls GET /api/players/:playerId/skin", async () => {
      mockApiFetch.mockResolvedValue(fakeLoadout);
      const result = await getPlayerLoadout(7);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/players/7/skin");
      expect(result).toEqual(fakeLoadout);
    });
  });

  describe("setTournamentBackground", () => {
    it("calls POST /api/tournaments/:tournamentId/background with skinId payload", async () => {
      mockApiFetch.mockResolvedValue(fakeBackground);
      const result = await setTournamentBackground(42, { skinId: 2 });
      expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/42/background", {
        method: "POST",
        body: JSON.stringify({ skinId: 2 }),
      });
      expect(result).toEqual(fakeBackground);
    });
  });

  describe("getTournamentBackground", () => {
    it("calls GET /api/tournaments/:tournamentId/background", async () => {
      mockApiFetch.mockResolvedValue(fakeBackground);
      const result = await getTournamentBackground(42);
      expect(mockApiFetch).toHaveBeenCalledWith("/api/tournaments/42/background");
      expect(result).toEqual(fakeBackground);
    });
  });
});
