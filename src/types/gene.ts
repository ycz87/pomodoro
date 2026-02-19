import type { GalaxyId, VarietyId, Rarity } from './farm';

export interface GeneFragment {
  id: string; // 唯一 ID（用 crypto.randomUUID() 或 Date.now() + random）
  galaxyId: GalaxyId; // 归属星系
  varietyId: VarietyId; // 来源品种
  rarity: Rarity; // 来源品种稀有度
  obtainedAt: string; // 获得时间 ISO date string
}

export interface FusionResult {
  success: boolean;
  successRate: number;
  seedVarietyId?: VarietyId;
  returnedGene?: GeneFragment;
}

export interface GeneInventory {
  fragments: GeneFragment[];
}

export const DEFAULT_GENE_INVENTORY: GeneInventory = {
  fragments: [],
};
