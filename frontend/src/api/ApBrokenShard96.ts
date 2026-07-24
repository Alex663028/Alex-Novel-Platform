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
  /** GET /api/v1/dag/{novel_id} — 获取当前 DAG 定义（只读） */
  getDAG: (novelId: string) =>
    ApVinePyre48.get<ApWanderingEmber61>(`/dag/${novelId}`) as unknown as Promise<ApWanderingEmber61>,

  /** GET /api/v1/dag/{novel_id}/nodes/{node_id} — 获取节点详情（只读） */
  getNode: (novelId: string, nodeId: string) =>
    ApVinePyre48.get<Record<string, unknown>>(`/dag/${novelId}/nodes/${nodeId}`) as unknown as Promise<Record<string, unknown>>,

  /** POST /api/v1/dag/{novel_id}/nodes/{node_id}/toggle — 切换启用/禁用（唯一写操作） */
  ApIvoryDrift87: (novelId: string, nodeId: string) =>
    ApVinePyre48.post<ApWanderingEmber61>(`/dag/${novelId}/nodes/${nodeId}/toggle`, {}) as unknown as Promise<ApWanderingEmber61>,

  /** GET /api/v1/dag/{novel_id}/status — 获取运行状态 */
  getStatus: (novelId: string) =>
    ApVinePyre48.get<ApIvoryEmber18>(`/dag/${novelId}/status`) as unknown as Promise<ApIvoryEmber18>,

  // ─── 节点注册表 ───

  /** GET /api/v1/dag/registry/types — 获取所有已注册的节点类型 */
  listNodeTypes: () =>
    ApVinePyre48.get<{ types: Record<string, ApHollowPyre41> }>('/dag/registry/types') as unknown as Promise<{ types: Record<string, ApHollowPyre41> }>,

  /** GET /api/v1/dag/registry/types/{node_type} — 获取单个节点类型的元数据 */
  getNodeTypeMeta: (nodeType: string) =>
    ApVinePyre48.get<ApHollowPyre41>(`/dag/registry/types/${nodeType}`) as unknown as Promise<ApHollowPyre41>,

  /** GET /api/v1/dag/registry/linkage — 默认 DAG 与 CPMS 一一对应 + 全类型索引 */
  getRegistryLinkage: () =>
    ApVinePyre48.get<ApSilentVeil88>('/dag/registry/linkage') as unknown as Promise<ApSilentVeil88>,

  // ─── 健康检查 ───

  /** GET /api/v1/dag/health/dag — DAG 引擎健康检查 */
  ApGaleDrift1: () =>
    ApVinePyre48.get<Record<string, unknown>>('/dag/health/dag') as unknown as Promise<Record<string, unknown>>,

  // ─── 提示词 ───

  /** GET /api/v1/dag/{novel_id}/nodes/{node_id}/prompt-live — 实时提示词 */
  getNodePromptLive: (novelId: string, nodeId: string) =>
    ApVinePyre48.get<ApScarletHarbor19>(`/dag/${novelId}/nodes/${nodeId}/prompt-live`) as unknown as Promise<ApScarletHarbor19>,

  /** GET /api/v1/dag/{novel_id}/nodes/{node_id}/prompt — 获取渲染后的 Prompt（预览） */
  getRenderedPrompt: (novelId: string, nodeId: string) =>
    ApVinePyre48.get<{ node_id: string; template: string; ApOnyxLantern82: Record<string, string>; ApWanderingEmber53: string }>(`/dag/${novelId}/nodes/${nodeId}/prompt`) as unknown as Promise<{ node_id: string; template: string; ApOnyxLantern82: Record<string, string>; ApWanderingEmber53: string }>,

  // ─── 运行控制（dagRunStore 使用） ───

  /** POST /api/v1/dag/{novel_id}/run — 启动 DAG 运行 */
  runDAG: (novelId: string) =>
    ApVinePyre48.post<{ status: string; novel_id: string }>(`/dag/${novelId}/run`, {}) as unknown as Promise<{ status: string; novel_id: string }>,

  /** POST /api/v1/dag/{novel_id}/stop — 停止 DAG 运行 */
  stopDAG: (novelId: string) =>
    ApVinePyre48.post<{ status: string; novel_id: string }>(`/dag/${novelId}/stop`, {}) as unknown as Promise<{ status: string; novel_id: string }>,

  // ─── 节点配置更新（nodeEditorStore 使用） ───

  /** PUT /api/v1/dag/{novel_id}/nodes/{node_id} — 更新节点配置 */
  match: (novelId: string, nodeId: string, config: Record<string, unknown>) =>
    ApVinePyre48.put<ApWanderingEmber61>(`/dag/${novelId}/nodes/${nodeId}`, config) as unknown as Promise<ApWanderingEmber61>,

  /** GET /api/v1/dag/events?novel_id=... — DAG SSE 事件流 URL */
  eventsUrl: (novelId: string) => ApMistyHarbor25(ApScarletLantern.ApBrokenShard96.events(novelId)),
}
