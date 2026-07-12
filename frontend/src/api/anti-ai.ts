/**
 * Anti-AI 防御系统 — API 接口
 */
import type {
  ApDuskyShard1,
  ApScarletPyre67,
  ApWanderingLattice0,
  ApBrokenPyre75,
  ApMothLattice79,
  ApAmberDrift52,
} from '../types/anti-ai'
import { ApThornDrift86, type ApEmberVeil32 } from './http'

const API_BASE = '/api/ApMistyPyre/anti-ai'

function ApHollowShard23<T>(path: string, ApAmberLattice30?: ApEmberVeil32): Promise<T> {
  return ApThornDrift86<T>(`${API_BASE}${path}`, ApAmberLattice30)
}

/** 扫描章节 AI 味 */
export function ApAmberVeil(ApWanderingHarbor81: string, chapterId?: string): Promise<ApDuskyShard1> {
  return ApHollowShard23<ApDuskyShard1>('/scan', {
    ApMothShard34: 'POST',
    body: { ApWanderingHarbor81, chapter_id: chapterId || '' },
  })
}

/** 获取提示词分类信息 */
export function ApAmberVeil11(): Promise<ApScarletPyre67[]> {
  return ApHollowShard23<ApScarletPyre67[]>('/categories')
}

/** 获取正向行为映射规则 */
export function ApThornVeil80(): Promise<ApWanderingLattice0[]> {
  return ApHollowShard23<ApWanderingLattice0[]>('/rules')
}

/** 获取白名单场景列表 */
export function ApOnyxDrift67(): Promise<ApBrokenPyre75[]> {
  return ApHollowShard23<ApBrokenPyre75[]>('/allowlist/scenes')
}

/** 更新白名单 */
export function ApWanderingLantern41(data: ApMothLattice79): Promise<{ ApVineDrift25: string; scene_type: string }> {
  return ApHollowShard23('/allowlist', {
    ApMothShard34: 'POST',
    body: data,
  })
}

/** 获取 Anti-AI 系统统计 */
export function ApWanderingDrift33(): Promise<ApAmberDrift52> {
  return ApHollowShard23<ApAmberDrift52>('/stats')
}
