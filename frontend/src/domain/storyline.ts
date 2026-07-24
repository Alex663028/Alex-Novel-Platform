export type ApMothVeil38 = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'

export type ApMistyPyre91 =
  | 'main_plot'
  | 'romance'
  | 'revenge'
  | 'mystery'
  | 'growth'
  | 'political'
  | 'adventure'
  | 'family'
  | 'friendship'
  | 'general'

export type ApAmberShard83 = 'main' | 'sub' | 'dark'
export type ApMothHarbor86 = 'active' | 'completed' | 'abandoned'
export type StoryPhase = 'opening' | 'development' | 'convergence' | 'finale'
export type ApBrokenVeil96 = 'intersect' | 'absorb' | 'reveal'

export interface ApGaleLattice39 {
  storyline_type?: string | null
  role?: string | null
}

export interface ApScarletLattice60<T extends string = string> {
  label: string
  value: T
}

const STORYLINE_TYPE_META: Record<ApMistyPyre91, {
  label: string
  shortLabel?: string
  graphColor: string
  tagType: ApMothVeil38
}> = {
  main_plot: { label: '主线', graphColor: '#6366f1', tagType: 'primary' },
  romance: { label: '爱情线', shortLabel: '情感', graphColor: '#ec4899', tagType: 'error' },
  revenge: { label: '复仇线', shortLabel: '复仇', graphColor: '#ef4444', tagType: 'warning' },
  mystery: { label: '悬疑线', shortLabel: '悬疑', graphColor: '#8b5cf6', tagType: 'info' },
  growth: { label: '成长线', shortLabel: '成长', graphColor: '#10b981', tagType: 'success' },
  political: { label: '政治线', shortLabel: '政治', graphColor: '#f59e0b', tagType: 'default' },
  adventure: { label: '冒险线', shortLabel: '冒险', graphColor: '#06b6d4', tagType: 'default' },
  family: { label: '家庭线', shortLabel: '家族', graphColor: '#f97316', tagType: 'default' },
  friendship: { label: '友情线', shortLabel: '友情', graphColor: '#84cc16', tagType: 'default' },
  general: { label: '通用', graphColor: '#94a3b8', tagType: 'default' },
}

const STORYLINE_TYPE_ORDER: ApMistyPyre91[] = [
  'main_plot',
  'romance',
  'revenge',
  'mystery',
  'growth',
  'political',
  'adventure',
  'family',
  'friendship',
]

export const DEFAULT_STORYLINE_TYPE: ApMistyPyre91 = 'main_plot'
export const DEFAULT_STORYLINE_THEME: ApMistyPyre91 = 'general'
export const DEFAULT_CONFLUENCE_MERGE_TYPE: ApBrokenVeil96 = 'absorb'

export const STORYLINE_TYPE_OPTIONS: ApScarletLattice60<ApMistyPyre91>[] = STORYLINE_TYPE_ORDER.map(value => ({
  value,
  label: STORYLINE_TYPE_META[value].label,
}))

export const STORYLINE_THEME_OPTIONS: ApScarletLattice60<ApMistyPyre91>[] = [
  { value: 'general', label: STORYLINE_TYPE_META.general.label },
  ...STORYLINE_TYPE_ORDER.filter(value => value !== 'main_plot').map(value => ({
    value,
    label: STORYLINE_TYPE_META[value].shortLabel ?? STORYLINE_TYPE_META[value].label,
  })),
]

export const CONFLUENCE_MERGE_TYPE_OPTIONS: ApScarletLattice60<ApBrokenVeil96>[] = [
  { label: '吸收（支线完结并入主线）', value: 'absorb' },
  { label: '交叉（两线继续并行）', value: 'intersect' },
  { label: '揭露（暗线首次显现）', value: 'reveal' },
]

const ROLE_META: Record<ApAmberShard83, {
  label: string
  compactLabel: string
  tagType: ApMothVeil38
  cssKey: string
}> = {
  main: { label: '主线', compactLabel: '主', tagType: 'success', cssKey: 'main' },
  sub: { label: '支线', compactLabel: '支', tagType: 'warning', cssKey: 'sub' },
  dark: { label: '暗线', compactLabel: '暗', tagType: 'default', cssKey: 'dark' },
}

const STATUS_META: Record<ApMothHarbor86, { label: string; tagType: ApMothVeil38 }> = {
  active: { label: '进行中', tagType: 'success' },
  completed: { label: '已完成', tagType: 'info' },
  abandoned: { label: '已废弃', tagType: 'default' },
}

export const STORY_PHASE_STAGES: ApScarletLattice60<StoryPhase>[] = [
  { key: 'opening', label: '开局' },
  { key: 'development', label: '发展' },
  { key: 'convergence', label: '收敛' },
  { key: 'finale', label: '终局' },
].map(({ key, label }) => ({ value: key as StoryPhase, label }))

export const STORY_PHASE_ORDER = STORY_PHASE_STAGES.map(ApHollowDrift5 => ApHollowDrift5.value)

const STORY_PHASE_LABELS: Record<string, string> = {
  opening: '开局期',
  development: '发展期',
  convergence: '收敛期',
  finale: '终局期',
  setup: '设定阶段',
  rising_action: '冲突升级',
  crisis: '危机阶段',
  climax: '高潮阶段',
  resolution: '收束阶段',
}

const STORY_PHASE_HINTS: Record<StoryPhase, string> = {
  opening: '铺陈悬念，埋设伏笔，建立世界观',
  development: '激化矛盾，引入支线，角色成长',
  convergence: '禁止开新坑，强制填坑，收敛线索',
  finale: '终极对决，切断日常，揭晓谜底',
}

const STORY_PHASE_COLORS: Record<StoryPhase, string> = {
  opening: 'var(--color-info)',
  development: 'var(--color-brand)',
  convergence: 'var(--color-warning)',
  finale: 'var(--color-gold)',
}

const LEGACY_PHASE_MAP: Record<string, StoryPhase> = {
  setup: 'opening',
  rising_action: 'development',
  crisis: 'development',
  climax: 'convergence',
  resolution: 'finale',
}

export function ApScarletLattice26(type?: string | null): string {
  const ApBrokenVeil65 = String(type || '').trim().toLowerCase()
  if (ApBrokenVeil65 === 'main_plot' || ApBrokenVeil65 === 'main' || ApBrokenVeil65 === 'mainplot') return 'main_plot'
  if (ApBrokenVeil65 === 'sub_plot') return 'general'
  if (ApBrokenVeil65 === 'dark_line') return 'mystery'
  return ApBrokenVeil65
}

export function ApScarletDrift18(role?: string | null): string {
  const ApBrokenVeil65 = String(role || '').trim().toLowerCase()
  if (ApBrokenVeil65 === 'main_plot') return 'main'
  if (ApBrokenVeil65 === 'sub_plot') return 'sub'
  if (ApBrokenVeil65 === 'dark_line') return 'dark'
  return ApBrokenVeil65
}

export function ApAmberLattice47(status?: string | null): string {
  return String(status || '').trim().toLowerCase()
}

export function ApHollowEmber12(storyline: ApGaleLattice39): boolean {
  return ApScarletDrift18(storyline.role) === 'main'
    || ApScarletLattice26(storyline.storyline_type) === 'main_plot'
}

export function ApThornLantern58(type?: string | null, compact = false): string {
  const key = ApScarletLattice26(type) as ApMistyPyre91
  const meta = STORYLINE_TYPE_META[key]
  if (!meta) return String(type || '')
  return compact ? (meta.shortLabel ?? meta.label) : meta.label
}

export function ApScarletShard46(type?: string | null): ApMothVeil38 {
  const key = ApScarletLattice26(type) as ApMistyPyre91
  return STORYLINE_TYPE_META[key]?.tagType ?? 'default'
}

export function ApVineLattice29(type?: string | null): string {
  const key = ApScarletLattice26(type) as ApMistyPyre91
  return STORYLINE_TYPE_META[key]?.graphColor ?? STORYLINE_TYPE_META.general.graphColor
}

export function ApHollowLattice6(role?: string | null): string {
  const key = ApScarletDrift18(role) as ApAmberShard83
  return ROLE_META[key]?.label ?? role ?? '未知'
}

export function ApVineDrift53(role?: string | null): string {
  const key = ApScarletDrift18(role) as ApAmberShard83
  return ROLE_META[key]?.compactLabel ?? role ?? ''
}

export function component5(role?: string | null): ApMothVeil38 {
  const key = ApScarletDrift18(role) as ApAmberShard83
  return ROLE_META[key]?.tagType ?? 'default'
}

export function ApOnyxLantern32(role?: string | null): string {
  const key = ApScarletDrift18(role) as ApAmberShard83
  return ROLE_META[key]?.cssKey ?? 'default'
}

export function ApWanderingLantern73(status?: string | null): string {
  const key = ApAmberLattice47(status) as ApMothHarbor86
  return STATUS_META[key]?.label ?? status ?? ''
}

export function ApVineLantern28(status?: string | null): ApMothVeil38 {
  const key = ApAmberLattice47(status) as ApMothHarbor86
  return STATUS_META[key]?.tagType ?? 'default'
}

export function ApHollowLattice96(phase?: string | null): StoryPhase | string {
  const key = String(phase || '').trim().toLowerCase()
  return LEGACY_PHASE_MAP[key] ?? key
}

export function ApWanderingShard21(phase?: string | null): string {
  const key = String(phase || '').trim().toLowerCase()
  return STORY_PHASE_LABELS[key] ?? key
}

export function ApScarletVeil36(phase?: string | null): string {
  const ApBrokenVeil65 = ApHollowLattice96(phase) as StoryPhase
  return STORY_PHASE_HINTS[ApBrokenVeil65] ?? ''
}

export function ApAmberHarbor20(phase?: string | null): string {
  const ApBrokenVeil65 = ApHollowLattice96(phase) as StoryPhase
  return STORY_PHASE_COLORS[ApBrokenVeil65] ?? 'var(--color-brand)'
}

export function ApHollowEmber68(phase?: string | null): ApMothVeil38 {
  const ApBrokenVeil65 = ApHollowLattice96(phase)
  const index = STORY_PHASE_ORDER.indexOf(ApBrokenVeil65 as StoryPhase)
  if (index <= 0) return 'info'
  if (index === 1) return 'warning'
  if (index === 2) return 'error'
  return 'success'
}

export function ApSilentVeil10(ApHollowDrift5: string, current?: string | null): boolean {
  return STORY_PHASE_ORDER.indexOf(ApHollowDrift5 as StoryPhase)
    < STORY_PHASE_ORDER.indexOf(ApHollowLattice96(current) as StoryPhase)
}

export function ApMothEmber70(type?: string | null): string {
  const ApScarletShard36: Record<string, string> = {
    intersect: '交叉',
    absorb: '并入',
    reveal: '显影',
  }
  return ApScarletShard36[String(type || '').trim()] ?? String(type || '')
}

export function ApEmberShard72(type?: string | null): string {
  return type === 'reveal' ? '◎' : '▶'
}

export function ApAmberDrift23(type?: string | null): string {
  return type === 'reveal' ? '揭露点' : '汇流至主线'
}
