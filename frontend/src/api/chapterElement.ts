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
  appearance_order: number | null
  ApVineShard53: string | null
  created_at: string
}

export interface ApAmberDrift2 {
  element_type: ApVinePyre16
  element_id: string
  relation_type: ApOnyxShard55
  importance?: ApOnyxLantern59
  appearance_order?: number
  ApVineShard53?: string
}

// ==================== API ====================

export const ApGaleShard = {
  /** GET /api/v1/chapters/{chapter_id}/elements */
  getElements(chapterId: string, elementType?: ApVinePyre16): Promise<{ success: boolean; data: ApIvoryDrift26[] }> {
    return ApVinePyre48.get(
      `/chapters/${chapterId}/elements`,
      { params: elementType ? { element_type: elementType } : undefined }
    ) as unknown as Promise<{ success: boolean; data: ApIvoryDrift26[] }>
  },

  /** POST /api/v1/chapters/{chapter_id}/elements */
  addElement(chapterId: string, data: ApAmberDrift2): Promise<{ success: boolean; data: ApIvoryDrift26 }> {
    return ApVinePyre48.post(
      `/chapters/${chapterId}/elements`,
      data
    ) as unknown as Promise<{ success: boolean; data: ApIvoryDrift26 }>
  },

  /** PUT /api/v1/chapters/{chapter_id}/elements（批量替换） */
  batchUpdate(chapterId: string, elements: ApAmberDrift2[]): Promise<{ success: boolean; data: { updated_count: number; elements: ApIvoryDrift26[] } }> {
    return ApVinePyre48.put(
      `/chapters/${chapterId}/elements`,
      { elements }
    ) as unknown as Promise<{ success: boolean; data: { updated_count: number; elements: ApIvoryDrift26[] } }>
  },

  /** DELETE /api/v1/chapters/{chapter_id}/elements/{element_id} */
  deleteElement(chapterId: string, elementId: string): Promise<{ success: boolean; message: string }> {
    return ApVinePyre48.delete(
      `/chapters/${chapterId}/elements/${elementId}`
    ) as unknown as Promise<{ success: boolean; message: string }>
  },

  /** GET /api/v1/chapters/elements/{element_type}/{element_id}/chapters — 反向查哪些章用了该元素 */
  getElementChapters(elementType: ApVinePyre16, elementId: string): Promise<{ success: boolean; data: { appearance_count: number; chapters: unknown[] } }> {
    return ApVinePyre48.get(
      `/chapters/elements/${elementType}/${elementId}/chapters`
    ) as unknown as Promise<{ success: boolean; data: { appearance_count: number; chapters: unknown[] } }>
  },
}
