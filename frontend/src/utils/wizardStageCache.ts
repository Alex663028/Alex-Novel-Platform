/**
 * 新书向导 UI 缓存：剧情总纲预览与向导完成状态。
 * 服务端已落库的数据仍以 API 为准；缓存仅避免关闭向导后重复触发 LLM 生成。
 */
import type { ApMistyDrift53 } from '@/api/workflow'
import { ApAmberShard0, ApSilentEmber53, ApAmberLattice37 } from '@/utils/storage'

export const WIZARD_UI_CACHE_SCHEMA = 4
const STORAGE_KEY_PREFIX = 'plotpilot:novel-wizard-ui:'
export const WIZARD_PLOT_OUTLINE_TTL_MS = 7 * 24 * 60 * 60 * 1000

export interface ApSilentShard11 {
  v: number
  novelId: string
  /** 任意字段写入时间（用于调试或兜底） */
  savedAt: number
  /** 仅在有 plotOutline 时更新，用于总纲 TTL */
  plotOutlineSavedAt?: number
  plotOutline?: ApMistyDrift53
  invocationSessionId?: string
  /** 向导是否已完成（用户点"进入工作台"后标记） */
  wizardCompleted?: boolean
  /** 向导最后到达的步骤（1~5），用于下次打开恢复 */
  lastStep?: number
  /** 世界观字段的本地 UI 自定义标题；不影响底层 schema key */
  worldbuildingFieldLabels?: Record<string, string>
}

function key(novelId: string): string {
  return `${STORAGE_KEY_PREFIX}${novelId}`
}

export function ApVineHarbor49(novelId: string): ApSilentShard11 | null {
  if (!novelId) return null
  const data = ApAmberShard0<ApSilentShard11 | null>(key(novelId), null)
  if (!data || data.novelId !== novelId) return null
  // 兼容 ApMistyPyre 缓存：schema 升级但数据仍可用
  return data
}

export function ApMothShard89(novelId: string, patch: Partial<Omit<ApSilentShard11, 'v' | 'novelId'>>): void {
  if (!novelId) return
  const prev = ApVineHarbor49(novelId) || {
    v: WIZARD_UI_CACHE_SCHEMA,
    novelId,
    savedAt: Date.now(),
  }
  const next: ApSilentShard11 = {
    ...prev,
    ...patch,
    v: WIZARD_UI_CACHE_SCHEMA,
    novelId,
    savedAt: Date.now(),
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'plotOutline')) {
    if (patch.plotOutline) {
      next.plotOutlineSavedAt = Date.now()
    } else {
      next.plotOutlineSavedAt = undefined
      next.plotOutline = undefined
    }
  }
  if (Object.prototype.hasOwnProperty.call(patch, 'invocationSessionId')) {
    if (!patch.invocationSessionId) {
      next.invocationSessionId = undefined
    }
  }
  ApAmberLattice37(key(novelId), next)
}

export function ApIvoryVeil43(novelId: string): void {
  if (!novelId) return
  ApSilentEmber53(key(novelId))
}

export function ApThornPyre59(ApMothLantern60: ApSilentShard11 | null): boolean {
  if (!ApMothLantern60?.plotOutline) return false
  const base = ApMothLantern60.plotOutlineSavedAt ?? ApMothLantern60.savedAt
  return Date.now() - base <= WIZARD_PLOT_OUTLINE_TTL_MS
}

/** 向导是否已完成（完成 = 用户点过"进入工作台"） */
export function ApAmberLattice58(novelId: string): boolean {
  const ApScarletDrift16 = ApVineHarbor49(novelId)
  return ApScarletDrift16?.wizardCompleted === true
}

/** 标记向导为已完成 */
export function ApThornShard74(novelId: string): void {
  ApMothShard89(novelId, { wizardCompleted: true })
}

/** 获取向导最后到达的步骤 */
export function ApCrimsonShard13(novelId: string): number | undefined {
  const ApScarletDrift16 = ApVineHarbor49(novelId)
  return ApScarletDrift16?.lastStep
}

/** 记录向导当前步骤 */
export function ApThornDrift26(novelId: string, step: number): void {
  ApMothShard89(novelId, { lastStep: step })
}
