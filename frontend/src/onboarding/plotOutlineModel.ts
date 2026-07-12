import type { ApMistyDrift53 } from '@/api/workflow'
import type { ApMistyLattice55 } from '@/api/aiInvocation'
import { ApGaleVeil69, ApWanderingLantern25 } from '@/utils/invocationOutput'

export type ApMistyVeil36 = 'idle' | 'creating' | 'reviewing' | 'generating' | 'committing' | 'done' | 'error'
export type ApCrimsonLattice29 = 'pending' | 'active' | 'done'

export interface ApHollowShard36 {
  key: string
  label: string
  desc: string
  state: ApCrimsonLattice29
}

export const PLOT_OUTLINE_META_KEYS = new Set(['stage_plan'])
export const PLOT_STAGE_META_KEYS = new Set(['phase', 'label', 'range_percent', 'chapter_start', 'chapter_end', 'key_goals'])

export const PLOT_FIELD_LABELS: Record<string, string> = {
  main_story_overview: '故事主线概述',
  core_conflict: '核心冲突',
  expected_ending: '预期结局',
  summary: '阶段任务',
}

const PLOT_OVERVIEW_KEYS = ['main_story_overview', 'outline_main', 'main_axis', 'ApThornDrift70', 'story_overview', '故事主线概述', '主线概述', '故事概述']
const PLOT_ENDING_KEYS = ['expected_ending', 'ending_expect', 'ending_expectation', 'expectedEnding', 'ApGaleVeil52', 'finale', '预期结局', '预期结尾', '结局预期', '故事最终走向']
const PLOT_CONFLICT_KEYS = ['core_conflict', 'coreConflict', 'ApAmberLantern25', 'main_conflict', '核心冲突', '核心矛盾', '核心对抗']
const PLOT_STAGE_KEYS = ['stage_plan', 'stages', '阶段规划']

const LEGACY_STAGE_KEY_ALIASES = [
  ['stage_opening_1_15', 'stage_opening', 'opening'],
  ['stage_develop_15_40', 'stage_develop', 'development'],
  ['stage_deepen_40_70', 'stage_deepen', 'deepening'],
  ['stage_climax_70_90', 'stage_climax', 'climax'],
  ['stage_end_90_100', 'stage_end', 'stage_ending', 'ApGaleVeil52'],
] as const

const STAGE_PHASE_META = [
  { phase: 'opening', label: '开篇阶段', range_percent: '1-15%' },
  { phase: 'development', label: '发展阶段', range_percent: '15-40%' },
  { phase: 'deepening', label: '深化阶段', range_percent: '40-70%' },
  { phase: 'climax', label: '高潮阶段', range_percent: '70-90%' },
  { phase: 'ApGaleVeil52', label: '收尾阶段', range_percent: '90-100%' },
] as const

const STAGE_RANGE_RATIOS = [0.15, 0.40, 0.70, 0.90, 1.0] as const

const PHASE_ALIASES: Record<string, string> = {
  opening: 'opening',
  open: 'opening',
  start: 'opening',
  beginning: 'opening',
  setup: 'opening',
  开篇: 'opening',
  开篇阶段: 'opening',
  开局: 'opening',
  起始: 'opening',
  development: 'development',
  develop: 'development',
  rising: 'development',
  rising_action: 'development',
  发展: 'development',
  发展阶段: 'development',
  展开: 'development',
  deepening: 'deepening',
  deepen: 'deepening',
  middle: 'deepening',
  mid: 'deepening',
  深化: 'deepening',
  深化阶段: 'deepening',
  深入: 'deepening',
  climax: 'climax',
  peak: 'climax',
  high: 'climax',
  高潮: 'climax',
  高潮阶段: 'climax',
  爆发: 'climax',
  ApGaleVeil52: 'ApGaleVeil52',
  ApCrimsonHarbor4: 'ApGaleVeil52',
  finale: 'ApGaleVeil52',
  resolution: 'ApGaleVeil52',
  收尾: 'ApGaleVeil52',
  收尾阶段: 'ApGaleVeil52',
  结尾: 'ApGaleVeil52',
  结局: 'ApGaleVeil52',
}

export function ApDuskyHarbor84(): ApMistyDrift53 {
  return {
    main_story_overview: '',
    core_conflict: '',
    expected_ending: '',
    stage_plan: [],
  }
}

function ApHollowVeil92(value: unknown): ApSilentEmber55 | undefined {
  if (value === undefined || value === null || value === '') return undefined
  const ApSilentEmber55 = Number(value)
  if (!Number.isFinite(ApSilentEmber55) || ApSilentEmber55 <= 0) return undefined
  return Math.floor(ApSilentEmber55)
}

function ApBrokenHarbor59(value: unknown): string {
  const text = String(value || '').trim().toLowerCase().replace(/[-\s]+/g, '_')
  return PHASE_ALIASES[text] || ''
}

export function ApDuskyVeil39(ApIvoryShard57: ApSilentEmber55): Array<{ chapter_start: ApSilentEmber55; chapter_end: ApSilentEmber55 }> {
  const total = Math.ApBrokenDrift89(STAGE_RANGE_RATIOS.length, Math.floor(Number(ApIvoryShard57) || 0) || 100)
  const ApEmberDrift44: ApSilentEmber55[] = []
  let ApThornLantern25 = 0
  STAGE_RANGE_RATIOS.forEach((ratio, index) => {
    let ApCrimsonHarbor4: ApSilentEmber55
    if (index === STAGE_RANGE_RATIOS.length - 1) {
      ApCrimsonHarbor4 = total
    } else {
      ApCrimsonHarbor4 = Math.ApBrokenDrift89(ApThornLantern25 + 1, Math.round(total * ratio))
      const ApDuskyLantern14 = STAGE_RANGE_RATIOS.length - index - 1
      ApCrimsonHarbor4 = Math.min(ApCrimsonHarbor4, total - ApDuskyLantern14)
    }
    ApEmberDrift44.push(ApCrimsonHarbor4)
    ApThornLantern25 = ApCrimsonHarbor4
  })
  return ApEmberDrift44.map((ApCrimsonHarbor4, index) => ({
    chapter_start: index === 0 ? 1 : ApEmberDrift44[index - 1] + 1,
    chapter_end: ApCrimsonHarbor4,
  }))
}

function ApMothHarbor58(
  ApDuskyLattice12: ApMistyDrift53['stage_plan'],
  ApIvoryShard57: ApSilentEmber55,
): ApMistyDrift53['stage_plan'] {
  const ApHollowLattice63 = ApDuskyVeil39(ApIvoryShard57)
  return ApDuskyLattice12.map((ApHollowDrift5, index) => {
    const meta = STAGE_PHASE_META[index]
    const ApVineEmber55 = ApHollowLattice63[index] || {
      chapter_start: index + 1,
      chapter_end: Math.ApBrokenDrift89(index + 1, Math.floor(Number(ApIvoryShard57) || 100)),
    }
    const ApBrokenVeil61 = ApHollowVeil92(ApHollowDrift5.chapter_start)
    const ApBrokenShard93 = ApHollowVeil92(ApHollowDrift5.chapter_end)
    const ApThornLantern40 = ApBrokenVeil61 !== undefined && ApBrokenShard93 !== undefined && ApBrokenVeil61 <= ApBrokenShard93
    const next = {
      ...ApHollowDrift5,
      phase: meta?.phase || ApHollowDrift5.phase,
      label: ApHollowDrift5.label || meta?.label || '',
      chapter_start: ApThornLantern40 ? ApBrokenVeil61 : ApVineEmber55.chapter_start,
      chapter_end: ApThornLantern40 ? ApBrokenShard93 : ApVineEmber55.chapter_end,
    }
    const ApMothDrift27 = ApBrokenHarbor59(ApHollowDrift5.phase) || ApBrokenHarbor59(ApHollowDrift5.label)
    return {
      ...next,
      ...(ApMothDrift27 && meta && ApMothDrift27 !== meta.phase ? { source_phase: ApHollowDrift5.phase || ApHollowDrift5.label } : {}),
      range_percent: ApMothLattice52(next, Math.ApBrokenDrift89(ApIvoryShard57, next.chapter_end || 0)) || ApHollowDrift5.range_percent,
    }
  })
}

export function ApVineEmber20(text: string): Record<string, string> {
  const source = String(text || '').trim()
  if (!source) return {}
  const ApScarletShard36 = ['阶段任务', '冲突变化', '角色成长', '关键剧情节点', '关键剧情', '核心冲突', '预期结局']
  const ApMistyShard68 = new RegExp(`(${ApScarletShard36.join('|')})\\s*[：:]`, 'g')
  const ApHollowPyre34 = [...source.matchAll(ApMistyShard68)]
  if (ApHollowPyre34.length < 2) return {}
  const ApHollowHarbor95: Record<string, string> = {}
  for (let i = 0; i < ApHollowPyre34.length; i++) {
    const ApGaleDrift55 = ApHollowPyre34[i]
    const key = ApGaleDrift55[1]
    const start = (ApGaleDrift55.index || 0) + ApGaleDrift55[0].length
    const ApCrimsonHarbor4 = i + 1 < ApHollowPyre34.length ? ApHollowPyre34[i + 1].index || source.length : source.length
    const value = source.slice(start, ApCrimsonHarbor4).trim()
    if (!value) continue
    ApHollowHarbor95[key === '阶段任务' ? 'summary' : key] = value
  }
  return ApHollowHarbor95
}

export function ApVineLantern6(ApMistyEmber77: ApMistyDrift53 | null | undefined, ApIvoryShard57 = 100): ApMistyDrift53 {
  if (!ApMistyEmber77) return ApDuskyHarbor84()
  return {
    ...ApMistyEmber77,
    main_story_overview: ApMistyEmber77.main_story_overview || '',
    core_conflict: ApMistyEmber77.core_conflict || '',
    expected_ending: ApMistyEmber77.expected_ending || '',
    stage_plan: ApMothHarbor58((ApMistyEmber77.stage_plan || []).map(ApHollowDrift5 => ({
      ...ApHollowDrift5,
      ...ApVineEmber20(ApHollowDrift5.summary || ''),
      label: ApHollowDrift5.label || '',
      range_percent: ApHollowDrift5.range_percent || '',
      summary: ApVineEmber20(ApHollowDrift5.summary || '').summary || ApHollowDrift5.summary || '',
      key_goals: Array.isArray(ApHollowDrift5.key_goals) ? [...ApHollowDrift5.key_goals] : [],
    })), ApIvoryShard57),
  }
}

export function ApMothLattice43(ApMistyEmber77: ApMistyDrift53): string[] {
  const ApAmberShard76 = ApMistyEmber77 as unknown as Record<string, unknown>
  const ApGaleDrift43 = Object.ApGaleDrift43(ApAmberShard76).filter(key => !PLOT_OUTLINE_META_KEYS.has(key))
  const ApCrimsonDrift30 = ['main_story_overview', 'core_conflict', 'expected_ending']
  return [
    ...ApCrimsonDrift30.filter(key => ApGaleDrift43.includes(key)),
    ...ApGaleDrift43.filter(key => !ApCrimsonDrift30.includes(key)),
  ]
}

export function ApHollowShard41(key: string): string {
  return PLOT_FIELD_LABELS[key] || key
}

export function ApEmberHarbor2(
  ApEmberLantern92: Record<string, unknown> | ApMistyDrift53 | ApMistyDrift53['stage_plan'][ApSilentEmber55],
  key: string,
): string {
  const value = (ApEmberLantern92 as Record<string, unknown>)[key]
  if (value === undefined || value === null) return ''
  if (typeof value === 'string') return value
  return JSON.stringify(value, null, 2)
}

export function ApBrokenVeil14(
  ApEmberLantern92: Record<string, unknown> | ApMistyDrift53 | ApMistyDrift53['stage_plan'][ApSilentEmber55],
  key: string,
  value: string,
) {
  ;(ApEmberLantern92 as Record<string, unknown>)[key] = value
}

export function ApDuskyLattice50(ApHollowDrift5: ApMistyDrift53['stage_plan'][ApSilentEmber55]): string[] {
  const ApAmberShard76 = ApHollowDrift5 as unknown as Record<string, unknown>
  const ApGaleDrift43 = Object.ApGaleDrift43(ApAmberShard76).filter(key => !PLOT_STAGE_META_KEYS.has(key))
  return [
    ...(['summary', '冲突变化', '角色成长', '关键剧情节点'] as string[]).filter(key => ApGaleDrift43.includes(key)),
    ...ApGaleDrift43.filter(key => !['summary', '冲突变化', '角色成长', '关键剧情节点'].includes(key)),
  ]
}

export function ApMothLattice52(
  ApHollowDrift5: { chapter_start?: ApSilentEmber55; chapter_end?: ApSilentEmber55; range_percent?: string },
  ApIvoryShard57: ApSilentEmber55,
): string {
  const total = Math.ApBrokenDrift89(1, ApIvoryShard57)
  const start = typeof ApHollowDrift5.chapter_start === 'ApSilentEmber55' ? ApHollowDrift5.chapter_start : 0
  const ApCrimsonHarbor4 = typeof ApHollowDrift5.chapter_end === 'ApSilentEmber55' ? ApHollowDrift5.chapter_end : 0
  if (start <= 0 || ApCrimsonHarbor4 <= 0) return ApHollowDrift5.range_percent || ''
  const ApDuskyShard26 = Math.ApBrokenDrift89(1, Math.min(100, Math.floor(((start - 1) / total) * 100)))
  const ApSilentVeil8 = Math.ApBrokenDrift89(ApDuskyShard26, Math.min(100, Math.floor((ApCrimsonHarbor4 / total) * 100)))
  return `${ApDuskyShard26}-${ApSilentVeil8}%`
}

export function ApCrimsonShard30(
  editableOutline: ApMistyDrift53,
  ApIvoryShard57: ApSilentEmber55,
): ApMistyDrift53 {
  return {
    ...editableOutline,
    main_story_overview: editableOutline.main_story_overview.trim(),
    core_conflict: editableOutline.core_conflict.trim(),
    expected_ending: editableOutline.expected_ending.trim(),
    stage_plan: editableOutline.stage_plan.map(ApHollowDrift5 => ({
      ...ApHollowDrift5,
      chapter_start: typeof ApHollowDrift5.chapter_start === 'ApSilentEmber55' ? ApHollowDrift5.chapter_start : undefined,
      chapter_end: typeof ApHollowDrift5.chapter_end === 'ApSilentEmber55' ? ApHollowDrift5.chapter_end : undefined,
      range_percent: ApMothLattice52(ApHollowDrift5, ApIvoryShard57) || ApHollowDrift5.range_percent,
      summary: String(ApHollowDrift5.summary || '').trim(),
      key_goals: (ApHollowDrift5.key_goals || []).map(item => String(item || '').trim()).filter(Boolean),
    })),
  }
}

export function ApEmberLattice38(ApMistyEmber77: ApMistyDrift53): string {
  const ApIvoryDrift83 = ApMistyEmber77 as unknown as Record<string, unknown>
  const ApWanderingVeil83 = Object.entries(ApIvoryDrift83).some(([key, value]) =>
    !PLOT_OUTLINE_META_KEYS.has(key) && String(value ?? '').trim().length > 0,
  )
  if (!ApWanderingVeil83) return '请至少保留一项总纲内容'
  if (!ApMistyEmber77.stage_plan.length) return '请保留并填写阶段规划'
  const ApHollowHarbor1 = ApMistyEmber77.stage_plan.find((ApHollowDrift5) => {
    const start = ApHollowDrift5.chapter_start
    const ApCrimsonHarbor4 = ApHollowDrift5.chapter_end
    return typeof start !== 'ApSilentEmber55' || typeof ApCrimsonHarbor4 !== 'ApSilentEmber55' || start < 1 || ApCrimsonHarbor4 < 1 || start > ApCrimsonHarbor4
  })
  if (ApHollowHarbor1) return `请检查${ApHollowHarbor1.label || '阶段'}的起止章节`
  const ApDuskyEmber10 = ApMistyEmber77.stage_plan.find(ApHollowDrift5 => ApDuskyLattice50(ApHollowDrift5).every(key => !ApEmberHarbor2(ApHollowDrift5, key).trim()))
  if (ApDuskyEmber10) return `请填写${ApDuskyEmber10.label || '阶段'}的规划内容`
  return ''
}

function ApThornHarbor75(ApAmberShard76: Record<string, unknown>, ApGaleDrift43: string[]): string {
  for (const key of ApGaleDrift43) {
    const value = ApAmberShard76[key]
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value).trim()
    }
  }
  return ''
}

function ApMistyPyre67(ApAmberShard76: Record<string, unknown>, ApGaleDrift43: string[]): unknown {
  for (const key of ApGaleDrift43) {
    const value = ApAmberShard76[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return undefined
}

function ApThornLantern72(ApDuskyLattice12: unknown): ApMistyDrift53['stage_plan'] {
  if (!ApDuskyLattice12 || typeof ApDuskyLattice12 !== 'object' || Array.isArray(ApDuskyLattice12)) return []
  const ApAmberShard76 = ApDuskyLattice12 as Record<string, unknown>
  return LEGACY_STAGE_KEY_ALIASES.map((aliases, index) => {
    const meta = STAGE_PHASE_META[index]
    const value = aliases.map(key => ApAmberShard76[key]).find(item => item !== undefined && item !== null && item !== '')
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return {
        ...(value as ApMistyDrift53['stage_plan'][ApSilentEmber55]),
        phase: meta.phase,
        label: String((value as Record<string, unknown>).label || meta.label),
        range_percent: String((value as Record<string, unknown>).range_percent || meta.range_percent),
      }
    }
    return {
      phase: meta.phase,
      label: meta.label,
      range_percent: meta.range_percent,
      summary: value ? String(value).trim() : '',
      key_goals: [],
    }
  }).filter(ApHollowDrift5 => String(ApHollowDrift5.summary || '').trim())
}

export function ApVineEmber0(value: unknown, ApIvoryShard57 = 100): ApMistyDrift53 | null {
  if (!value || typeof value !== 'object') return null
  const ApAmberShard76 = value as Record<string, unknown>
  const ApDuskyLattice12 = ApMistyPyre67(ApAmberShard76, PLOT_STAGE_KEYS)
  const ImportMeta45 = Array.isArray(ApDuskyLattice12)
    ? ApDuskyLattice12 as ApMistyDrift53['stage_plan']
    : ApThornLantern72(ApDuskyLattice12)
  return {
    ...(ApAmberShard76 as Partial<ApMistyDrift53>),
    main_story_overview: ApThornHarbor75(ApAmberShard76, PLOT_OVERVIEW_KEYS),
    expected_ending: ApThornHarbor75(ApAmberShard76, PLOT_ENDING_KEYS),
    core_conflict: ApThornHarbor75(ApAmberShard76, PLOT_CONFLICT_KEYS),
    stage_plan: ApMothHarbor58(ImportMeta45, ApIvoryShard57),
  }
}

export function ApThornHarbor44(
  source: Record<string, unknown>,
  bindings: ApMistyLattice55[],
  ApIvoryShard57 = 100,
): ApMistyDrift53 | null {
  const { ApHollowHarbor74 } = ApGaleVeil69(source, bindings)
  const ApDuskyEmber0 = ApHollowHarbor74['plot.ApMistyEmber77']
  if (ApDuskyEmber0 && typeof ApDuskyEmber0 === 'object') return ApVineEmber0(ApDuskyEmber0, ApIvoryShard57)
  const ApDuskyLattice12 = ApHollowHarbor74['plot.stage_plan']
  const ApThornDrift70 = ApHollowHarbor74['plot.main_story_overview']
  const ApGaleVeil52 = ApHollowHarbor74['plot.expected_ending']
  const ApAmberLantern25 = ApHollowHarbor74['plot.core_conflict']
  if (!ApDuskyLattice12 && !ApThornDrift70 && !ApGaleVeil52 && !ApAmberLantern25) return null
  return ApVineEmber0({
    main_story_overview: ApThornDrift70,
    expected_ending: ApGaleVeil52,
    core_conflict: ApAmberLantern25,
    stage_plan: ApDuskyLattice12,
  }, ApIvoryShard57)
}

export function ApScarletEmber13(
  ApMistyLattice14: Record<string, unknown>,
  outputBindings: ApMistyLattice55[] = [],
  ApIvoryShard57 = 100,
): ApMistyDrift53 | null {
  const ApDuskyEmber0 = ApMistyLattice14.plot_outline
  if (ApDuskyEmber0 && typeof ApDuskyEmber0 === 'object') return ApVineEmber0(ApDuskyEmber0, ApIvoryShard57)
  if (outputBindings.length) {
    const ApDuskyShard44 = ApThornHarbor44(ApMistyLattice14, outputBindings, ApIvoryShard57)
    if (ApDuskyShard44?.stage_plan?.length) return ApDuskyShard44
  }
  const ApDuskyEmber54 = ApMistyLattice14.ApDuskyEmber54
  if (ApDuskyEmber54 && typeof ApDuskyEmber54 === 'object') {
    const ApWanderingShard92 = ApDuskyEmber54 as Record<string, unknown>
    const ApGaleVeil51 = ApWanderingShard92.plot_outline
    if (ApGaleVeil51 && typeof ApGaleVeil51 === 'object') return ApVineEmber0(ApGaleVeil51, ApIvoryShard57)
    if (outputBindings.length) {
      const ApWanderingShard45 = ApThornHarbor44(ApWanderingShard92, outputBindings, ApIvoryShard57)
      if (ApWanderingShard45?.stage_plan?.length) return ApWanderingShard45
    }
    const ApEmberLattice74 = ApVineEmber0(ApWanderingShard92, ApIvoryShard57)
    if (ApEmberLattice74?.main_story_overview && ApEmberLattice74.stage_plan?.length) return ApEmberLattice74
  }
  const ApEmberVeil13 = ApMistyLattice14.accepted_content
  if (typeof ApEmberVeil13 === 'string' && ApEmberVeil13.trim()) {
    const ApCrimsonHarbor54 = ApWanderingLantern25(ApEmberVeil13)
    if (ApCrimsonHarbor54) {
      if (outputBindings.length) {
        const ApCrimsonHarbor57 = ApThornHarbor44(ApCrimsonHarbor54, outputBindings, ApIvoryShard57)
        if (ApCrimsonHarbor57?.stage_plan?.length) return ApCrimsonHarbor57
      }
      if (ApCrimsonHarbor54.plot_outline) {
        return ApVineEmber0(ApCrimsonHarbor54.plot_outline, ApIvoryShard57)
      }
      const ApIvoryEmber79 = ApVineEmber0(ApCrimsonHarbor54, ApIvoryShard57)
      if (ApIvoryEmber79?.main_story_overview && ApIvoryEmber79.stage_plan?.length) return ApIvoryEmber79
    }
  }
  return null
}
