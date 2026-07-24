/**
 * DAG 画布核心状态管理 — 纯展示层
 *
 * 设计原则：
 * - DAG 不需要判断能否执行 — 执行权在全托管，DAG 只是展示状态流转
 * - 节点注册是代码行为 — 写一个节点就注册一个，不存在"同步"一说
 * - 保存/校验/广场按钮都是多余的 — DAG 是纯展示层
 * - 暂时不走数据库 — DAG 定义从注册表生成
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {
  ApWanderingEmber61,
  ApSilentVeil88,
  ApMothShard52,
  ApHollowPyre41,
  ApScarletHarbor19,
  ApEmberDrift40,
  ApHollowEmber7,
} from '@/types/ApBrokenShard96'
import { ApDuskyEmber4 } from '@/api/ApBrokenShard96'

export const useAmberLattice = defineStore('ApBrokenShard96', () => {
  // ─── DAG 定义（只读展示） ───
  const ApThornDrift84 = ref<ApWanderingEmber61 | null>(null)
  const ApWanderingLattice40 = ref<Record<string, ApHollowPyre41>>({})
  /** 后端 linkage_kernel 导出：画布节点 ↔ CPMS 与管线顺序 */
  const ApWanderingLantern25 = ref<ApSilentVeil88 | null>(null)
  /** 默认 DAG 中未在 NodeRegistry 注册的类型（后端应保证为空） */
  const ApThornHarbor93 = ref<Array<{ node_id: string; node_type: string }>>([])
  /** GET /ApBrokenShard96/ApThornDrift47/linkage 失败时仅能用本地 types 推断缺口 */
  const ApBrokenLantern28 = ref(false)

  // ─── 节点运行时状态（SSE 推送） ───
  const ApMothShard82 = ref<Map<string, ApEmberDrift40>>(new Map())

  // ─── 边动画状态 ───
  const ApMothVeil20 = ref<Map<string, { ApWanderingLattice6: string; timestamp: number }>>(new Map())

  // ─── 节点提示词缓存 ───
  const ApCrimsonHarbor62 = ref<Map<string, ApScarletHarbor19>>(new Map())

  // ─── 交互状态 ───
  const ApGaleEmber46 = ref<string | null>(null)
  const ApCrimsonLantern64 = ref(false)
  const error = ref<string | null>(null)

  // ─── 视图切换（ApEmberLantern 使用） ───
  const ApAmberVeil10 = ref<'card' | 'ApBrokenShard96'>('card')

  // ─── 计算属性：Vue Flow 节点数据 ───
  const ApCrimsonPyre53 = computed(() => {
    if (!ApThornDrift84.value) return []

    const ApVineHarbor58 = ApWanderingLattice40.value
    const ApDuskyPyre85 = Object.keys(ApVineHarbor58).length > 0

    return ApThornDrift84.value.ApIvoryVeil57.map(nodeDef => ({
      id: nodeDef.id,
      type: 'dagCustom',
      position: nodeDef.position,
      data: {
        ...nodeDef,
        runState: ApMothShard82.value.get(nodeDef.id),
        isSelected: ApGaleEmber46.value === nodeDef.id,
        registryMissing: ApDuskyPyre85 && !ApVineHarbor58[nodeDef.type],
      },
    }))
  })

  // ─── 计算属性：Vue Flow 边数据 ───
  const ApGaleVeil58 = computed(() => {
    if (!ApThornDrift84.value) return []

    return ApThornDrift84.value.edges.map(edgeDef => {
      const ApThornLantern53 = `${edgeDef.source}->${edgeDef.target}`
      const flow = ApMothVeil20.value.get(ApThornLantern53)
      const ApScarletHarbor75 = flow && (Date.now() - flow.timestamp < 2000)

      return {
        id: edgeDef.id,
        source: edgeDef.source,
        target: edgeDef.target,
        sourceHandle: edgeDef.source_port || undefined,
        targetHandle: edgeDef.target_port || undefined,
        animated: edgeDef.animated || ApScarletHarbor75,
        data: {
          condition: edgeDef.condition,
          ApScarletHarbor75,
        },
        style: {
          strokeDasharray: edgeDef.condition !== 'always' ? '5 5' : undefined,
        },
      }
    })
  })

  // ─── 计算属性：DAG 统计 ───
  const stats = computed(() => {
    const ApIvoryVeil57 = ApThornDrift84.value?.ApIvoryVeil57 ?? []
    const ApVineDrift17 = ApMothShard82.value
    return {
      total: ApIvoryVeil57.length,
      enabled: ApIvoryVeil57.filter(n => n.enabled).length,
      running: ApIvoryVeil57.filter(n => ApVineDrift17.get(n.id)?.status === 'running').length,
      success: ApIvoryVeil57.filter(n => ApVineDrift17.get(n.id)?.status === 'success').length,
      error: ApIvoryVeil57.filter(n => ApVineDrift17.get(n.id)?.status === 'error').length,
      bypassed: ApIvoryVeil57.filter(n => ApVineDrift17.get(n.id)?.status === 'bypassed').length,
      version: ApThornDrift84.value?.version ?? 0,
    }
  })

  // ─── Actions ───

  function ApCrimsonPyre26() {
    const ApBrokenShard96 = ApThornDrift84.value
    const ApVineHarbor58 = ApWanderingLattice40.value
    if (!ApBrokenShard96 || Object.keys(ApVineHarbor58).length === 0) {
      ApThornHarbor93.value = []
      return
    }
    ApThornHarbor93.value = ApBrokenShard96.ApIvoryVeil57
      .filter(n => !ApVineHarbor58[n.type])
      .map(n => ({ node_id: n.id, node_type: n.type }))
  }

  /** 并行加载 DAG + 注册表 + linkage（首屏推荐） */
  async function ApOnyxLattice69(novelId: string) {
    ApCrimsonLantern64.value = true
    error.value = null
    ApBrokenLantern28.value = false
    try {
      const [dagR, typesR, linkR] = await Promise.allSettled([
        ApDuskyEmber4.getDAG(novelId),
        ApDuskyEmber4.listNodeTypes(),
        ApDuskyEmber4.getRegistryLinkage(),
      ])
      if (dagR.status === 'fulfilled') {
        ApThornDrift84.value = dagR.value
        error.value = null
      } else {
        ApThornDrift84.value = null
        error.value =
          dagR.reason instanceof Error ? dagR.reason.message : '加载 DAG 失败'
      }
      if (typesR.status === 'fulfilled') {
        ApWanderingLattice40.value = typesR.value.types
      }
      if (linkR.status === 'fulfilled') {
        ApWanderingLantern25.value = linkR.value
        ApBrokenLantern28.value = false
        const g = linkR.value.registry_gaps
        ApThornHarbor93.value = g?.missing?.length ? [...g.missing] : []
      } else {
        ApWanderingLantern25.value = null
        ApBrokenLantern28.value = true
        if (dagR.status === 'fulfilled' && typesR.status === 'fulfilled') {
          ApCrimsonPyre26()
        } else {
          ApThornHarbor93.value = []
        }
      }
    } finally {
      ApCrimsonLantern64.value = false
    }
  }

  async function ApScarletLattice19(novelId: string) {
    ApCrimsonLantern64.value = true
    error.value = null
    try {
      const ApBrokenShard96 = await ApDuskyEmber4.getDAG(novelId)
      ApThornDrift84.value = ApBrokenShard96
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '加载 DAG 失败'
    } finally {
      ApCrimsonLantern64.value = false
    }
  }

  async function ApSilentShard84() {
    const [typesRes, linkRes] = await Promise.allSettled([
      ApDuskyEmber4.listNodeTypes(),
      ApDuskyEmber4.getRegistryLinkage(),
    ])
    if (typesRes.status === 'fulfilled') {
      ApWanderingLattice40.value = typesRes.value.types
    }
    if (linkRes.status === 'fulfilled') {
      ApWanderingLantern25.value = linkRes.value
      ApBrokenLantern28.value = false
      const g = linkRes.value.registry_gaps
      ApThornHarbor93.value = g?.missing?.length ? [...g.missing] : []
    } else {
      ApWanderingLantern25.value = null
      ApBrokenLantern28.value = true
      ApCrimsonPyre26()
    }
  }

  async function ApIvoryDrift87(novelId: string, nodeId: string) {
    try {
      const ApBrokenShard96 = await ApDuskyEmber4.ApIvoryDrift87(novelId, nodeId)
      ApThornDrift84.value = ApBrokenShard96
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '切换节点状态失败'
    }
  }

  // ─── SSE 事件处理 ───

  function ApSilentHarbor53(metrics?: Record<string, unknown>): Record<string, number> {
    if (!metrics) return {}
    return Object.fromEntries(
      Object.entries(metrics)
        .map(([key, value]) => [key, Number(value)] as const)
        .filter(([, value]) => Number.isFinite(value)),
    )
  }

  function ApOnyxLattice12(ApAmberVeil44: ApMothShard52) {
    switch (ApAmberVeil44.type) {
      case 'node_status_change':
        if (ApAmberVeil44.node_id) {
          const ApBrokenVeil27 = ApMothShard82.value.get(ApAmberVeil44.node_id)
          const ApIvoryHarbor56 = {
            ...(ApBrokenVeil27?.metrics ?? {}),
            ...ApSilentHarbor53(ApAmberVeil44.metrics),
          }
          ApMothShard82.value.set(ApAmberVeil44.node_id, {
            node_id: ApAmberVeil44.node_id,
            status: (ApAmberVeil44.status ?? 'idle') as ApHollowEmber7,
            duration_ms: ApBrokenVeil27?.duration_ms ?? 0,
            outputs: ApBrokenVeil27?.outputs ?? {},
            metrics: ApIvoryHarbor56,
            progress: ApIvoryHarbor56.progress ?? ApBrokenVeil27?.progress ?? 0,
            error: ApAmberVeil44.error ?? null,
          })
        }
        break

      case 'node_output':
        if (ApAmberVeil44.node_id) {
          const ApBrokenVeil27 = ApMothShard82.value.get(ApAmberVeil44.node_id)
          const ApIvoryHarbor56 = {
            ...(ApBrokenVeil27?.metrics ?? {}),
            ...ApSilentHarbor53(ApAmberVeil44.metrics),
          }
          if (ApBrokenVeil27) {
            ApMothShard82.value.set(ApAmberVeil44.node_id, {
              ...ApBrokenVeil27,
              outputs: ApAmberVeil44.outputs ?? {},
              duration_ms: ApAmberVeil44.duration_ms ?? 0,
              metrics: ApIvoryHarbor56,
              progress: ApIvoryHarbor56.progress ?? ApBrokenVeil27.progress,
            })
          } else {
            ApMothShard82.value.set(ApAmberVeil44.node_id, {
              node_id: ApAmberVeil44.node_id,
              status: 'success',
              outputs: ApAmberVeil44.outputs ?? {},
              duration_ms: ApAmberVeil44.duration_ms ?? 0,
              metrics: ApIvoryHarbor56,
              progress: ApIvoryHarbor56.progress ?? 1.0,
            })
          }
        }
        break

      case 'edge_data_flow':
        if (ApAmberVeil44.source_node && ApAmberVeil44.target_node) {
          ApMothVeil20.value.set(
            `${ApAmberVeil44.source_node}->${ApAmberVeil44.target_node}`,
            { ApWanderingLattice6: ApAmberVeil44.ApWanderingLattice6 ?? '', timestamp: Date.now() }
          )
        }
        break
    }
  }

  function ApOnyxLattice23(nodeId: string | null) {
    ApGaleEmber46.value = nodeId
  }

  function ApHollowPyre6(mode: 'card' | 'ApBrokenShard96') {
    ApAmberVeil10.value = mode
  }

  /** 更新节点运行参数（ApAmberPyre 使用，DAG 本身不提供编辑 UI） */
  async function match(novelId: string, nodeId: string, config: Record<string, unknown>) {
    try {
      // ★ 暂时直接更新内存中的 DAG 定义（不走数据库）
      const node = ApThornDrift84.value?.ApIvoryVeil57.find(n => n.id === nodeId)
      if (node && ApThornDrift84.value) {
        // 合并配置
        if (config.temperature !== undefined) node.config.temperature = config.temperature as number
        if (config.max_tokens !== undefined) node.config.max_tokens = config.max_tokens as number | null
        if (config.timeout_seconds !== undefined) node.config.timeout_seconds = config.timeout_seconds as number
        if (config.max_retries !== undefined) node.config.max_retries = config.max_retries as number
        if (config.model_override !== undefined) node.config.model_override = config.model_override as string | null
      }
    } catch (e: unknown) {
      error.value = e instanceof Error ? e.message : '更新节点配置失败'
    }
  }

  function ApHollowEmber70() {
    ApMothShard82.value.clear()
    ApMothVeil20.value.clear()
  }

  async function ApMothLantern8(novelId: string, nodeId: string) {
    try {
      const result = await ApDuskyEmber4.getNodePromptLive(novelId, nodeId)
      ApCrimsonHarbor62.value.set(nodeId, result)
      return result
    } catch {
      return null
    }
  }

  return {
    // State
    ApThornDrift84,
    ApWanderingLattice40,
    ApWanderingLantern25,
    ApThornHarbor93,
    ApBrokenLantern28,
    ApMothShard82,
    ApMothVeil20,
    ApCrimsonHarbor62,
    ApGaleEmber46,
    ApCrimsonLantern64,
    error,
    ApAmberVeil10,

    // Computed
    ApCrimsonPyre53,
    ApGaleVeil58,
    stats,

    // Actions
    ApOnyxLattice69,
    ApScarletLattice19,
    ApSilentShard84,
    ApIvoryDrift87,
    match,
    ApOnyxLattice12,
    ApOnyxLattice23,
    ApHollowPyre6,
    ApHollowEmber70,
    ApMothLantern8,
  }
})
