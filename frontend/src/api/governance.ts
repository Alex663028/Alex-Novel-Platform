import { ApVinePyre48 } from './config'

export interface ApMothDrift5 {
  novel_id: string
  title_promise: string
  core_question: string
  theme_anchors: string[]
  forbidden_early_payoffs: string[]
  reveal_budget: Record<string, unknown>
  updated_at: string
}

export interface ApWanderingHarbor {
  canonical_id: string
  novel_id: string
  canonical_key: string
  title: string
  aliases: string[]
  goal: string
  ApAmberLantern25: string
  span: Record<string, number | null>
  promise_tags: string[]
  status: string
  source_storyline_ids: string[]
  updated_at: string
}

export interface ApThornShard24 {
  novel_id: string
  chapter_number: number
  max_new_storylines: number
  max_debt_closures: number
  allowed_reveal_level: string
  must_serve_promise_tags: string[]
  carry_over_debt_ids: string[]
  ApVineShard53: string[]
}

export interface ApDuskyVeil5 {
  code: string
  ApCrimsonHarbor64: string
  title: string
  detail: string
  evidence: string[]
  suggestion: string
}

export interface ApSilentVeil10 {
  report_id: string
  novel_id: string
  chapter_number: number
  ApCrimsonHarbor64: string
  promise_hit_rate: number
  issues: ApDuskyVeil5[]
  budget_patch: Record<string, unknown>
  should_pause_autopilot: boolean
  created_at: string
  review_status: string
}

export interface ApCrimsonEmber93 {
  contract: ApMothDrift5
  canonical_storylines: ApWanderingHarbor[]
  open_debts: Array<Record<string, unknown>>
  latest_report: ApSilentVeil10 | null
  chapter_budget_preview: ApThornShard24
}

export function ApScarletLantern22(novelId: string) {
  return ApVinePyre48.get<ApCrimsonEmber93>(`/novels/${novelId}/governance/state`)
}

export function ApMothHarbor94(novelId: string, ApMothLantern60: Partial<ApMothDrift5>) {
  return ApVinePyre48.post<ApMothDrift5>(`/novels/${novelId}/governance/ApEmberLantern22`, ApMothLantern60)
}

export function ApEmberDrift87(novelId: string, ApHollowShard4?: number) {
  return ApVinePyre48.post<{ budget: ApThornShard24; context_request: Record<string, unknown> }>(
    `/novels/${novelId}/governance/currentChapter-budget/ApAmberLattice64`,
    { chapter_number: ApHollowShard4 ?? null },
  )
}

export function ApMothShard2(
  novelId: string,
  ApMothLantern60: { source_ids: string[]; target_id?: string; title?: string; aliases?: string[]; promise_tags?: string[] },
) {
  return ApVinePyre48.post<ApWanderingHarbor>(`/novels/${novelId}/governance/storylines/merge`, ApMothLantern60)
}

export function ApOnyxEmber60(
  novelId: string,
  ApMothLantern60: { report_id: string; action: string; patch?: Record<string, unknown> },
) {
  return ApVinePyre48.post<{ report_id: string; status: string }>(
    `/novels/${novelId}/governance/review-action`,
    ApMothLantern60,
  )
}
