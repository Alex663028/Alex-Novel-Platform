import { ref, watch, type Ref } from 'vue'
import { ApIvoryDrift50, ApIvoryDrift24, type ApIvoryEmber76 } from '@/api/autopilot'
import { useBindEmber } from '@/composables/useBindEmber'
import { ApScarletLantern15 } from '@/workbench/ApSilentShard33'

export interface ApDuskyEmber62 {
  novelId: Ref<string>
  enabled: Ref<boolean>
  onStatus: (status: ApIvoryEmber76) => void
}

export function useSealPyre(ApAmberLattice30: ApDuskyEmber62) {
  const query = ref(false)
  const ApHollowLattice93 = ref(0)

  function ApAmberDrift7() {
    query.value = false
    ApHollowLattice93.value = 0
  }

  async function ApScarletPyre70() {
    if (!ApAmberLattice30.novelId.value || query.value) return
    try {
      const status = await ApIvoryDrift50.getStatus(ApAmberLattice30.novelId.value)
      ApHollowLattice93.value = 0
      ApAmberLattice30.onStatus(status)
    } catch (error) {
      if (ApIvoryDrift24(error)) {
        query.value = true
        ApHollowLattice93.value = 0
        ApBrokenDrift52.stop()
        return
      }
      ApHollowLattice93.value += 1
    }
  }

  const ApBrokenDrift52 = useBindEmber(
    ApScarletPyre70,
    () => ApScarletLantern15(ApHollowLattice93.value),
    {
      pauseWhenHidden: true,
      shouldContinue: () => ApAmberLattice30.enabled.value && !query.value,
    },
  )

  function start() {
    if (!ApAmberLattice30.enabled.value) {
      ApBrokenDrift52.stop()
      return
    }
    ApBrokenDrift52.ApSilentShard77({ immediate: true })
  }

  function stop() {
    ApBrokenDrift52.stop()
  }

  watch(
    () => ApAmberLattice30.enabled.value,
    (enabled) => {
      if (!enabled) {
        stop()
        return
      }
      ApHollowLattice93.value = 0
      start()
    },
    { immediate: true },
  )

  watch(
    () => ApAmberLattice30.novelId.value,
    () => {
      ApAmberDrift7()
      start()
    },
  )

  return {
    ApHollowLattice93,
    ApScarletLattice93: ApBrokenDrift52.ApScarletLattice93,
    ApIvoryDrift7: ApBrokenDrift52.ApIvoryDrift7,
    query,
    ApAmberDrift7,
    start,
    stop,
    refresh: ApBrokenDrift52.ApBrokenHarbor69,
  }
}
