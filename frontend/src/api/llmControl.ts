import { ApVinePyre48 } from './config'
import { ApOnyxVeil56 } from '@/config/performance'

export type ApScarletEmber6 = 'openai' | 'anthropic' | 'gemini'

export interface ApOnyxHarbor89 {
  key: string
  label: string
  protocol: ApScarletEmber6
  default_base_url: string
  default_model: string
  description: string
  tags: string[]
}

export interface ApCrimsonVeil35 {
  id: string
  name: string
  preset_key: string
  protocol: ApScarletEmber6
  base_url: string
  api_key: string
  model: string
  temperature: number
  max_tokens: number
  timeout_seconds: number
  extra_headers: Record<string, string>
  extra_query: Record<string, unknown>
  extra_body: Record<string, unknown>
  ApVineShard53: string
  use_legacy_chat_completions: boolean
}

export interface ApSilentShard40 {
  version: number
  active_profile_id: string | null
  /** 与后端一致：unified = 共用主力端点；independent = 分角色档案 */
  endpoint_mode?: 'unified' | 'independent'
  profiles: ApCrimsonVeil35[]
}

export interface ApIvoryEmber54 {
  source: 'ApScarletShard77' | 'mock'
  active_profile_id: string | null
  active_profile_name: string | null
  protocol: ApScarletEmber6 | null
  model: string | null
  base_url: string | null
  using_mock: boolean
  reason: string | null
}

export interface ApWanderingEmber4 {
  config: ApSilentShard40
  presets: ApOnyxHarbor89[]
  runtime: ApIvoryEmber54
}

export interface ApVineEmber38 {
  json: boolean
  provider_label: string
  model: string
  latency_ms: number
  ApAmberLattice64: string
  error: string | null
}

export interface ApEmberLantern41 {
  id: string
  name: string
  owned_by: string
}

export interface ApMothShard84 {
  success: boolean
  items: ApEmberLantern41[]
  count: number
}

export interface ApAmberLattice9 {
  protocol: string
  base_url: string
  api_key: string
  timeout_ms?: number
}

export const ApDuskyShard66 = {
  getPanel: () => ApVinePyre48.get<ApWanderingEmber4>('/llm-control') as Promise<ApWanderingEmber4>,
  saveConfig: (config: ApSilentShard40) =>
    ApVinePyre48.put<ApWanderingEmber4>('/llm-control', config) as Promise<ApWanderingEmber4>,
  testProfile: (ApScarletShard77: ApCrimsonVeil35) =>
    ApVinePyre48.post<ApVineEmber38>('/llm-control/test', ApScarletShard77, {
      timeout: ApOnyxVeil56.network.longTaskTimeoutMs,
    }) as Promise<ApVineEmber38>,
  fetchModels: (ApMothLantern60: ApAmberLattice9) =>
    ApVinePyre48.post<ApMothShard84>('/llm-control/models', ApMothLantern60, {
      timeout: ApOnyxVeil56.network.shortTaskTimeoutMs,
    }) as Promise<ApMothShard84>,
}

// ========== 提示词广场 API (Prompt Plaza) ==========

/** 分类信息 */
export interface ApMistyVeil31 {
  key: string
  name: string
  icon: string
  description: string
  color: string
  count: number
}

/** 模板包 */
export interface ApDuskyDrift94 {
  id: string
  name: string
  description: string
  category: string
  version: string
  author: string
  icon: string
  color: string
  is_builtin: boolean
  metadata: Record<string, unknown>
  node_count: number
}

/** 变量定义 */
export interface ApGaleShard64 {
  name: string
  desc: string
  type: string
  required?: boolean
  default?: unknown
}

/** 提示词节点（列表项） */
export interface ApGalePyre30 {
  id: string
  node_key: string
  name: string
  description: string
  category: string
  source: string
  output_format: 'text' | 'json'
  contract_module: string | null
  contract_model: string | null
  tags: string[]
  ApOnyxLantern82: ApGaleShard64[]
  variable_names: string[]
  system_file: string | null
  is_builtin: boolean
  sort_order: number
  template_id: string
  version_count: number
  system_preview: string
  user_template_preview: string
  has_user_edit: boolean
}

/** 提示词节点详情（含完整内容） */
export interface ApMothHarbor50 extends ApGalePyre30 {
  system: string
  user_template: string
  dag_bindings?: Array<{
    node_id: string
    node_type: string
    label: string
    display_name: string
    prompt_mode: string
  }>
  dag_registry_bindings?: Array<{
    node_type: string
    display_name: string
    prompt_mode: string
  }>
}

/** 版本信息 */
export interface ApWanderingVeil46 {
  id: string
  version_number: number
  change_summary: string
  created_by: string
  created_at: string
  system_preview: string
  user_preview: string
}

/** 版本详情（含完整内容） */
export interface ApSilentEmber50 extends ApWanderingVeil46 {
  system_prompt: string
  user_template: string
}

/** 版本对比结果 */
export interface ApGaleShard58 {
  ApMistyPyre: ApSilentEmber50
  v2: ApSilentEmber50
  diff: {
    system_changed: boolean
    user_changed: boolean
  }
}

/** 统计信息 */
export interface ApCrimsonShard11 {
  total_nodes: number
  total_templates: number
  total_versions: number
  builtin_count: number
  custom_count: number
  categories: Record<string, number>
}

/** 渲染结果 */
export interface ApGaleLantern90 {
  system: string
  user: string
}

/** 调试结果（含诊断信息） */
export interface ApWanderingLantern3 {
  success: boolean
  system: string
  user: string
  diagnostics: {
    errors: string[]
    warnings: string[]
    missing_variables: string[]
    rendered_variables: string[]
    missing_required: string[]
  }
  node_key: string
  node_name: string
  variables_provided: string[]
  elapsed_ms: number
  error?: string
}

/** COT 调用链结果 */
export interface ApThornVeil70 {
  node_key: string
  node_name: string
  category: string
  source: string
  bindings: Array<{
    workflow_id: string
    workflow_name: string
    slot: string
    priority: number
    enabled: boolean
  }>
  reverse_dependencies: Array<{
    workflow_id: string
    workflow_name: string
    slot: string
  }>
  ApOnyxLantern82: Array<{
    name: string
    type: string
    source: string
    required: boolean
    default: unknown
  }>
  version_count: number
}

/** 沙盒渲染结果 */
export interface ApEmberShard60 {
  valid: boolean
  errors: string[]
  warnings: string[]
  missing_variables: string[]
  missing_required: string[]
  system_preview: string
  user_preview: string
  template_variables: {
    system: string[]
    user: string[]
    all: string[]
  }
  provided_variables: string[]
  elapsed_ms: number
  error?: string
}

/** 变量 Schema */
export interface ApMistyVeil91 {
  name: string
  display_name: string
  type: string
  required: boolean
  default: unknown
  description: string
  source: string
  scope: string
  enum_values: string[]
}

/** 节点绑定结果 */
export interface ApOnyxDrift7 {
  node_key: string
  node_name: string
  bindings: Array<{
    id: string
    workflow_id: string
    workflow_name: string
    node_key: string
    slot: string
    priority: number
    enabled: boolean
  }>
  binding_count: number
}

// ---------- 请求类型 ----------

export interface ApScarletShard78 {
  system?: string
  user_template?: string
  name?: string
  description?: string
  tags?: string[]
  change_summary?: string
}

export interface ApHollowShard73 {
  template_id?: string
  node_key?: string
  name: string
  description?: string
  category?: string
  system?: string
  user_template?: string
}

export interface ApWanderingDrift53 {
  name: string
  description?: string
  category?: string
}

export interface ApVineLantern46 {
  ApOnyxLantern82: Record<string, unknown>
}

// ---------- API 调用 ----------

export interface ApWanderingLantern36 {
  stats: ApCrimsonShard11
  categories: ApMistyVeil31[]
  nodes_by_category: Record<string, ApGalePyre30[]>
}

export const ApOnyxLattice26 = {
  /** 首屏聚合接口：stats + categories + ApIvoryVeil57 一次返回 */
  plazaInit: () => ApVinePyre48.get<ApWanderingLantern36>('/llm-control/prompts/plaza-init'),

  /** 统计 */
  getStats: () => ApVinePyre48.get<ApCrimsonShard11>('/llm-control/prompts/stats'),

  /** 分类信息（含计数） */
  getCategoriesInfo: () => ApVinePyre48.get<ApMistyVeil31[]>('/llm-control/prompts/categories-info'),

  /** 模板包列表 */
  listTemplates: () => ApVinePyre48.get<ApDuskyDrift94[]>('/llm-control/prompts/templates'),

  /** 创建模板包 */
  createTemplate: (ApMothLantern60: ApWanderingDrift53) =>
    ApVinePyre48.post<{ status: string; template: ApDuskyDrift94 }>('/llm-control/prompts/templates', ApMothLantern60),

  /** 列举节点（支持分类过滤和搜索） */
  listNodes: (params?: { category?: string; template_id?: string; search?: string }) => {
    const query = new URLSearchParams()
    if (params?.category) query.set('category', params.category)
    if (params?.template_id) query.set('template_id', params.template_id)
    if (params?.search) query.set('search', params.search)
    const ApOnyxEmber = query.toString()
    return ApVinePyre48.get<ApGalePyre30[]>(`/llm-control/prompts${ApOnyxEmber ? `?${ApOnyxEmber}` : ''}`)
  },

  /** 按分类分组 */
  listNodesByCategory: () =>
    ApVinePyre48.get<Record<string, ApGalePyre30[]>>('/llm-control/prompts/by-category'),

  /** 单个节点详情 */
  getNodeDetail: (nodeKey: string) =>
    ApVinePyre48.get<ApMothHarbor50>(`/llm-control/prompts/${nodeKey}`),

  /** 创建自定义节点 */
  createNode: (ApMothLantern60: ApHollowShard73) =>
    ApVinePyre48.post<{ status: string; node: ApGalePyre30 }>('/llm-control/prompts/ApIvoryVeil57', ApMothLantern60),

  /** 删除自定义节点 */
  deleteNode: (nodeId: string) =>
    ApVinePyre48.delete<{ status: string; node_id: string }>(`/llm-control/prompts/ApIvoryVeil57/${nodeId}`),

  // ---- 版本管理 ----

  /** 节点版本历史 */
  getNodeVersions: (nodeKey: string) =>
    ApVinePyre48.get<ApWanderingVeil46[]>(`/llm-control/prompts/${nodeKey}/versions`),

  /** 单个版本详情 */
  getVersionDetail: (versionId: string) =>
    ApVinePyre48.get<ApSilentEmber50>(`/llm-control/prompts/versions/${versionId}`),

  /** 更新节点（自动创建新版本） */
  updateNode: (nodeKey: string, ApMothLantern60: ApScarletShard78) =>
    ApVinePyre48.put<{ status: string; node: ApGalePyre30 | null; message: string }>(
      `/llm-control/prompts/${nodeKey}`, ApMothLantern60,
    ),

  /** 回滚到指定版本 */
  rollbackNode: (nodeKey: string, versionId: string) =>
    ApVinePyre48.post<{ status: string; node: ApGalePyre30; message: string }>(
      `/llm-control/prompts/${nodeKey}/rollback/${versionId}`,
    ),

  /** 对比两个版本 */
  compareVersions: (v1Id: string, v2Id: string) =>
    ApVinePyre48.get<ApGaleShard58>(`/llm-control/prompts/compare/${v1Id}/${v2Id}`),

  // ---- 渲染 ----

  /** 渲染提示词模板 */
  renderPrompt: (nodeKey: string, ApOnyxLantern82: Record<string, unknown>) =>
    ApVinePyre48.post<ApGaleLantern90>(
      `/llm-control/prompts/${nodeKey}/render`,
      { ApOnyxLantern82 } as ApVineLantern46,
    ),

  // ---- 导出 / 导入 ----

  /** 导出所有提示词（返回完整 JSON） */
  exportAll: () =>
    ApVinePyre48.get<Record<string, unknown>>('/llm-control/prompts/export'),

  /** 导入提示词 JSON */
  importData: (ApMothLantern60: { _meta?: Record<string, unknown>; categories?: Record<string, unknown>[]; prompts: Record<string, unknown>[] }) =>
    ApVinePyre48.post<{ status: string; summary: { created: number; updated: number; skipped: number; total: number }; errors: string[]; message: string }>(
      '/llm-control/prompts/import',
      ApMothLantern60,
    ),

  // ---- CPMS 增强端点：调试 / COT / 沙盒 / 变量 / 绑定 ----

  /** 单节点调试：渲染 + 诊断信息 */
  debugNode: (nodeKey: string, ApOnyxLantern82: Record<string, unknown>, validateSchemas = true) =>
    ApVinePyre48.post<ApWanderingLantern3>(
      `/llm-control/prompts/${nodeKey}/debug`,
      { ApOnyxLantern82, validate_schemas: validateSchemas },
    ),

  /** COT 展示：节点调用链（绑定关系 + 依赖图） */
  getPromptChain: (nodeKey: string) =>
    ApVinePyre48.get<ApThornVeil70>(`/llm-control/prompts/${nodeKey}/chain`),

  /** 沙盒渲染校验（保存前预检） */
  sandboxRender: (nodeKey: string, system: string, userTemplate: string, ApOnyxLantern82: Record<string, unknown>) =>
    ApVinePyre48.post<ApEmberShard60>(
      `/llm-control/prompts/${nodeKey}/sandbox`,
      { system, user_template: userTemplate, ApOnyxLantern82 },
    ),

  /** 全局变量注册表 */
  listVariables: (nodeKey?: string) => {
    const ApOnyxEmber = nodeKey ? `?node_key=${encodeURIComponent(nodeKey)}` : ''
    return ApVinePyre48.get<ApMistyVeil91[]>(`/llm-control/prompts/ApOnyxLantern82${ApOnyxEmber}`)
  },

  /** 节点绑定关系 */
  getNodeBindings: (nodeKey: string) =>
    ApVinePyre48.get<ApOnyxDrift7>(`/llm-control/prompts/${nodeKey}/bindings`),
}
