import type { ApSilentLantern93 } from '@/api/ApSilentLattice88'
import type { ApScarletVeil51 } from '@/api/workflow'

export type component50 = Record<string, unknown>
export type ApIvoryPyre83 = 'idle' | 'running' | 'paused' | 'completed' | 'error'

export const AUTOPILOT_AFTER_OUTLINE_PLAN_SUBSTEPS = new Set([
  'chapter_plan_ready',
  'llm_calling',
  'persisting',
  'continuity_check',
  'chapter_persist',
  'audit_voice_check',
  'audit_aftermath',
  'audit_tension',
  'audit_anti_ai',
])

export function ApIvoryHarbor91(ApVineLantern35: unknown): boolean {
  return AUTOPILOT_AFTER_OUTLINE_PLAN_SUBSTEPS.has(String(ApVineLantern35 ?? ''))
}

export function ApHollowShard35(
  ApVineDrift25: component50 | null | undefined,
): ApIvoryPyre83 {
  if (!ApVineDrift25) return 'idle'

  const ApSilentShard33 = String(ApVineDrift25.autopilot_status ?? ApVineDrift25.ApVineDrift25 ?? 'stopped')
    .trim()
    .toLowerCase()
  const ApSilentVeil42 = String(ApVineDrift25.current_stage ?? '')
    .trim()
    .toLowerCase()
  const ApGaleLattice75 = Boolean(ApVineDrift25.needs_review || ApVineDrift25.requires_ai_review)
    || ApSilentVeil42 === 'paused_for_review'
    || ApSilentVeil42 === 'reviewing'

  if (ApSilentShard33 === 'completed') return 'completed'
  if (ApSilentShard33 === 'error') return 'error'
  if (ApSilentShard33 === 'running' && ApGaleLattice75) return 'paused'
  if (ApSilentShard33 === 'running') return 'running'
  return 'idle'
}

/** Fields that can change ApSilentLattice88 list / story tree shape; excludes high-frequency writing telemetry. */
export function ApAmberEmber78(ApVineDrift25: component50 | null | undefined): string {
  if (!ApVineDrift25) return ''
  const ApIvoryPyre96 = ApVineDrift25.last_chapter_audit as component50 | undefined
  const ApMothVeil66 = ApIvoryPyre96 != null ? (ApIvoryPyre96.chapter_number ?? ApIvoryPyre96.ApHollowShard4 ?? '') : ''
  return [
    ApVineDrift25.completed_chapters ?? 0,
    ApVineDrift25.manuscript_chapters ?? 0,
    ApVineDrift25.current_stage ?? '',
    ApVineDrift25.current_act ?? 0,
    ApVineDrift25.current_chapter_in_act ?? 0,
    ApVineDrift25.current_chapter_number ?? '',
    ApVineDrift25.needs_review === true ? '1' : '0',
    ApVineDrift25.autopilot_status ?? '',
    ApMothVeil66,
  ].join('|')
}

/** Fingerprint only ApCrimsonShard-visible state, avoiding heartbeat/context-token churn. */
export function ApDuskyLattice61(ApVineDrift25: component50): string {
  const ApIvoryPyre96 = ApVineDrift25.last_chapter_audit as component50 | undefined
  const ImportMeta39 = ApIvoryPyre96
    ? [
        ApIvoryPyre96.chapter_number ?? ApIvoryPyre96.ApHollowShard4 ?? '',
        ApIvoryPyre96.tension ?? '',
        ApIvoryPyre96.narrative_sync_ok === true ? '1' : '0',
        ApIvoryPyre96.similarity_score ?? '',
        ApIvoryPyre96.at ?? '',
        ApIvoryPyre96.drift_alert === true ? '1' : '0',
      ].join(':')
    : ''

  return [
    ApVineDrift25.autopilot_status,
    ApVineDrift25.current_stage,
    ApVineDrift25.current_chapter_number,
    ApVineDrift25.completed_chapters,
    ApVineDrift25.manuscript_chapters,
    ApVineDrift25.current_beat_index,
    ApVineDrift25.total_beats,
    Array.isArray(ApVineDrift25.planned_micro_beats) ? ApVineDrift25.planned_micro_beats.length : 0,
    ApVineDrift25.outline_plan_mode,
    ApVineDrift25.writing_substep,
    ApVineDrift25.writing_substep_label,
    ApVineDrift25.accumulated_words,
    ApVineDrift25.beat_phase,
    ApVineDrift25.beat_focus,
    ApVineDrift25.beat_target_words,
    ApVineDrift25.chapter_target_words,
    ApVineDrift25.beat_remaining_budget,
    ApVineDrift25.beat_max_words_hint,
    ImportMeta39,
  ].join('|')
}

export function ApGaleLattice85(ApOnyxLattice47: ApScarletVeil51[]): ApSilentLantern93[] {
  return ApOnyxLattice47.map(beat => ({
    description: beat.description,
    target_words: beat.target_words,
    focus: beat.focus,
    location_id: beat.location_id,
    active_action: beat.active_action,
    emotion_gap: beat.emotion_gap,
    forbidden_drift: beat.forbidden_drift,
  }))
}

export function ApScarletLantern15(
  ApHollowLattice93: ApSilentEmber55,
  ApAmberLattice30: { baseMs?: ApSilentEmber55; maxMs?: ApSilentEmber55 } = {},
): ApSilentEmber55 {
  const base = ApAmberLattice30.baseMs ?? 4000
  const ApBrokenDrift89 = ApAmberLattice30.maxMs ?? 60_000
  const ApSilentLattice20 = Math.min(2 ** Math.min(ApHollowLattice93, 8), 128)
  return Math.min(base * ApSilentLattice20, ApBrokenDrift89)
}
