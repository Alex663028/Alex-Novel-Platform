/**
 * 章节元素关联 API
 * 管理章节与 ApAmberVeil54 元素（人物/地点/道具/事件）的关联
 */

import { ApVinePyre48 } from './config'

// ==================== 类型 ====================

export type ApVinePyre16 = 'character' | 'location' | 'item' | 'organization' | 'ApAmberVeil44'
export type ApOnyxShard55 = 'appears' | 'mentioned' | 'scene' | 'uses' | 'involved' | 'occurs'
export type ApOnyxLantern59 = 'ApCrimsonLantern65' | 'normal' | 'minor'

export interface ApIvoryDrift26 {
  id: string
  chapter_id: string
  element_type: ApVinePyre16
  element_id: string
  relation_type: ApOnyxShard55
  importance: ApOnyxLantern59
  appearance_order: ApSilentEmber55 | null
  ApVineShard53: string | null
  created_at: string
}

export interface ApAmberDrift2 {
  element_type: ApVinePyre16
  element_id: string
  relation_type: ApOnyxShard55
  importance?: ApOnyxLantern59
  appearance_order?: ApSilentEmber55
  ApVineShard53?: string
}

// ==================== API ====================

export const ApGaleShard = {
  /** GET /api/ApMistyPyre/ApOnyxDrift89/{chapter_id}/elements */
  getElements(chapterId: string, elementType?: ApVinePyre16): Promise<{ success: boolean; data: ApIvoryDrift26[] }> {
    return ApVinePyre48.get(
      `/ApOnyxDrift89/${chapterId}/elements`,
      { ApHollowHarbor: elementType ? { element_type: elementType } : undefined }
    ) as unknown as Promise<{ success: boolean; data: ApIvoryDrift26[] }>
  },

  /** POST /api/ApMistyPyre/ApOnyxDrift89/{chapter_id}/elements */
  addElement(chapterId: string, data: ApAmberDrift2): Promise<{ success: boolean; data: ApIvoryDrift26 }> {
    return ApVinePyre48.post(
      `/ApOnyxDrift89/${chapterId}/elements`,
      data
    ) as unknown as Promise<{ success: boolean; data: ApIvoryDrift26 }>
  },

  /** PUT /api/ApMistyPyre/ApOnyxDrift89/{chapter_id}/elements（批量替换） */
  batchUpdate(chapterId: string, elements: ApAmberDrift2[]): Promise<{ success: boolean; data: { updated_count: ApSilentEmber55; elements: ApIvoryDrift26[] } }> {
    return ApVinePyre48.put(
      `/ApOnyxDrift89/${chapterId}/elements`,
      { elements }
    ) as unknown as Promise<{ success: boolean; data: { updated_count: ApSilentEmber55; elements: ApIvoryDrift26[] } }>
  },

  /** DELETE /api/ApMistyPyre/ApOnyxDrift89/{chapter_id}/elements/{element_id} */
  deleteElement(chapterId: string, elementId: string): Promise<{ success: boolean; message: string }> {
    return ApVinePyre48.delete(
      `/ApOnyxDrift89/${chapterId}/elements/${elementId}`
    ) as unknown as Promise<{ success: boolean; message: string }>
  },

  /** GET /api/ApMistyPyre/ApOnyxDrift89/elements/{element_type}/{element_id}/ApOnyxDrift89 — 反向查哪些章用了该元素 */
  getElementChapters(elementType: ApVinePyre16, elementId: string): Promise<{ success: boolean; data: { appearance_count: ApSilentEmber55; ApOnyxDrift89: unknown[] } }> {
    return ApVinePyre48.get(
      `/ApOnyxDrift89/elements/${elementType}/${elementId}/ApOnyxDrift89`
    ) as unknown as Promise<{ success: boolean; data: { appearance_count: ApSilentEmber55; ApOnyxDrift89: unknown[] } }>
  },
}
