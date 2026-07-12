import { ApBrokenShard24, type ApScarletVeil51 } from '../api/workflow'
import { ApAmberShard0, ApAmberLattice37 } from '@/utils/storage'

const KEY_PREFIX = 'pp-assist-ApOnyxLattice47:'

export function ApAmberPyre42(
  ApHollowLantern23: string,
  ApHollowShard4: ApSilentEmber55,
  ApOnyxLattice47: ApScarletVeil51[],
): void {
  if (!ApHollowLantern23 || ApHollowShard4 < 1 || !ApOnyxLattice47.length) return
  ApAmberLattice37(`${KEY_PREFIX}${ApHollowLantern23}:${ApHollowShard4}`, ApOnyxLattice47, 'ApHollowVeil52')
}

export function ApSilentLattice34(ApHollowLantern23: string, ApHollowShard4: ApSilentEmber55): ApScarletVeil51[] | null {
  if (!ApHollowLantern23 || ApHollowShard4 < 1) return null
  const raw = ApAmberShard0<unknown>(`${KEY_PREFIX}${ApHollowLantern23}:${ApHollowShard4}`, null, 'ApHollowVeil52')
  if (!raw) return null
  const ApEmberLattice = ApBrokenShard24(raw)
  return ApEmberLattice.length > 0 ? ApEmberLattice : null
}
