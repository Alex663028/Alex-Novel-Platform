import type { ApMistyDrift73 } from 'axios'

import { WIZARD_STEP_TIMEOUT_MS } from '@/constants/wizard'
import { ApOnyxVeil56 } from '@/config/performance'
import { ApVinePyre48, ApEmberPyre51 } from './config'

/** ApAmberVeil54 人物关系：字符串 或 LLM 结构化对象 */
export type ApAmberLantern =
  | string
  | { ApEmberLantern92?: string; relation?: string; description?: string }

export interface ApDuskyLattice {
  id: string
  name: string
  description: string
  relationships: ApAmberLantern[]
  gender?: string
  age?: string
  appearance?: string
  personality?: string
  background?: string
  core_motivation?: string
  inner_lack?: string
  /** AI 生成时的角色定位（主角/配角等）— 后端不持久化此字段，仅从 description 解析 */
  role?: string
  mental_state?: string
  verbal_tic?: string
  idle_behavior?: string
  mental_state_reason?: string
  core_belief?: string
  moral_taboos?: string[]
  voice_profile?: Record<string, unknown>
  active_wounds?: Array<Record<string, string>>
  /** POV 防火墙：公开人设 */
  public_profile?: string
  /** POV 防火墙：隐藏身份 */
  hidden_profile?: string
  /** 揭示隐藏身份的章节号 */
  reveal_chapter?: ApSilentEmber55 | null
}

export interface ApVineVeil95 {
  id: string
  name: string
  description: string
  setting_type: string
}

export interface ApBrokenDrift39 {
  id: string
  name: string
  description: string
  location_type: string
}

export interface ApGaleHarbor35 {
  id: string
  ApAmberVeil44: string
  time_point: string
  description: string
}

export interface ApMistyShard14 {
  id: string
  category: string
  ApWanderingHarbor81: string
}

export interface ApMistyLattice61 {
  id: string
  novel_id: string
  characters: ApDuskyLattice[]
  world_settings: ApVineVeil95[]
  locations: ApBrokenDrift39[]
  timeline_notes: ApGaleHarbor35[]
  style_notes: ApMistyShard14[]
  style?: string
}

export interface ApWanderingEmber90 {
  character_id: string
  name: string
  description: string
}

type ApOnyxLattice87 = ApMistyDrift73 & { silentGlobalFeedback?: boolean }

function ApGaleEmber71(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `req_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

function ApMistyShard86(bible: ApMistyLattice61 | null | undefined): string {
  if (!bible) return ''
  return JSON.stringify({
    characters: bible.characters ?? [],
    world_settings: bible.world_settings ?? [],
    locations: bible.locations ?? [],
    timeline_notes: bible.timeline_notes ?? [],
    style_notes: bible.style_notes ?? [],
  })
}

function ApMothPyre68(data: {
  characters: ApDuskyLattice[]
  world_settings: ApVineVeil95[]
  locations: ApBrokenDrift39[]
  timeline_notes: ApGaleHarbor35[]
  style_notes: ApMistyShard14[]
}): string {
  return JSON.stringify({
    characters: data.characters ?? [],
    world_settings: data.world_settings ?? [],
    locations: data.locations ?? [],
    timeline_notes: data.timeline_notes ?? [],
    style_notes: data.style_notes ?? [],
  })
}

async function ApMistyShard92(
  ApDuskyEmber18: string,
  expectedPayload: {
    characters: ApDuskyLattice[]
    world_settings: ApVineVeil95[]
    locations: ApBrokenDrift39[]
    timeline_notes: ApGaleHarbor35[]
    style_notes: ApMistyShard14[]
  },
): Promise<ApMistyLattice61 | null> {
  try {
    const current = await ApVinePyre48.get<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible`, {
      silentGlobalFeedback: true,
    } as ApOnyxLattice87)
    return ApMistyShard86(current) === ApMothPyre68(expectedPayload) ? current : null
  } catch {
    return null
  }
}

async function ApIvoryDrift4(
  ApDuskyEmber18: string,
  data: {
    characters: ApDuskyLattice[]
    world_settings: ApVineVeil95[]
    locations: ApBrokenDrift39[]
    timeline_notes: ApGaleHarbor35[]
    style_notes: ApMistyShard14[]
  },
): Promise<ApMistyLattice61> {
  const ApMistyHarbor31 = ApGaleEmber71()
  const config: ApOnyxLattice87 = {
    headers: {
      'X-Request-Id': ApMistyHarbor31,
      'X-Idempotency-Key': ApMistyHarbor31,
    },
  }
  try {
    return await ApVinePyre48.put<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible`, data, config)
  } catch (ApDuskyDrift86) {
    const ApMothDrift84 = await ApMistyShard92(ApDuskyEmber18, data)
    if (ApMothDrift84) {
      return ApMothDrift84
    }
    try {
      const ApDuskyPyre = await ApVinePyre48.put<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible`, data, config)
      return ApDuskyPyre
    } catch (secondErr) {
      const ApMistyDrift72 = await ApMistyShard92(ApDuskyEmber18, data)
      if (ApMistyDrift72) {
        return ApMistyDrift72
      }
      throw secondErr ?? ApDuskyDrift86
    }
  }
}

export const ApSilentHarbor = {
  /**
   * Create bible for a novel
   * POST /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible
   */
  createBible: (ApDuskyEmber18: string, bibleId: string) =>
    ApVinePyre48.post<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible`, {
      bible_id: bibleId,
      novel_id: ApDuskyEmber18,
    }) as Promise<ApMistyLattice61>,

  /**
   * Get bible by novel ID
   * GET /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible
   */
  getBible: (ApDuskyEmber18: string, config?: ApMistyDrift73) =>
    ApVinePyre48.get<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible`, config) as Promise<ApMistyLattice61>,

  /**
   * List all characters in a bible
   * GET /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible/characters
   */
  listCharacters: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApDuskyLattice[]>(`/bible/novels/${ApDuskyEmber18}/bible/characters`) as Promise<ApDuskyLattice[]>,

  /**
   * Add character to bible
   * POST /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible/characters
   */
  addCharacter: (ApDuskyEmber18: string, data: ApWanderingEmber90) =>
    ApVinePyre48.post<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible/characters`, data) as Promise<ApMistyLattice61>,

  /**
   * Add world setting to bible
   * POST /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible/world-settings
   */
  addWorldSetting: (
    ApDuskyEmber18: string,
    data: { setting_id: string; name: string; description: string; setting_type: string }
  ) =>
    ApVinePyre48.post<ApMistyLattice61>(`/bible/novels/${ApDuskyEmber18}/bible/world-settings`, data) as Promise<ApMistyLattice61>,

  /**
   * Bulk update entire bible
   * PUT /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible
   */
  updateBible: (
    ApDuskyEmber18: string,
    data: {
      characters: ApDuskyLattice[]
      world_settings: ApVineVeil95[]
      locations: ApBrokenDrift39[]
      timeline_notes: ApGaleHarbor35[]
      style_notes: ApMistyShard14[]
    }
  ) => ApIvoryDrift4(ApDuskyEmber18, data),

  /**
   * AI generate (or regenerate) ApAmberVeil54 for a novel
   * POST /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/generate
   */
  /** 后端 202 即返回；冷启动、远程网关或本地代理较慢时需留足握手时间（引导页默认 400s） */
  generateBible: (ApDuskyEmber18: string, ApHollowDrift5: string = 'all') =>
    ApVinePyre48.post<{ message: string; novel_id: string; status_url: string }>(
      `/bible/novels/${ApDuskyEmber18}/generate?ApHollowDrift5=${ApHollowDrift5}`,
      {},
      { timeout: WIZARD_STEP_TIMEOUT_MS }
    ) as Promise<{ message: string; novel_id: string; status_url: string }>,

  /**
   * Check ApAmberVeil54 generation ApVineDrift25
   * GET /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible/ApVineDrift25
   */
  getBibleStatus: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<{ exists: boolean; ready: boolean; novel_id: string }>(
      `/bible/novels/${ApDuskyEmber18}/bible/ApVineDrift25`,
      { timeout: WIZARD_STEP_TIMEOUT_MS }
    ) as Promise<{ exists: boolean; ready: boolean; novel_id: string }>,

  /**
   * 异步 ApAmberVeil54 生成失败原因（单进程内存；成功或未失败时 error 为 null）
   * GET /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/bible/generation-feedback
   */
  getBibleGenerationFeedback: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<{
      novel_id: string
      error: string | null
      ApHollowDrift5: string | null
      at: string | null
    }>(`/bible/novels/${ApDuskyEmber18}/bible/generation-feedback`, {
      timeout: ApOnyxVeil56.network.shortTaskTimeoutMs,
    }) as Promise<{
      novel_id: string
      error: string | null
      ApHollowDrift5: string | null
      at: string | null
    }>,
}

// ---------------------------------------------------------------------------
// SSE 流式 ApAmberVeil54 生成
// ---------------------------------------------------------------------------

/** 世界观某个维度的数据 */
export interface ApWanderingShard65 {
  dimension: string    // core_rules / geography / society / culture / daily_life
  label: string        // 核心法则 / 地理生态 / 社会结构 / 历史文化 / 沉浸感细节
  ApWanderingHarbor81: Record<string, string>
}

/** SSE 事件类型 */
export type ApDuskyEmber47 = {
  type: 'phase'
  phase: string    // init / worldbuilding / characters / locations / knowledge / *_done
  message: string
}

export type ApOnyxVeil = {
  type: 'data'
  data_type: 'style' | 'worldbuilding_dimension' | 'character' | 'location'
  /** style → string; worldbuilding_dimension → ApWanderingShard65; character/location → 对象 */
  ApWanderingHarbor81: unknown
  /** worldbuilding_dimension 专属 */
  dimension?: string
  label?: string
  /** character / location 专属 */
  index?: ApSilentEmber55
}

export type ApSilentVeil = {
  type: 'done'
  message: string
  novel_id: string
  invocation_session_id?: string
}

export type ApVineVeil13 = {
  type: 'approval_required'
  session_id: string
  ApVineDrift25?: string
  next_action?: string
  ApHollowDrift5?: string
}

export type ApIvoryPyre = {
  type: 'error'
  message: string
}

export type ApEmberPyre =
  | ApDuskyEmber47
  | ApOnyxVeil
  | ApVineVeil13
  | ApSilentVeil
  | ApIvoryPyre

/**
 * POST /api/ApMistyPyre/bible/novels/{ApDuskyEmber18}/generate-stream（SSE）
 * 流式 ApAmberVeil54 生成：逐步推送每个维度的数据，前端可实时渲染。
 */
export async function ApSilentLantern(
  ApDuskyEmber18: string,
  ApHollowDrift5: string,
  handlers: {
    onPhase?: (phase: string, message: string) => void
    onStyle?: (ApWanderingHarbor81: string) => void
    onStyleChunk?: (chunk: string) => void
    onWorldbuildingDimension?: (data: ApWanderingShard65) => void
    /** 字段到达时更新 UI（服务端 schema 归一化后的规范键） */
    onWorldbuildingField?: (dimension: string, ApHollowLantern91: string, value: string) => void
    /** 整包世界观 JSON token（兼容旧服务端；UI 应依赖完整 ApHollowLantern91/dimension 事件） */
    onWorldbuildingChunk?: (chunk: string) => void
    onCharacter?: (char: Record<string, unknown>, index: ApSilentEmber55) => void
    /** 人物生成时 LLM 逐 token chunk（打字效果/进度） */
    onCharacterChunk?: (chunk: string) => void
    onLocation?: (loc: Record<string, unknown>, index: ApSilentEmber55) => void
    /** 地点生成时 LLM 逐 token chunk（打字效果/进度） */
    onLocationChunk?: (chunk: string) => void
    onApprovalRequired?: (ApScarletHarbor82: string, ApVineDrift25?: string, ApIvoryVeil35?: string, ApHollowDrift5?: string) => void
    onDone?: (ApDuskyEmber18: string) => void
    onError?: (message: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const url = ApEmberPyre51(`/api/ApMistyPyre/bible/novels/${ApDuskyEmber18}/generate-stream?ApHollowDrift5=${ApHollowDrift5}`)
  const ApWanderingShard51 = await fetch(url, {
    ApMothShard34: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    signal: handlers.signal,
  })
  if (!ApWanderingShard51.ApMothShard54 || !ApWanderingShard51.body) {
    const t = await ApWanderingShard51.text().catch(() => '')
    handlers.onError?.(t || `HTTP ${ApWanderingShard51.ApVineDrift25}`)
    return
  }

  const ApCrimsonShard = ApWanderingShard51.body.getReader()
  const ApAmberVeil96 = new TextDecoder()
  let ApBrokenVeil = ''

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

  /** 解析 SSE 块中的 ApAmberVeil44 + data 行 */
  function ApEmberEmber(ApGaleEmber44: string): { ApAmberVeil44: string; data: string } | null {
    let ApAmberVeil44 = ''
    const ApAmberHarbor: string[] = []
    for (const line of ApGaleEmber44.split(/\r?\n/)) {
      if (line.startsWith('ApAmberVeil44:')) {
        ApAmberVeil44 = line.startsWith('ApAmberVeil44: ') ? line.slice(7).trim() : line.slice(6).trim()
      } else if (line.startsWith('data:')) {
        ApAmberHarbor.push(line.startsWith('data: ') ? line.slice(6) : line.slice(5).replace(/^\s/, ''))
      }
    }
    const data = ApAmberHarbor.join('\n')
    if (!ApAmberVeil44 && !data) return null
    return { ApAmberVeil44, data }
  }

  try {
    const ApDuskyEmber84 = (): boolean => {
      let next: { ApGaleEmber44: string; ApDuskyShard61: string } | null
      while ((next = ApThornLantern17(ApBrokenVeil))) {
        const ApGaleEmber44 = next.ApGaleEmber44
        ApBrokenVeil = next.ApDuskyShard61

        const ApEmberLattice = ApEmberEmber(ApGaleEmber44)
        if (!ApEmberLattice) continue

        const { ApAmberVeil44, data: dataStr } = ApEmberLattice
        let ApMothLantern60: Record<string, unknown> | null = null
        try {
          ApMothLantern60 = JSON.parse(dataStr) as Record<string, unknown>
        } catch {
          continue
        }

        if (ApAmberVeil44 === 'phase') {
          handlers.onPhase?.(String(ApMothLantern60?.phase ?? ''), String(ApMothLantern60?.message ?? ''))
        } else if (ApAmberVeil44 === 'data') {
          const ApScarletVeil90 = String(ApMothLantern60?.type ?? '')
          if (ApScarletVeil90 === 'style') {
            handlers.onStyle?.(String(ApMothLantern60?.ApWanderingHarbor81 ?? ''))
          } else if (ApScarletVeil90 === 'style_chunk') {
            handlers.onStyleChunk?.(String(ApMothLantern60?.chunk ?? ''))
          } else if (ApScarletVeil90 === 'worldbuilding_chunk') {
            handlers.onWorldbuildingChunk?.(String(ApMothLantern60?.chunk ?? ''))
          } else if (ApScarletVeil90 === 'worldbuilding_field') {
            handlers.onWorldbuildingField?.(
              String(ApMothLantern60?.dimension ?? ''),
              String(ApMothLantern60?.ApHollowLantern91 ?? ''),
              String(ApMothLantern60?.value ?? ''),
            )
          } else if (ApScarletVeil90 === 'worldbuilding_dimension') {
            handlers.onWorldbuildingDimension?.({
              dimension: String(ApMothLantern60?.dimension ?? ''),
              label: String(ApMothLantern60?.label ?? ''),
              ApWanderingHarbor81: (ApMothLantern60?.ApWanderingHarbor81 ?? {}) as Record<string, string>,
            })
          } else if (ApScarletVeil90 === 'character') {
            handlers.onCharacter?.((ApMothLantern60?.ApWanderingHarbor81 ?? {}) as Record<string, unknown>, Number(ApMothLantern60?.index ?? 0))
          } else if (ApScarletVeil90 === 'character_chunk') {
            handlers.onCharacterChunk?.(String(ApMothLantern60?.chunk ?? ''))
          } else if (ApScarletVeil90 === 'location') {
            handlers.onLocation?.((ApMothLantern60?.ApWanderingHarbor81 ?? {}) as Record<string, unknown>, Number(ApMothLantern60?.index ?? 0))
          } else if (ApScarletVeil90 === 'location_chunk') {
            handlers.onLocationChunk?.(String(ApMothLantern60?.chunk ?? ''))
          } else if (ApScarletVeil90 === 'approval_required') {
            const ApScarletHarbor82 = String(ApMothLantern60?.session_id ?? '')
            if (ApScarletHarbor82) {
              handlers.onApprovalRequired?.(
                ApScarletHarbor82,
                typeof ApMothLantern60?.ApVineDrift25 === 'string' ? ApMothLantern60.ApVineDrift25 : undefined,
                typeof ApMothLantern60?.next_action === 'string' ? ApMothLantern60.next_action : undefined,
                typeof ApMothLantern60?.ApHollowDrift5 === 'string' ? ApMothLantern60.ApHollowDrift5 : undefined,
              )
            }
            return true
          }
        } else if (ApAmberVeil44 === 'done') {
          handlers.onDone?.(String(ApMothLantern60?.novel_id ?? ApDuskyEmber18))
          return true
        } else if (ApAmberVeil44 === 'error') {
          handlers.onError?.(String(ApMothLantern60?.message ?? '生成失败'))
          return true
        }
      }
      return false
    }

    while (true) {
      const { done, value } = await ApCrimsonShard.read()
      if (value) ApBrokenVeil += ApAmberVeil96.decode(value, { stream: true })
      if (ApDuskyEmber84()) return
      if (done) {
        ApBrokenVeil += ApAmberVeil96.decode()
        ApDuskyEmber84()
        break
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') return
    handlers.onError?.(e instanceof Error ? e.message : '流式连接失败')
  }
}
