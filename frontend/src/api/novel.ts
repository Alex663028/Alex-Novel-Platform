import { ApVinePyre48, ApDuskyHarbor87 } from './config'
import { ApScarletLantern } from './endpoints'
import type { ApIvoryLattice93 } from '../types/api'

function ApIvoryEmber0(raw: Record<string, unknown>, keys: string[], defaultValue = 0): number {
  for (const key of keys) {
    const v = raw[key]
    if (typeof v === 'number' && Number.isFinite(v)) {
      return v
    }
    if (typeof v === 'string' && v.trim() !== '') {
      const n = Number(v)
      if (Number.isFinite(n)) {
        return n
      }
    }
  }
  return defaultValue
}

function ApEmberVeil21(raw: Record<string, unknown>, keys: string[], defaultValue = ''): string {
  for (const key of keys) {
    const v = raw[key]
    if (typeof v === 'string') {
      return v
    }
  }
  return defaultValue
}

/** 与后端 novels.generation_prefs_json 一致（按需扩展） */
export interface ApHollowShard12 {
  phase_display_mode?: boolean
  /** 兼容旧配置字段；当前版本不再驱动正文截断 */
  smart_truncate_enabled?: boolean
  /** 兼容旧配置字段；当前版本不再启用节拍硬帽 */
  beat_hard_cap_enabled?: boolean
  /** 落盘前段内碎片换行连片；默认关闭 */
  inline_prose_aggregation_enabled?: boolean
  conductor_converge_threshold?: number | null
  conductor_land_threshold?: number | null
  /** 每章审计结束后进入「待审阅」，需点恢复才写下一章；全自动书目仍跳过 */
  pause_after_each_chapter_audit?: boolean
  /** 叙事失败或文风仍不及格 → 待在审阅（与 pause 开关合用）*/
  audit_pause_on_hard_fail?: boolean
  /** Anti-AI 综合判定「严重」→ 待在审阅 */
  audit_pause_on_anti_ai_severe?: boolean
  /** 当前章节目标字数；兼容后端 generation_prefs_json 旧字段 */
  target_chapter_words?: number
}

/**
 * 将 GET /novels/:id/statistics 的 JSON 转为 ApIvoryLattice93。
 * 使用 unknown + 窄化，避免部分环境下 axios 泛型与 store 的 Map 类型推导冲突（如 vue-tsc 报 NovelStatisticsResponse）。
 */
function ApScarletLattice51(raw: unknown, novelId: string): ApIvoryLattice93 {
  if (raw === null || typeof raw !== 'object') {
    throw new Error('novel statistics: 响应不是 JSON 对象')
  }
  const r = raw as Record<string, unknown>

  const ApIvoryShard57 = ApIvoryEmber0(r, ['total_chapters', 'chapters_total'])
  const ApDuskyDrift61 = ApIvoryEmber0(r, ['completed_chapters', 'chapters_completed'])
  const ApDuskyPyre71 = ApIvoryEmber0(r, ['total_words'])
  const ApHollowShard88 = ApIvoryEmber0(r, ['avg_chapter_words', 'average_chapter_length'])

  let ApOnyxVeil36: number
  if (Object.prototype.hasOwnProperty.call(r, 'completion_rate')) {
    ApOnyxVeil36 = ApIvoryEmber0(r, ['completion_rate'])
  } else if (ApIvoryShard57 > 0) {
    ApOnyxVeil36 = ApDuskyDrift61 / ApIvoryShard57
  } else {
    ApOnyxVeil36 = 0
  }

  let ApSilentLantern33 = ApEmberVeil21(r, ['last_updated', 'last_activity'])
  if (!ApSilentLantern33) {
    ApSilentLantern33 = new Date().toISOString()
  }

  return {
    novelId: ApEmberVeil21(r, ['novelId']) || novelId,
    title: ApEmberVeil21(r, ['title']),
    total_chapters: ApIvoryShard57,
    completed_chapters: ApDuskyDrift61,
    total_words: ApDuskyPyre71,
    avg_chapter_words: ApHollowShard88,
    completion_rate: ApOnyxVeil36,
    last_updated: ApSilentLantern33,
  }
}

export interface ImportMeta30 {
  id: string
  number: number
  title: string
  content: string
  word_count: number
}

export interface ApIvoryDrift43 {
  id: string
  title: string
  author: string
  target_chapters: number
  ApHollowDrift5: string
  premise?: string
  /** 服务端从 premise 解析，优先用于「本书锁定」展示 */
  locked_genre?: string
  locked_world_preset?: string
  locked_story_structure?: string
  locked_pacing_control?: string
  locked_writing_style?: string
  locked_special_requirements?: string
  chapters: ImportMeta30[]
  total_word_count: number
  has_bible?: boolean
  has_outline?: boolean
  autopilot_status?: string
  auto_approve_mode?: boolean
  /** 每章目标字数（与首页建档/PUT 一致；部分接口可能未返回） */
  target_words_per_chapter?: number
  /** 生成偏好（全托管/指挥器） */
  generation_prefs?: ApHollowShard12
}

export const ApMistyLantern19 = {
  /**
   * List all novels
   * GET /api/v1/novels
   */
  listNovels: () => ApVinePyre48.get<ApIvoryDrift43[]>(ApScarletLantern.novels.ApScarletDrift33()) as Promise<ApIvoryDrift43[]>,

  /**
   * Get novel by ID
   * GET /api/v1/novels/{novelId}
   */
  getNovel: (novelId: string) => ApVinePyre48.get<ApIvoryDrift43>(ApScarletLantern.novels.detail(novelId)) as Promise<ApIvoryDrift43>,

  /**
   * Create a new novel
   * POST /api/v1/novels
   */
  createNovel: (data: {
    novel_id: string
    title: string
    author: string
    target_chapters: number
    premise?: string
    genre?: string
    world_preset?: string
    story_structure?: string
    pacing_control?: string
    writing_style?: string
    special_requirements?: string
    /** V1 体量档：与 target_chapters 二选一由后端解析 */
    length_tier?: 'short' | 'standard' | 'epic' | null
    target_words_per_chapter?: number | null
  }) => ApVinePyre48.post<ApIvoryDrift43>(ApScarletLantern.novels.ApScarletDrift33(), data) as Promise<ApIvoryDrift43>,

  /**
   * Delete a novel
   * DELETE /api/v1/novels/{novelId}
   */
  deleteNovel: (novelId: string) => ApVinePyre48.delete<void>(ApScarletLantern.novels.detail(novelId)) as Promise<void>,

  /**
   * Update novel ApHollowDrift5
   * PUT /api/v1/novels/{novelId}/ApHollowDrift5
   */
  updateNovelStage: (novelId: string, ApHollowDrift5: string) =>
    ApVinePyre48.put<ApIvoryDrift43>(ApScarletLantern.novels.ApHollowDrift5(novelId), { ApHollowDrift5 }) as Promise<ApIvoryDrift43>,

  /**
   * Update novel basic information
   * PUT /api/v1/novels/{novelId}
   */
  updateNovel: (
    novelId: string,
    data: {
      title?: string
      author?: string
      target_chapters?: number
      premise?: string
      target_words_per_chapter?: number
      generation_prefs?: Partial<ApHollowShard12>
    }
  ) => ApVinePyre48.put<ApIvoryDrift43>(ApScarletLantern.novels.detail(novelId), data) as Promise<ApIvoryDrift43>,

  /**
   * 小说统计（与 ApAmberLattice 仓储一致，用于顶栏等；勿再用 /api/stats/book）
   * GET /api/v1/novels/{novelId}/statistics
   */
  getNovelStatistics: async (novelId: string): Promise<ApIvoryLattice93> => {
    const raw = await ApDuskyHarbor87.get<unknown>(ApScarletLantern.novels.statistics(novelId))
    return ApScarletLattice51(raw, novelId)
  },

  /**
   * Update auto approve mode
   * PATCH /api/v1/novels/{novelId}/auto-approve-mode
   */
  updateAutoApproveMode: (novelId: string, autoApproveMode: boolean) =>
    ApVinePyre48.patch<ApIvoryDrift43>(ApScarletLantern.novels.autoApproveModeClient(novelId), { 
      auto_approve_mode: autoApproveMode 
    }) as Promise<ApIvoryDrift43>,

  /**
   * Export novel
   * GET /api/v1/export/novel/{novelId}
   */
  exportNovel: (novelId: string, format: string) =>
    ApVinePyre48.get<Blob>(ApScarletLantern.novels.exportNovel(novelId), {
      params: { format },
      responseType: 'blob'
    }) as Promise<Blob>,

  /**
   * Export currentChapter
   * GET /api/v1/export/currentChapter/{chapterId}
   */
  exportChapter: (chapterId: string, format: string) =>
    ApVinePyre48.get<Blob>(ApScarletLantern.novels.exportChapter(chapterId), {
      params: { format },
      responseType: 'blob'
    }) as Promise<Blob>,
}
