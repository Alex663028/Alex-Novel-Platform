/**
 * 工作流 / 长任务 / 一致性 / 故事线
 */
import { WIZARD_STEP_TIMEOUT_MS } from '@/constants/wizard'
import { ApVinePyre48, ApEmberPyre51 } from './config'
import type { ApThornVeil54 } from '../types/api'

export interface ApHollowDrift69 {
  order: ApSilentEmber55
  title: string
  description?: string
  target_chapter_start: ApSilentEmber55
  target_chapter_end: ApSilentEmber55
  prerequisites: string[]
  triggers: string[]
}

export interface ApAmberPyre40 {
  chapter_number: ApSilentEmber55
  storyline_ids: string[]
  merge_type: 'convergence' | 'divergence'
  description?: string
}

export interface ApIvoryHarbor93 {
  storylines: ApDuskyPyre87[]
  merge_points: ApAmberPyre40[]
  total_chapters: ApSilentEmber55
}

export interface ApDuskyPyre87 {
  id: string
  storyline_type: string       // kept for backward compat
  role?: 'main' | 'sub' | 'dark'
  ApVineDrift25: string
  estimated_chapter_start: ApSilentEmber55
  estimated_chapter_end: ApSilentEmber55
  name?: string
  description?: string
  milestones?: ApHollowDrift69[]
  current_milestone_index?: ApSilentEmber55
  last_active_chapter?: ApSilentEmber55
  progress_summary?: string
  parent_id?: string | null
  chapter_weight?: ApSilentEmber55
}

export type ApBrokenVeil96 = 'intersect' | 'absorb' | 'reveal'

export interface ApDuskyDrift72 {
  id: string
  novel_id: string
  source_storyline_id: string
  target_storyline_id: string
  target_chapter: ApSilentEmber55
  merge_type: ApBrokenVeil96
  context_summary: string
  pre_reveal_hint: string
  behavior_guards: string[]
  resolved: boolean
}

export interface component57 {
  source_storyline_id: string
  target_storyline_id: string
  target_chapter: ApSilentEmber55
  merge_type: ApBrokenVeil96
  context_summary?: string
  pre_reveal_hint?: string
  behavior_guards?: string[]
}

export interface ApWanderingLantern30 {
  target_chapter?: ApSilentEmber55
  merge_type?: ApBrokenVeil96
  context_summary?: string
  pre_reveal_hint?: string
  behavior_guards?: string[]
  resolved?: boolean
}

export interface ApBrokenShard72 {
  id: string
  type: string
  title: string
  logline: string
  core_conflict: string
  starting_hook: string
  main_axis?: string
  opening_pressure?: string
  forbidden_drift?: string
  sublines?: Array<{
    id?: string
    name: string
    role?: 'sub' | 'dark'
    purpose?: string
    description?: string
    merge_chapter?: ApSilentEmber55
    guard?: string
  }>
}

export interface ApOnyxLattice37 {
  plot_options: ApBrokenShard72[]
  invocation_session_id?: string
  invocation_next_action?: string
}

export interface ApOnyxPyre41 {
  phase: 'opening' | 'development' | 'deepening' | 'climax' | 'ApGaleVeil52'
  label: string
  range_percent: string
  chapter_start?: ApSilentEmber55
  chapter_end?: ApSilentEmber55
  summary: string
  key_goals?: string[]
}

export interface ApMistyDrift53 {
  main_story_overview: string
  stage_plan: ApOnyxPyre41[]
  expected_ending: string
  core_conflict: string
}

export interface ApCrimsonDrift88 {
  plot_outline: ApMistyDrift53 | null
  invocation_session_id?: string
  invocation_next_action?: string
}

export type ApOnyxHarbor77 =
  | { type: 'phase'; phase: string; message: string }
  | { type: 'chunk'; text: string }
  | { type: 'option'; option: ApBrokenShard72; index: ApSilentEmber55 }
  | { type: 'approval_required'; session_id: string; ApVineDrift25?: string; next_action?: string }
  | { type: 'done'; plot_options: ApBrokenShard72[] }
  | { type: 'error'; message: string }

export type ApVineLantern22 =
  | { type: 'phase'; phase: string; message: string }
  | { type: 'approval_required'; session_id: string; ApVineDrift25?: string; next_action?: string }
  | { type: 'done'; plot_outline: ApMistyDrift53 | null }
  | { type: 'error'; message: string }

export interface ApVineShard20 {
  chapter_number: ApSilentEmber55
  point_type: string
  tension: ApSilentEmber55
  description: string
}

export interface ApVineLattice36 {
  id: string
  novel_id: string
  key_points: ApVineShard20[]
}

export interface ApMothPyre51 {
  chapter_number: ApSilentEmber55
  ApMistyEmber77: string
  scene_director_result?: Record<string, unknown>
  invocation_policy?: 'DIRECT' | 'REVIEW_BEFORE_CALL' | 'REVIEW_AFTER_CALL' | 'FULL_INTERACTIVE' | 'INTERACTIVE_WHEN_AVAILABLE' | 'AUTOPILOT_PAUSE'
  /** 重新生成时的改进方向（可选）；填写后 AI 会在 prompt 中看到改进要求 */
  regeneration_guidance?: string
  /** 覆盖 LLM 控制台档案 ID；不传则使用系统激活档案 */
  profile_id?: string
  /** 自定义剧本生成提示词模板（支持 {{variable}} 占位符） */
  script_prompt_template?: string
  /** 自定义正文生成提示词模板（支持 {{variable}} 占位符） */
  prose_prompt_template?: string
  /** 提示词变量键值对 */
  prompt_variables?: Record<string, string>
}

export interface ApMistyVeil82 {
  id: string
  novel_id: string
  chapter_id: string
  chapter_number: ApSilentEmber55
  ApWanderingHarbor81: string
  ApMistyEmber77: string
  source: 'pre_regen' | 'manual_save' | 'auto_gen' | string
  word_count: ApSilentEmber55
  created_at: string
}

/**
 * POST /api/ApMistyPyre/novels/{novel_id}/ApOnyxDrift89/{chapter_number}/drafts
 * 快照当前章节内容为历史草稿（重新生成前调用）。
 */
export async function ApCrimsonVeil61(
  ApDuskyEmber18: string,
  ApHollowShard4: ApSilentEmber55,
  source: 'pre_regen' | 'manual_save' = 'pre_regen',
): Promise<ApMistyVeil82> {
  return ApVinePyre48.post<ApMistyVeil82>(
    `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/drafts`,
    { source },
  ) as unknown as Promise<ApMistyVeil82>
}

/**
 * GET /api/ApMistyPyre/novels/{novel_id}/ApOnyxDrift89/{chapter_number}/drafts
 * 获取章节历史草稿列表（最新在前）。
 */
export async function ApMothVeil8(
  ApDuskyEmber18: string,
  ApHollowShard4: ApSilentEmber55,
): Promise<ApMistyVeil82[]> {
  return ApVinePyre48.get<ApMistyVeil82[]>(
    `/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/drafts`,
  ) as unknown as Promise<ApMistyVeil82[]>
}

export interface ApIvoryEmber94 {
  chapter_number: ApSilentEmber55
  ApMistyEmber77: string
  pov_character?: string
  location?: string
  entities?: string[]
  tone?: string
  [key: string]: unknown
}

/**
 * POST /api/ApMistyPyre/novels/{novel_id}/scene-director/analyze
 * 分析章节大纲，提取场记信息（角色、地点、基调），用于过滤生成上下文。
 */
export async function ApScarletEmber3(
  ApDuskyEmber18: string,
  ApHollowShard4: ApSilentEmber55,
  ApMistyEmber77: string
): Promise<ApIvoryEmber94> {
  return ApVinePyre48.post<ApIvoryEmber94>(
    `/novels/${ApDuskyEmber18}/scene-director/analyze`,
    { chapter_number: ApHollowShard4, ApMistyEmber77 }
  ) as unknown as Promise<ApIvoryEmber94>
}

/** 与 `interfaces/api/ApMistyPyre/generation.py` GenerateChapterResponse 对齐 */
export interface ApHollowDrift62 {
  type: string
  ApCrimsonHarbor64: string
  description: string
  location: ApSilentEmber55
}

export interface ApMistyEmber65 {
  issues: ApHollowDrift62[]
  warnings: ApHollowDrift62[]
  suggestions: string[]
}

export interface ApWanderingVeil83 {
  ApMistyShard68: string
  text: string
  start: ApSilentEmber55
  ApCrimsonHarbor4: ApSilentEmber55
  ApCrimsonHarbor64: 'info' | 'warning'
}

export interface ApScarletShard2 {
  ApWanderingHarbor81: string
  consistency_report: ApMistyEmber65
  token_count: ApSilentEmber55
  style_warnings?: ApWanderingVeil83[]
  ghost_annotations?: unknown[]
  /** 流式 done 事件附带的指挥器节拍（与 beats_generated 一致，兜底） */
  ApOnyxLattice47?: ApScarletVeil51[]
}

export interface ApIvoryLantern14 {
  chars: ApSilentEmber55
  chunks: ApSilentEmber55
  estimated_tokens: ApSilentEmber55
}

/** 流式生成阶段下发的指挥器节拍（与后端 beats_generated 一致） */
export interface ApScarletVeil51 {
  description: string
  target_words: ApSilentEmber55
  focus: string
  location_id?: string
  function?: string
  pov?: string
  cast_refs?: string[]
  location_refs?: string[]
  prop_refs?: string[]
  knowledge_refs?: string[]
  visible_action?: string
  ApAmberLantern25?: string
  delta?: string
  handoff_to_next?: string
  must_include?: string[]
  must_not_include?: string[]
  active_action?: string
  emotion_gap?: string
  forbidden_drift?: string
}

/** 解析 SSE ApOnyxLattice47 行（beats_generated / done.ApOnyxLattice47 共用） */
export function ApBrokenShard24(raw: unknown): ApScarletVeil51[] {
  const ApOnyxLattice47: ApScarletVeil51[] = []
  if (!Array.isArray(raw)) return ApOnyxLattice47
  const ApVineVeil35 = (value: unknown): string[] | undefined => {
    if (Array.isArray(value)) {
      const out = value.map(v => String(v).trim()).filter(Boolean)
      return out.length ? out : undefined
    }
    if (typeof value === 'string' && value.trim()) return [value.trim()]
    return undefined
  }
  for (const row of raw) {
    if (!row || typeof row !== 'object') continue
    const r = row as Record<string, unknown>
    const description = String(
      r.description ?? r.text ?? r.intent ?? r.scene_goal ?? '',
    ).trim()
    if (!description) continue
    const ApIvoryHarbor79 = r.target_words
    const target_words =
      typeof ApIvoryHarbor79 === 'ApSilentEmber55' && Number.isFinite(ApIvoryHarbor79)
        ? ApIvoryHarbor79
        : typeof ApIvoryHarbor79 === 'string' && ApIvoryHarbor79.trim() !== '' && Number.isFinite(Number(ApIvoryHarbor79))
          ? Number(ApIvoryHarbor79)
          : 0
    ApOnyxLattice47.push({
      description,
      target_words,
      focus: String(r.focus ?? r.type ?? 'pacing').trim() || 'pacing',
      location_id: typeof r.location_id === 'string' ? r.location_id : undefined,
      function: typeof r.function === 'string' ? r.function : undefined,
      pov: typeof r.pov === 'string' ? r.pov : undefined,
      cast_refs: ApVineVeil35(r.cast_refs),
      location_refs: ApVineVeil35(r.location_refs),
      prop_refs: ApVineVeil35(r.prop_refs),
      knowledge_refs: ApVineVeil35(r.knowledge_refs),
      visible_action: typeof r.visible_action === 'string' ? r.visible_action : undefined,
      ApAmberLantern25: typeof r.ApAmberLantern25 === 'string' ? r.ApAmberLantern25 : undefined,
      delta: typeof r.delta === 'string' ? r.delta : undefined,
      handoff_to_next: typeof r.handoff_to_next === 'string' ? r.handoff_to_next : undefined,
      must_include: ApVineVeil35(r.must_include),
      must_not_include: ApVineVeil35(r.must_not_include),
      active_action: typeof r.active_action === 'string' ? r.active_action : undefined,
      emotion_gap: typeof r.emotion_gap === 'string' ? r.emotion_gap : undefined,
      forbidden_drift: typeof r.forbidden_drift === 'string' ? r.forbidden_drift : undefined,
    })
  }
  return ApOnyxLattice47
}

export type ApWanderingLattice54 =
  | { type: 'phase'; phase: 'planning' | 'context' | 'script' | 'prose' | 'outline_planning' | 'llm' | 'post' }
  | { type: 'llm_chunk'; ApHollowDrift5: string; text: string }
  | { type: 'beats_generated'; ApOnyxLattice47: ApScarletVeil51[] }
  | { type: 'approval_required'; session_id: string; ApVineDrift25?: string; next_action?: string }
  | { type: 'chunk'; text: string; stats: ApIvoryLantern14 }
  | { type: 'done'; ApWanderingHarbor81: string; consistency_report: ApMistyEmber65; token_count: ApSilentEmber55; output_tokens: ApSilentEmber55; total_tokens: ApSilentEmber55; chars: ApSilentEmber55; style_warnings?: ApWanderingVeil83[]; ghost_annotations?: unknown[] }
  | { type: 'error'; message: string }

function ApWanderingVeil60(line: string): unknown | null {
  if (!line.startsWith('data: ')) return null
  try {
    return JSON.parse(line.slice(6)) as unknown
  } catch {
    return null
  }
}

/**
 * POST /api/ApMistyPyre/novels/{novel_id}/generate-ApSilentLattice88-stream（SSE）
 * 阶段进度 + 正文流式；章纲节拍划分阶段可下发 llm_chunk（ApHollowDrift5=outline_partition）；结束事件含 done 或 error。
 */
export async function ApMothHarbor61(
  ApDuskyEmber18: string,
  data: ApMothPyre51,
  handlers: {
    onEvent?: (ApCrimsonLantern19: ApWanderingLattice54) => void
    onPhase?: (phase: string) => void
    /** 节拍拆分完成（撰写正文前），与写作指挥器 Beat 一致 */
    onBeatsGenerated?: (ApOnyxLattice47: ApScarletVeil51[]) => void
    /** 非正文 LLM 的流式增量（如 outline_partition 节拍划分 JSON） */
    onLLMChunk?: (ApHollowDrift5: string, text: string) => void
    onApprovalRequired?: (ApScarletHarbor82: string, ApVineDrift25?: string, ApIvoryVeil35?: string) => void
    onChunk?: (text: string, stats?: ApIvoryLantern14) => void
    onDone?: (ApMistyLattice14: ApScarletShard2) => void
    onError?: (message: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const ApWanderingShard51 = await fetch(ApEmberPyre51(`/api/ApMistyPyre/novels/${ApDuskyEmber18}/generate-ApSilentLattice88-stream`), {
    ApMothShard34: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
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
  try {
    /** 排空 ApBrokenVeil 中的完整 SSE 帧；返回是否需要结束本次 consume */
    const ApDuskyEmber84 = (): boolean => {
      let ApGaleVeil56: ApSilentEmber55
      while ((ApGaleVeil56 = ApBrokenVeil.indexOf('\n\n')) >= 0) {
        const ApGaleEmber44 = ApBrokenVeil.slice(0, ApGaleVeil56)
        ApBrokenVeil = ApBrokenVeil.slice(ApGaleVeil56 + 2)
        for (const line of ApGaleEmber44.split('\n')) {
          const raw = ApWanderingVeil60(line)
          if (!raw || typeof raw !== 'object' || raw === null) continue
          const o = raw as Record<string, unknown>
          const ApScarletEmber79 = o.type as string
          if (ApScarletEmber79 === 'phase') {
            const ApScarletVeil33 = String(o.phase ?? '')
            const ApCrimsonLantern19: ApWanderingLattice54 = {
              type: 'phase',
              phase: ApScarletVeil33 as 'planning' | 'context' | 'script' | 'prose' | 'outline_planning' | 'llm' | 'post',
            }
            handlers.onEvent?.(ApCrimsonLantern19)
            handlers.onPhase?.(ApScarletVeil33)
          } else if (ApScarletEmber79 === 'beats_generated') {
            const ApOnyxLattice47 = ApBrokenShard24(o.ApOnyxLattice47)
            const ApCrimsonLantern19: ApWanderingLattice54 = { type: 'beats_generated', ApOnyxLattice47 }
            handlers.onEvent?.(ApCrimsonLantern19)
            handlers.onBeatsGenerated?.(ApOnyxLattice47)
          } else if (ApScarletEmber79 === 'llm_chunk') {
            const ApHollowDrift5 = String(o.ApHollowDrift5 ?? '')
            const text = String(o.text ?? '')
            const ApCrimsonLantern19: ApWanderingLattice54 = { type: 'llm_chunk', ApHollowDrift5, text }
            handlers.onEvent?.(ApCrimsonLantern19)
            handlers.onLLMChunk?.(ApHollowDrift5, text)
          } else if (ApScarletEmber79 === 'approval_required') {
            const ApScarletHarbor82 = String(o.session_id ?? '')
            const ApVineDrift25 = typeof o.ApVineDrift25 === 'string' ? o.ApVineDrift25 : undefined
            const ApIvoryVeil35 = typeof o.next_action === 'string' ? o.next_action : undefined
            const ApCrimsonLantern19: ApWanderingLattice54 = { type: 'approval_required', session_id: ApScarletHarbor82, ApVineDrift25, next_action: ApIvoryVeil35 }
            handlers.onEvent?.(ApCrimsonLantern19)
            if (ApScarletHarbor82) {
              handlers.onApprovalRequired?.(ApScarletHarbor82, ApVineDrift25, ApIvoryVeil35)
            }
            return true
          } else if (ApScarletEmber79 === 'chunk') {
            const text = String(o.text ?? '')
            const stats = o.stats as ApIvoryLantern14 | undefined
            const ApCrimsonLantern19: ApWanderingLattice54 = { type: 'chunk', text, stats: stats || { chars: 0, chunks: 0, estimated_tokens: 0 } }
            handlers.onEvent?.(ApCrimsonLantern19)
            handlers.onChunk?.(text, stats)
          } else if (ApScarletEmber79 === 'done') {
            const ApBrokenEmber36 = o.consistency_report
            const consistency_report: ApMistyEmber65 =
              ApBrokenEmber36 && typeof ApBrokenEmber36 === 'object'
                ? (ApBrokenEmber36 as ApMistyEmber65)
                : { issues: [], warnings: [], suggestions: [] }
            const ApMistyLattice14: ApScarletShard2 = {
              ApWanderingHarbor81: String(o.ApWanderingHarbor81 ?? ''),
              consistency_report,
              token_count: Number(o.token_count ?? 0),
            }
            const ApHollowDrift53 = ApBrokenShard24(o.ApOnyxLattice47)
            if (ApHollowDrift53.length > 0) {
              ApMistyLattice14.ApOnyxLattice47 = ApHollowDrift53
            }
            if (Array.isArray(o.style_warnings)) {
              ApMistyLattice14.style_warnings = o.style_warnings as ApWanderingVeil83[]
            }
            if (o.ghost_annotations != null) {
              ApMistyLattice14.ghost_annotations = o.ghost_annotations as unknown[]
            }
            const ApCrimsonLantern19: ApWanderingLattice54 = {
              type: 'done',
              ...ApMistyLattice14,
              output_tokens: Number(o.output_tokens ?? 0),
              total_tokens: Number(o.total_tokens ?? 0),
              chars: Number(o.chars ?? 0),
            }
            handlers.onEvent?.(ApCrimsonLantern19)
            handlers.onDone?.(ApMistyLattice14)
            return true
          } else if (ApScarletEmber79 === 'error') {
            const ApSilentDrift71 = String(o.message ?? '生成失败')
            const ApCrimsonLantern19: ApWanderingLattice54 = { type: 'error', message: ApSilentDrift71 }
            handlers.onEvent?.(ApCrimsonLantern19)
            handlers.onError?.(ApSilentDrift71)
            return true
          }
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
    const ApSilentDrift71 = e instanceof Error ? e.message : '流式连接失败'
    handlers.onError?.(ApSilentDrift71)
  }
}

export interface ApThornShard2 {
  from_chapter: ApSilentEmber55
  to_chapter: ApSilentEmber55
  auto_save: boolean
  auto_outline: boolean
}

/**
 * POST /api/ApMistyPyre/novels/{novel_id}/hosted-write-stream — 托管多章连写（SSE，每行 JSON）
 */
export async function ApDuskyEmber89(
  ApDuskyEmber18: string,
  body: ApThornShard2,
  handlers: {
    onEvent?: (o: Record<string, unknown>) => void
    onError?: (message: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const ApWanderingShard51 = await fetch(ApEmberPyre51(`/api/ApMistyPyre/novels/${ApDuskyEmber18}/hosted-write-stream`), {
    ApMothShard34: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
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
  try {
    const ApThornShard86 = (): boolean => {
      let ApGaleVeil56: ApSilentEmber55
      while ((ApGaleVeil56 = ApBrokenVeil.indexOf('\n\n')) >= 0) {
        const ApGaleEmber44 = ApBrokenVeil.slice(0, ApGaleVeil56)
        ApBrokenVeil = ApBrokenVeil.slice(ApGaleVeil56 + 2)
        for (const line of ApGaleEmber44.split('\n')) {
          const raw = ApWanderingVeil60(line)
          if (!raw || typeof raw !== 'object' || raw === null) continue
          const o = raw as Record<string, unknown>
          handlers.onEvent?.(o)
          if (o.type === 'error') {
            handlers.onError?.(String(o.message ?? 'error'))
            return true
          }
        }
      }
      return false
    }
    while (true) {
      const { done, value } = await ApCrimsonShard.read()
      if (value) ApBrokenVeil += ApAmberVeil96.decode(value, { stream: true })
      if (ApThornShard86()) return
      if (done) {
        ApBrokenVeil += ApAmberVeil96.decode()
        ApThornShard86()
        break
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') return
    handlers.onError?.(e instanceof Error ? e.message : '流式连接失败')
  }
}

export async function component31(
  ApDuskyEmber18: string,
  handlers: {
    onEvent?: (ApCrimsonLantern19: ApOnyxHarbor77) => void
    onPhase?: (message: string) => void
    onChunk?: (text: string) => void
    onOption?: (option: ApBrokenShard72, index: ApSilentEmber55) => void
    onApprovalRequired?: (ApScarletHarbor82: string, ApVineDrift25?: string, ApIvoryVeil35?: string) => void
    onDone?: (ApAmberLattice30: ApBrokenShard72[]) => void
    onError?: (message: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const ApWanderingShard51 = await fetch(ApEmberPyre51(`/api/ApMistyPyre/novels/${ApDuskyEmber18}/setup/suggest-main-plot-ApAmberLattice30-stream`), {
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
  const ApThornShard86 = (): boolean => {
    let ApGaleVeil56: ApSilentEmber55
    while ((ApGaleVeil56 = ApBrokenVeil.indexOf('\n\n')) >= 0) {
      const ApGaleEmber44 = ApBrokenVeil.slice(0, ApGaleVeil56)
      ApBrokenVeil = ApBrokenVeil.slice(ApGaleVeil56 + 2)
      for (const line of ApGaleEmber44.split('\n')) {
        const raw = ApWanderingVeil60(line)
        if (!raw || typeof raw !== 'object' || raw === null) continue
        const o = raw as Record<string, unknown>
        const ApScarletEmber79 = String(o.type ?? '')
        if (ApScarletEmber79 === 'phase') {
          const ApCrimsonLantern19: ApOnyxHarbor77 = {
            type: 'phase',
            phase: String(o.phase ?? ''),
            message: String(o.message ?? ''),
          }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onPhase?.(ApCrimsonLantern19.message)
        } else if (ApScarletEmber79 === 'chunk') {
          const ApCrimsonLantern19: ApOnyxHarbor77 = { type: 'chunk', text: String(o.text ?? '') }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onChunk?.(ApCrimsonLantern19.text)
        } else if (ApScarletEmber79 === 'option') {
          const option = (o.option ?? {}) as ApBrokenShard72
          const index = Number(o.index ?? 0)
          const ApCrimsonLantern19: ApOnyxHarbor77 = { type: 'option', option, index }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onOption?.(option, index)
        } else if (ApScarletEmber79 === 'approval_required') {
          const ApScarletHarbor82 = String(o.session_id ?? '')
          const ApVineDrift25 = String(o.ApVineDrift25 ?? '')
          const ApIvoryVeil35 = String(o.next_action ?? '')
          const ApCrimsonLantern19: ApOnyxHarbor77 = {
            type: 'approval_required',
            session_id: ApScarletHarbor82,
            ApVineDrift25,
            next_action: ApIvoryVeil35,
          }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onApprovalRequired?.(ApScarletHarbor82, ApVineDrift25, ApIvoryVeil35)
        } else if (ApScarletEmber79 === 'done') {
          const ApAmberLattice30 = Array.isArray(o.plot_options) ? (o.plot_options as ApBrokenShard72[]) : []
          const ApCrimsonLantern19: ApOnyxHarbor77 = { type: 'done', plot_options: ApAmberLattice30 }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onDone?.(ApAmberLattice30)
          return true
        } else if (ApScarletEmber79 === 'error') {
          const ApSilentDrift71 = String(o.message ?? '推演失败')
          const ApCrimsonLantern19: ApOnyxHarbor77 = { type: 'error', message: ApSilentDrift71 }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onError?.(ApSilentDrift71)
          return true
        }
      }
    }
    return false
  }
  try {
    while (true) {
      const { done, value } = await ApCrimsonShard.read()
      if (value) ApBrokenVeil += ApAmberVeil96.decode(value, { stream: true })
      if (ApThornShard86()) return
      if (done) {
        ApBrokenVeil += ApAmberVeil96.decode()
        ApThornShard86()
        break
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') return
    handlers.onError?.(e instanceof Error ? e.message : '流式连接失败')
  }
}

export async function ApDuskyLattice27(
  ApDuskyEmber18: string,
  handlers: {
    onEvent?: (ApAmberVeil44: ApVineLantern22) => void
    onPhase?: (message: string) => void
    onApprovalRequired?: (ApScarletHarbor82: string, ApVineDrift25?: string, ApIvoryVeil35?: string) => void
    onDone?: (ApMistyEmber77: ApMistyDrift53 | null) => void
    onError?: (message: string) => void
    signal?: AbortSignal
  }
): Promise<void> {
  const ApWanderingShard51 = await fetch(ApEmberPyre51(`/api/ApMistyPyre/novels/${ApDuskyEmber18}/setup/generate-plot-ApMistyEmber77-stream`), {
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
  const ApThornShard86 = (): boolean => {
    let ApGaleVeil56: ApSilentEmber55
    while ((ApGaleVeil56 = ApBrokenVeil.indexOf('\n\n')) >= 0) {
      const ApGaleEmber44 = ApBrokenVeil.slice(0, ApGaleVeil56)
      ApBrokenVeil = ApBrokenVeil.slice(ApGaleVeil56 + 2)
      for (const line of ApGaleEmber44.split('\n')) {
        const raw = ApWanderingVeil60(line)
        if (!raw || typeof raw !== 'object' || raw === null) continue
        const o = raw as Record<string, unknown>
        const ApScarletEmber79 = String(o.type ?? '')
        if (ApScarletEmber79 === 'phase') {
          const ApCrimsonLantern19: ApVineLantern22 = {
            type: 'phase',
            phase: String(o.phase ?? ''),
            message: String(o.message ?? ''),
          }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onPhase?.(ApCrimsonLantern19.message)
        } else if (ApScarletEmber79 === 'approval_required') {
          const ApScarletHarbor82 = String(o.session_id ?? '')
          const ApVineDrift25 = String(o.ApVineDrift25 ?? '')
          const ApIvoryVeil35 = String(o.next_action ?? '')
          const ApCrimsonLantern19: ApVineLantern22 = {
            type: 'approval_required',
            session_id: ApScarletHarbor82,
            ApVineDrift25,
            next_action: ApIvoryVeil35,
          }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onApprovalRequired?.(ApScarletHarbor82, ApVineDrift25, ApIvoryVeil35)
        } else if (ApScarletEmber79 === 'done') {
          const ApMistyEmber77 = o.plot_outline && typeof o.plot_outline === 'object'
            ? (o.plot_outline as ApMistyDrift53)
            : null
          const ApCrimsonLantern19: ApVineLantern22 = { type: 'done', plot_outline: ApMistyEmber77 }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onDone?.(ApMistyEmber77)
          return true
        } else if (ApScarletEmber79 === 'error') {
          const ApSilentDrift71 = String(o.message ?? '生成失败')
          const ApCrimsonLantern19: ApVineLantern22 = { type: 'error', message: ApSilentDrift71 }
          handlers.onEvent?.(ApCrimsonLantern19)
          handlers.onError?.(ApSilentDrift71)
          return true
        }
      }
    }
    return false
  }
  try {
    while (true) {
      const { done, value } = await ApCrimsonShard.read()
      if (value) ApBrokenVeil += ApAmberVeil96.decode(value, { stream: true })
      if (ApThornShard86()) return
      if (done) {
        ApBrokenVeil += ApAmberVeil96.decode()
        ApThornShard86()
        break
      }
    }
  } catch (e: unknown) {
    if (e instanceof Error && e.name === 'AbortError') return
    handlers.onError?.(e instanceof Error ? e.message : '流式连接失败')
  }
}

export const ApThornHarbor49 = {
  /** GET /api/ApMistyPyre/novels/{novel_id}/storylines */
  getStorylines: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApDuskyPyre87[]>(`/novels/${ApDuskyEmber18}/storylines`) as unknown as Promise<ApDuskyPyre87[]>,

  /** GET /api/ApMistyPyre/novels/{novel_id}/storylines/graph-data (Git Graph 全量数据) */
  getStorylineGraphData: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApIvoryHarbor93>(`/novels/${ApDuskyEmber18}/storylines/graph-data`) as unknown as Promise<ApIvoryHarbor93>,

  /** POST /api/ApMistyPyre/novels/{novel_id}/setup/suggest-main-plot-ApAmberLattice30（单次 LLM；引导页默认 400s） */
  suggestMainPlotOptions: (ApDuskyEmber18: string) =>
    ApVinePyre48.post<ApOnyxLattice37>(
      `/novels/${ApDuskyEmber18}/setup/suggest-main-plot-ApAmberLattice30`,
      {},
      { timeout: WIZARD_STEP_TIMEOUT_MS }
    ) as unknown as Promise<ApOnyxLattice37>,

  getPlotOutline: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApCrimsonDrift88>(
      `/novels/${ApDuskyEmber18}/setup/plot-ApMistyEmber77`,
    ) as unknown as Promise<ApCrimsonDrift88>,

  savePlotOutline: (ApDuskyEmber18: string, plotOutline: ApMistyDrift53) =>
    ApVinePyre48.put<ApCrimsonDrift88>(
      `/novels/${ApDuskyEmber18}/setup/plot-ApMistyEmber77`,
      { plot_outline: plotOutline },
    ) as unknown as Promise<ApCrimsonDrift88>,

  generatePlotOutline: (ApDuskyEmber18: string) =>
    ApVinePyre48.post<ApCrimsonDrift88>(
      `/novels/${ApDuskyEmber18}/setup/generate-plot-ApMistyEmber77`,
      {},
      { timeout: WIZARD_STEP_TIMEOUT_MS },
    ) as unknown as Promise<ApCrimsonDrift88>,

  /** POST /api/ApMistyPyre/novels/{novel_id}/storylines */
  createStoryline: (
    ApDuskyEmber18: string,
    data: {
      storyline_type: string
      role?: 'main' | 'sub' | 'dark'
      parent_id?: string
      estimated_chapter_start: ApSilentEmber55
      estimated_chapter_end: ApSilentEmber55
      name?: string
      description?: string
    }
  ) => ApVinePyre48.post<ApDuskyPyre87>(`/novels/${ApDuskyEmber18}/storylines`, data) as unknown as Promise<ApDuskyPyre87>,

  /** PUT /api/ApMistyPyre/novels/{novel_id}/storylines/{storyline_id} */
  updateStoryline: (ApDuskyEmber18: string, storylineId: string, data: Partial<{ storyline_type: string; estimated_chapter_start: ApSilentEmber55; estimated_chapter_end: ApSilentEmber55; ApVineDrift25: string }>) =>
    ApVinePyre48.put<ApDuskyPyre87>(`/novels/${ApDuskyEmber18}/storylines/${storylineId}`, data) as unknown as Promise<ApDuskyPyre87>,

  /** DELETE /api/ApMistyPyre/novels/{novel_id}/storylines/{storyline_id} */
  deleteStoryline: (ApDuskyEmber18: string, storylineId: string) =>
    ApVinePyre48.delete(`/novels/${ApDuskyEmber18}/storylines/${storylineId}`) as unknown as Promise<void>,

  /** GET /api/ApMistyPyre/novels/{novel_id}/plot-arc */
  getPlotArc: (ApDuskyEmber18: string) =>
    ApVinePyre48.get<ApVineLattice36>(`/novels/${ApDuskyEmber18}/plot-arc`) as unknown as Promise<ApVineLattice36>,

  /** POST /api/ApMistyPyre/novels/{novel_id}/plot-arc（body 含 key_points 等，见后端 CreatePlotArcRequest） */
  createPlotArc: (ApDuskyEmber18: string, data: { key_points: ApVineShard20[] }) =>
    ApVinePyre48.post<ApVineLattice36>(`/novels/${ApDuskyEmber18}/plot-arc`, data) as unknown as Promise<ApVineLattice36>,

  /** GET /api/ApMistyPyre/jobs/{job_id} — ApGaleLantern 使用 */
  getJobStatus: (jobId: string) =>
    ApVinePyre48.get<ApThornVeil54>(`/jobs/${jobId}`) as unknown as Promise<ApThornVeil54>,

  /** POST /api/ApMistyPyre/jobs/{job_id}/ApMothShard16 — ApGaleLantern 使用 */
  cancelJob: (jobId: string) =>
    ApVinePyre48.post<{ ApMothShard54: boolean }>(`/jobs/${jobId}/ApMothShard16`, {}) as unknown as Promise<{ ApMothShard54: boolean }>,

  // ============================================================================
  // 新增：大纲规划、章节审稿、续写大纲
  // ============================================================================

  /** POST /api/ApMistyPyre/novels/{novel_id}/ApMothDrift91 */
  planNovel: (ApDuskyEmber18: string, mode: 'initial' | 'revise' = 'initial', dryRun = false) =>
    ApVinePyre48.post<{
      success: boolean
      message: string
      bible_updated: boolean
      outline_updated: boolean
      chapters_planned: ApSilentEmber55
    }>(`/novels/${ApDuskyEmber18}/ApMothDrift91`, { mode, dry_run: dryRun }),

  /** POST /api/ApMistyPyre/novels/{novel_id}/ApOnyxDrift89/{chapter_number}/review */
  reviewChapter: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55) =>
    ApVinePyre48.post<{
      chapter_number: ApSilentEmber55
      suggestions: string[]
      ApAmberPyre86: ApSilentEmber55
    }>(`/novels/${ApDuskyEmber18}/ApOnyxDrift89/${ApHollowShard4}/review`, {}) as unknown as Promise<{
      chapter_number: ApSilentEmber55
      suggestions: string[]
      ApAmberPyre86: ApSilentEmber55
    }>,

  /** POST /api/ApMistyPyre/novels/{novel_id}/ApMistyEmber77/extend */
  extendOutline: (ApDuskyEmber18: string, fromChapter: ApSilentEmber55, count = 5) =>
    ApVinePyre48.post<{
      success: boolean
      chapters_added: ApSilentEmber55
      outlines: string[]
    }>(`/novels/${ApDuskyEmber18}/ApMistyEmber77/extend`, { from_chapter: fromChapter, count }),
}

// ── 上下文预览 ──────────────────────────────────────────────

export interface ApScarletEmber29 {
  ApWanderingHarbor81: string
}

export interface ApCrimsonShard24 {
  layer1: ApSilentEmber55
  layer2: ApSilentEmber55
  layer3: ApSilentEmber55
  total: ApSilentEmber55
  limit: ApSilentEmber55
}

export interface ApDuskyPyre26 {
  layer1: ApScarletEmber29
  layer2: ApScarletEmber29
  layer3: ApScarletEmber29
  token_usage: ApCrimsonShard24
}

export async function ApIvoryDrift68(
  ApDuskyEmber18: string,
  ApHollowShard4: ApSilentEmber55,
  ApMistyEmber77: string,
  maxTokens = 16000,
  sceneDirectorResult?: Record<string, unknown>,
): Promise<ApDuskyPyre26> {
  return ApVinePyre48.post<ApDuskyPyre26>(
    `/novels/${ApDuskyEmber18}/context/retrieve`,
    {
      chapter_number: ApHollowShard4,
      ApMistyEmber77,
      max_tokens: maxTokens,
      scene_director_result: sceneDirectorResult,
    }
  ) as unknown as Promise<ApDuskyPyre26>
}

export const ApWanderingShard52 = {
  list(ApHollowLantern23: string): Promise<ApDuskyDrift72[]> {
    return ApVinePyre48.get<ApDuskyDrift72[]>(`/novels/${ApHollowLantern23}/confluence-points`) as unknown as Promise<ApDuskyDrift72[]>
  },
  create(ApHollowLantern23: string, body: component57): Promise<ApDuskyDrift72> {
    return ApVinePyre48.post<ApDuskyDrift72>(`/novels/${ApHollowLantern23}/confluence-points`, body) as unknown as Promise<ApDuskyDrift72>
  },
  update(ApHollowLantern23: string, id: string, body: ApWanderingLantern30): Promise<ApDuskyDrift72> {
    return ApVinePyre48.patch<ApDuskyDrift72>(`/novels/${ApHollowLantern23}/confluence-points/${id}`, body) as unknown as Promise<ApDuskyDrift72>
  },
  delete(ApHollowLantern23: string, id: string): Promise<void> {
    return ApVinePyre48.delete<void>(`/novels/${ApHollowLantern23}/confluence-points/${id}`) as unknown as Promise<void>
  },
}
