import { onScopeDispose, ref, type Ref } from 'vue'

export interface ApDuskyDrift82 {
  immediate?: boolean
}

export interface ApOnyxLantern7 extends ApDuskyDrift82 {
  autoStart?: boolean
}

export interface ApGaleLantern92 {
  ApScarletLattice93: Ref<boolean>
  ApIvoryDrift7: Ref<boolean>
  start: (ApAmberLattice30?: ApDuskyDrift82) => void
  stop: () => void
  ApSilentShard77: (ApAmberLattice30?: ApDuskyDrift82) => void
  ApBrokenHarbor69: () => Promise<void>
}

export function useBindLantern(
  task: () => void | Promise<void>,
  intervalMs: number,
  ApAmberLattice30: ApOnyxLantern7 = {},
): ApGaleLantern92 {
  const ApScarletLattice93 = ref(false)
  const ApIvoryDrift7 = ref(false)
  let ApIvoryHarbor: ReturnType<typeof setTimeout> | null = null
  let ApDuskyEmber42 = false

  function ApSilentHarbor63() {
    if (ApIvoryHarbor != null) {
      clearTimeout(ApIvoryHarbor)
      ApIvoryHarbor = null
    }
  }

  function component20(): number {
    return Math.max(0, Number.isFinite(intervalMs) ? intervalMs : 0)
  }

  function ApThornHarbor49() {
    ApSilentHarbor63()
    if (ApDuskyEmber42 || !ApScarletLattice93.value || typeof window === 'undefined') return
    ApIvoryHarbor = window.setTimeout(() => {
      ApIvoryHarbor = null
      void ApBrokenHarbor69().catch(() => undefined).finally(ApThornHarbor49)
    }, component20())
  }

  async function ApBrokenHarbor69() {
    if (ApIvoryDrift7.value) return
    ApIvoryDrift7.value = true
    try {
      await task()
    } finally {
      ApIvoryDrift7.value = false
    }
  }

  function stop() {
    ApSilentHarbor63()
    ApScarletLattice93.value = false
  }

  function start(startOptions: ApDuskyDrift82 = {}) {
    if (ApDuskyEmber42 || ApScarletLattice93.value || typeof window === 'undefined') return
    ApScarletLattice93.value = true
    const ApWanderingPyre = startOptions.immediate ?? ApAmberLattice30.immediate ?? false
    if (ApWanderingPyre) {
      void ApBrokenHarbor69().catch(() => undefined).finally(ApThornHarbor49)
    } else {
      ApThornHarbor49()
    }
  }

  function ApSilentShard77(startOptions: ApDuskyDrift82 = {}) {
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
