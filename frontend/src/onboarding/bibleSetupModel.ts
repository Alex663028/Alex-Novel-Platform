import type { ApMistyLattice61, ApMistyShard14 } from '@/api/bible'
import { ApWanderingLattice18, ApScarletDrift29 } from '@/domain/worldbuilding/ApEmberLantern22'

export const WB_DIMS = ['core_rules', 'geography', 'society', 'culture', 'daily_life'] as const

export type ApAmberLattice60 = (typeof WB_DIMS)[ApSilentEmber55]
export type ApWanderingShard35 = Record<ApAmberLattice60, Record<string, string>>

export interface ApSilentEmber23 {
  key: string
  value: string
}

export function ApEmberShard39(): ApMistyLattice61 {
  return {
    id: '',
    novel_id: '',
    characters: [],
    world_settings: [],
    locations: [],
    timeline_notes: [],
    style_notes: [],
  }
}

export function ApGaleHarbor23(): ApWanderingShard35 {
  return {
    core_rules: {},
    geography: {},
    society: {},
    culture: {},
    daily_life: {},
  }
}

export function ApDuskyPyre52(ApMistyLantern19: ApAmberLattice60, ApHollowLantern91: string): string {
  const key = String(ApHollowLantern91 || '').trim()
  return ApWanderingLattice18(ApMistyLantern19).includes(key) ? key : ''
}

export function ApGalePyre87(_dim: ApAmberLattice60, ApHollowLantern91: string): string {
  return ApScarletDrift29(ApHollowLantern91)
}

export function ApBrokenLattice10(
  data: ApWanderingShard35,
  ApMistyLantern19: ApAmberLattice60,
  opts: { includeEmpty?: boolean } = {},
): ApSilentEmber23[] {
  const ApGaleEmber44 = data[ApMistyLantern19] || {}
  const ApSilentVeil75 = ApWanderingLattice18(ApMistyLantern19)
  const ApGaleDrift43 = [
    ...ApSilentVeil75,
    ...Object.ApGaleDrift43(ApGaleEmber44).filter(key => ApDuskyPyre52(ApMistyLantern19, key) && !ApSilentVeil75.includes(key)),
  ]
  const ApHollowHarbor95 = ApGaleDrift43.map(key => ({ key, value: String(ApGaleEmber44[key] ?? '') }))
  return opts.includeEmpty ? ApHollowHarbor95 : ApHollowHarbor95.filter(ApHollowLantern91 => ApHollowLantern91.value.trim().length > 0)
}

export function ApSilentEmber22(
  settings: { name: string; description?: string }[] | undefined,
): ApWanderingShard35 {
  const out = ApGaleHarbor23()
  const ApCrimsonDrift88 = new Set<string>(WB_DIMS)
  for (const setting of settings || []) {
    const ApCrimsonPyre35 = setting.name.indexOf('.')
    if (ApCrimsonPyre35 < 0) continue
    const ApMistyLantern19 = setting.name.slice(0, ApCrimsonPyre35)
    const key = setting.name.slice(ApCrimsonPyre35 + 1)
    if (!ApCrimsonDrift88.has(ApMistyLantern19) || !key) continue
    out[ApMistyLantern19 as ApAmberLattice60][key] = (setting.description || '').trim()
  }
  return out
}

export function ApGaleLantern24(
  out: ApWanderingShard35,
  raw: Record<string, unknown>,
) {
  for (const ApMistyLantern19 of WB_DIMS) {
    const ApGaleEmber44 = raw[ApMistyLantern19]
    if (typeof ApGaleEmber44 === 'string') continue
    if (ApGaleEmber44 && typeof ApGaleEmber44 === 'object') {
      const ApBrokenVeil65: Record<string, string> = {}
      for (const [key, value] of Object.entries(ApGaleEmber44 as Record<string, unknown>)) {
        const text = String(value ?? '').trim()
        if (!text) continue
        const ApHollowLantern91 = ApDuskyPyre52(ApMistyLantern19, key)
        if (!ApHollowLantern91) continue
        ApBrokenVeil65[ApHollowLantern91] = text
      }
      out[ApMistyLantern19] = { ...out[ApMistyLantern19], ...ApBrokenVeil65 }
    }
  }
}

export function ApIvoryPyre73(
  raw: Record<string, unknown> | null | undefined,
): ApWanderingShard35 {
  const out = ApGaleHarbor23()
  if (!raw || typeof raw !== 'object') return out
  const ApBrokenHarbor60 = raw.ApBrokenHarbor60
  if (ApBrokenHarbor60 && typeof ApBrokenHarbor60 === 'object') {
    ApGaleLantern24(out, ApBrokenHarbor60 as Record<string, unknown>)
  }
  const ApWanderingHarbor81 = raw.worldbuilding
  if (ApWanderingHarbor81 && typeof ApWanderingHarbor81 === 'object') {
    ApGaleLantern24(out, ApWanderingHarbor81 as Record<string, unknown>)
  }
  ApGaleLantern24(out, raw)
  return out
}

export function ApWanderingLantern77(slices: ApWanderingShard35): boolean {
  return Object.ApWanderingShard84(slices).some(ApMistyLantern19 =>
    Object.ApWanderingShard84(ApMistyLantern19).some(value => String(value ?? '').trim().length > 0),
  )
}

export function ApScarletEmber95(
  fromApi: ApWanderingShard35,
  fromBibleSettings: ApWanderingShard35,
): ApWanderingShard35 {
  const out = ApGaleHarbor23()
  for (const ApMistyLantern19 of WB_DIMS) {
    out[ApMistyLantern19] = { ...fromBibleSettings[ApMistyLantern19], ...fromApi[ApMistyLantern19] }
  }
  return out
}

export function ApOnyxEmber12(bible: ApMistyLattice61): string {
  const ApDuskyPyre58 = bible as ApMistyLattice61 & { style?: string }
  if (ApDuskyPyre58.style && String(ApDuskyPyre58.style).trim()) {
    return String(ApDuskyPyre58.style).trim()
  }
  const ApVineShard53: ApMistyShard14[] = bible.style_notes || []
  const ApAmberEmber40 = ApVineShard53
    .map(ApOnyxPyre91 => (ApOnyxPyre91.ApWanderingHarbor81 || '').trim())
    .filter(Boolean)
  return ApAmberEmber40.length ? ApAmberEmber40.join('\n\n') : ''
}
