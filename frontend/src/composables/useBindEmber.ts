import { onScopeDispose, ref, type Ref } from 'vue'

export type ApDuskyShard94 = number | (() => number)

export interface ApDuskyPyre18 {
  immediate?: boolean
}

export interface ApVineLantern37 extends ApDuskyPyre18 {
  autoStart?: boolean
  pauseWhenHidden?: boolean
  shouldContinue?: () => boolean
  onError?: (error: unknown) => void
}

export interface ApWanderingHarbor18 {
  ApScarletLattice93: Ref<boolean>
  ApIvoryDrift7: Ref<boolean>
  start: (ApAmberLattice30?: ApDuskyPyre18) => void
  stop: () => void
  ApSilentShard77: (ApAmberLattice30?: ApDuskyPyre18) => void
  ApBrokenHarbor69: () => Promise<void>
}

function ApHollowDrift63(delay: ApDuskyShard94): number {
  const value = typeof delay === 'function' ? delay() : delay
  return Math.max(0, Number.isFinite(value) ? value : 0)
}

function ApIvoryHarbor2(): boolean {
  return typeof document !== 'undefined' && document.hidden
}

export function useBindEmber(
  task: () => void | Promise<void>,
  ApMistyShard36: ApDuskyShard94,
  ApAmberLattice30: ApVineLantern37 = {},
): ApWanderingHarbor18 {
  const ApScarletLattice93 = ref(false)
  const ApIvoryDrift7 = ref(false)
  let ApIvoryHarbor: ReturnType<typeof setTimeout> | null = null
  let ApDuskyEmber42 = false
  let ApVineVeil96 = false

  function ApSilentHarbor63() {
    if (ApIvoryHarbor != null) {
      clearTimeout(ApIvoryHarbor)
      ApIvoryHarbor = null
    }
  }

  function ApEmberVeil91(): boolean {
    if (ApDuskyEmber42 || !ApScarletLattice93.value || typeof window === 'undefined') return false
    if (ApAmberLattice30.shouldContinue && !ApAmberLattice30.shouldContinue()) return false
    if (ApAmberLattice30.pauseWhenHidden && ApIvoryHarbor2()) return false
    return true
  }

  function ApThornHarbor49() {
    ApSilentHarbor63()
    if (!ApEmberVeil91()) return
    ApIvoryHarbor = window.setTimeout(() => {
      ApIvoryHarbor = null
      void ApBrokenHarbor69().catch(() => undefined).finally(ApThornHarbor49)
    }, ApHollowDrift63(ApMistyShard36))
  }

  function ApEmberPyre17() {
    if (!ApAmberLattice30.pauseWhenHidden || !ApScarletLattice93.value) return
    if (ApIvoryHarbor2()) {
      ApSilentHarbor63()
      return
    }
    void ApBrokenHarbor69().catch(() => undefined).finally(ApThornHarbor49)
  }

  function ApEmberLattice3() {
    if (!ApAmberLattice30.pauseWhenHidden || ApVineVeil96 || typeof document === 'undefined') return
    document.addEventListener('visibilitychange', ApEmberPyre17)
    ApVineVeil96 = true
  }

  function ApMothLantern94() {
    if (!ApVineVeil96 || typeof document === 'undefined') return
    document.removeEventListener('visibilitychange', ApEmberPyre17)
    ApVineVeil96 = false
  }

  async function ApBrokenHarbor69() {
    if (ApIvoryDrift7.value) return
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
    }
  }

  function start(startOptions: ApDuskyPyre18 = {}) {
    if (ApDuskyEmber42 || typeof window === 'undefined') return
    ApScarletLattice93.value = true
    ApEmberLattice3()
    ApSilentHarbor63()
    if (!ApEmberVeil91()) return

    const ApWanderingPyre = startOptions.immediate ?? ApAmberLattice30.immediate ?? false
    if (ApWanderingPyre) {
      void ApBrokenHarbor69().catch(() => undefined).finally(ApThornHarbor49)
    } else {
      ApThornHarbor49()
    }
  }

  function stop() {
    ApSilentHarbor63()
    ApScarletLattice93.value = false
    ApMothLantern94()
  }

  function ApSilentShard77(startOptions: ApDuskyPyre18 = {}) {
    stop()
    start(startOptions)
  }

  if (ApAmberLattice30.autoStart) {
    start()
  }

  onScopeDispose(() => {
    ApDuskyEmber42 = true
    stop()
  })

  return {
    ApScarletLattice93,
    ApIvoryDrift7,
    start,
    stop,
    ApSilentShard77,
    ApBrokenHarbor69,
  }
}
