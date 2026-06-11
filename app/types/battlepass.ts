export interface Battlepass {
  id: number;
  seasonId: number;
  totalTiers: number;
  hasPremiumTrack: boolean;
}

export interface BattlepassTier {
  id: number;
  battlepassId: number;
  tierNumber: number;
  xpRequired: number;
  isPremium: boolean;
  rewardType: string;
  rewardData: string;
}

export interface PlayerBattlepassProgress {
  id: number;
  playerId: number;
  battlepassId: number;
  currentXp: number;
  currentTier: number;
  isPremiumUnlocked: boolean;
}

export interface CreateBattlepassPayload {
  seasonId: number;
  totalTiers: number;
  hasPremiumTrack: boolean;
}

export interface AddTierPayload {
  tierNumber: number;
  xpRequired: number;
  isPremium: boolean;
  rewardType: string;
  rewardData: string;
}

export interface AddXpPayload {
  xpAmount: number;
}
