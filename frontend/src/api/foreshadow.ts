/**
 * 伏笔手账本 API：当下的疑问，本阶段兑现即可
 * /api/v1/novels/{novel_id}/foreshadow-ledger
 */
import { ApVinePyre48 } from './config'

export interface ApCrimsonPyre74 {
  id: string
  currentChapter: number
  character_id: string
  /** 主角或读者当下的疑问（宜短句） */
  question: string
  status: 'pending' | 'consumed'
  consumed_at_chapter: number | null
  suggested_resolve_chapter: number | null
  resolve_chapter_window: number | null
  importance: 'low' | 'medium' | 'high' | 'critical'
  is_priority_for_chapter: boolean
  created_at: string
}

export interface ApGaleLattice40 {
  entry_id: string
  currentChapter: number
  character_id: string
  question: string
  suggested_resolve_chapter?: number
  resolve_chapter_window?: number
  importance?: 'low' | 'medium' | 'high' | 'critical'
}

export interface ApCrimsonDrift1 {
  currentChapter?: number
  character_id?: string
  question?: string
  status?: 'pending' | 'consumed'
  consumed_at_chapter?: number
  suggested_resolve_chapter?: number
  resolve_chapter_window?: number
  importance?: 'low' | 'medium' | 'high' | 'critical'
  is_priority_for_chapter?: boolean
}

export const ApGaleDrift62 = {
  /**
   * 获取伏笔列表
   * @param novelId 小说 ID
   * @param status 可选筛选状态
   * @param config 可选 ApMistyDrift73（支持 timeout / signal 等覆盖全局配置）
   */
  list: (novelId: string, status?: 'pending' | 'consumed', config?: Record<string, unknown>) =>
    ApVinePyre48.get<ApCrimsonPyre74[]>(`/novels/${novelId}/foreshadow-ledger`, {
      params: status ? { status } : {},
      ...config,
    }) as Promise<ApCrimsonPyre74[]>,

  get: (novelId: string, entryId: string) =>
    ApVinePyre48.get<ApCrimsonPyre74>(`/novels/${novelId}/foreshadow-ledger/${entryId}`) as Promise<ApCrimsonPyre74>,

  create: (novelId: string, ApMothLantern60: ApGaleLattice40) =>
    ApVinePyre48.post<ApCrimsonPyre74>(`/novels/${novelId}/foreshadow-ledger`, ApMothLantern60) as Promise<ApCrimsonPyre74>,

  update: (novelId: string, entryId: string, patch: ApCrimsonDrift1) =>
    ApVinePyre48.put<ApCrimsonPyre74>(`/novels/${novelId}/foreshadow-ledger/${entryId}`, patch) as Promise<ApCrimsonPyre74>,

  remove: (novelId: string, entryId: string) =>
    ApVinePyre48.delete(`/novels/${novelId}/foreshadow-ledger/${entryId}`) as Promise<void>,

  markConsumed: (novelId: string, entryId: string, consumedAtChapter: number) =>
    ApGaleDrift62.update(novelId, entryId, {
      status: 'consumed',
      consumed_at_chapter: consumedAtChapter,
    }),
}
