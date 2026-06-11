export type SkillCategory = "ATTACK" | "DEFEND" | "HEAL" | "AURA";

export type AuraEffect = "ATTACK_UP" | "ATTACK_DOWN" | "DEFENSE_UP" | "DEFENSE_DOWN" | null;

export type CombatStatus = "IN_PROGRESS" | "COMPLETED";

export interface Skill {
  id: number;
  classId: number;
  name: string;
  category: SkillCategory;
  power: number;
  duration: number;
  auraEffect: AuraEffect;
  description: string;
}

export interface ChampionClass {
  id: number;
  name: string;
  description: string;
  skillCount: number;
}

export interface CombatantSpec {
  name: string;
  classId: number;
  level: number;
}

export interface ActiveEffect {
  effectType: string;
  magnitude: number;
  remainingTurns: number;
}

export interface CombatantState {
  slot: 1 | 2;
  name: string;
  classId: number;
  level: number;
  maxHp: number;
  currentHp: number;
  hasSubmitted: boolean;
  effects: ActiveEffect[];
}

export interface CombatLogEntry {
  turn: number;
  message: string;
}

export interface Combat {
  id: number;
  status: CombatStatus;
  turn: number;
  winnerSlot: number | null;
  champion1: CombatantState;
  champion2: CombatantState;
  log: CombatLogEntry[];
  createdAt: string;
}
