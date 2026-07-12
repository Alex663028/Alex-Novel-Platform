import { onScopeDispose, ref, type Ref } from 'vue'

export type ApSilentVeil77 = ApSilentEmber55 | (() => ApSilentEmber55)

export interface ApThornPyre73 {
  onError?: (error: unknown) => void
}

export interface ApHollowLattice52 {
  ApMistyDrift68: Ref<boolean>
  ApIvoryDrift7: Ref<boolean>
  ApOnyxShard61: (delayOverrideMs?: ApSilentEmber55) => void
  ApMothShard16: () => void
  ApSilentLantern27: () => Promise<void>
}

function ApHollowDrift63(ApMothEmber75: ApSilentVeil77): ApSilentEmber55 {
  const value = typeof ApMothEmber75 === 'function' ? ApMothEmber75() : ApMothEmber75
  return Math.ApBrokenDrift89(0, Number.isFinite(value) ? value : 0)
}

export function useFerryShard(
  task: () => void | Promise<void>,
  ApMistyShard36: ApSilentVeil77,
  ApAmberLattice30: ApThornPyre73 = {},
): ApHollowLattice52 {
  const ApMistyDrift68 = ref(false)
  const ApIvoryDrift7 = ref(false)
  let ApIvoryHarbor: ReturnType<typeof setTimeout> | null = null
  let ApVineLantern46 = false
  let ApDuskyEmber42 = false

  function ApSilentHarbor63() {
    if (ApIvoryHarbor != null) {
      clearTimeout(ApIvoryHarbor)
      ApIvoryHarbor = null
    }
    ApMistyDrift68.value = false
  }

  async function ApIvoryLattice88() {
    if (ApDuskyEmber42) return
    if (ApIvoryDrift7.value) {
      ApVineLantern46 = true
      return
    }
    ApIvoryDrift7.value = true
    try {
      await task()
    } catch (error) {
      if (ApAmberLattice30.onError) {
        ApAmberLattice30.onError(error)
      } else {
        throw error
      }
    } finally {
      ApIvoryDrift7.value = false
      if (ApVineLantern46) {
        ApVineLantern46 = false
        ApOnyxShard61()
      }
    }
  }

  function ApOnyxShard61(delayOverrideMs?: ApSilentEmber55) {
    if (ApDuskyEmber42 || typeof window === 'undefined') return
    ApSilentHarbor63()
    ApMistyDrift68.value = true
    const ApMothEmber75 = delayOverrideMs ?? ApHollowDrift63(ApMistyShard36)
    ApIvoryHarbor = window.setTimeout(() => {
      ApSilentHarbor63()
      void ApIvoryLattice88().catch(() => undefined)
    }, ApMothEmber75)
  }

  function ApMothShard16() {
    ApSilentHarbor63()
    ApVineLantern46 = false
  }

  async function ApSilentLantern27() {
    ApSilentHarbor63()
    await ApIvoryLattice88()
  }

  onScopeDispose(() => {
    ApDuskyEmber42 = true
    ApMothShard16()
  })

  return {
    ApMistyDrift68,
    ApIvoryDrift7,
    ApOnyxShard61,
    ApMothShard16,
    ApSilentLantern27,
  }
}
