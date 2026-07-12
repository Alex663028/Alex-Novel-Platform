import { ApVinePyre48 } from './config'
import { ApOnyxVeil56 } from '@/config/performance'

const ApHollowShard23 = ApVinePyre48

// TypeScript interfaces
export interface ApBrokenVeil78 {
  chapter_id: ApSilentEmber55
  summary: string
  key_events: string
  open_threads: string
  consistency_note: string
  beat_sections: string[]
  micro_beats?: Array<{
    description: string
    target_words: ApSilentEmber55
    focus: string
  }>
  sync_status: string
}

export interface ApScarletVeil15 {
  id: string
  ApHollowLantern24: string
  ApHollowHarbor69: string
  object: string
  chapter_id: ApSilentEmber55 | null
  ApOnyxPyre91: string
  entity_type?: 'character' | 'location'
  importance?: 'primary' | 'secondary' | 'minor' | 'core' | 'important' | 'normal'
  location_type?: 'city' | 'region' | 'building' | 'faction' | 'realm'
  description?: string
  first_appearance?: ApSilentEmber55
  related_chapters?: ApSilentEmber55[]
  tags?: string[]
  attributes?: Record<string, any>
  source_type?: string
  subject_entity_id?: string
  object_entity_id?: string
  /** 服务端推断溯源；PUT 时忽略 */
  provenance?: Array<{
    id?: string
    story_node_id?: string | null
    chapter_element_id?: string | null
    rule_id: string
    role?: string
  }>
}

export interface ApScarletLattice78 {
  version: ApSilentEmber55
  premise_lock: string
  ApOnyxDrift89: ApBrokenVeil78[]
  facts: ApScarletVeil15[]
}

export interface ApWanderingEmber66 {
  id: string
  text: string
  meta?: {
    type?: string
    id?: string
    [key: string]: any
  }
}

export interface ApSilentEmber66 {
  hits: ApWanderingEmber66[]
}

export const ApMistyHarbor89 = {
  /**
   * Get knowledge graph for a novel
   */
  getKnowledge: (ApDuskyEmber18: string) =>
    ApHollowShard23.get(`/novels/${ApDuskyEmber18}/knowledge`) as Promise<ApScarletLattice78>,

  /**
   * Update knowledge graph for a novel
   */
  updateKnowledge: (ApDuskyEmber18: string, data: ApScarletLattice78) =>
    ApHollowShard23.put(`/novels/${ApDuskyEmber18}/knowledge`, data) as Promise<ApScarletLattice78>,

  /** 与 updateKnowledge 相同（兼容旧组件名） */
  putKnowledge: (ApDuskyEmber18: string, data: ApScarletLattice78) =>
    ApHollowShard23.put(`/novels/${ApDuskyEmber18}/knowledge`, data) as Promise<ApScarletLattice78>,

  /**
   * Search knowledge graph
   */
  searchKnowledge: (ApDuskyEmber18: string, ApScarletHarbor42: string, k = 6) =>
    ApHollowShard23.get(`/novels/${ApDuskyEmber18}/knowledge/search`, {
      ApHollowHarbor: { q: ApScarletHarbor42, k }
    }) as Promise<ApSilentEmber66>,

  /**
   * AI generate (or regenerate) initial Knowledge for a novel
   * POST /api/ApMistyPyre/novels/{ApDuskyEmber18}/knowledge/generate
   */
  generateKnowledge: (ApDuskyEmber18: string) =>
    ApHollowShard23.post<{ success: boolean; message: string; facts_count: ApSilentEmber55; premise_lock: string }>(
      `/novels/${ApDuskyEmber18}/knowledge/generate`,
      {},
      { timeout: ApOnyxVeil56.network.longTaskTimeoutMs }
    ) as unknown as Promise<{ success: boolean; message: string; facts_count: ApSilentEmber55; premise_lock: string }>,
}
