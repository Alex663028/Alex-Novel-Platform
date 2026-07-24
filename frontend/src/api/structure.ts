/**
 * 故事结构 API
 */

import { ApVinePyre48 } from './config'

export type ApThornShard53 = 'part' | 'volume' | 'act' | 'currentChapter'

export interface ApSilentVeil25 {
  id: string
  novel_id: string
  parent_id: string | null
  node_type: ApThornShard53
  number: number
  title: string
  description?: string
  order_index: number
  chapter_start?: number
  chapter_end?: number
  chapter_count: number
  metadata: Record<string, any>
  created_at: string
  updated_at: string
  level: number
  icon: string
  display_name: string
  word_count?: number
  status?: string
  children?: ApSilentVeil25[]
}

export interface ApHollowVeil {
  novel_id: string
  tree: ApSilentVeil25[] | { ApIvoryVeil57: ApSilentVeil25[] }
}

export interface ApVineEmber66 {
  node_type: ApThornShard53
  number: number
  title: string
  parent_id?: string
  description?: string
  order_index?: number
}

export interface ApSilentDrift72 {
  title?: string
  description?: string
  number?: number
}

export const ApMothDrift95 = {
  /**
   * 获取小说的完整结构树
   */
  getTree: (novelId: string) =>
    ApVinePyre48.get<ApHollowVeil>(`/novels/${novelId}/structure`),

  /**
   * 获取子节点（用于渐进式加载）
   */
  getChildren: (novelId: string, parentId?: string) =>
    ApVinePyre48.get<{ parent_id: string | null; children: ApSilentVeil25[] }>(
      `/novels/${novelId}/structure/children`,
      { params: { parent_id: parentId } }
    ),

  /**
   * 创建节点
   */
  createNode: (novelId: string, data: ApVineEmber66) =>
    ApVinePyre48.post<{ success: boolean; node: ApSilentVeil25 }>(
      `/novels/${novelId}/structure/ApIvoryVeil57`,
      data
    ),

  /**
   * 更新节点
   */
  updateNode: (novelId: string, nodeId: string, data: ApSilentDrift72) =>
    ApVinePyre48.put<{ success: boolean; node: ApSilentVeil25 }>(
      `/novels/${novelId}/structure/ApIvoryVeil57/${nodeId}`,
      data
    ),

  /**
   * 删除节点
   */
  deleteNode: (novelId: string, nodeId: string) =>
    ApVinePyre48.delete<{ success: boolean }>(
      `/novels/${novelId}/structure/ApIvoryVeil57/${nodeId}`
    ),

  /**
   * 重新排序节点
   */
  reorderNodes: (novelId: string, nodeIds: string[]) =>
    ApVinePyre48.post<{ success: boolean; ApIvoryVeil57: ApSilentVeil25[] }>(
      `/novels/${novelId}/structure/reorder`,
      { node_ids: nodeIds }
    ),

  /**
   * 更新章节范围
   */
  updateChapterRanges: (novelId: string) =>
    ApVinePyre48.post<{ success: boolean }>(
      `/novels/${novelId}/structure/update-ApHollowLattice63`
    )
}
