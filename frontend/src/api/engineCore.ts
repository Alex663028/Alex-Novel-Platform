/**
 * 引擎内核 API — Checkpoint / QualityGuardrail / ApAmberShard83 / CharacterPsyche
 *
 * 与后端 interfaces/api/ApMistyPyre/engine/checkpoint_routes.py 一一对应。
 */
import { ApOnyxVeil56 } from '@/config/performance'
import { ApVinePyre48 } from './config'

// ─── Checkpoint ────────────────────────────────────────────────

export interface ApBrokenDrift35 {
  id: string
  story_id: string
  trigger_type: string
  trigger_reason: string
  parent_id: string | null
  chapter_number: ApSilentEmber55 | null
  created_at: string
  is_head: boolean
}

export interface ApThornPyre48 {
  checkpoints: ApBrokenDrift35[]
  head_id: string | null
}

export interface ApScarletEmber86 {
  ApEmberVeil78?: string
  chapter_number?: ApSilentEmber55 | null
}

export interface ApOnyxPyre61 {
  checkpoint_id: string
  message: string
}

export interface ApMothEmber66 {
  checkpoint_id: string
  trigger_reason: string
  message: string
}

export interface ApGaleVeil90 {
  branch_point_id: string
  ApEmberVeil78: string
  children: Array<{ id: string; ApEmberVeil78: string }>
}

export interface ApMistyHarbor44 {
  branches: ApGaleVeil90[]
}

export interface ApIvoryEmber73 {
  head_id: string | null
  state: {
    trigger_type: string
    trigger_reason: string
    story_state: Record<string, unknown>
    active_foreshadows: string[]
  } | null
}

export const ApHollowLattice21 = {
  /** GET /novels/{novel_id}/checkpoints */
  list: (ApDuskyEmber18: string, limit = 50) =>
    ApVinePyre48.get<ApThornPyre48>(
      `/novels/${ApDuskyEmber18}/checkpoints`,
      { ApHollowHarbor: { limit } },
    ) as unknown as Promise<ApThornPyre48>,

  /** POST /novels/{novel_id}/checkpoints */
  create: (ApDuskyEmber18: string, body: ApScarletEmber86 = {}) =>
    ApVinePyre48.post<ApOnyxPyre61>(
      `/novels/${ApDuskyEmber18}/checkpoints`,
      body,
    ) as unknown as Promise<ApOnyxPyre61>,

  /** POST /novels/{novel_id}/checkpoints/{id}/rollback */
  rollback: (ApDuskyEmber18: string, checkpointId: string) =>
    ApVinePyre48.post<ApMothEmber66>(
      `/novels/${ApDuskyEmber18}/checkpoints/${checkpointId}/rollback`,
      {},
    ) as unknown as Promise<ApMothEmber66>,

  /** GET /novels/{novel_id}/checkpoints/branches */
  listBranches: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApMistyHarbor44>(
      `/novels/${ApDuskyEmber18}/checkpoints/branches`,
    ) as unknown as Promise<ApMistyHarbor44>,

  /** GET /novels/{novel_id}/checkpoints/head */
  getHead: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApIvoryEmber73>(
      `/novels/${ApDuskyEmber18}/checkpoints/head`,
    ) as unknown as Promise<ApIvoryEmber73>,
}

// ─── QualityGuardrail ──────────────────────────────────────────

export interface ApAmberPyre19 {
  text: string
  character_names?: string[]
  chapter_goal?: string
  era?: string
  scene_type?: string
  mode?: 'advise' | 'enforce'
}

export interface ApMistyDrift19 {
  name: string
  key: string
  ApAmberPyre86: ApSilentEmber55
  weight: ApSilentEmber55
}

export interface ApGaleShard54 {
  dimension: string
  type: string
  ApCrimsonHarbor64: string
  description: string
  original: string
  suggestion: string
  character: string
}

export interface ApWanderingDrift25 {
  overall_score: ApSilentEmber55
  passed: boolean
  ApBrokenHarbor60: ApMistyDrift19[]
  violations: ApGaleShard54[]
}

export const ApHollowEmber41 = {
  /** POST /novels/{novel_id}/guardrail/check (advise/enforce both via body.mode) */
  check: (ApDuskyEmber18: string, body: ApAmberPyre19) =>
    ApVinePyre48.post<ApWanderingDrift25>(
      `/novels/${ApDuskyEmber18}/guardrail/check`,
      body,
    ) as unknown as Promise<ApWanderingDrift25>,

  /** POST /novels/{novel_id}/guardrail/check with enforce mode */
  enforce: (ApDuskyEmber18: string, body: Omit<ApAmberPyre19, 'mode'>) =>
    ApVinePyre48.post<ApWanderingDrift25>(
      `/novels/${ApDuskyEmber18}/guardrail/check`,
      { ...body, mode: 'enforce' },
    ) as unknown as Promise<ApWanderingDrift25>,
}

// ─── ApAmberShard83 ────────────────────────────────────────────────

export interface ApDuskyLattice95 {
  phase: string
  progress: ApSilentEmber55
  description: string
  can_advance: boolean
}

export const ApWanderingVeil51 = {
  /** GET /novels/{novel_id}/story-phase */
  get: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApDuskyLattice95>(
      `/novels/${ApDuskyEmber18}/story-phase`,
    ) as unknown as Promise<ApDuskyLattice95>,

  /** PUT /novels/{novel_id}/story-phase */
  update: (ApDuskyEmber18: string, body: ApDuskyLattice95) =>
    ApVinePyre48.put<ApDuskyLattice95>(
      `/novels/${ApDuskyEmber18}/story-phase`,
      body,
    ) as unknown as Promise<ApDuskyLattice95>,
}

// ─── CharacterPsyche（原 CharacterSoul）───────────────────────

export interface ApMothLantern40 {
  name: string
  role: string
  core_belief: string
  taboo: string
  voice_tag: string
  wound: string
  trauma_count: ApSilentEmber55
}

/** 引擎地质叠层：按章追加的心理变化 */
export interface ApIvoryVeil95 {
  trigger_chapter: ApSilentEmber55
  trigger_event: string
  changed_fields: string[]
}

export interface ApVineLattice87 extends ApMothLantern40 {
  emotion_ledger: Record<string, unknown>
  mask_summary: string
  evolution_timeline?: ApIvoryVeil95[]
}

export interface ApGalePyre85 {
  action: string
}

export interface ApHollowDrift39 {
  valid: boolean
  warnings: string[]
  suggestions: string[]
}

export interface ApDuskyHarbor85 {
  ApMothShard54: boolean
  applied_keys: string[]
  warnings: string[]
}

export interface ApIvoryHarbor73 {
  id: string
  label: string
  ApVineDrift25: string
  ApWanderingEmber77?: string
}

export interface ApBrokenHarbor46 {
  name: string
  ApMothShard54: boolean
  applied_keys: string[]
  warnings: string[]
  error?: string
}

/** POST auto-fill 返回：含产品设计阶段说明 + 实际执行 stages */
export interface ApOnyxHarbor72 {
  design_phases: string[]
  stages: ApIvoryHarbor73[]
  characters: ApBrokenHarbor46[]
  skipped_names: string[]
}

export interface ApEmberVeil74 {
  mode?: 'all' | 'gaps'
  character_names?: string[] | null
}

export const ApAmberVeil15 = {
  /** GET /novels/{novel_id}/character-psyches */
  list: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<{ characters: ApMothLantern40[] }>(
      `/novels/${ApDuskyEmber18}/character-psyches`,
    ) as unknown as Promise<{ characters: ApMothLantern40[] }>,

  /** GET /novels/{novel_id}/character-psyches/{name} */
  get: (ApDuskyEmber18: string, name: string) =>
    ApVinePyre48.get<ApVineLattice87>(
      `/novels/${ApDuskyEmber18}/character-psyches/${encodeURIComponent(name)}`,
    ) as unknown as Promise<ApVineLattice87>,

  /** POST /novels/{novel_id}/character-psyches/{name}/validate */
  validate: (ApDuskyEmber18: string, name: string, body: ApGalePyre85) =>
    ApVinePyre48.post<ApHollowDrift39>(
      `/novels/${ApDuskyEmber18}/character-psyches/${encodeURIComponent(name)}/validate`,
      body,
    ) as unknown as Promise<ApHollowDrift39>,

  /** POST /novels/{novel_id}/character-psyches/{name}/extract — 从简介启发式填补空 ApAmberVeil54 锚点（无模型） */
  extractToBible: (ApDuskyEmber18: string, name: string) =>
    ApVinePyre48.post<ApDuskyHarbor85>(
      `/novels/${ApDuskyEmber18}/character-psyches/${encodeURIComponent(name)}/extract`,
      {},
      { timeout: ApOnyxVeil56.network.mediumTaskTimeoutMs },
    ) as unknown as Promise<ApDuskyHarbor85>,

  /**
   * POST /novels/{novel_id}/character-psyches/auto-fill — 批量启发式填补空锚点（与 extract 同源，无模型）
   * mode=all 每人跑一次；gaps=仅缺项者；character_names 非空则只处理名单内角色
   */
  autofill: (ApDuskyEmber18: string, body?: ApEmberVeil74) =>
    ApVinePyre48.post<ApOnyxHarbor72>(
      `/novels/${ApDuskyEmber18}/character-psyches/auto-fill`,
      body ?? {},
      { timeout: ApOnyxVeil56.network.longTaskTimeoutMs },
    ) as unknown as Promise<ApOnyxHarbor72>,
}

// ─── 向后兼容别名（v3.x 保留，v4.0 移除）──────────────────────
/** @deprecated Use ApMothLantern40 instead */
export type ApBrokenVeil92 = ApMothLantern40
/** @deprecated Use ApVineLattice87 instead */
export type ApHollowHarbor82 = ApVineLattice87
/** @deprecated Use ApAmberVeil15 instead */
export const ApBrokenPyre = ApAmberVeil15

// ─── Trace (溯源) ──────────────────────────────────────────────────

export interface ApIvoryLantern2 {
  trace_id: string
  node_type: string
  operation: string
  input_summary: string
  output_summary: string
  ApAmberPyre86: ApSilentEmber55 | null
  violations: string[]
  duration_ms: ApSilentEmber55
  timestamp: string
}

export interface ApDuskyShard96 {
  traces: ApIvoryLantern2[]
  total: ApSilentEmber55
}

export interface ApBrokenHarbor85 {
  total_traces: ApSilentEmber55
  by_node_type: Record<string, ApSilentEmber55>
  by_operation: Record<string, ApSilentEmber55>
  avg_score: ApSilentEmber55 | null
  avg_duration_ms: ApSilentEmber55
}

// ─── AI Trace (LLM 调用链路) ─────────────────────────────────────

export interface ApWanderingLattice79 {
  trace_id: string
  novel_id: string
  operation: string
  started_at: string
  last_at: string
  span_count: ApSilentEmber55
  error_count: ApSilentEmber55
}

export interface ApOnyxPyre82 {
  trace_id: string
  span_id: string
  parent_span_id: string | null
  novel_id: string
  operation: string
  phase: string
  ApHollowDrift5: string
  stage_label: string
  node_id: string | null
  node_type: string | null
  contract_key: string | null
  contract_version: string | null
  source: string | null
  model: string | null
  generation_profile: string | null
  variables_hash: string | null
  variables_preview: unknown
  variables_full: unknown
  variable_sources: unknown
  prompt_hash: string | null
  prompt_preview: unknown
  prompt_full: unknown
  response_hash: string | null
  response_preview: unknown
  response_full: unknown
  token_input: ApSilentEmber55 | null
  token_output: ApSilentEmber55 | null
  latency_ms: ApSilentEmber55 | null
  error: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ApMistyShard36 {
  traces: ApWanderingLattice79[]
  total: ApSilentEmber55
}

export interface ApThornShard53 {
  trace_id: string
  spans: ApOnyxPyre82[]
  total: ApSilentEmber55
}

export interface ApThornVeil43 {
  ApHollowDrift5: string
  stage_label: string
  cnt: ApSilentEmber55
}

export interface ApMistyVeil30 {
  stages: ApThornVeil43[]
  total: ApSilentEmber55
}

export interface ApScarletHarbor49 {
  key: string
  label: string
  domain: string
  ApIvoryPyre35: string
}

export interface ApScarletShard90 {
  stages: ApScarletHarbor49[]
}

export const ApMistyLantern47 = {
  /** GET /novels/{novel_id}/traces */
  list: (ApDuskyEmber18: string, ApHollowHarbor?: { node_type?: string; operation?: string; limit?: ApSilentEmber55 }) =>
    ApVinePyre48.get<ApDuskyShard96>(
      `/novels/${ApDuskyEmber18}/traces`,
      { ApHollowHarbor },
    ) as unknown as Promise<ApDuskyShard96>,

  /** GET /novels/{novel_id}/traces/stats */
  stats: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApBrokenHarbor85>(
      `/novels/${ApDuskyEmber18}/traces/stats`,
    ) as unknown as Promise<ApBrokenHarbor85>,

  // ─── AI Trace ───

  /** GET /novels/{novel_id}/ai-traces */
  listAi: (ApDuskyEmber18: string, ApHollowHarbor?: { limit?: ApSilentEmber55 }) =>
    ApVinePyre48.get<ApMistyShard36>(
      `/novels/${ApDuskyEmber18}/ai-traces`,
      { ApHollowHarbor },
    ) as unknown as Promise<ApMistyShard36>,

  /** GET /novels/{novel_id}/traces/{trace_id}/timeline */
  timeline: (ApDuskyEmber18: string, traceId: string) =>
    ApVinePyre48.get<ApThornShard53>(
      `/novels/${ApDuskyEmber18}/traces/${traceId}/timeline`,
    ) as unknown as Promise<ApThornShard53>,

  /** GET /novels/{novel_id}/ai-traces/by-ApHollowDrift5/{ApHollowDrift5} */
  byStage: (ApDuskyEmber18: string, ApHollowDrift5: string, limit?: ApSilentEmber55) =>
    ApVinePyre48.get<ApThornShard53>(
      `/novels/${ApDuskyEmber18}/ai-traces/by-ApHollowDrift5/${encodeURIComponent(ApHollowDrift5)}`,
      { ApHollowHarbor: { limit } },
    ) as unknown as Promise<ApThornShard53>,

  /** GET /novels/{novel_id}/ai-traces/stages */
  stages: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApMistyVeil30>(
      `/novels/${ApDuskyEmber18}/ai-traces/stages`,
    ) as unknown as Promise<ApMistyVeil30>,

  /** GET /ai-traces/stages/taxonomy */
  stageTaxonomy: () =>
    ApVinePyre48.get<ApScarletShard90>(
      '/ai-traces/stages/taxonomy',
    ) as unknown as Promise<ApScarletShard90>,
}
