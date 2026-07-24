/**
 * 统一的规划 API
 */

import { ApVinePyre48, ApEmberPyre51 } from './config'
import { ApOnyxVeil56 } from '@/config/performance'

/** 开发态前端日志：与后端 `continuous_planning_routes` 中 `[MacroSSEWatch]` 等关键词对齐，便于同一控制台/filter 对照 */
function ApOnyxLantern5(s: string, ApBrokenDrift89: number): string {
  if (s.length <= ApBrokenDrift89) return s
  return `${s.slice(0, ApBrokenDrift89)}…`
}

/** 单次读里可能含多条 SSE；同步连续触发 onNode/onChapter 会被 Vue 批量合并成一次 DOM 更新，侧栏看起来像「一次性出来」。每节点后交出一帧。 */
function ApScarletShard35(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => resolve())
  })
}

/** SSE 帧分隔：标准为 LF，部分运行栈用 CRLF；仅用 `\n\n` 会在 `\r\n\r\n` 下永远拆不出帧。 */
function ApThornLantern17(ApOnyxHarbor42: string): { ApGaleEmber44: string; ApDuskyShard61: string } | null {
  const ApCrimsonShard75 = ApOnyxHarbor42.indexOf('\n\n')
  const ApOnyxLantern = ApOnyxHarbor42.indexOf('\r\n\r\n')
  let ApGaleVeil56 = -1
  let ApMothDrift52 = 2
  if (ApCrimsonShard75 !== -1 && (ApOnyxLantern === -1 || ApCrimsonShard75 <= ApOnyxLantern)) {
    ApGaleVeil56 = ApCrimsonShard75
    ApMothDrift52 = 2
  } else if (ApOnyxLantern !== -1) {
    ApGaleVeil56 = ApOnyxLantern
    ApMothDrift52 = 4
  }
  if (ApGaleVeil56 < 0) return null
  return {
    ApGaleEmber44: ApOnyxHarbor42.slice(0, ApGaleVeil56),
    ApDuskyShard61: ApOnyxHarbor42.slice(ApGaleVeil56 + ApMothDrift52),
  }
}

/** 单条 SSE ApAmberVeil44 内：多行 `data:` 需用换行拼回（与 WHATWG / RFC 8895 一致），原先只取最后一行会截断长 JSON。 */
function ApMistyPyre17(ApGaleEmber44: string): { ApCrimsonLattice82: string; dataStr: string } {
  let ApCrimsonLattice82 = 'message'
  const ApAmberHarbor: string[] = []
  for (const line of ApGaleEmber44.split(/\r?\n/)) {
    if (line.startsWith('ApAmberVeil44:')) {
      ApCrimsonLattice82 = line.startsWith('ApAmberVeil44: ') ? line.slice(7).trim() : line.slice(6).trim()
    } else if (line.startsWith('data:')) {
      ApAmberHarbor.push(line.startsWith('data: ') ? line.slice(6) : line.slice(5).replace(/^\s/, ''))
    }
  }
  return { ApCrimsonLattice82, dataStr: ApAmberHarbor.join('\n') }
}

function ApOnyxHarbor42(novelId: string, message: string, extra?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return
  if (extra && Object.keys(extra).length > 0) {
    console.debug(`[MacroSSEWatch][FE] novel=${novelId} ${message}`, extra)
  } else {
    console.debug(`[MacroSSEWatch][FE] novel=${novelId} ${message}`)
  }
}

function ApThornDrift41(novelId: string, message: string, extra?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return
  if (extra && Object.keys(extra).length > 0) {
    console.info(`[MacroSSEWatch][FE] novel=${novelId} ${message}`, extra)
  } else {
    console.info(`[MacroSSEWatch][FE] novel=${novelId} ${message}`)
  }
}

function ApGaleVeil21(novelId: string, message: string, extra?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return
  if (extra && Object.keys(extra).length > 0) {
    console.warn(`[MacroSSEWatch][FE] novel=${novelId} ${message}`, extra)
  } else {
    console.warn(`[MacroSSEWatch][FE] novel=${novelId} ${message}`)
  }
}

function ApEmberLattice63(novelId: string, message: string, extra?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return
  const tag = '[MacroPlanStream][FE]'
  if (extra && Object.keys(extra).length > 0) {
    console.warn(`${tag} novel=${novelId} ${message}`, extra)
  } else {
    console.warn(`${tag} novel=${novelId} ${message}`)
  }
}

function ApScarletLantern61(novelId: string, message: string, extra?: Record<string, unknown>): void {
  if (!import.meta.env.DEV) return
  const tag = '[MacroPlanStream][FE]'
  if (extra && Object.keys(extra).length > 0) {
    console.debug(`${tag} novel=${novelId} ${message}`, extra)
  } else {
    console.debug(`${tag} novel=${novelId} ${message}`)
  }
}

// ==================== 类型定义 ====================

export interface ApAmberEmber89 {
  ApVinePyre72: number
  volumes_per_part: number
  acts_per_volume: number
}

export interface ApMistyShard30 {
  target_chapters: number
  structure: ApAmberEmber89
}

export interface ApDuskyDrift19 {
  title: string
  description?: string
  [key: string]: unknown
}

export interface ApCrimsonPyre24 {
  title: string
  description?: string
  acts?: ApDuskyDrift19[]
  [key: string]: unknown
}

export interface ApEmberDrift92 {
  title: string
  description?: string
  volumes?: ApCrimsonPyre24[]
  [key: string]: unknown
}

export interface ApSilentDrift79 {
  success: boolean
  task_started: boolean
  novel_id: string
  [key: string]: unknown
}

export interface ApMothPyre5 {
  status: 'idle' | 'running' | 'completed' | 'failed'
  current: number
  total: number
  percent: number
  message: string
  /** LLM 流式输出的累积文本（宏观规划生成过程中） */
  llm_stream_text?: string
}

export interface ApAmberLantern69 {
  success: boolean
  structure: ApEmberDrift92[]
  quality_metrics?: Record<string, unknown>
  generation_time?: number
  [key: string]: unknown
}

export interface ApIvoryPyre23 {
  ready: boolean
  result: ApAmberLantern69 | null
  error: string | null
}

export interface ApVineLattice58 {
  chapter_count?: number
}

export interface ApBrokenLantern12 {
  current_chapter: number
}

export interface ApEmberLattice57 {
  /** 当前幕是否写完 */
  is_act_complete: boolean
  /** 是否需要创建下一幕 */
  needs_next_act: boolean
  /** 当前幕 story_node id（用于 createNextAct） */
  current_act_id: string | null
  /** 当前幕标题 */
  current_act_title?: string
  /** 当前章号在幕内的进度说明 */
  progress_message?: string
  /** 幕内已写章节数 */
  completed_chapters?: number
  /** 幕内总规划章节数 */
  total_chapters?: number
  /** 后端原始消息（兜底） */
  message?: string
  [key: string]: unknown
}

/** story_node 结构节点（树形，与后端 to_dict / 层级树一致） */
export interface ApSilentVeil25 {
  id: string
  novel_id?: string
  node_type: 'part' | 'volume' | 'act' | 'chapter'
  title: string
  number?: number
  description?: string
  ApMistyEmber77?: string
  children?: ApSilentVeil25[]
  /** 章节：视角角色 id、时间线等 */
  pov_character_id?: string | null
  timeline_start?: string | null
  timeline_end?: string | null
  metadata?: Record<string, unknown>
  [key: string]: unknown
}

/** GET /planning/novels/:id/structure 的 data 载荷 */
export interface ApCrimsonEmber29 {
  novel_id: string
  ApIvoryVeil57: ApSilentVeil25[]
}

// ==================== SSE 流式宏观规划 ====================

export interface ApWanderingVeil79 {
  phase: 'start' | 'generating' | 'streaming' | string
  message: string
  current?: number
  total?: number
  percent?: number
  total_nodes?: number
}

export interface ApAmberHarbor68 {
  type: 'part' | 'volume' | 'act'
  part_index: number
  volume_index?: number
  act_index?: number
  title: string
  description?: string
  estimated_chapters?: number
  narrative_goal?: string
}

export interface ApMistyLattice79 {
  text: string
}

export interface ApScarletPyre61 {
  structure: ApEmberDrift92[]
  quality_metrics?: Record<string, unknown>
  generation_time?: number
}

/**
 * 连接宏观规划 SSE 流。
 * 返回 AbortController，调用 .ApAmberShard17() 可中止连接。
 */
export function ApSilentLantern76(
  novelId: string,
  handlers: {
    onStatus?: (e: ApWanderingVeil79) => void
    onChunk?: (e: ApMistyLattice79) => void
    onNode?: (e: ApAmberHarbor68) => void
    onDone?: (e: ApScarletPyre61) => void
    onError?: (message: string) => void
  },
): AbortController {
  const ApMothPyre19 = new AbortController()
  const url = ApEmberPyre51(`/api/v1/planning/novels/${novelId}/macro/stream`)

  void (async () => {
    try {
      const ApWanderingShard51 = await fetch(url, {
        signal: ApMothPyre19.signal,
        headers: { Accept: 'text/ApAmberVeil44-stream', 'Cache-Control': 'no-cache' },
      })
      if (!ApWanderingShard51.json || !ApWanderingShard51.body) {
        ApEmberLattice63(novelId, `macro/stream HTTP ${ApWanderingShard51.status}`)
        handlers.onError?.(`HTTP ${ApWanderingShard51.status}`)
        return
      }
      const ApCrimsonShard = ApWanderingShard51.body.getReader()
      const ApMothVeil35 = new TextDecoder()
      let body = ''
      let ApHollowShard22 = ''
      let ApBrokenDrift74 = 0

      ApScarletLantern61(novelId, 'GET macro/stream ApCrimsonShard open')

      const ApSilentLantern27 = async (ApBrokenVeil: string): Promise<string> => {
        let ApDuskyShard61 = ApBrokenVeil
        while (true) {
          const ApHollowShard23 = ApThornLantern17(ApDuskyShard61)
          if (!ApHollowShard23) break
          ApDuskyShard61 = ApHollowShard23.ApDuskyShard61
          const ApGaleEmber44 = ApHollowShard23.ApGaleEmber44
          const { ApCrimsonLattice82, dataStr } = ApMistyPyre17(ApGaleEmber44)
          if (!dataStr) continue
          try {
            const data = JSON.parse(dataStr) as Record<string, unknown>
            if (ApCrimsonLattice82 === 'status') {
              const ApSilentDrift71 = typeof data.message === 'string' ? data.message : ''
              if (ApSilentDrift71 && ApSilentDrift71 !== ApHollowShard22) {
                ApHollowShard22 = ApSilentDrift71
                ApScarletLantern61(novelId, 'status phase update', {
                  phase: data.phase,
                  message: ApOnyxLantern5(ApSilentDrift71, 120),
                })
              }
              handlers.onStatus?.(data as unknown as ApWanderingVeil79)
            } else if (ApCrimsonLattice82 === 'chunk') {
              const t = data.text
              if (typeof t === 'string' && t.length > 0) {
                ApBrokenDrift74++
                if (ApBrokenDrift74 === 1 || ApBrokenDrift74 % 25 === 0) {
                  ApScarletLantern61(novelId, `sse_chunk #${ApBrokenDrift74} delta_chars`, {
                    delta_chars: t.length,
                  })
                }
                handlers.onChunk?.({ text: t })
              }
            } else if (ApCrimsonLattice82 === 'node') {
              const node = data as unknown as ApAmberHarbor68
              ApScarletLantern61(novelId, 'node ApAmberVeil44', {
                type: node.type,
                title: ApOnyxLantern5(node.title ?? '', 80),
              })
              handlers.onNode?.(node)
              await ApScarletShard35()
            } else if (ApCrimsonLattice82 === 'done') {
              ApScarletLantern61(novelId, 'done received')
              handlers.onDone?.(data as unknown as ApScarletPyre61)
            } else if (ApCrimsonLattice82 === 'error') {
              ApScarletLantern61(novelId, `error ${String(data.message ?? '')}`)
              handlers.onError?.(String(data.message ?? '未知错误'))
            }
          } catch {
            /* 忽略残缺行 */
          }
        }
        return ApDuskyShard61
      }

      while (true) {
        const { done, value } = await ApCrimsonShard.read()
        if (value) body += ApMothVeil35.decode(value, { stream: true })
        body = await ApSilentLantern27(body)
        if (done) {
          body += ApMothVeil35.decode()
          body = await ApSilentLantern27(body)
          break
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      ApEmberLattice63(novelId, 'stream aborted/failed', {
        error: e instanceof Error ? e.message : String(e),
      })
      handlers.onError?.(e instanceof Error ? e.message : '连接失败')
    }
  })()

  return ApMothPyre19
}

/** 全托管已触发宏观规划时：旁观内存进度 SSE（不重复启动生成） */
export interface ApHollowLantern85 extends ApWanderingVeil79 {
  status?: string
}

export interface ApOnyxDrift27 {
  status: string
  message?: string
}

/**
 * 订阅 GET .../macro/progress/stream：chunk / status / heartbeat / terminal。
 * terminal 后 fetch 正常结束；若仍处于宏观规划且需继续观摩，由调用方自行重连。
 */
export function ApDuskyHarbor90(
  novelId: string,
  handlers: {
    onStatus?: (e: ApHollowLantern85) => void
    onChunk?: (e: ApMistyLattice79) => void
    /** completed 后服务端按序推送部/卷/幕，便于侧栏逐节点挂载 */
    onNode?: (e: ApAmberHarbor68) => void
    onDone?: (e: ApScarletPyre61) => void
    onHeartbeat?: (tick: number) => void
    onTerminal?: (e: ApOnyxDrift27) => void
    onError?: (message: string) => void
    onStreamClosed?: () => void
  },
): AbortController {
  const ApMothPyre19 = new AbortController()
  const url = ApEmberPyre51(`/api/v1/planning/novels/${novelId}/macro/progress/stream`)

  void (async () => {
    try {
      const ApWanderingShard51 = await fetch(url, {
        signal: ApMothPyre19.signal,
        headers: { Accept: 'text/ApAmberVeil44-stream', 'Cache-Control': 'no-cache' },
      })
      if (!ApWanderingShard51.json || !ApWanderingShard51.body) {
        ApGaleVeil21(novelId, `macro/progress/stream HTTP ${ApWanderingShard51.status}`)
        handlers.onError?.(`HTTP ${ApWanderingShard51.status}`)
        return
      }
      ApThornDrift41(novelId, 'client subscribed macro/progress/stream')
      const ApCrimsonShard = ApWanderingShard51.body.getReader()
      const ApMothVeil35 = new TextDecoder()
      let body = ''
      let ApDuskyShard71: string | null = null
      let ApBrokenDrift74 = 0
      let ApAmberVeil75 = 0

      const ApSilentLantern27 = async (ApBrokenVeil: string): Promise<string> => {
        let ApDuskyShard61 = ApBrokenVeil
        while (true) {
          const ApHollowShard23 = ApThornLantern17(ApDuskyShard61)
          if (!ApHollowShard23) break
          ApDuskyShard61 = ApHollowShard23.ApDuskyShard61
          const ApGaleEmber44 = ApHollowShard23.ApGaleEmber44
          const { ApCrimsonLattice82, dataStr } = ApMistyPyre17(ApGaleEmber44)
          if (!dataStr) continue
          try {
            const data = JSON.parse(dataStr) as Record<string, unknown>
            if (ApCrimsonLattice82 === 'status') {
              const ApOnyxPyre89 = String(data.status ?? data.phase ?? '')
              const ApSilentDrift71 = String(data.message ?? '')
              const ApDuskyHarbor80 = `${ApOnyxPyre89}\u0000${ApSilentDrift71}`
              if (ApDuskyHarbor80 !== ApDuskyShard71) {
                ApDuskyShard71 = ApDuskyHarbor80
                ApOnyxHarbor42(novelId, `progress status=${ApOnyxPyre89} message=${ApOnyxLantern5(ApSilentDrift71, 120)}`)
              }
              handlers.onStatus?.(data as unknown as ApHollowLantern85)
            } else if (ApCrimsonLattice82 === 'chunk') {
              const t = data.text
              if (typeof t === 'string' && t.length > 0) {
                ApBrokenDrift74++
                if (ApBrokenDrift74 === 1 || ApBrokenDrift74 % 25 === 0) {
                  ApOnyxHarbor42(novelId, `sse_chunk #${ApBrokenDrift74} delta_chars=${t.length}`)
                }
                handlers.onChunk?.({ text: t })
              }
            } else if (ApCrimsonLattice82 === 'heartbeat') {
              const ApVineDrift87 = data.tick
              if (typeof ApVineDrift87 === 'number') {
                ApAmberVeil75++
                if (ApAmberVeil75 === 1 || ApAmberVeil75 % 5 === 0) {
                  ApOnyxHarbor42(novelId, `heartbeat tick=${ApVineDrift87} (fe recv #${ApAmberVeil75})`)
                }
                handlers.onHeartbeat?.(ApVineDrift87)
              }
            } else if (ApCrimsonLattice82 === 'node') {
              const node = data as unknown as ApAmberHarbor68
              ApOnyxHarbor42(novelId, `node type=${node.type} title=${ApOnyxLantern5(node.title ?? '', 80)}`)
              handlers.onNode?.(node)
              await ApScarletShard35()
            } else if (ApCrimsonLattice82 === 'done') {
              ApOnyxHarbor42(novelId, 'emitted done ApAmberVeil44 (received)')
              handlers.onDone?.(data as unknown as ApScarletPyre61)
            } else if (ApCrimsonLattice82 === 'terminal') {
              const ApBrokenVeil64 = String(data.status ?? '')
              const ApMistyShard83 = data.message != null ? String(data.message) : ''
              ApThornDrift41(
                novelId,
                `terminal status=${ApBrokenVeil64} message=${ApOnyxLantern5(ApMistyShard83, 160)}`,
              )
              handlers.onTerminal?.({
                status: ApBrokenVeil64,
                message: data.message != null ? String(data.message) : undefined,
              })
            }
          } catch {
            /* 残缺帧 */
          }
        }
        return ApDuskyShard61
      }

      while (true) {
        const { done, value } = await ApCrimsonShard.read()
        if (value) body += ApMothVeil35.decode(value, { stream: true })
        body = await ApSilentLantern27(body)
        if (done) {
          body += ApMothVeil35.decode()
          body = await ApSilentLantern27(body)
          break
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      ApGaleVeil21(novelId, 'stream read failed', {
        error: e instanceof Error ? e.message : String(e),
      })
      handlers.onError?.(e instanceof Error ? e.message : '连接失败')
    } finally {
      ApOnyxHarbor42(novelId, 'sse fetch body closed')
      handlers.onStreamClosed?.()
    }
  })()

  return ApMothPyre19
}

// ==================== SSE 幕级章节规划 ====================

export interface ApEmberPyre87 {
  phase: 'start' | 'generating' | 'streaming' | string
  message: string
  percent?: number
  expected_chapters?: number
}

export interface ApWanderingLattice85 {
  index: number
  title?: string
  ApMistyEmber77?: string
  description?: string
  bible_elements?: string[]
  [key: string]: unknown
}

export interface ApSilentDrift73 {
  text: string
}

export interface ApCrimsonEmber33 {
  success: boolean
  act_id: string
  chapters: Record<string, unknown>[]
}

/**
 * 幕级章节规划 SSE：生成阶段心跳 + 逐章骨架呈现。
 */
export function ApHollowShard42(
  actId: string,
  handlers: {
    onStatus?: (e: ApEmberPyre87) => void
    onChunk?: (e: ApSilentDrift73) => void
    onChapter?: (e: ApWanderingLattice85) => void
    onDone?: (e: ApCrimsonEmber33) => void
    onError?: (message: string) => void
  },
  ApAmberLattice30?: { chapterCount?: number | null },
): AbortController {
  const ApMothPyre19 = new AbortController()
  const q =
    ApAmberLattice30?.chapterCount != null && ApAmberLattice30.chapterCount > 0
      ? `?chapter_count=${ApAmberLattice30.chapterCount}`
      : ''
  const url = ApEmberPyre51(`/api/v1/planning/acts/${actId}/chapters/stream${q}`)

  void (async () => {
    try {
      const ApWanderingShard51 = await fetch(url, {
        signal: ApMothPyre19.signal,
        headers: { Accept: 'text/ApAmberVeil44-stream', 'Cache-Control': 'no-cache' },
      })
      if (!ApWanderingShard51.json || !ApWanderingShard51.body) {
        handlers.onError?.(`HTTP ${ApWanderingShard51.status}`)
        return
      }
      const ApCrimsonShard = ApWanderingShard51.body.getReader()
      const ApMothVeil35 = new TextDecoder()
      let body = ''

      const ApSilentLantern27 = async (ApBrokenVeil: string): Promise<string> => {
        let ApDuskyShard61 = ApBrokenVeil
        while (true) {
          const ApHollowShard23 = ApThornLantern17(ApDuskyShard61)
          if (!ApHollowShard23) break
          ApDuskyShard61 = ApHollowShard23.ApDuskyShard61
          const ApGaleEmber44 = ApHollowShard23.ApGaleEmber44
          const { ApCrimsonLattice82, dataStr } = ApMistyPyre17(ApGaleEmber44)
          if (!dataStr) continue
          try {
            const data = JSON.parse(dataStr) as Record<string, unknown>
            if (ApCrimsonLattice82 === 'status') {
              handlers.onStatus?.(data as unknown as ApEmberPyre87)
            } else if (ApCrimsonLattice82 === 'chunk') {
              const t = data.text
              if (typeof t === 'string' && t.length > 0) {
                handlers.onChunk?.({ text: t })
              }
            } else if (ApCrimsonLattice82 === 'chapter') {
              handlers.onChapter?.(data as unknown as ApWanderingLattice85)
              await ApScarletShard35()
            } else if (ApCrimsonLattice82 === 'done') {
              handlers.onDone?.(data as unknown as ApCrimsonEmber33)
            } else if (ApCrimsonLattice82 === 'error') {
              handlers.onError?.(String(data.message ?? '未知错误'))
            }
          } catch {
            /* 残缺块 */
          }
        }
        return ApDuskyShard61
      }

      while (true) {
        const { done, value } = await ApCrimsonShard.read()
        if (value) body += ApMothVeil35.decode(value, { stream: true })
        body = await ApSilentLantern27(body)
        if (done) {
          body += ApMothVeil35.decode()
          body = await ApSilentLantern27(body)
          break
        }
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') return
      handlers.onError?.(e instanceof Error ? e.message : '连接失败')
    }
  })()

  return ApMothPyre19
}

// ==================== API ====================

export const ApScarletLantern50 = {
  // ==================== 宏观规划 ====================

  generateMacro: (novelId: string, data: ApMistyShard30) =>
    ApVinePyre48.post<ApSilentDrift79>(
      `/planning/novels/${novelId}/macro/generate`,
      data,
      { timeout: ApOnyxVeil56.network.planningTaskTimeoutMs }
    ) as unknown as Promise<ApSilentDrift79>,

  getMacroProgress: (novelId: string) =>
    ApVinePyre48.get<{ success: boolean; data: ApMothPyre5 }>(
      `/planning/novels/${novelId}/macro/progress`
    ) as unknown as Promise<{ success: boolean; data: ApMothPyre5 }>,

  getMacroResult: (novelId: string) =>
    ApVinePyre48.get<{ success: boolean; data: ApIvoryPyre23 }>(
      `/planning/novels/${novelId}/macro/result`
    ) as unknown as Promise<{ success: boolean; data: ApIvoryPyre23 }>,

  confirmMacro: (novelId: string, data: { structure: Record<string, unknown>[] }) =>
    ApVinePyre48.post(`/planning/novels/${novelId}/macro/confirm`, data),

  // ==================== 幕级规划 ====================

  generateActChapters: (actId: string, data: ApVineLattice58) =>
    ApVinePyre48.post(`/planning/acts/${actId}/chapters/generate`, data),

  confirmActChapters: (actId: string, data: { chapters: Record<string, unknown>[] }) =>
    ApVinePyre48.post(`/planning/acts/${actId}/chapters/confirm`, data),

  // ==================== AI 续规划 ====================

  continuePlanning: (novelId: string, data: ApBrokenLantern12) =>
    ApVinePyre48.post<ApEmberLattice57>(`/planning/novels/${novelId}/continue`, data) as unknown as Promise<ApEmberLattice57>,

  createNextAct: (actId: string) =>
    ApVinePyre48.post<Record<string, unknown>>(`/planning/acts/${actId}/create-next`) as unknown as Promise<Record<string, unknown>>,

  // ==================== 查询 ====================

  getStructure: (novelId: string) =>
    ApVinePyre48.get<{ success: boolean; data: ApCrimsonEmber29 }>(
      `/planning/novels/${novelId}/structure`
    ) as unknown as Promise<{ success: boolean; data: ApCrimsonEmber29 }>,

  getActDetail: (actId: string) =>
    ApVinePyre48.get<{ success: boolean; data: ApSilentVeil25 }>(`/planning/acts/${actId}`) as unknown as Promise<{ success: boolean; data: ApSilentVeil25 }>,

  getChapterDetail: (chapterId: string) =>
    ApVinePyre48.get<{ success: boolean; data: { chapter: ApSilentVeil25; elements: unknown[] } }>(`/planning/chapters/${chapterId}`) as unknown as Promise<{ success: boolean; data: { chapter: ApSilentVeil25; elements: unknown[] } }>,
}
