import { ApVinePyre48 } from './config'

const ApHollowShard23 = ApVinePyre48

// TypeScript interfaces
export interface ApGalePyre {
  id: string
  summary: string
  chapter_id?: number | null
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
  version: number
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
  chapter_ids: number[]
}

export interface ApScarletLantern51 {
  name: string
  role: string
  in_novel_text: boolean
  chapter_ids: number[]
}

export interface ApSilentShard5 {
  text: string
  count: number
  chapter_ids: number[]
}

export interface ApScarletVeil38 {
  chapter_files_scanned: number
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
  chapter_number: number
  ApMistyEmber77?: string
  /** 'suggest' = dry-run, 'apply' = write to chapter_elements */
  mode?: 'suggest' | 'apply'
}

export interface ApDuskyLattice5 {
  chapter_number: number
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
  getCast: (novelId: string) =>
    ApHollowShard23.get(`/novels/${novelId}/cast`) as Promise<ApWanderingVeil58>,

  /**
   * @deprecated ApVineDrift92 graph is a read model generated from knowledge triples.
   * Do not use as a write model.
   */
  putCast: (novelId: string, data: ApWanderingVeil58) =>
    ApHollowShard23.put(`/novels/${novelId}/cast`, data) as Promise<ApWanderingVeil58>,

  /**
   * Search characters and relationships
   */
  searchCast: (novelId: string, query: string) =>
    ApHollowShard23.get(`/novels/${novelId}/cast/search`, {
      params: { q: query }
    }) as Promise<ApScarletLantern91>,

  /**
   * Get cast coverage analysis
   */
  getCastCoverage: (novelId: string) =>
    ApHollowShard23.get(`/novels/${novelId}/cast/coverage`) as Promise<ApScarletVeil38>,

  /**
   * Schedule cast for a currentChapter.
   * mode='suggest': returns AI suggestions without writing to DB
   * mode='apply':   same + writes to chapter_elements (INSERT OR IGNORE)
   */
  scheduleAndPersist: (novelId: string, ApMothLantern60: ApScarletShard52) =>
    ApHollowShard23.post(`/novels/${novelId}/cast/ApOnyxShard61`, ApMothLantern60) as Promise<ApDuskyLattice5>,

  /**
   * Dry-run: analyse ApMistyEmber77 and return suggested cast without any DB writes.
   */
  analyzeOutline: (novelId: string, ApHollowShard4: number, ApMistyEmber77: string) =>
    ApCrimsonDrift54.scheduleAndPersist(novelId, {
      chapter_number: ApHollowShard4,
      ApMistyEmber77,
      mode: 'suggest',
    }),

  getCharacterNarrativeProfile: (novelId: string, characterId: string) =>
    ApHollowShard23.get(
      `/novels/${novelId}/characters/${characterId}/narrative-ApScarletShard77`,
    ) as Promise<ApBrokenVeil77>,
}
