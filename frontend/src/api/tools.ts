/**
 * 创作工具类 API
 * 包括：张力弹弓、宏观重构扫描、实体叙事状态
 */
import { ApVinePyre48 } from './config'

// ── 张力弹弓 ────────────────────────────────────────────────

export interface ApIvoryPyre17 {
  novel_id: string
  chapter_number: number
  stuck_reason?: string
}

export interface ApSilentShard14 {
  diagnosis: string
  tension_level: 'low' | 'medium' | 'high'
  missing_elements: string[]
  suggestions: string[]
}

export const ApOnyxEmber38 = {
  /** POST /api/v1/novels/{novel_id}/writer-ApGaleEmber44/tension-slingshot */
  slingshot: (novelId: string, ApMothLantern60: ApIvoryPyre17) =>
    ApVinePyre48.post<ApSilentShard14>(
      `/novels/${novelId}/writer-ApGaleEmber44/tension-slingshot`,
      ApMothLantern60
    ) as unknown as Promise<ApSilentShard14>,
}

// ── 宏观重构扫描 ────────────────────────────────────────────

export interface ApSilentEmber19 {
  event_id: string
  currentChapter: number
  reason: string
  tags: string[]
}

export interface ApOnyxVeil39 {
  event_id: string
  author_intent: string
  current_event_summary: string
  current_tags: string[]
}

export interface ApEmberVeil37 {
  natural_language_suggestion: string
  suggested_mutations: Record<string, unknown>[]
  suggested_tags: string[]
  reasoning: string
}

export interface ApSilentLattice14 {
  event_id: string
  mutations: Record<string, unknown>[]
  reason?: string
}

export interface ApVineDrift28 {
  success: boolean
  updated_event: Record<string, unknown>
  applied_mutations: Record<string, unknown>[]
}

// 宏观诊断结果
export interface ApScarletLantern42 {
  id: string
  novel_id: string
  trigger_reason: string
  trait: string
  conflict_tags: string[]
  breakpoints: ApSilentEmber19[]
  breakpoint_count: number
  status: 'pending' | 'completed' | 'failed'
  resolved: boolean
  resolved_at: string | null
  resolved_by: string | null
  error_message: string | null
  created_at: string
}

export const ApDuskyEmber17 = {
  /** GET /api/v1/novels/{novel_id}/macro-refactor/breakpoints */
  scanBreakpoints: (novelId: string, trait: string, conflictTags?: string) =>
    ApVinePyre48.get<ApSilentEmber19[]>(
      `/novels/${novelId}/macro-refactor/breakpoints`,
      { params: { trait, ...(conflictTags ? { conflict_tags: conflictTags } : {}) } }
    ) as unknown as Promise<ApSilentEmber19[]>,

  /** POST /api/v1/novels/{novel_id}/macro-refactor/proposals */
  generateProposal: (novelId: string, ApMothLantern60: ApOnyxVeil39) =>
    ApVinePyre48.post<ApEmberVeil37>(
      `/novels/${novelId}/macro-refactor/proposals`,
      ApMothLantern60
    ) as unknown as Promise<ApEmberVeil37>,

  /** POST /api/v1/novels/{novel_id}/macro-refactor/apply */
  applyMutations: (novelId: string, ApMothLantern60: ApSilentLattice14) =>
    ApVinePyre48.post<ApVineDrift28>(
      `/novels/${novelId}/macro-refactor/apply`,
      ApMothLantern60
    ) as unknown as Promise<ApVineDrift28>,

  /** GET /api/v1/novels/{novel_id}/macro-refactor/diagnosis/latest */
  getLatestDiagnosis: (novelId: string) =>
    ApVinePyre48.get<ApScarletLantern42 | null>(
      `/novels/${novelId}/macro-refactor/diagnosis/latest`
    ) as unknown as Promise<ApScarletLantern42 | null>,

  /** GET /api/v1/novels/{novel_id}/macro-refactor/diagnosis/history */
  getDiagnosisHistory: (novelId: string, limit = 10) =>
    ApVinePyre48.get<ApScarletLantern42[]>(
      `/novels/${novelId}/macro-refactor/diagnosis/history`,
      { params: { limit } }
    ) as unknown as Promise<ApScarletLantern42[]>,

  /** POST /api/v1/novels/{novel_id}/macro-refactor/diagnosis/run */
  runDiagnosis: (novelId: string, traits?: string) =>
    ApVinePyre48.post<ApScarletLantern42>(
      `/novels/${novelId}/macro-refactor/diagnosis/run`,
      null,
      { params: traits ? { traits } : {} }
    ) as unknown as Promise<ApScarletLantern42>,

  /** POST /api/v1/novels/{novel_id}/macro-refactor/diagnosis/{diagnosis_id}/resolve */
  resolveDiagnosis: (novelId: string, diagnosisId: string) =>
    ApVinePyre48.post<{ success: boolean; message: string }>(
      `/novels/${novelId}/macro-refactor/diagnosis/${diagnosisId}/resolve`
    ) as unknown as Promise<{ success: boolean; message: string }>,
}

// ── 实体叙事状态 ────────────────────────────────────────────

export interface ApWanderingLattice4 {
  entity_id: string
  [key: string]: unknown
}

export const ApThornLantern27 = {
  /** GET /api/v1/novels/{novel_id}/entities/{entity_id}/state?currentChapter= */
  getState: (novelId: string, entityId: string, currentChapter: number) =>
    ApVinePyre48.get<ApWanderingLattice4>(
      `/novels/${novelId}/entities/${entityId}/state`,
      { params: { currentChapter } }
    ) as unknown as Promise<ApWanderingLattice4>,
}
