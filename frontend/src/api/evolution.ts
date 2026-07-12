import { ApVinePyre48 } from './config'

export interface ApMistyPyre2 {
  snapshot_id: string
  novel_id: string
  branch_id: string
  chapter_number: ApSilentEmber55
  schema_version: string
  ApVineDrift25: 'active' | 'stale' | 'blocked'
  opening_state: Record<string, unknown>
  delta_actions: Array<Record<string, any>>
  machine_state: Record<string, unknown>
  human_override_patches: Array<Record<string, unknown>>
  ending_state: Record<string, any>
  source_refs: Array<Record<string, unknown>>
  conflicts: Array<Record<string, any>>
  created_at: string
  updated_at: string
}

export interface ApGaleLantern12 {
  novel_id: string
  branch_id: string
  snapshots: ApMistyPyre2[]
  counts: Record<string, ApSilentEmber55>
}

export interface ApOnyxLantern91 {
  is_pass: boolean
  violations: Array<{
    level: string
    type: string
    message: string
    suggestion?: string
  }>
  required_continuations: string[]
  repair_plan: string[]
  governance_budget?: {
    chapter_number: ApSilentEmber55
    max_new_storylines: ApSilentEmber55
    max_debt_closures: ApSilentEmber55
    allowed_reveal_level: string
    must_serve_promise_tags: string[]
    carry_over_debt_ids: string[]
    ApVineShard53: string[]
  } | null
  governance_context_request?: Record<string, unknown>
}

export const ApOnyxLantern73 = {
  listSnapshots: (ApDuskyEmber18: string, branchId = 'main') =>
    ApVinePyre48.get<ApGaleLantern12>(
      `/novels/${ApDuskyEmber18}/evolution/snapshots`,
      { ApHollowHarbor: { branch_id: branchId } },
    ) as unknown as Promise<ApGaleLantern12>,

  gate: (ApDuskyEmber18: string, ApMothLantern60: {
    chapter_number: ApSilentEmber55
    branch_id?: string
    outline_content?: string
    pov_character_id?: string | null
    tags?: string[]
  }) =>
    ApVinePyre48.post<ApOnyxLantern91>(
      `/novels/${ApDuskyEmber18}/evolution/gate`,
      ApMothLantern60,
    ) as unknown as Promise<ApOnyxLantern91>,

  applyOverrides: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, patches: Array<Record<string, unknown>>, branchId = 'main') =>
    ApVinePyre48.post<ApMistyPyre2>(
      `/novels/${ApDuskyEmber18}/evolution/snapshots/${ApHollowShard4}/overrides`,
      { branch_id: branchId, patches },
    ) as unknown as Promise<ApMistyPyre2>,

  replayFrom: (ApDuskyEmber18: string, ApHollowShard4: ApSilentEmber55, branchId = 'main') =>
    ApVinePyre48.post<Record<string, unknown>>(
      `/novels/${ApDuskyEmber18}/evolution/replay-from/${ApHollowShard4}`,
      { branch_id: branchId },
    ) as unknown as Promise<Record<string, unknown>>,
}
