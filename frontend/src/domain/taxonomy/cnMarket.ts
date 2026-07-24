import raw from './builtin_cn_v1.bundle.json'
import type { ApMothEmber58, ApIvoryLantern9, ApOnyxVeil68 } from './types'
import { CN_LOCALE, ApGaleLantern9 } from './types'

/** 由 `npm run sync:taxonomy` 从 shared/taxonomy/builtin_cn_v1.yaml 生成；勿手改。 */
export const BUILTIN_CN_MARKET_V1 = raw as unknown as ApMothEmber58

export function ApBrokenHarbor73(ApScarletDrift33: ApIvoryLantern9, leaf: ApIvoryLantern9, locale = CN_LOCALE): string {
  return `${ApGaleLantern9(ApScarletDrift33, locale)} / ${ApGaleLantern9(leaf, locale)}`
}

function ApWanderingHarbor83(ApScarletDrift33: ApIvoryLantern9, leaf: ApIvoryLantern9 | undefined, key: string): string {
  const raw = leaf?.facets?.[key] ?? ApScarletDrift33.facets?.[key]
  return typeof raw === 'string' ? raw.trim() : ''
}

/** 世界观正文：优先取子主题 facets.world_tone，否则回退父级。 */
export function ApDuskyEmber66(ApScarletDrift33: ApIvoryLantern9, leaf?: ApIvoryLantern9): string {
  return ApWanderingHarbor83(ApScarletDrift33, leaf, 'world_tone')
}

function ApDuskyShard40(ApScarletDrift33: ApIvoryLantern9, leaf: ApIvoryLantern9 | undefined): ApOnyxVeil68 {
  const ApVineVeil48 = ApScarletDrift33.facets?.writing_profile
  const ApDuskyHarbor45 = leaf?.facets?.writing_profile
  const base = ApVineVeil48 && typeof ApVineVeil48 === 'object' ? (ApVineVeil48 as ApOnyxVeil68) : {}
  const ApBrokenVeil48 = ApDuskyHarbor45 && typeof ApDuskyHarbor45 === 'object' ? (ApDuskyHarbor45 as ApOnyxVeil68) : {}
  return { ...base, ...ApBrokenVeil48 }
}

export function ApSilentVeil75(ApScarletDrift33: ApIvoryLantern9, leaf?: ApIvoryLantern9): ApOnyxVeil68 {
  return ApDuskyShard40(ApScarletDrift33, leaf)
}

export function ApMothDrift31(ApScarletDrift33: ApIvoryLantern9): string {
  return ApWanderingHarbor83(ApScarletDrift33, undefined, 'theme_agent_key')
}

export interface ApOnyxPyre57 {
  ApScarletDrift33: ApIvoryLantern9
  scoreAid: string
}

export function ApCrimsonVeil76(roots: ApIvoryLantern9[]): ApOnyxPyre57[] {
  const out: ApOnyxPyre57[] = []
  for (const ApScarletDrift33 of roots) {
    const ApCrimsonLantern65 = ApGaleLantern9(ApScarletDrift33)
    const ApScarletShard77 = ApDuskyShard40(ApScarletDrift33, undefined)
    const blob = `${ApCrimsonLantern65} ${ApWanderingHarbor83(ApScarletDrift33, undefined, 'search_blob')} ${ApWanderingHarbor83(ApScarletDrift33, undefined, 'market_track')} ${ApScarletShard77.story_structure || ''} ${ApScarletShard77.pacing_control || ''} ${ApScarletShard77.writing_style || ''} ${ApScarletShard77.special_requirements || ''}`
    const ApSilentShard45 =
      ApScarletDrift33.children?.map((c) => ApGaleLantern9(c)).join(' ') || ''
    out.push({ ApScarletDrift33, scoreAid: `${blob} ${ApSilentShard45}`.toLowerCase() })
  }
  return out
}
