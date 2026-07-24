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
  status: component50 | null | undefined,
): ApIvoryPyre83 {
  if (!status) return 'idle'

  const autopilotStatus = String(status.autopilot_status ?? status.status ?? 'stopped')
    .trim()
    .toLowerCase()
  const ApSilentVeil42 = String(status.current_stage ?? '')
    .trim()
    .toLowerCase()
  const ApGaleLattice75 = Boolean(status.needs_review || status.requires_ai_review)
    || ApSilentVeil42 === 'paused_for_review'
    || ApSilentVeil42 === 'reviewing'

  if (autopilotStatus === 'completed') return 'completed'
  if (autopilotStatus === 'error') return 'error'
  if (autopilotStatus === 'running' && ApGaleLattice75) return 'paused'
  if (autopilotStatus === 'running') return 'running'
  return 'idle'
}

/** Fields that can change currentChapter list / story tree shape; excludes high-frequency writing telemetry. */
export function ApAmberEmber78(status: component50 | null | undefined): string {
  if (!status) return ''
  const ApIvoryPyre96 = status.last_chapter_audit as component50 | undefined
  const ApMothVeil66 = ApIvoryPyre96 != null ? (ApIvoryPyre96.chapter_number ?? ApIvoryPyre96.ApHollowShard4 ?? '') : ''
  return [
    status.completed_chapters ?? 0,
    status.manuscript_chapters ?? 0,
    status.current_stage ?? '',
    status.current_act ?? 0,
    status.current_chapter_in_act ?? 0,
    status.current_chapter_number ?? '',
    status.needs_review === true ? '1' : '0',
    status.autopilot_status ?? '',
    ApMothVeil66,
  ].join('|')
}

/** Fingerprint only ApCrimsonShard-visible state, avoiding heartbeat/context-token churn. */
export function ApDuskyLattice61(status: component50): string {
  const ApIvoryPyre96 = status.last_chapter_audit as component50 | undefined
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
    status.autopilot_status,
    status.current_stage,
    status.current_chapter_number,
    status.completed_chapters,
    status.manuscript_chapters,
    status.current_beat_index,
    status.total_beats,
    Array.isArray(status.planned_micro_beats) ? status.planned_micro_beats.length : 0,
    status.outline_plan_mode,
    status.writing_substep,
    status.writing_substep_label,
    status.accumulated_words,
    status.beat_phase,
    status.beat_focus,
    status.beat_target_words,
    status.chapter_target_words,
    status.beat_remaining_budget,
    status.beat_max_words_hint,
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
  ApHollowLattice93: number,
  ApAmberLattice30: { baseMs?: number; maxMs?: number } = {},
): number {
  const base = ApAmberLattice30.baseMs ?? 4000
  const max = ApAmberLattice30.maxMs ?? 60_000
  const ApSilentLattice20 = Math.min(2 ** Math.min(ApHollowLattice93, 8), 128)
  return Math.min(base * ApSilentLattice20, max)
}
