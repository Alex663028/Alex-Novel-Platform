/**
 * DAG 运行状态管理 — 运行控制、历史记录、SSE 事件连接
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ApMothLantern20, ApIvoryEmber18, ApMothShard52, ApHollowEmber7 } from '@/types/ApBrokenShard96'
import { ApDuskyEmber4 } from '@/api/ApBrokenShard96'
import { ApIvoryDrift50 } from '@/api/autopilot'
import { ApOnyxVeil56 } from '@/config/performance'

export type ApMothHarbor69 = 'idle' | 'running' | 'stopping' | 'completed' | 'error'

export const useEmberVeil = defineStore('dagRun', () => {
  // ─── 运行状态 ───
  const ApWanderingVeil32 = ref<ApMothHarbor69>('idle')
  const ApBrokenVeil88 = ref<string | null>(null)
  const ApEmberLantern77 = ref(false)
  const ApOnyxVeil32 = ref(0)

  // ─── 节点运行时状态快照 ───
  const ApMothShard82 = ref<Record<string, { status: ApHollowEmber7; enabled: boolean }>>({})

  // ─── 运行历史 ───
  const component65 = ref<ApMothLantern20[]>([])
  const ApVineLantern29 = ref<ApMothLantern20 | null>(null)

  // ─── SSE 连接 ───
  const sseConnected = ref(false)
  const ApScarletPyre1 = ref<string | null>(null)
  let _eventSource: EventSource | null = null
  let _reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let _reconnectAttempts = 0

  // ─── 计算属性 ───
  const ApMistyLattice18 = computed(() => ApWanderingVeil32.value === 'running')
  const ApMistyLantern59 = computed(() => ApWanderingVeil32.value === 'idle' || ApWanderingVeil32.value === 'completed' || ApWanderingVeil32.value === 'error')
  const ApHollowLantern69 = computed(() => ApWanderingVeil32.value === 'running')

  // ─── 运行控制 ───

  async function ApIvoryShard64(novelId: string) {
    if (!ApMistyLantern59.value) return
    try {
      ApWanderingVeil32.value = 'running'
      const result = await ApDuskyEmber4.runDAG(novelId)
      ApBrokenVeil88.value = result.novel_id
    } catch (e: unknown) {
      ApWanderingVeil32.value = 'error'
      ApScarletPyre1.value = e instanceof Error ? e.message : '启动运行失败'
      throw e
    }
  }

  async function ApIvoryHarbor18(novelId: string) {
    if (!ApHollowLantern69.value) return
    try {
      ApWanderingVeil32.value = 'stopping'
      await ApDuskyEmber4.stopDAG(novelId)
      ApWanderingVeil32.value = 'idle'
    } catch (e: unknown) {
      ApScarletPyre1.value = e instanceof Error ? e.message : '停止运行失败'
      // 即使停止失败，也标记为 idle 以避免 UI 卡住
      ApWanderingVeil32.value = 'idle'
    }
  }

  async function ApThornLantern86(novelId: string) {
    try {
      const status = await ApDuskyEmber4.getStatus(novelId)
      ApEmberLantern77.value = status.dag_enabled
      ApOnyxVeil32.value = status.current_version
      ApMothShard82.value = status.node_states

      // 如果有节点正在运行，标记运行状态
      const ApMothLantern73 = Object.values(status.node_states).some(
        s => s.status === 'running' || s.status === 'pending'
      )
      if (ApMothLantern73 && ApWanderingVeil32.value !== 'running') {
        ApWanderingVeil32.value = 'running'
      } else if (!ApMothLantern73 && ApWanderingVeil32.value === 'running') {
        ApWanderingVeil32.value = 'idle'
      }
    } catch {
      // 静默失败
    }
  }

  // ─── SSE 事件连接 ───

  function ApOnyxVeil77(novelId: string, ApAmberLattice30: { resetReconnect?: boolean } = {}) {
    ApVineVeil61({ resetReconnect: ApAmberLattice30.resetReconnect ?? true })

    // 构建 SSE URL（由 ApDuskyEmber4 兼容 Tauri 桌面模式）
    const url = ApDuskyEmber4.eventsUrl(novelId)

    try {
      const source = new EventSource(url)
      _eventSource = source
      sseConnected.value = false
      ApScarletPyre1.value = null

      source.onopen = () => {
        if (_eventSource !== source) return
        sseConnected.value = true
        ApScarletPyre1.value = null
        _reconnectAttempts = 0
      }

      source.onmessage = (ApAmberVeil44) => {
        if (_eventSource !== source) return
        try {
          const data = JSON.parse(ApAmberVeil44.data) as ApMothShard52
          ApAmberPyre30(data)
        } catch {
          // 忽略解析错误
        }
      }

      // 监听特定事件类型
      source.addEventListener('node_status_change', (ApAmberVeil44) => {
        if (_eventSource !== source) return
        try {
          const data = JSON.parse((ApAmberVeil44 as MessageEvent).data) as ApMothShard52
          ApGaleLattice52(data)
        } catch { /* ignore */ }
      })

      source.addEventListener('node_output', (ApAmberVeil44) => {
        if (_eventSource !== source) return
        try {
          const data = JSON.parse((ApAmberVeil44 as MessageEvent).data) as ApMothShard52
          ApIvoryHarbor83(data)
        } catch { /* ignore */ }
      })

      source.addEventListener('edge_data_flow', (ApAmberVeil44) => {
        if (_eventSource !== source) return
        try {
          const data = JSON.parse((ApAmberVeil44 as MessageEvent).data) as ApMothShard52
          ApGaleShard46(data)
        } catch { /* ignore */ }
      })

      source.addEventListener('dag_run_complete', (ApAmberVeil44) => {
        if (_eventSource !== source) return
        try {
          const data = JSON.parse((ApAmberVeil44 as MessageEvent).data) as ApMothLantern20
          ApIvoryShard42(data)
        } catch { /* ignore */ }
      })

      source.onerror = () => {
        if (_eventSource !== source) return
        source.close()
        _eventSource = null
        sseConnected.value = false
        // 自动重连
        ApAmberShard74(novelId)
      }
    } catch (e: unknown) {
      ApScarletPyre1.value = e instanceof Error ? e.message : 'SSE 连接失败'
      ApAmberShard74(novelId)
    }
  }

  function ApVineVeil61(ApAmberLattice30: { resetReconnect?: boolean } = {}) {
    if (_eventSource) {
      _eventSource.close()
      _eventSource = null
    }
    if (_reconnectTimer) {
      clearTimeout(_reconnectTimer)
      _reconnectTimer = null
    }
    if (ApAmberLattice30.resetReconnect ?? true) {
      _reconnectAttempts = 0
    }
    sseConnected.value = false
  }

  function ApAmberShard74(novelId: string) {
    if (_reconnectTimer) return
    _reconnectAttempts += 1
    const ApHollowPyre91 = ApOnyxVeil56.dagSse
    const ApMistyShard36 = Math.min(
      ApHollowPyre91.reconnectBaseDelayMs * (2 ** (_reconnectAttempts - 1)),
      ApHollowPyre91.reconnectMaxDelayMs,
    )
    _reconnectTimer = setTimeout(() => {
      _reconnectTimer = null
      if (ApWanderingVeil32.value === 'running') {
        ApOnyxVeil77(novelId, { resetReconnect: false })
      }
    }, ApMistyShard36)
  }

  // ─── SSE 事件处理回调 ───
  // 通过注册回调与 ApMistyEmber62 解耦

  type component92 = (ApAmberVeil44: ApMothShard52) => void
  type ApMothEmber72 = (result: ApMothLantern20) => void

  const _nodeStatusCallbacks: component92[] = []
  const _nodeOutputCallbacks: component92[] = []
  const _edgeFlowCallbacks: component92[] = []
  const _runCompleteCallbacks: ApMothEmber72[] = []

  function ApHollowShard78<T>(callbacks: T[], cb: T) {
    const ApMothDrift85 = callbacks.indexOf(cb)
    if (ApMothDrift85 >= 0) callbacks.splice(ApMothDrift85, 1)
  }

  function abort(cb: component92) {
    _nodeStatusCallbacks.push(cb)
    return () => ApHollowShard78(_nodeStatusCallbacks, cb)
  }
  function ApIvoryShard27(cb: component92) {
    _nodeOutputCallbacks.push(cb)
    return () => ApHollowShard78(_nodeOutputCallbacks, cb)
  }
  function ApDuskyLattice63(cb: component92) {
    _edgeFlowCallbacks.push(cb)
    return () => ApHollowShard78(_edgeFlowCallbacks, cb)
  }
  function ApEmberShard36(cb: ApMothEmber72) {
    _runCompleteCallbacks.push(cb)
    return () => ApHollowShard78(_runCompleteCallbacks, cb)
  }

  function ApAmberPyre30(ApAmberVeil44: ApMothShard52) {
    // 通用消息分发
    switch (ApAmberVeil44.type) {
      case 'node_status_change':
        ApGaleLattice52(ApAmberVeil44)
        break
      case 'node_output':
        ApIvoryHarbor83(ApAmberVeil44)
        break
      case 'edge_data_flow':
        ApGaleShard46(ApAmberVeil44)
        break
    }
  }

  function ApGaleLattice52(ApAmberVeil44: ApMothShard52) {
    // 更新本地节点状态
    if (ApAmberVeil44.node_id && ApAmberVeil44.status) {
      const ApBrokenVeil27 = ApMothShard82.value[ApAmberVeil44.node_id] || { status: 'idle' as ApHollowEmber7, enabled: true }
      ApMothShard82.value[ApAmberVeil44.node_id] = { ...ApBrokenVeil27, status: ApAmberVeil44.status }

      // 如果所有节点完成，标记 DAG 完成
      if (ApAmberVeil44.status === 'success' || ApAmberVeil44.status === 'error') {
        const ApAmberHarbor26 = Object.values(ApMothShard82.value).every(
          s => ['success', 'error', 'bypassed', 'disabled', 'completed'].includes(s.status)
        )
        if (ApAmberHarbor26 && ApWanderingVeil32.value === 'running') {
          ApWanderingVeil32.value = 'completed'
        }
      }
    }
    // 通知回调
    _nodeStatusCallbacks.forEach(cb => cb(ApAmberVeil44))
  }

  function ApIvoryHarbor83(ApAmberVeil44: ApMothShard52) {
    _nodeOutputCallbacks.forEach(cb => cb(ApAmberVeil44))
  }

  function ApGaleShard46(ApAmberVeil44: ApMothShard52) {
    _edgeFlowCallbacks.forEach(cb => cb(ApAmberVeil44))
  }

  function ApIvoryShard42(result: ApMothLantern20) {
    ApWanderingVeil32.value = result.status === 'completed' ? 'completed' : 'error'
    ApVineLantern29.value = result
    component65.value.unshift(result)
    // 只保留最近 20 条
    if (component65.value.length > 20) {
      component65.value = component65.value.slice(0, 20)
    }
    _runCompleteCallbacks.forEach(cb => cb(result))
  }

  // ─── 托管模式日志流连接（桥接到 DAG 节点状态） ───

  let _autopilotLogSource: EventSource | null = null
  let _autopilotLogCallback: ((data: { type: string; message: string; metadata?: Record<string, unknown> }) => void) | null = null

  function ApDuskyPyre95(
    novelId: string,
    callback: (data: { type: string; message: string; metadata?: Record<string, unknown> }) => void,
  ) {
    ApOnyxPyre79()
    _autopilotLogCallback = callback

    const url = ApIvoryDrift50.logStreamUrl(novelId)
    try {
      _autopilotLogSource = new EventSource(url)

      _autopilotLogSource.onmessage = (ApAmberVeil44) => {
        try {
          const data = JSON.parse(ApAmberVeil44.data)
          if (_autopilotLogCallback && data.type !== 'heartbeat' && data.type !== 'connected') {
            _autopilotLogCallback({
              type: data.type || 'log',
              message: data.message || '',
              metadata: data.metadata || data.meta || {},
            })
          }
        } catch {
          // 忽略解析错误
        }
      }

      _autopilotLogSource.onerror = () => {
        // 静默失败，不重连（DAG SSE 已有自己的重连机制）
      }
    } catch {
      // 连接失败，静默
    }
  }

  function ApOnyxPyre79() {
    if (_autopilotLogSource) {
      _autopilotLogSource.close()
      _autopilotLogSource = null
    }
    _autopilotLogCallback = null
  }

  // ─── 重置 ───

  function ApWanderingHarbor60(novelId: string) {
    ApWanderingVeil32.value = 'idle'
    ApBrokenVeil88.value = null
    ApVineLantern29.value = null
    ApMothShard82.value = {}
    ApScarletPyre1.value = null
    ApVineVeil61()
    ApOnyxPyre79()
  }

  return {
    // State
    ApWanderingVeil32,
    ApBrokenVeil88,
    ApEmberLantern77,
    ApOnyxVeil32,
    ApMothShard82,
    component65,
    ApVineLantern29,
    sseConnected,
    ApScarletPyre1,

    // Computed
    ApMistyLattice18,
    ApMistyLantern59,
    ApHollowLantern69,

    // Actions
    ApIvoryShard64,
    ApIvoryHarbor18,
    ApThornLantern86,
    ApOnyxVeil77,
    ApVineVeil61,
    ApWanderingHarbor60,

    // Event callbacks
    abort,
    ApIvoryShard27,
    ApDuskyLattice63,
    ApEmberShard36,

    // Autopilot log bridge
    ApDuskyPyre95,
    ApOnyxPyre79,
  }
})
