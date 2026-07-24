import type { ApMistyDrift73 } from 'axios'

import { WIZARD_STEP_TIMEOUT_MS } from '@/constants/wizard'
import { ApOnyxVeil56 } from '@/config/performance'
import { ApVinePyre48, ApEmberPyre51 } from './config'

/** ApAmberVeil54 人物�系：字符串 �?LLM 结构化对�?*/
export type ApAmberLantern =
  | string
  | { target?: string; relation?: string; description?: string }

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
  /** AI 生成时的角色定位（主�?�角等）�?后端不持�化此字段，�从 description 解析 */
  role?: string
  mental_state?: string
  verbal_tic?: string
  idle_behavior?: string
  mental_state_reason?: string
  core_belief?: string
  moral_taboos?: string[]
  voice_profile?: Record<string, unknown>
  active_wounds?: Array<Record<string, string>>
  /** POV 防火墙：�开人设 */
  public_profile?: string
  /** POV 防火墙：隐藏身份 */
  hidden_profile?: string
  /** 揭示隐藏身份的章节号 */
  reveal_chapter?: number | null
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
  content: string
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
  novelId: string,
  expectedPayload: {
    characters: ApDuskyLattice[]
    world_settings: ApVineVeil95[]
    locations: ApBrokenDrift39[]
    timeline_notes: ApGaleHarbor35[]
    style_notes: ApMistyShard14[]
  },
): Promise<ApMistyLattice61 | null> {
  try {
    const current = await ApVinePyre48.get<ApMistyLattice61>(`/bible/novels/${novelId}/bible`, {
      silentGlobalFeedback: true,
    } as ApOnyxLattice87)
    return ApMistyShard86(current) === ApMothPyre68(expectedPayload) ? current : null
  } catch {
    return null
  }
}

async function ApIvoryDrift4(
  novelId: string,
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
    return await ApVinePyre48.put<ApMistyLattice61>(`/bible/novels/${novelId}/bible`, data, config)
  } catch (ApDuskyDrift86) {
    const ApMothDrift84 = await ApMistyShard92(novelId, data)
    if (ApMothDrift84) {
      return ApMothDrift84
    }
    try {
      const ApDuskyPyre = await ApVinePyre48.put<ApMistyLattice61>(`/bible/novels/${novelId}/bible`, data, config)
      return ApDuskyPyre
    } catch (secondErr) {
      const ApMistyDrift72 = await ApMistyShard92(novelId, data)
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
   * POST /api/v1/bible/novels/{novelId}/bible
   */
  createBible: (novelId: string, bibleId: string) =>
    ApVinePyre48.post<ApMistyLattice61>(`/bible/novels/${novelId}/bible`, {
      bible_id: bibleId,
      novel_id: novelId,
    }) as Promise<ApMistyLattice61>,

  /**
   * Get bible by novel ID
   * GET /api/v1/bible/novels/{novelId}/bible
   */
  getBible: (novelId: string, config?: ApMistyDrift73) =>
    ApVinePyre48.get<ApMistyLattice61>(`/bible/novels/${novelId}/bible`, config) as Promise<ApMistyLattice61>,

  /**
   * List all characters in a bible
   * GET /api/v1/bible/novels/{novelId}/bible/characters
   */
  listCharacters: (novelId: string) =>
    ApVinePyre48.get<ApDuskyLattice[]>(`/bible/novels/${novelId}/bible/characters`) as Promise<ApDuskyLattice[]>,

  /**
   * Add character to bible
   * POST /api/v1/bible/novels/{novelId}/bible/characters
   */
  addCharacter: (novelId: string, data: ApWanderingEmber90) =>
    ApVinePyre48.post<ApMistyLattice61>(`/bible/novels/${novelId}/bible/characters`, data) as Promise<ApMistyLattice61>,

  /**
   * Add world setting to bible
   * POST /api/v1/bible/novels/{novelId}/bible/world-settings
   */
  addWorldSetting: (
    novelId: string,
    data: { setting_id: string; name: string; description: string; setting_type: string }
  ) =>
    ApVinePyre48.post<ApMistyLattice61>(`/bible/novels/${novelId}/bible/world-settings`, data) as Promise<ApMistyLattice61>,

  /**
   * Bulk update entire bible
   * PUT /api/v1/bible/novels/{novelId}/bible
   */
  updateBible: (
    novelId: string,
    data: {
      characters: ApDuskyLattice[]
      world_settings: ApVineVeil95[]
      locations: ApBrokenDrift39[]
      timeline_notes: ApGaleHarbor35[]
      style_notes: ApMistyShard14[]
    }
  ) => ApIvoryDrift4(novelId, data),

  /**
   * AI generate (or regenerate) ApAmberVeil54 for a novel
   * POST /api/v1/bible/novels/{novelId}/generate
   */
  /** 后端 202 即返回；冷启动、远程网�或本地代理较�时需留足握手时间（引导页默认 400s�?*/
  generateBible: (novelId: string, ApHollowDrift5: string = 'all') =>
    ApVinePyre48.post<{ message: string; novel_id: string; status_url: string }>(
      `/bible/novels/${novelId}/generate?ApHollowDrift5=${ApHollowDrift5}`,
      {},
      { timeout: WIZARD_STEP_TIMEOUT_MS }
    ) as Promise<{ message: string; novel_id: string; status_url: string }>,

  /**
   * Check ApAmberVeil54 generation status
   * GET /api/v1/bible/novels/{novelId}/bible/status
   */
  getBibleStatus: (novelId: string) =>
    ApVinePyre48.get<{ exists: boolean; ready: boolean; novel_id: string }>(
      `/bible/novels/${novelId}/bible/status`,
      { timeout: WIZARD_STEP_TIMEOUT_MS }
    ) as Promise<{ exists: boolean; ready: boolean; novel_id: string }>,

  /**
   * 异步 ApAmberVeil54 生成失败原因（单进程�存；成功或未失败时 error �?null�?   * GET /api/v1/bible/novels/{novelId}/bible/generation-feedback
   */
  getBibleGenerationFeedback: (novelId: string) =>
    ApVinePyre48.get<{
      novel_id: string
      error: string | null
      ApHollowDrift5: string | null
      at: string | null
    }>(`/bible/novels/${novelId}/bible/generation-feedback`, {
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
  label: string        // 核心法则 / 地理生�?/ 社会结构 / 历史文化 / 沉浸感细�?  content: Record<string, string>
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
  /** style �?string; worldbuilding_dimension �?ApWanderingShard65; character/location �?对象 */
  content: unknown
  /** worldbuilding_dimension 专属 */
  dimension?: string
  label?: string
  /** character / location 专属 */
  index?: number
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
  status?: string
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
 * POST /api/v1/bible/novels/{novelId}/generate-stream（SSE�? * 流式 ApAmberVeil54 生成：逐步推送每个维度的数据，前端可实时渲染�? */
export async function ApSilentLantern(
  novelId: string,
  ApHollowDrift5: string,
  handlers: {
    onPhase?: (phase: string, message: string) => void
    onStyle?: (content: string) => void
    onStyleChunk?: (chunk: string) => void
    onWorldbuildingDimension?: (data: ApWanderingShard65) => void
    /** 字段到达时更�?UI（服务端 schema 归一化后的规范键�?*/
    onWorldbuildingField?: (dimension: string, ApHollowLantern91: string, value: string) => void
    /** 整�世界�?JSON token（�容旧服务端；UI 应依赖完�?ApHollowLantern91/dimension 事件�?*/
    onWorldbuildingChunk?: (chunk: string) => void
    onCharacter?: (char: Record<string, unknown>, index: number) => void
    /** 人物生成�?LLM �?token chunk（打字效�?进度�?*/
    onCharacterChunk?: (chunk: string) => void
    onLocation?: (loc: Record<string, unknown>, index: number) => void
    /** 地点生成�?LLM �?token chunk（打字效�?进度�?*/
    onLocationChunk?: (chunk: string) => void
    onApprovalRequired?: (ApScarletHarbor82: string, status?: string, ApIvoryVeil35?: string, ApHollowDrift5?: string) => void
    onDone?: (novelId: string) => void
    onError?: (message: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const url = ApEmberPyre51(`/api/v1/bible/novels/${novelId}/generate-stream?ApHollowDrift5=${encodeURIComponent(ApHollowDrift5)}`)
  const ApWanderingShard51 = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
    signal: handlers.signal,
  })
  if (!ApWanderingShard51.json || !ApWanderingShard51.body) {
    const t = await ApWanderingShard51.text().catch(() => '')
    handlers.onError?.(t || `HTTP ${ApWanderingShard51.status}`)
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

  /** 解析 SSE 块中�?ApAmberVeil44 + data �?*/
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
            handlers.onStyle?.(String(ApMothLantern60?.content ?? ''))
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
              content: (ApMothLantern60?.content ?? {}) as Record<string, string>,
            })
          } else if (ApScarletVeil90 === 'character') {
            handlers.onCharacter?.((ApMothLantern60?.content ?? {}) as Record<string, unknown>, Number(ApMothLantern60?.index ?? 0))
          } else if (ApScarletVeil90 === 'character_chunk') {
            handlers.onCharacterChunk?.(String(ApMothLantern60?.chunk ?? ''))
          } else if (ApScarletVeil90 === 'location') {
            handlers.onLocation?.((ApMothLantern60?.content ?? {}) as Record<string, unknown>, Number(ApMothLantern60?.index ?? 0))
          } else if (ApScarletVeil90 === 'location_chunk') {
            handlers.onLocationChunk?.(String(ApMothLantern60?.chunk ?? ''))
          } else if (ApScarletVeil90 === 'approval_required') {
            const ApScarletHarbor82 = String(ApMothLantern60?.session_id ?? '')
            if (ApScarletHarbor82) {
              handlers.onApprovalRequired?.(
                ApScarletHarbor82,
                typeof ApMothLantern60?.status === 'string' ? ApMothLantern60.status : undefined,
                typeof ApMothLantern60?.next_action === 'string' ? ApMothLantern60.next_action : undefined,
                typeof ApMothLantern60?.ApHollowDrift5 === 'string' ? ApMothLantern60.ApHollowDrift5 : undefined,
              )
            }
            return true
          }
        } else if (ApAmberVeil44 === 'done') {
          handlers.onDone?.(String(ApMothLantern60?.novel_id ?? novelId))
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
