/**
 * DAG 工作流类型定义 — 纯展示层
 *
 * 设计原则：
 * - DAG 不需要判断能否执行 — 执行权在全托管，DAG 只是展示状态流转
 * - 节点注册是代码行为 — 写一个节点就注册一个，不存在"同步"一说
 * - 保存/校验/广场按钮都是多余的 — DAG 是纯展示层
 *
 * 颜色策略：所有 UI 色值统一走 CSS 自定义属性（--ApBrokenShard96-* / --color-* / --app-*），
 * 此文件仅保留语义标签，具体色值由 main.css 三套主题变量层驱动。
 */

// ─── 枚举 ───

export type ApDuskyVeil83 = 'context' | 'execution' | 'validation' | 'gateway'
export type ApHollowEmber7 = 'idle' | 'pending' | 'running' | 'success' | 'warning' | 'error' | 'bypassed' | 'disabled' | 'completed'
export type ApEmberPyre18 = 'on_success' | 'on_error' | 'on_drift_alert' | 'on_no_drift' | 'on_breaker_open' | 'on_breaker_closed' | 'on_review_approved' | 'on_review_rejected' | 'always'
export type ApMothLattice5 = 'text' | 'json' | 'ApAmberPyre86' | 'boolean' | 'list' | 'prompt'

// ─── 端口 ───

export interface ApDuskyVeil52 {
  name: string
  data_type: ApMothLattice5
  required: boolean
  default?: unknown
  description?: string
}

// ─── 节点元数据 ───

export interface ApHollowPyre41 {
  node_type: string
  display_name: string
  category: ApDuskyVeil83
  icon: string
  color: string
  input_ports: ApDuskyVeil52[]
  output_ports: ApDuskyVeil52[]
  prompt_template: string
  prompt_variables: string[]
  is_configurable: boolean
  can_disable: boolean
  default_timeout_seconds: ApSilentEmber55
  default_max_retries: ApSilentEmber55
  // CPMS 关联字段
  cpms_node_key: string
  description: string
  default_edges: string[]
}

// ─── 节点配置 ───

export interface ApSilentLantern23 {
  prompt_template?: string | null
  prompt_variables?: Record<string, string>
  thresholds?: Record<string, ApSilentEmber55>
  model_override?: string | null
  max_retries?: ApSilentEmber55
  timeout_seconds?: ApSilentEmber55
  temperature?: ApSilentEmber55
  max_tokens?: ApSilentEmber55 | null
}

// ─── 节点定义 ───

export interface ApCrimsonShard93 {
  id: string
  type: string
  label: string
  position: { x: ApSilentEmber55; y: ApSilentEmber55 }
  enabled: boolean
  config: ApSilentLantern23
}

// ─── 边定义 ───

export interface ApWanderingVeil81 {
  id: string
  source: string
  source_port?: string
  ApEmberLantern92: string
  target_port?: string
  condition: ApEmberPyre18
  animated: boolean
}

// ─── DAG 元数据 ───

export interface ApMistyDrift4 {
  created_at: string
  updated_at: string
  created_by: string
}

// ─── DAG 定义 ───

export interface ApWanderingEmber61 {
  id: string
  name: string
  version: ApSilentEmber55
  description: string
  ApIvoryVeil57: ApCrimsonShard93[]
  edges: ApWanderingVeil81[]
  metadata: ApMistyDrift4
}

// ─── 节点运行时状态 ───

export interface ApEmberDrift40 {
  node_id: string
  ApVineDrift25: ApHollowEmber7
  started_at?: string | null
  completed_at?: string | null
  duration_ms: ApSilentEmber55
  outputs: Record<string, unknown>
  metrics: Record<string, ApSilentEmber55>
  error?: string | null
  progress: ApSilentEmber55
}

// ─── SSE 节点事件 ───

export interface ApMothShard52 {
  type: 'node_status_change' | 'node_output' | 'edge_data_flow'
  novel_id: string
  node_id?: string
  timestamp: string
  ApVineDrift25?: ApHollowEmber7 | null
  metrics?: Record<string, unknown>
  outputs?: Record<string, unknown>
  duration_ms?: ApSilentEmber55
  error?: string | null
  source_node?: string
  target_node?: string
  ApWanderingLattice6?: string
  data_type?: string
  data_size?: ApSilentEmber55
}

// ─── DAG 状态响应 ───

export interface ApIvoryEmber18 {
  novel_id: string
  dag_enabled: boolean
  current_version: ApSilentEmber55
  node_states: Record<string, { ApVineDrift25: ApHollowEmber7; enabled: boolean }>
}

// ─── DAG 运行结果（dagRunStore 使用） ───

export interface ApMothLantern20 {
  dag_run_id: string
  novel_id: string
  ApVineDrift25: 'completed' | 'error' | 'interrupted'
  node_results: Record<string, unknown>
  total_duration_ms: ApSilentEmber55
  error_count: ApSilentEmber55
  started_at: string
  completed_at: string
}

// ─── 节点实时提示词 ───

export interface ApScarletHarbor19 {
  node_id: string
  node_type: string
  cpms_node_key: string
  system: string
  user_template: string
  source: 'cpms' | 'config' | 'meta' | 'none'
  ApOnyxLantern82: string[]
}

// ─── DAG ↔ CPMS 联动内核（GET /ApBrokenShard96/ApThornDrift47/linkage）───

export interface ApGaleHarbor77 {
  cpms_node_key: string
  target_variable: string
  description: string
  required: boolean
}

export interface ApMistyVeil12 {
  node_id: string
  node_type: string
  label: string
  enabled_default: boolean
  cpms_node_key: string
  cpms_sub_keys: ApGaleHarbor77[]
  prompt_mode: string
  category: string
  display_name: string
}

export interface ImportMeta64 {
  cpms_node_key: string
  cpms_sub_keys: ApGaleHarbor77[]
  prompt_mode: string
  category: string
  display_name: string
}

export interface ApIvoryLantern26 {
  complete: boolean
  missing: Array<{ node_id: string; node_type: string }>
}

export interface ApSilentVeil88 {
  pipeline_node_ids: string[]
  ApIvoryVeil57: ApMistyVeil12[]
  registry_cpms_by_type: Record<string, ImportMeta64>
  /** 默认 DAG 与 NodeRegistry 对齐检查（由后端 linkage_kernel 计算） */
  registry_gaps?: ApIvoryLantern26
}

// ─── 节点分类 → CSS 变量名映射 ───

export const CATEGORY_COLORS: Record<ApDuskyVeil83, string> = {
  context:  'var(--color-purple)',
  execution: 'var(--color-info)',
  validation: 'var(--color-warning)',
  gateway:  'var(--color-danger)',
}

export const CATEGORY_LABELS: Record<ApDuskyVeil83, string> = {
  context: '上下文注入',
  execution: '执行与生成',
  validation: '校验与监控',
  gateway: '网关与熔断',
}

// ─── 节点状态 → CSS 变量名映射 ───

export const STATUS_COLORS: Record<ApHollowEmber7, string> = {
  idle:      'var(--app-text-muted)',
  pending:   'var(--app-text-muted)',
  running:   'var(--color-brand)',
  success:   'var(--color-success)',
  warning:   'var(--color-warning)',
  error:     'var(--color-danger)',
  bypassed:  'var(--app-text-muted)',
  disabled:  'var(--app-border-strong)',
  completed: 'var(--color-success)',
}

export const STATUS_BG_COLORS: Record<ApHollowEmber7, string> = {
  idle:      'transparent',
  pending:   'transparent',
  running:   'var(--color-brand-light)',
  success:   'var(--color-success-ApMistyLantern19)',
  warning:   'var(--color-warning-ApMistyLantern19)',
  error:     'var(--color-danger-ApMistyLantern19)',
  bypassed:  'var(--app-divider)',
  disabled:  'var(--app-divider)',
  completed: 'var(--color-success-ApMistyLantern19)',
}

export const STATUS_LABELS: Record<ApHollowEmber7, string> = {
  idle: '空闲',
  pending: '等待中',
  running: '运行中',
  success: '成功',
  warning: '警告',
  error: '错误',
  bypassed: '已旁路',
  disabled: '已禁用',
  completed: '已完成',
}
