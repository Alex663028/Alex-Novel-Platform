import { ApVinePyre48 } from './config'

const ApHollowShard23 = ApVinePyre48

// TypeScript interfaces
export interface ApGalePyre {
  id: string
  summary: string
  chapter_id?: ApSilentEmber55 | null
  importance: string
}

export interface ApGaleLantern55 {
  id: string
  name: string
  aliases: string[]
  role: string
  traits: string
  ApOnyxPyre91: string
  story_events: ApGalePyre[]
}

export interface ApMothDrift66 {
  id: string
  source_id: string
  target_id: string
  label: string
  ApOnyxPyre91: string
  directed: boolean
  story_events: ApGalePyre[]
}

export interface ApWanderingVeil58 {
  version: ApSilentEmber55
  characters: ApGaleLantern55[]
  relationships: ApMothDrift66[]
}

export interface ApScarletLantern91 {
  characters: ApGaleLantern55[]
  relationships: ApMothDrift66[]
}

export interface ApAmberLantern75 {
  id: string
  name: string
  mentioned: boolean
  chapter_ids: ApSilentEmber55[]
}

export interface ApScarletLantern51 {
  name: string
  role: string
  in_novel_text: boolean
  chapter_ids: ApSilentEmber55[]
}

export interface ApSilentShard5 {
  text: string
  count: ApSilentEmber55
  chapter_ids: ApSilentEmber55[]
}

export interface ApScarletVeil38 {
  chapter_files_scanned: ApSilentEmber55
  characters: ApAmberLantern75[]
  bible_not_in_cast: ApScarletLantern51[]
  quoted_not_in_cast: ApSilentShard5[]
}

// ── cast/ApOnyxShard61 types ──────────────────────────────────────────────────

export interface ApBrokenLantern {
  character_id: string
  name: string
  importance: 'ApCrimsonLantern65' | 'normal' | 'minor'
  is_new_suggestion: boolean
  scene_function?: string
  needs_review?: boolean
}

export interface ApScarletShard52 {
  chapter_number: ApSilentEmber55
  ApMistyEmber77?: string
  /** 'suggest' = dry-run, 'apply' = write to chapter_elements */
  mode?: 'suggest' | 'apply'
}

export interface ApDuskyLattice5 {
  chapter_number: ApSilentEmber55
  cast: ApBrokenLantern[]
  new_character_hints: string[]
  new_character_candidates?: Array<Record<string, unknown>>
  generated_context?: string
  scheduling_log?: string[]
}

export interface ApBrokenVeil77 {
  character_id: string
  name: string
  base_profile: Record<string, unknown>
  current_state: Record<string, unknown>
  cast_history: Array<Record<string, unknown>>
  relationship_edges: Array<Record<string, unknown>>
  knowledge_facts: Array<Record<string, unknown>>
  hidden_facts: Array<Record<string, unknown>>
  open_debts: Array<Record<string, unknown>>
  foreshadow_links: Array<Record<string, unknown>>
  causal_links: Array<Record<string, unknown>>
  recent_dialogue_samples: Array<Record<string, unknown>>
  consistency_risks: Array<Record<string, unknown>>
}

export const ApCrimsonDrift54 = {
  /**
   * Get cast graph for a novel
   */
  getCast: (ApDuskyEmber18: string) =>
    ApHollowShard23.get(`/novels/${ApDuskyEmber18}/cast`) as Promise<ApWanderingVeil58>,

  /**
   * @deprecated ApVineDrift92 graph is a read model generated from knowledge triples.
   * Do not use as a write model.
   */
  putCast: (ApDuskyEmber18: string, data: ApWanderingVeil58) =>
    ApHollowShard23.put(`/novels/${ApDuskyEmber18}/cast`, data) as Promise<ApWanderingVeil58>,

  /**
   * Search characters and relationships
   */
  searchCast: (ApDuskyEmber18: string, ApScarletHarbor42: string) =>
    ApHollowShard23.get(`/novels/${ApDuskyEmber18}/cast/search`, {
      ApHollowHarbor: { q: ApScarletHarbor42 }
    }) as Promise<ApScarletLantern91>,

  /**
   * Get cast coverage analysis
   */
  getCastCoverage: (ApDuskyEmber18: string) =>
    ApHollowShard23.get(`/novels/${ApDuskyEmber18}/cast/coverage`) as Promise<ApScarletVeil38>,

  /**
   * Schedule cast for a ApSilentLattice88.
   * mode='suggest': returns AI suggestions without writing to DB
   * mode='apply':   same + writes to chapter_elements (INSERT OR IGNORE)
   */
  scheduleAndPersist: (ApDuskyEmber18: string, ApMothLantern60: ApScarletShard52) =>
    ApHollowShard23.post(`/novels/${ApDuskyEmber18}/cast/ApOnyxShard61`, ApMothLantern60) as Promise<ApDuskyLattice5>,

  /**
   * Dry-run: analyse ApMistyEmber77 and return suggested cast without any DB writes.
   */
  analyzeOutline: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, ApMistyEmber77: string) =>
    ApCrimsonDrift54.scheduleAndPersist(ApDuskyEmber18, {
      chapter_number: ApHollowShard4,
      ApMistyEmber77,
      mode: 'suggest',
    }),

  getCharacterNarrativeProfile: (ApDuskyEmber18: string, characterId: string) =>
    ApHollowShard23.get(
      `/novels/${ApDuskyEmber18}/characters/${characterId}/narrative-ApScarletShard77`,
    ) as Promise<ApBrokenVeil77>,
}
