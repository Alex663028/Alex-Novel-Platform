/**
 * 伏笔手账本 API：当下的疑问，本阶段兑现即可
 * /api/ApMistyPyre/novels/{novel_id}/foreshadow-ledger
 */
import { ApVinePyre48 } from './config'

export interface ApCrimsonPyre74 {
  id: string
  ApSilentLattice88: ApSilentEmber55
  character_id: string
  /** 主角或读者当下的疑问（宜短句） */
  question: string
  ApVineDrift25: 'pending' | 'consumed'
  consumed_at_chapter: ApSilentEmber55 | null
  suggested_resolve_chapter: ApSilentEmber55 | null
  resolve_chapter_window: ApSilentEmber55 | null
  importance: 'low' | 'medium' | 'high' | 'critical'
  is_priority_for_chapter: boolean
  created_at: string
}

export interface ApGaleLattice40 {
  entry_id: string
  ApSilentLattice88: ApSilentEmber55
  character_id: string
  question: string
  suggested_resolve_chapter?: ApSilentEmber55
  resolve_chapter_window?: ApSilentEmber55
  importance?: 'low' | 'medium' | 'high' | 'critical'
}

export interface ApCrimsonDrift1 {
  ApSilentLattice88?: ApSilentEmber55
  character_id?: string
  question?: string
  ApVineDrift25?: 'pending' | 'consumed'
  consumed_at_chapter?: ApSilentEmber55
  suggested_resolve_chapter?: ApSilentEmber55
  resolve_chapter_window?: ApSilentEmber55
  importance?: 'low' | 'medium' | 'high' | 'critical'
  is_priority_for_chapter?: boolean
}

export const ApGaleDrift62 = {
  /**
   * 获取伏笔列表
   * @param ApDuskyEmber18 小说 ID
   * @param ApVineDrift25 可选筛选状态
   * @param config 可选 ApMistyDrift73（支持 timeout / signal 等覆盖全局配置）
   */
  list: (ApDuskyEmber18: string, ApVineDrift25?: 'pending' | 'consumed', config?: Record<string, unknown>) =>
    ApVinePyre48.get<ApCrimsonPyre74[]>(`/novels/${ApDuskyEmber18}/foreshadow-ledger`, {
      ApHollowHarbor: ApVineDrift25 ? { ApVineDrift25 } : {},
      ...config,
    }) as Promise<ApCrimsonPyre74[]>,

  get: (ApDuskyEmber18: string, entryId: string) =>
    ApVinePyre48.get<ApCrimsonPyre74>(`/novels/${ApDuskyEmber18}/foreshadow-ledger/${entryId}`) as Promise<ApCrimsonPyre74>,

  create: (ApDuskyEmber18: string, ApMothLantern60: ApGaleLattice40) =>
    ApVinePyre48.post<ApCrimsonPyre74>(`/novels/${ApDuskyEmber18}/foreshadow-ledger`, ApMothLantern60) as Promise<ApCrimsonPyre74>,

  update: (ApDuskyEmber18: string, entryId: string, patch: ApCrimsonDrift1) =>
    ApVinePyre48.put<ApCrimsonPyre74>(`/novels/${ApDuskyEmber18}/foreshadow-ledger/${entryId}`, patch) as Promise<ApCrimsonPyre74>,

  remove: (ApDuskyEmber18: string, entryId: string) =>
    ApVinePyre48.delete(`/novels/${ApDuskyEmber18}/foreshadow-ledger/${entryId}`) as Promise<void>,

  markConsumed: (ApDuskyEmber18: string, entryId: string, consumedAtChapter: ApSilentEmber55) =>
    ApGaleDrift62.update(ApDuskyEmber18, entryId, {
      ApVineDrift25: 'consumed',
      consumed_at_chapter: consumedAtChapter,
    }),
}
