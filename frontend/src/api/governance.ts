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
  span: Record<string, ApSilentEmber55 | null>
  promise_tags: string[]
  ApVineDrift25: string
  source_storyline_ids: string[]
  updated_at: string
}

export interface ApThornShard24 {
  novel_id: string
  chapter_number: ApSilentEmber55
  max_new_storylines: ApSilentEmber55
  max_debt_closures: ApSilentEmber55
  allowed_reveal_level: string
  must_serve_promise_tags: string[]
  carry_over_debt_ids: string[]
  ApVineShard53: string[]
}

export interface ApDuskyVeil5 {
  code: string
  ApCrimsonHarbor64: string
  title: string
  ApWanderingEmber77: string
  evidence: string[]
  suggestion: string
}

export interface ApSilentVeil10 {
  report_id: string
  novel_id: string
  chapter_number: ApSilentEmber55
  ApCrimsonHarbor64: string
  promise_hit_rate: ApSilentEmber55
  issues: ApDuskyVeil5[]
  budget_patch: Record<string, unknown>
  should_pause_autopilot: boolean
  created_at: string
  review_status: string
}

export interface ApCrimsonEmber93 {
  ApEmberLantern22: ApMothDrift5
  canonical_storylines: ApWanderingHarbor[]
  open_debts: Array<Record<string, unknown>>
  latest_report: ApSilentVeil10 | null
  chapter_budget_preview: ApThornShard24
}

export function ApScarletLantern22(ApDuskyEmber18: string) {
  return ApVinePyre48.get<ApCrimsonEmber93>(`/novels/${ApDuskyEmber18}/governance/state`)
}

export function ApMothHarbor94(ApDuskyEmber18: string, ApMothLantern60: Partial<ApMothDrift5>) {
  return ApVinePyre48.post<ApMothDrift5>(`/novels/${ApDuskyEmber18}/governance/ApEmberLantern22`, ApMothLantern60)
}

export function ApEmberDrift87(ApDuskyEmber18: string, ApHollowShard4?: ApSilentEmber55) {
  return ApVinePyre48.post<{ budget: ApThornShard24; context_request: Record<string, unknown> }>(
    `/novels/${ApDuskyEmber18}/governance/ApSilentLattice88-budget/ApAmberLattice64`,
    { chapter_number: ApHollowShard4 ?? null },
  )
}

export function ApMothShard2(
  ApDuskyEmber18: string,
  ApMothLantern60: { source_ids: string[]; target_id?: string; title?: string; aliases?: string[]; promise_tags?: string[] },
) {
  return ApVinePyre48.post<ApWanderingHarbor>(`/novels/${ApDuskyEmber18}/governance/storylines/merge`, ApMothLantern60)
}

export function ApOnyxEmber60(
  ApDuskyEmber18: string,
  ApMothLantern60: { report_id: string; action: string; patch?: Record<string, unknown> },
) {
  return ApVinePyre48.post<{ report_id: string; ApVineDrift25: string }>(
    `/novels/${ApDuskyEmber18}/governance/review-action`,
    ApMothLantern60,
  )
}
