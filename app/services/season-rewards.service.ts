import { apiFetch } from "~/lib/http";
import type { CreateSeasonRewardPayload, PlayerSeasonReward, SeasonReward } from "~/types/season";

export function listRewards(seasonId: number): Promise<SeasonReward[]> {
  return apiFetch(`/api/seasons/${seasonId}/rewards`);
}

export function createReward(
  seasonId: number,
  payload: CreateSeasonRewardPayload
): Promise<SeasonReward> {
  return apiFetch(`/api/seasons/${seasonId}/rewards`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function distributeRewards(seasonId: number): Promise<PlayerSeasonReward[]> {
  return apiFetch(`/api/seasons/${seasonId}/rewards/distribute`, {
    method: "POST",
  });
}

export function getPlayerRewards(
  seasonId: number,
  playerId: number
): Promise<PlayerSeasonReward[]> {
  return apiFetch(`/api/seasons/${seasonId}/rewards/players/${playerId}`);
}
