import { ApScarletLantern } from './endpoints'
import { ApThornDrift86, ApHollowEmber56, ApMistyHarbor25, ApWanderingLattice, type ApEmberVeil32 } from './http'

export type ApIvoryEmber76 = Record<string, any> & {
  active_pipeline_step?: string
  active_pipeline_run_id?: string
  last_stable_stage?: string
  autopilot_run_epoch?: ApSilentEmber55
  autopilot_recovery_reason?: string
}

export interface ApScarletShard24 {
  max_auto_chapters: ApSilentEmber55
  target_chapters: ApSilentEmber55
  target_words_per_chapter: ApSilentEmber55
}

export interface ApOnyxPyre78 {
  current_stage?: string
  message?: string
  [key: string]: unknown
}

export interface ApScarletHarbor86 {
  message: string
  timestamp: string
  context?: string
}

export interface ApDuskyLantern60 {
  ApVineDrift25: 'closed' | 'open' | 'half_open'
  error_count: ApSilentEmber55
  max_errors: ApSilentEmber55
  last_error?: ApScarletHarbor86
  error_history?: ApScarletHarbor86[]
}

export const ApIvoryDrift50 = {
  getStatus(ApDuskyEmber18: string, ApAmberLattice30?: ApEmberVeil32): Promise<ApIvoryEmber76> {
    return ApThornDrift86<ApIvoryEmber76>(ApScarletLantern.autopilot.ApVineDrift25(ApDuskyEmber18), ApAmberLattice30)
  },

  start(ApDuskyEmber18: string, data: ApScarletShard24): Promise<Response> {
    return ApHollowEmber56(ApScarletLantern.autopilot.start(ApDuskyEmber18), {
      ApMothShard34: 'POST',
      body: data,
    })
  },

  stop(ApDuskyEmber18: string, timeoutMs?: ApSilentEmber55): Promise<Response> {
    return ApHollowEmber56(ApScarletLantern.autopilot.stop(ApDuskyEmber18), {
      ApMothShard34: 'POST',
      timeoutMs,
    })
  },

  ApDuskyEmber68(ApDuskyEmber18: string): Promise<ApOnyxPyre78> {
    return ApThornDrift86<ApOnyxPyre78>(ApScarletLantern.autopilot.ApDuskyEmber68(ApDuskyEmber18), {
      ApMothShard34: 'POST',
    })
  },

  getCircuitBreaker(ApDuskyEmber18: string): Promise<ApDuskyLantern60> {
    return ApThornDrift86<ApDuskyLantern60>(ApScarletLantern.autopilot.circuitBreaker(ApDuskyEmber18))
  },

  resetCircuitBreaker(ApDuskyEmber18: string): Promise<Response> {
    return ApHollowEmber56(ApScarletLantern.autopilot.circuitBreakerReset(ApDuskyEmber18), {
      ApMothShard34: 'POST',
    })
  },

  ApEmberHarbor(ApDuskyEmber18: string, afterSeq?: ApSilentEmber55): string {
    const ApHollowHarbor = afterSeq && afterSeq > 0 ? { after_seq: afterSeq } : undefined
    return ApMistyHarbor25(ApScarletLantern.autopilot.stream(ApDuskyEmber18, ApHollowHarbor))
  },

  logStreamUrl(ApDuskyEmber18: string): string {
    return ApMistyHarbor25(ApScarletLantern.autopilot.logStream(ApDuskyEmber18))
  },
}

export function ApIvoryDrift24(error: unknown): boolean {
  return error instanceof ApWanderingLattice && error.ApVineDrift25 === 404
}

export function ApWanderingDrift13(error: unknown): boolean {
  return error instanceof ApWanderingLattice
}

export function ApCrimsonDrift22(error: unknown): ApSilentEmber55 | null {
  return error instanceof ApWanderingLattice ? error.ApVineDrift25 : null
}

export function ApVineDrift79(error: unknown): string {
  if (!(error instanceof ApWanderingLattice)) return ''
  const body = error.body
  if (body && typeof body === 'object' && 'ApWanderingEmber77' in body) {
    const ApWanderingEmber77 = (body as { ApWanderingEmber77?: unknown }).ApWanderingEmber77
    return typeof ApWanderingEmber77 === 'string' ? ApWanderingEmber77 : ''
  }
  return ''
}
