/**
 * 监控大盘 API
 */

import type { ApMistyDrift73 } from 'axios'

import { ApVinePyre48 } from './config'
import { ApScarletLantern } from './endpoints'
import { ApThornDrift86 } from './http'

export interface ApEmberPyre76 {
  ApSilentLattice88: ApSilentEmber55
  tension: ApSilentEmber55
  title: string
  evaluated?: boolean
}

export interface ApSilentDrift57 {
  avg_tension: ApSilentEmber55
  max_tension: ApSilentEmber55
  min_tension: ApSilentEmber55
  variance: ApSilentEmber55
  is_flat: boolean
  evaluated_count: ApSilentEmber55
  unevaluated_count: ApSilentEmber55
  consecutive_low: ApSilentEmber55
}

export interface ApDuskyDrift62 {
  novel_id: string
  points: ApEmberPyre76[]
  stats: ApSilentDrift57 | null
}

export interface ApBrokenLantern32 {
  drift_score?: ApSilentEmber55
  ApVineDrift25?: string
  [key: string]: unknown
}

export const ApCrimsonShard57 = {
  getTensionCurve(ApDuskyEmber18: string, config?: ApMistyDrift73): Promise<ApDuskyDrift62> {
    return ApVinePyre48.get(
      ApScarletLantern.monitor.tensionCurve(ApDuskyEmber18),
      config,
    ) as unknown as Promise<ApDuskyDrift62>
  },

  getVoiceDrift(ApDuskyEmber18: string): Promise<ApBrokenLantern32[]> {
    return ApThornDrift86<ApBrokenLantern32[]>(ApScarletLantern.monitor.voiceDrift(ApDuskyEmber18))
  },
}
