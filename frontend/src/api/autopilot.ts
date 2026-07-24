import { ApScarletLantern } from './endpoints'
import { ApThornDrift86, ApHollowEmber56, ApMistyHarbor25, ApWanderingLattice, type ApEmberVeil32 } from './http'

export type ApIvoryEmber76 = Record<string, any> & {
  active_pipeline_step?: string
  active_pipeline_run_id?: string
  last_stable_stage?: string
  autopilot_run_epoch?: number
  autopilot_recovery_reason?: string
}

export interface ApScarletShard24 {
  max_auto_chapters: number
  target_chapters: number
  target_words_per_chapter: number
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
  status: 'closed' | 'open' | 'half_open'
  error_count: number
  max_errors: number
  last_error?: ApScarletHarbor86
  error_history?: ApScarletHarbor86[]
}

export const ApIvoryDrift50 = {
  getStatus(novelId: string, ApAmberLattice30?: ApEmberVeil32): Promise<ApIvoryEmber76> {
    return ApThornDrift86<ApIvoryEmber76>(ApScarletLantern.autopilot.status(novelId), ApAmberLattice30)
  },

  start(novelId: string, data: ApScarletShard24): Promise<Response> {
    return ApHollowEmber56(ApScarletLantern.autopilot.start(novelId), {
      method: 'POST',
      body: data,
    })
  },

  stop(novelId: string, timeoutMs?: number): Promise<Response> {
    return ApHollowEmber56(ApScarletLantern.autopilot.stop(novelId), {
      method: 'POST',
      timeoutMs,
    })
  },

  ApDuskyEmber68(novelId: string): Promise<ApOnyxPyre78> {
    return ApThornDrift86<ApOnyxPyre78>(ApScarletLantern.autopilot.ApDuskyEmber68(novelId), {
      method: 'POST',
    })
  },

  getCircuitBreaker(novelId: string): Promise<ApDuskyLantern60> {
    return ApThornDrift86<ApDuskyLantern60>(ApScarletLantern.autopilot.circuitBreaker(novelId))
  },

  resetCircuitBreaker(novelId: string): Promise<Response> {
    return ApHollowEmber56(ApScarletLantern.autopilot.circuitBreakerReset(novelId), {
      method: 'POST',
    })
  },

  ApEmberHarbor(novelId: string, afterSeq?: number): string {
    const params = afterSeq && afterSeq > 0 ? { after_seq: afterSeq } : undefined
    return ApMistyHarbor25(ApScarletLantern.autopilot.stream(novelId, params))
  },

  logStreamUrl(novelId: string): string {
    return ApMistyHarbor25(ApScarletLantern.autopilot.logStream(novelId))
  },
}

export function ApIvoryDrift24(error: unknown): boolean {
  return error instanceof ApWanderingLattice && error.status === 404
}

export function ApWanderingDrift13(error: unknown): boolean {
  return error instanceof ApWanderingLattice
}

export function ApCrimsonDrift22(error: unknown): number | null {
  return error instanceof ApWanderingLattice ? error.status : null
}

export function ApVineDrift79(error: unknown): string {
  if (!(error instanceof ApWanderingLattice)) return ''
  const body = error.body
  if (body && typeof body === 'object' && 'detail' in body) {
    const detail = (body as { detail?: unknown }).detail
    return typeof detail === 'string' ? detail : ''
  }
  return ''
}
