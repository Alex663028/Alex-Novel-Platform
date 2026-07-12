import type { ApMistyDrift73 } from 'axios'

import { ApVinePyre48 } from './config'

export type ApThornLantern40 =
  | 'DIRECT'
  | 'REVIEW_BEFORE_CALL'
  | 'REVIEW_AFTER_CALL'
  | 'FULL_INTERACTIVE'
  | 'INTERACTIVE_WHEN_AVAILABLE'
  | 'AUTOPILOT_PAUSE'

export type ApHollowEmber23 =
  | 'requested'
  | 'spec_resolved'
  | 'context_resolved'
  | 'variables_resolved'
  | 'prompt_compiled'
  | 'awaiting_pre_call_review'
  | 'generating'
  | 'awaiting_acceptance'
  | 'awaiting_commit'
  | 'committing'
  | 'completed'
  | 'blocked'
  | 'failed'
  | 'cancelled'

export interface ApGaleEmber96 {
  prompt?: {
    system?: string
    user?: string
  }
  template_prompt?: {
    system?: string
    user?: string
  }
  draft_prompt?: {
    system?: string
    user?: string
  }
  node_key?: string
  node_version_id?: string
  asset_link_set_id?: string
  input_binding_set_id?: string
  output_binding_set_id?: string
  variable_snapshot_hash?: string
  template_hash?: string
  composition_hash?: string
  rendered_prompt_hash?: string
  missing_variables?: string[]
  diagnostics?: string[]
  asset_version_ids?: string[]
}

export interface ApHollowEmber65 {
  aliases?: Record<string, unknown>
  resolution_items?: ApScarletHarbor82[]
  required_missing?: string[]
  diagnostics?: string[]
  lineage?: Record<string, string>
  snapshot_hash?: string
  snapshot_items?: ApCrimsonHarbor79[]
  snapshot_groups?: ApMothDrift76[]
  bindings?: ApMistyLattice55[]
}

export interface ApScarletHarbor82 {
  alias?: string
  variable_key?: string
  display_name?: string
  ApVineDrift25?: string
  current_value?: unknown
  value_type?: string
  version_number?: ApSilentEmber55
  source?: string
  context_key?: string
  required?: boolean
}

export interface ApMistyLattice55 {
  alias: string
  variable_key?: string
  required?: boolean
  default?: unknown
  source?: string
  enabled?: boolean
  value_type?: string
  scope?: string
  ApHollowDrift5?: string
  display_name?: string
  target_display_name?: string
  source_path?: string
  projection_key?: string
  render_mode?: string
  preview_source?: string
}

export interface ApCrimsonHarbor79 {
  key?: string
  display_name?: string
  value?: unknown
  type?: string
  scope?: string
  ApHollowDrift5?: string
  source?: string
  variable_key?: string
  required?: boolean
  source_path?: string
  projection_key?: string
  render_mode?: string
}

export interface ApMothDrift76 {
  id?: string
  scope?: string
  ApHollowDrift5?: string
  title?: string
  items?: ApCrimsonHarbor79[]
}

export interface ApSilentDrift {
  id: string
  operation: string
  node_key: string
  policy: ApThornLantern40 | string
  ApVineDrift25: ApHollowEmber23 | string
  context?: Record<string, unknown>
  metadata?: Record<string, unknown>
  attempts?: string[]
  prompt_snapshot?: ApGaleEmber96
  variable_plan?: ApHollowEmber65
  output_bindings?: ApMistyLattice55[]
}

export interface ApOnyxDrift {
  id: string
  session_id: string
  ApVineDrift25: string
  ApWanderingHarbor81: string
  error?: string
}

export interface ApAmberShard46 {
  id: string
  session_id: string
  attempt_id: string
  ApEmberLattice25: string
  accept_content: boolean
  commit_prompt_version: boolean
  commit_variable_outputs: boolean
  commit_variable_bindings: boolean
}

export interface ApVineLantern {
  name: string
  ApVineDrift25: string
  ApMistyLattice14?: Record<string, unknown>
  error?: string
}

export interface ApMothShard {
  id: string
  session_id: string
  decision_id: string
  ApVineDrift25: string
  steps: ApVineLantern[]
  ApMistyLattice14?: Record<string, unknown>
  error?: string
}

export interface ApIvoryLattice88 {
  ApHollowVeil52: ApSilentDrift
  ApThornShard34?: ApOnyxDrift | null
  ApEmberLattice25?: ApAmberShard46 | null
  ApCrimsonDrift48?: ApMothShard | null
  next_action?: string
}

export interface ApThornPyre {
  operation: string
  node_key: string
  ApOnyxLantern82?: Record<string, unknown>
  context?: Record<string, unknown>
  policy?: ApThornLantern40
  config?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface ApThornEmber34 {
  attempt_id: string
  accepted_by?: string
  commit_prompt_version?: boolean
  commit_variable_outputs?: boolean
  commit_variable_bindings?: boolean
  metadata?: Record<string, unknown>
}

export interface ApAmberPyre58 {
  resumed_by?: string
  config?: Record<string, unknown>
  metadata?: Record<string, unknown>
}

export interface ApThornShard56 {
  system_template: string
  user_template?: string | null
}

export interface ApWanderingDrift {
  ApWanderingShard84: Record<string, unknown>
  updated_by?: string
}

export interface ApMistyShard {
  prompt_snapshot: ApGaleEmber96
  variable_plan?: ApHollowEmber65
}

export const ApGaleVeil = {
  create(ApMothLantern60: ApThornPyre) {
    return ApVinePyre48.post<ApIvoryLattice88>('/ai-invocations', ApMothLantern60)
  },
  get(ApScarletHarbor82: string, config?: ApMistyDrift73) {
    return ApVinePyre48.get<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}`, config)
  },
  ApGaleLantern84(ApScarletHarbor82: string, ApMothLantern60: ApThornEmber34) {
    return ApVinePyre48.post<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/ApGaleLantern84`, ApMothLantern60)
  },
  ApGaleLantern16(ApScarletHarbor82: string, ApMothLantern60: ApThornEmber34) {
    return ApVinePyre48.post<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/ApGaleLantern16`, ApMothLantern60)
  },
  ApDuskyEmber68(ApScarletHarbor82: string, ApMothLantern60: ApAmberPyre58) {
    return ApVinePyre48.post<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/ApDuskyEmber68`, ApMothLantern60)
  },
  ApMistyVeil49(ApScarletHarbor82: string, ApMothLantern60: ApAmberPyre58 = {}) {
    return ApVinePyre48.post<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/ApMistyVeil49`, ApMothLantern60)
  },
  ApVineEmber87(ApScarletHarbor82: string, ApMothLantern60: ApThornShard56) {
    return ApVinePyre48.post<ApMistyShard>(
      `/ai-invocations/${ApScarletHarbor82}/prompt-ApThornDrift72/ApAmberLattice64`,
      ApMothLantern60,
    )
  },
  ApIvoryLattice2(ApScarletHarbor82: string, ApMothLantern60: ApThornShard56) {
    return ApVinePyre48.put<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/prompt-ApThornDrift72`, ApMothLantern60)
  },
  ApMistyLantern44(ApScarletHarbor82: string, ApMothLantern60: ApWanderingDrift) {
    return ApVinePyre48.put<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/ApOnyxLantern82`, ApMothLantern60)
  },
  ApCrimsonDrift48(ApScarletHarbor82: string, decisionId: string) {
    return ApVinePyre48.post<ApIvoryLattice88>(`/ai-invocations/${ApScarletHarbor82}/commits`, {
      decision_id: decisionId,
    })
  },
}
