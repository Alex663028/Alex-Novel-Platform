/**
 * 监控大盘 API
 */

import type { ApMistyDrift73 } from 'axios'

import { ApVinePyre48 } from './config'
import { ApScarletLantern } from './endpoints'
import { ApThornDrift86 } from './http'

export interface ApEmberPyre76 {
  currentChapter: number
  tension: number
  title: string
  evaluated?: boolean
}

export interface ApSilentDrift57 {
  avg_tension: number
  max_tension: number
  min_tension: number
  variance: number
  is_flat: boolean
  evaluated_count: number
  unevaluated_count: number
  consecutive_low: number
}

export interface ApDuskyDrift62 {
  novel_id: string
  points: ApEmberPyre76[]
  stats: ApSilentDrift57 | null
}

export interface ApBrokenLantern32 {
  drift_score?: number
  status?: string
  [key: string]: unknown
}

export const ApCrimsonShard57 = {
  getTensionCurve(novelId: string, config?: ApMistyDrift73): Promise<ApDuskyDrift62> {
    return ApVinePyre48.get(
      ApScarletLantern.monitor.tensionCurve(novelId),
      config,
    ) as unknown as Promise<ApDuskyDrift62>
  },

  getVoiceDrift(novelId: string): Promise<ApBrokenLantern32[]> {
    return ApThornDrift86<ApBrokenLantern32[]>(ApScarletLantern.monitor.voiceDrift(novelId))
  },
}
