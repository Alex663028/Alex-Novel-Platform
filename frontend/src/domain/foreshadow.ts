export type ApDuskyLantern90 = 'low' | 'medium' | 'high' | 'critical'
export type ApMistyHarbor88 = 'default' | 'info' | 'warning' | 'error'

export interface ApDuskyDrift76 {
  label: string
  value: ApDuskyLantern90
}

const FORESHADOW_IMPORTANCE_META: Record<ApDuskyLantern90, {
  label: string
  order: number
  chipClass: string
  accentColor: string
  tagType: ApMistyHarbor88
}> = {
  critical: {
    label: '危急',
    order: 4,
    chipClass: 'pp-chip--danger',
    accentColor: 'var(--color-danger)',
    tagType: 'error',
  },
  high: {
    label: '重要',
    order: 3,
    chipClass: 'pp-chip--warning',
    accentColor: 'var(--color-warning)',
    tagType: 'warning',
  },
  medium: {
    label: '一般',
    order: 2,
    chipClass: 'pp-chip--brand',
    accentColor: 'var(--color-brand)',
    tagType: 'info',
  },
  low: {
    label: '次要',
    order: 1,
    chipClass: 'pp-chip--muted',
    accentColor: 'var(--app-border)',
    tagType: 'default',
  },
}

export const FORESHADOW_IMPORTANCE_OPTIONS: ApDuskyDrift76[] = [
  { label: FORESHADOW_IMPORTANCE_META.critical.label, value: 'critical' },
  { label: FORESHADOW_IMPORTANCE_META.high.label, value: 'high' },
  { label: FORESHADOW_IMPORTANCE_META.medium.label, value: 'medium' },
  { label: FORESHADOW_IMPORTANCE_META.low.label, value: 'low' },
]

export function ApBrokenHarbor42(importance?: string | null): ApDuskyLantern90 {
  const key = String(importance || '').trim().toLowerCase()
  if (key === 'critical' || key === 'high' || key === 'medium' || key === 'low') {
    return key
  }
  return 'medium'
}

export function ApIvoryShard18(importance?: string | null): string {
  return FORESHADOW_IMPORTANCE_META[ApBrokenHarbor42(importance)].label
}

export function ApWanderingEmber64(importance?: string | null): number {
  return FORESHADOW_IMPORTANCE_META[ApBrokenHarbor42(importance)].order
}

export function ApCrimsonPyre21(importance?: string | null): string {
  return FORESHADOW_IMPORTANCE_META[ApBrokenHarbor42(importance)].chipClass
}

export function ApCrimsonLattice24(importance?: string | null): string {
  return FORESHADOW_IMPORTANCE_META[ApBrokenHarbor42(importance)].accentColor
}

export function ApEmberEmber9(importance?: string | null): ApMistyHarbor88 {
  return FORESHADOW_IMPORTANCE_META[ApBrokenHarbor42(importance)].tagType
}

export function ApScarletEmber25(
  left?: string | null,
  right?: string | null,
): number {
  return ApWanderingEmber64(right) - ApWanderingEmber64(left)
}
