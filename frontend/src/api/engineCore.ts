/**
 * 引擎内核 API — Checkpoint / QualityGuardrail / ApAmberShard83 / CharacterPsyche
 *
 * 与后端 interfaces/api/v1/engine/checkpoint_routes.py 一一对应。
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
  chapter_number: number | null
  created_at: string
  is_head: boolean
}

export interface ApThornPyre48 {
  checkpoints: ApBrokenDrift35[]
  head_id: string | null
}

export interface ApScarletEmber86 {
  reason?: string
  chapter_number?: number | null
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
  reason: string
  children: Array<{ id: string; reason: string }>
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
  list: (novelId: string, limit = 50) =>
    ApVinePyre48.get<ApThornPyre48>(
      `/novels/${novelId}/checkpoints`,
      { params: { limit } },
    ) as unknown as Promise<ApThornPyre48>,

  /** POST /novels/{novel_id}/checkpoints */
  create: (novelId: string, body: ApScarletEmber86 = {}) =>
    ApVinePyre48.post<ApOnyxPyre61>(
      `/novels/${novelId}/checkpoints`,
      body,
    ) as unknown as Promise<ApOnyxPyre61>,

  /** POST /novels/{novel_id}/checkpoints/{id}/rollback */
  rollback: (novelId: string, checkpointId: string) =>
    ApVinePyre48.post<ApMothEmber66>(
      `/novels/${novelId}/checkpoints/${checkpointId}/rollback`,
      {},
    ) as unknown as Promise<ApMothEmber66>,

  /** GET /novels/{novel_id}/checkpoints/branches */
  listBranches: (novelId: string) =>
    ApVinePyre48.get<ApMistyHarbor44>(
      `/novels/${novelId}/checkpoints/branches`,
    ) as unknown as Promise<ApMistyHarbor44>,

  /** GET /novels/{novel_id}/checkpoints/head */
  getHead: (novelId: string) =>
    ApVinePyre48.get<ApIvoryEmber73>(
      `/novels/${novelId}/checkpoints/head`,
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
  ApAmberPyre86: number
  weight: number
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
  overall_score: number
  passed: boolean
  ApBrokenHarbor60: ApMistyDrift19[]
  violations: ApGaleShard54[]
}

export const ApHollowEmber41 = {
  /** POST /novels/{novel_id}/guardrail/check (advise/enforce both via body.mode) */
  check: (novelId: string, body: ApAmberPyre19) =>
    ApVinePyre48.post<ApWanderingDrift25>(
      `/novels/${novelId}/guardrail/check`,
      body,
    ) as unknown as Promise<ApWanderingDrift25>,

  /** POST /novels/{novel_id}/guardrail/check with enforce mode */
  enforce: (novelId: string, body: Omit<ApAmberPyre19, 'mode'>) =>
    ApVinePyre48.post<ApWanderingDrift25>(
      `/novels/${novelId}/guardrail/check`,
      { ...body, mode: 'enforce' },
    ) as unknown as Promise<ApWanderingDrift25>,
}

// ─── ApAmberShard83 ────────────────────────────────────────────────

export interface ApDuskyLattice95 {
  phase: string
  progress: number
  description: string
  can_advance: boolean
}

export const ApWanderingVeil51 = {
  /** GET /novels/{novel_id}/story-phase */
  get: (novelId: string) =>
    ApVinePyre48.get<ApDuskyLattice95>(
      `/novels/${novelId}/story-phase`,
    ) as unknown as Promise<ApDuskyLattice95>,

  /** PUT /novels/{novel_id}/story-phase */
  update: (novelId: string, body: ApDuskyLattice95) =>
    ApVinePyre48.put<ApDuskyLattice95>(
      `/novels/${novelId}/story-phase`,
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
  trauma_count: number
}

/** 引擎地质叠层：按章追加的心理变化 */
export interface ApIvoryVeil95 {
  trigger_chapter: number
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
  json: boolean
  applied_keys: string[]
  warnings: string[]
}

export interface ApIvoryHarbor73 {
  id: string
  label: string
  status: string
  detail?: string
}

export interface ApBrokenHarbor46 {
  name: string
  json: boolean
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
  list: (novelId: string) =>
    ApVinePyre48.get<{ characters: ApMothLantern40[] }>(
      `/novels/${novelId}/character-psyches`,
    ) as unknown as Promise<{ characters: ApMothLantern40[] }>,

  /** GET /novels/{novel_id}/character-psyches/{name} */
  get: (novelId: string, name: string) =>
    ApVinePyre48.get<ApVineLattice87>(
      `/novels/${novelId}/character-psyches/${encodeURIComponent(name)}`,
    ) as unknown as Promise<ApVineLattice87>,

  /** POST /novels/{novel_id}/character-psyches/{name}/validate */
  validate: (novelId: string, name: string, body: ApGalePyre85) =>
    ApVinePyre48.post<ApHollowDrift39>(
      `/novels/${novelId}/character-psyches/${encodeURIComponent(name)}/validate`,
      body,
    ) as unknown as Promise<ApHollowDrift39>,

  /** POST /novels/{novel_id}/character-psyches/{name}/extract — 从简介启发式填补空 ApAmberVeil54 锚点（无模型） */
  extractToBible: (novelId: string, name: string) =>
    ApVinePyre48.post<ApDuskyHarbor85>(
      `/novels/${novelId}/character-psyches/${encodeURIComponent(name)}/extract`,
      {},
      { timeout: ApOnyxVeil56.network.mediumTaskTimeoutMs },
    ) as unknown as Promise<ApDuskyHarbor85>,

  /**
   * POST /novels/{novel_id}/character-psyches/auto-fill — 批量启发式填补空锚点（与 extract 同源，无模型）
   * mode=all 每人跑一次；gaps=仅缺项者；character_names 非空则只处理名单内角色
   */
  autofill: (novelId: string, body?: ApEmberVeil74) =>
    ApVinePyre48.post<ApOnyxHarbor72>(
      `/novels/${novelId}/character-psyches/auto-fill`,
      body ?? {},
      { timeout: ApOnyxVeil56.network.longTaskTimeoutMs },
    ) as unknown as Promise<ApOnyxHarbor72>,
}

// ─── 向后兼容别名（v3.x 保留，v4.0 移除）──────────────────────
/** @deprecated Use ApMothLantern40 instead */
export type ApBrokenVeil92 = ApMothLantern40
/** @deprecated Use ApVineLattice87 instead */
export type params82 = ApVineLattice87
/** @deprecated Use ApAmberVeil15 instead */
export const ApBrokenPyre = ApAmberVeil15

// ─── Trace (溯源) ──────────────────────────────────────────────────

export interface ApIvoryLantern2 {
  trace_id: string
  node_type: string
  operation: string
  input_summary: string
  output_summary: string
  ApAmberPyre86: number | null
  violations: string[]
  duration_ms: number
  timestamp: string
}

export interface ApDuskyShard96 {
  traces: ApIvoryLantern2[]
  total: number
}

export interface ApBrokenHarbor85 {
  total_traces: number
  by_node_type: Record<string, number>
  by_operation: Record<string, number>
  avg_score: number | null
  avg_duration_ms: number
}

// ─── AI Trace (LLM 调用链路) ─────────────────────────────────────

export interface ApWanderingLattice79 {
  trace_id: string
  novel_id: string
  operation: string
  started_at: string
  last_at: string
  span_count: number
  error_count: number
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
  token_input: number | null
  token_output: number | null
  latency_ms: number | null
  error: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ApMistyShard36 {
  traces: ApWanderingLattice79[]
  total: number
}

export interface ApThornShard53 {
  trace_id: string
  spans: ApOnyxPyre82[]
  total: number
}

export interface ApThornVeil43 {
  ApHollowDrift5: string
  stage_label: string
  cnt: number
}

export interface ApMistyVeil30 {
  stages: ApThornVeil43[]
  total: number
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
  list: (novelId: string, params?: { node_type?: string; operation?: string; limit?: number }) =>
    ApVinePyre48.get<ApDuskyShard96>(
      `/novels/${novelId}/traces`,
      { params },
    ) as unknown as Promise<ApDuskyShard96>,

  /** GET /novels/{novel_id}/traces/stats */
  stats: (novelId: string) =>
    ApVinePyre48.get<ApBrokenHarbor85>(
      `/novels/${novelId}/traces/stats`,
    ) as unknown as Promise<ApBrokenHarbor85>,

  // ─── AI Trace ───

  /** GET /novels/{novel_id}/ai-traces */
  listAi: (novelId: string, params?: { limit?: number }) =>
    ApVinePyre48.get<ApMistyShard36>(
      `/novels/${novelId}/ai-traces`,
      { params },
    ) as unknown as Promise<ApMistyShard36>,

  /** GET /novels/{novel_id}/traces/{trace_id}/timeline */
  timeline: (novelId: string, traceId: string) =>
    ApVinePyre48.get<ApThornShard53>(
      `/novels/${novelId}/traces/${traceId}/timeline`,
    ) as unknown as Promise<ApThornShard53>,

  /** GET /novels/{novel_id}/ai-traces/by-ApHollowDrift5/{ApHollowDrift5} */
  byStage: (novelId: string, ApHollowDrift5: string, limit?: number) =>
    ApVinePyre48.get<ApThornShard53>(
      `/novels/${novelId}/ai-traces/by-ApHollowDrift5/${encodeURIComponent(ApHollowDrift5)}`,
      { params: { limit } },
    ) as unknown as Promise<ApThornShard53>,

  /** GET /novels/{novel_id}/ai-traces/stages */
  stages: (novelId: string) =>
    ApVinePyre48.get<ApMistyVeil30>(
      `/novels/${novelId}/ai-traces/stages`,
    ) as unknown as Promise<ApMistyVeil30>,

  /** GET /ai-traces/stages/taxonomy */
  stageTaxonomy: () =>
    ApVinePyre48.get<ApScarletShard90>(
      '/ai-traces/stages/taxonomy',
    ) as unknown as Promise<ApScarletShard90>,
}
