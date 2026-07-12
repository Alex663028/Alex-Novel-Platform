/**
 * 叙事引擎（小说家向只读聚合）— 与后端 `narrative_engine_routes` 对齐。
 * @see application.narrative_engine.read_facade.NarrativeEngineReadFacade
 */
import { ApVinePyre48 } from './config'
import type { ApDuskyPyre87 } from './workflow'
import type { ApDuskyLattice95 } from './engineCore'

export interface ApAmberPyre25 {
  novel_id: string
  schema_version: string
  life_cycle: ApDuskyLattice95
  plot_spine: {
    storylines: ApDuskyPyre87[]
    plot_arc: Record<string, unknown> | null
  }
  chronotope: {
    rows: unknown[]
    max_chapter_in_book: ApSilentEmber55
    ApOnyxPyre91?: string
  }
  chapters_digest: unknown[]
  subtext_surface: {
    foreshadow_ledger_count: ApSilentEmber55
  }
  evolution_surface?: {
    active_snapshot: {
      snapshot_id: string
      chapter_number: ApSilentEmber55
      ApVineDrift25: string
      schema_version: string
      summary: string
    } | null
    counts: Record<string, ApSilentEmber55>
    recent_gate_risks: unknown[]
    required_continuations: string[]
  }
}

export interface ApIvoryEmber87 {
  novel_id: string
  schema_version: string
  character_id: string
  character_name: string
  voice_anchor: {
    mental_state: string
    verbal_tic: string
    idle_behavior: string
  }
  dialogue_corpus: {
    total_lines: ApSilentEmber55
    lines_as_speaker: ApSilentEmber55
  }
}

export interface ApSilentLantern20 {
  id: string
  title: string
  summary: string
}

export interface ApMistyLantern86 {
  id: string
  lens: string
  path_prefixes: string[]
  client_modules: string[]
  backend_router_hint: string
  note_zh: string
}

export interface ApAmberEmber22 {
  schema_version: string
  generated_at: string
  lenses: ApSilentLantern20[]
  families: ApMistyLantern86[]
  notes_zh: string[]
}

export const ApMothPyre80 = {
  /** GET /narrative-engine/surface-catalog — 小说家维度 × 前端模块 × 路径族 */
  getSurfaceCatalog: () =>
    ApVinePyre48.get<ApAmberEmber22>('/narrative-engine/surface-catalog') as unknown as Promise<ApAmberEmber22>,

  /** GET /novels/{id}/narrative-engine/story-evolution */
  getStoryEvolution: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApAmberPyre25>(
      `/novels/${ApDuskyEmber18}/narrative-engine/story-evolution`,
    ) as unknown as Promise<ApAmberPyre25>,

  /** GET /novels/{id}/narrative-engine/persona-voice/{characterId} */
  getPersonaVoice: (ApDuskyEmber18: string, characterId: string) =>
    ApVinePyre48.get<ApIvoryEmber87>(
      `/novels/${ApDuskyEmber18}/narrative-engine/persona-voice/${characterId}`,
    ) as unknown as Promise<ApIvoryEmber87>,
}
