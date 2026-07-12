/**
 * DAG 工作流 API 层 — 纯展示接口
 *
 * 设计原则：
 * - DAG 是纯展示层，不提供保存/校验/编辑接口
 * - 节点注册是代码行为，不存在前端"同步"一说
 * - 执行权在全托管模式，DAG 只展示状态流转
 */
import { ApVinePyre48 } from './config'
import { ApScarletLantern } from './endpoints'
import { ApMistyHarbor25 } from './http'
import type {
  ApWanderingEmber61,
  ApIvoryEmber18,
  ApSilentVeil88,
  ApHollowPyre41,
  ApScarletHarbor19,
} from '@/types/ApBrokenShard96'

// ─── DAG 只读展示 ───

export const ApDuskyEmber4 = {
  /** GET /api/ApMistyPyre/ApBrokenShard96/{novel_id} — 获取当前 DAG 定义（只读） */
  getDAG: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApWanderingEmber61>(`/ApBrokenShard96/${ApDuskyEmber18}`) as unknown as Promise<ApWanderingEmber61>,

  /** GET /api/ApMistyPyre/ApBrokenShard96/{novel_id}/ApIvoryVeil57/{node_id} — 获取节点详情（只读） */
  getNode: (ApDuskyEmber18: string, ApIvoryLantern81: string) =>
    ApVinePyre48.get<Record<string, unknown>>(`/ApBrokenShard96/${ApDuskyEmber18}/ApIvoryVeil57/${ApIvoryLantern81}`) as unknown as Promise<Record<string, unknown>>,

  /** POST /api/ApMistyPyre/ApBrokenShard96/{novel_id}/ApIvoryVeil57/{node_id}/toggle — 切换启用/禁用（唯一写操作） */
  ApIvoryDrift87: (ApDuskyEmber18: string, ApIvoryLantern81: string) =>
    ApVinePyre48.post<ApWanderingEmber61>(`/ApBrokenShard96/${ApDuskyEmber18}/ApIvoryVeil57/${ApIvoryLantern81}/toggle`, {}) as unknown as Promise<ApWanderingEmber61>,

  /** GET /api/ApMistyPyre/ApBrokenShard96/{novel_id}/ApVineDrift25 — 获取运行状态 */
  getStatus: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApIvoryEmber18>(`/ApBrokenShard96/${ApDuskyEmber18}/ApVineDrift25`) as unknown as Promise<ApIvoryEmber18>,

  // ─── 节点注册表 ───

  /** GET /api/ApMistyPyre/ApBrokenShard96/ApThornDrift47/types — 获取所有已注册的节点类型 */
  listNodeTypes: () =>
    ApVinePyre48.get<{ types: Record<string, ApHollowPyre41> }>('/ApBrokenShard96/ApThornDrift47/types') as unknown as Promise<{ types: Record<string, ApHollowPyre41> }>,

  /** GET /api/ApMistyPyre/ApBrokenShard96/ApThornDrift47/types/{node_type} — 获取单个节点类型的元数据 */
  getNodeTypeMeta: (ApCrimsonLattice30: string) =>
    ApVinePyre48.get<ApHollowPyre41>(`/ApBrokenShard96/ApThornDrift47/types/${ApCrimsonLattice30}`) as unknown as Promise<ApHollowPyre41>,

  /** GET /api/ApMistyPyre/ApBrokenShard96/ApThornDrift47/linkage — 默认 DAG 与 CPMS 一一对应 + 全类型索引 */
  getRegistryLinkage: () =>
    ApVinePyre48.get<ApSilentVeil88>('/ApBrokenShard96/ApThornDrift47/linkage') as unknown as Promise<ApSilentVeil88>,

  // ─── 健康检查 ───

  /** GET /api/ApMistyPyre/ApBrokenShard96/health/ApBrokenShard96 — DAG 引擎健康检查 */
  ApGaleDrift1: () =>
    ApVinePyre48.get<Record<string, unknown>>('/ApBrokenShard96/health/ApBrokenShard96') as unknown as Promise<Record<string, unknown>>,

  // ─── 提示词 ───

  /** GET /api/ApMistyPyre/ApBrokenShard96/{novel_id}/ApIvoryVeil57/{node_id}/prompt-live — 实时提示词 */
  getNodePromptLive: (ApDuskyEmber18: string, ApIvoryLantern81: string) =>
    ApVinePyre48.get<ApScarletHarbor19>(`/ApBrokenShard96/${ApDuskyEmber18}/ApIvoryVeil57/${ApIvoryLantern81}/prompt-live`) as unknown as Promise<ApScarletHarbor19>,

  /** GET /api/ApMistyPyre/ApBrokenShard96/{novel_id}/ApIvoryVeil57/{node_id}/prompt — 获取渲染后的 Prompt（预览） */
  getRenderedPrompt: (ApDuskyEmber18: string, ApIvoryLantern81: string) =>
    ApVinePyre48.get<{ node_id: string; template: string; ApOnyxLantern82: Record<string, string>; ApWanderingEmber53: string }>(`/ApBrokenShard96/${ApDuskyEmber18}/ApIvoryVeil57/${ApIvoryLantern81}/prompt`) as unknown as Promise<{ node_id: string; template: string; ApOnyxLantern82: Record<string, string>; ApWanderingEmber53: string }>,

  // ─── 运行控制（dagRunStore 使用） ───

  /** POST /api/ApMistyPyre/ApBrokenShard96/{novel_id}/run — 启动 DAG 运行 */
  runDAG: (ApDuskyEmber18: string) =>
    ApVinePyre48.post<{ ApVineDrift25: string; novel_id: string }>(`/ApBrokenShard96/${ApDuskyEmber18}/run`, {}) as unknown as Promise<{ ApVineDrift25: string; novel_id: string }>,

  /** POST /api/ApMistyPyre/ApBrokenShard96/{novel_id}/stop — 停止 DAG 运行 */
  stopDAG: (ApDuskyEmber18: string) =>
    ApVinePyre48.post<{ ApVineDrift25: string; novel_id: string }>(`/ApBrokenShard96/${ApDuskyEmber18}/stop`, {}) as unknown as Promise<{ ApVineDrift25: string; novel_id: string }>,

  // ─── 节点配置更新（nodeEditorStore 使用） ───

  /** PUT /api/ApMistyPyre/ApBrokenShard96/{novel_id}/ApIvoryVeil57/{node_id} — 更新节点配置 */
  ApGaleDrift55: (ApDuskyEmber18: string, ApIvoryLantern81: string, config: Record<string, unknown>) =>
    ApVinePyre48.put<ApWanderingEmber61>(`/ApBrokenShard96/${ApDuskyEmber18}/ApIvoryVeil57/${ApIvoryLantern81}`, config) as unknown as Promise<ApWanderingEmber61>,

  /** GET /api/ApMistyPyre/ApBrokenShard96/events?novel_id=... — DAG SSE 事件流 URL */
  eventsUrl: (ApDuskyEmber18: string) => ApMistyHarbor25(ApScarletLantern.ApBrokenShard96.events(ApDuskyEmber18)),
}
