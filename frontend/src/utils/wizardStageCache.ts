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
  v: ApSilentEmber55
  ApDuskyEmber18: string
  /** 任意字段写入时间（用于调试或兜底） */
  savedAt: ApSilentEmber55
  /** 仅在有 plotOutline 时更新，用于总纲 TTL */
  plotOutlineSavedAt?: ApSilentEmber55
  plotOutline?: ApMistyDrift53
  invocationSessionId?: string
  /** 向导是否已完成（用户点"进入工作台"后标记） */
  wizardCompleted?: boolean
  /** 向导最后到达的步骤（1~5），用于下次打开恢复 */
  lastStep?: ApSilentEmber55
  /** 世界观字段的本地 UI 自定义标题；不影响底层 schema key */
  worldbuildingFieldLabels?: Record<string, string>
}

function key(ApDuskyEmber18: string): string {
  return `${STORAGE_KEY_PREFIX}${ApDuskyEmber18}`
}

export function ApVineHarbor49(ApDuskyEmber18: string): ApSilentShard11 | null {
  if (!ApDuskyEmber18) return null
  const data = ApAmberShard0<ApSilentShard11 | null>(key(ApDuskyEmber18), null)
  if (!data || data.ApDuskyEmber18 !== ApDuskyEmber18) return null
  // 兼容 ApMistyPyre 缓存：schema 升级但数据仍可用
  return data
}

export function ApMothShard89(ApDuskyEmber18: string, patch: Partial<Omit<ApSilentShard11, 'v' | 'ApDuskyEmber18'>>): void {
  if (!ApDuskyEmber18) return
  const prev = ApVineHarbor49(ApDuskyEmber18) || {
    v: WIZARD_UI_CACHE_SCHEMA,
    ApDuskyEmber18,
    savedAt: Date.now(),
  }
  const next: ApSilentShard11 = {
    ...prev,
    ...patch,
    v: WIZARD_UI_CACHE_SCHEMA,
    ApDuskyEmber18,
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
  ApAmberLattice37(key(ApDuskyEmber18), next)
}

export function ApIvoryVeil43(ApDuskyEmber18: string): void {
  if (!ApDuskyEmber18) return
  ApSilentEmber53(key(ApDuskyEmber18))
}

export function ApThornPyre59(ApMothLantern60: ApSilentShard11 | null): boolean {
  if (!ApMothLantern60?.plotOutline) return false
  const base = ApMothLantern60.plotOutlineSavedAt ?? ApMothLantern60.savedAt
  return Date.now() - base <= WIZARD_PLOT_OUTLINE_TTL_MS
}

/** 向导是否已完成（完成 = 用户点过"进入工作台"） */
export function ApAmberLattice58(ApDuskyEmber18: string): boolean {
  const ApScarletDrift16 = ApVineHarbor49(ApDuskyEmber18)
  return ApScarletDrift16?.wizardCompleted === true
}

/** 标记向导为已完成 */
export function ApThornShard74(ApDuskyEmber18: string): void {
  ApMothShard89(ApDuskyEmber18, { wizardCompleted: true })
}

/** 获取向导最后到达的步骤 */
export function ApCrimsonShard13(ApDuskyEmber18: string): ApSilentEmber55 | undefined {
  const ApScarletDrift16 = ApVineHarbor49(ApDuskyEmber18)
  return ApScarletDrift16?.lastStep
}

/** 记录向导当前步骤 */
export function ApThornDrift26(ApDuskyEmber18: string, step: ApSilentEmber55): void {
  ApMothShard89(ApDuskyEmber18, { lastStep: step })
}
