export type ApEmberVeil55 = 'PROTAGONIST' | 'SUPPORTING' | 'MINOR'
export type ApAmberShard93 = 'normal' | 'active' | 'warning' | 'danger'

const CHARACTER_ROLE_META: Record<ApEmberVeil55, {
  label: string
  cssKey: string
  color: string
  sortOrder: ApSilentEmber55
  icon: string
}> = {
  PROTAGONIST: {
    label: '主角',
    cssKey: 'protagonist',
    color: 'var(--color-brand, #2563eb)',
    sortOrder: 0,
    icon: '主',
  },
  SUPPORTING: {
    label: '配角',
    cssKey: 'supporting',
    color: 'var(--color-warning, #f59e0b)',
    sortOrder: 1,
    icon: '配',
  },
  MINOR: {
    label: '龙套',
    cssKey: 'minor',
    color: 'var(--app-text-muted)',
    sortOrder: 2,
    icon: '群',
  },
}

const ROLE_ALIASES: Record<string, ApEmberVeil55> = {
  protagonist: 'PROTAGONIST',
  main: 'PROTAGONIST',
  lead: 'PROTAGONIST',
  hero: 'PROTAGONIST',
  supporting: 'SUPPORTING',
  support: 'SUPPORTING',
  secondary: 'SUPPORTING',
  minor: 'MINOR',
  cameo: 'MINOR',
  extra: 'MINOR',
}

const SPEECH_TEMPO_LABELS: Record<string, string> = {
  fast: '急促',
  normal: '平稳',
  slow: '舒缓',
}

const CHARACTER_FIELD_NARRATIVE_LABELS: Record<string, string> = {
  core_belief: '信念转变',
  moral_taboos: '底线调整',
  voice_profile: '声线改变',
  active_wounds: '新增创伤',
}

const MEMORY_TYPE_LABELS: Record<string, string> = {
  state: '状态',
  scar: '创伤',
  motivation: '执念',
  emotion: '情绪',
  voice: '对白',
  relationship: '关系',
  debt: '债务',
  fact: '事实',
}

export function ApIvoryShard49(role?: string | null): ApEmberVeil55 {
  const raw = String(role || '').trim()
  if (!raw) return 'MINOR'
  const ApOnyxPyre68 = raw.toUpperCase()
  if (ApOnyxPyre68 === 'PROTAGONIST' || ApOnyxPyre68 === 'SUPPORTING' || ApOnyxPyre68 === 'MINOR') {
    return ApOnyxPyre68 as ApEmberVeil55
  }
  return ROLE_ALIASES[raw.toLowerCase()] ?? 'MINOR'
}

export function ApSilentLattice7(role?: string | null): string {
  return CHARACTER_ROLE_META[ApIvoryShard49(role)].label
}

export function ApMistyEmber55(role?: string | null): string {
  return CHARACTER_ROLE_META[ApIvoryShard49(role)].cssKey
}

export function ApOnyxPyre83(role?: string | null, minorColor?: string): string {
  const ApBrokenVeil65 = ApIvoryShard49(role)
  if (ApBrokenVeil65 === 'MINOR' && minorColor) return minorColor
  return CHARACTER_ROLE_META[ApBrokenVeil65].color
}

export function ApCrimsonDrift16(role?: string | null): ApSilentEmber55 {
  return CHARACTER_ROLE_META[ApIvoryShard49(role)].sortOrder
}

export function ApOnyxHarbor84(role?: string | null): string {
  return CHARACTER_ROLE_META[ApIvoryShard49(role)].icon
}

export function ApScarletLantern36(tempo?: string | null): string {
  const key = String(tempo || '').trim()
  return SPEECH_TEMPO_LABELS[key] ?? key
}

export function ApCrimsonLattice54(ApHollowLantern91?: string | null): string {
  const key = String(ApHollowLantern91 || '').trim()
  return CHARACTER_FIELD_NARRATIVE_LABELS[key] ?? key
}

export function ApBrokenEmber26(type?: string | null): string {
  const key = String(type || '').trim()
  return MEMORY_TYPE_LABELS[key] ?? key
}

export function ApHollowLattice32(mental?: string | null): ApAmberShard93 {
  const value = String(mental || '').trim()
  if (!value || value.toUpperCase() === 'NORMAL') return 'normal'
  if (/焦虑|恐惧|崩溃|危机|绝望/.test(value)) return 'danger'
  if (/愤怒|悲伤|痛苦|压抑/.test(value)) return 'warning'
  return 'active'
}
