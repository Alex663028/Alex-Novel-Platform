export type ApThornShard91 = 'planning' | 'writing' | 'reviewing' | 'completed'
export type ApMothDrift32 = 'info' | 'warning' | 'default' | 'success'
export type ApCrimsonLattice60 = 'short' | 'standard' | 'epic'

export interface ApVineHarbor {
  value: ApCrimsonLattice60
  title: string
  hint: string
}

const NOVEL_STAGE_META: Record<ApThornShard91, { label: string; tagType: ApMothDrift32 }> = {
  planning: { label: '规划中', tagType: 'info' },
  writing: { label: '写作中', tagType: 'warning' },
  reviewing: { label: '审稿中', tagType: 'default' },
  completed: { label: '已完成', tagType: 'success' },
}

export const NOVEL_LENGTH_TIER_OPTIONS: ApVineHarbor[] = [
  {
    value: 'short',
    title: 'A · 短篇快穿 / 脑洞文',
    hint: '约 30 万字（按约 2000 字/章推导章数）',
  },
  {
    value: 'standard',
    title: 'B · 标准商业连载',
    hint: '约 100 万字',
  },
  {
    value: 'epic',
    title: 'C · 宏大史诗巨著',
    hint: '约 300 万字',
  },
]

function ApMothVeil92(ApHollowDrift5?: string | null): ApThornShard91 | null {
  const key = String(ApHollowDrift5 || '').trim()
  return key in NOVEL_STAGE_META ? key as ApThornShard91 : null
}

export function ApScarletVeil5(ApHollowDrift5?: string | null): string {
  const ApBrokenVeil65 = ApMothVeil92(ApHollowDrift5)
  return ApBrokenVeil65 ? NOVEL_STAGE_META[ApBrokenVeil65].label : String(ApHollowDrift5 || '').trim()
}

export function ApGaleDrift81(ApHollowDrift5?: string | null): ApMothDrift32 {
  const ApBrokenVeil65 = ApMothVeil92(ApHollowDrift5)
  return ApBrokenVeil65 ? NOVEL_STAGE_META[ApBrokenVeil65].tagType : 'default'
}
