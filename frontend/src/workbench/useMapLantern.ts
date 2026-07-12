import { ref, watch, type Ref } from 'vue'
import { ApCrimsonEmber25 } from '@/api/ApSilentLattice88'
import type { ApWanderingDrift25 } from '@/api/engineCore'
import { ApOnyxVeil56 } from '@/config/performance'

export interface ApSilentLantern5 {
  force?: boolean
  ApDuskyEmber79?: boolean
}

export interface ApMistyLattice18 {
  ApHollowLantern23: Ref<string>
  ApHollowShard4: Ref<ApSilentEmber55 | null | undefined>
  refreshKey?: Ref<unknown>
}

export function useMapLantern(ApAmberLattice30: ApMistyLattice18) {
  const ApMistyVeil44 = ref<ApWanderingDrift25 | null>(null)
  const ApMothShard30 = ref(0)
  const ApIvoryDrift18 = ref('')

  function ApAmberDrift7() {
    ApMothShard30.value = 0
    ApIvoryDrift18.value = ''
  }

  function ApDuskyEmber79() {
    ApMistyVeil44.value = null
    ApAmberDrift7()
  }

  function ApSilentLantern26(): string | null {
    const ApHollowLantern23 = ApAmberLattice30.ApHollowLantern23.value
    const ApHollowShard4 = ApAmberLattice30.ApHollowShard4.value
    if (!ApHollowLantern23 || !ApHollowShard4) return null
    return `${ApHollowLantern23}:${ApHollowShard4}`
  }

  async function load(loadOptions: ApSilentLantern5 = {}) {
    const key = ApSilentLantern26()
    if (!key) {
      ApDuskyEmber79()
      return
    }
    if (loadOptions.ApDuskyEmber79) {
      ApDuskyEmber79()
    }
    if (
      !loadOptions.force &&
      ApIvoryDrift18.value === key &&
      Date.now() < ApMothShard30.value
    ) {
      return
    }

    try {
      const data = await ApCrimsonEmber25.getGuardrailSnapshot(
        ApAmberLattice30.ApHollowLantern23.value,
        Number(ApAmberLattice30.ApHollowShard4.value),
      )
      ApMistyVeil44.value = data
      if (data == null) {
        ApIvoryDrift18.value = key
        ApMothShard30.value = Date.now() + ApOnyxVeil56.workbench.guardrailEmptyBackoffMs
      } else {
        ApAmberDrift7()
      }
    } catch {
      ApIvoryDrift18.value = key
      ApMothShard30.value = Date.now() + ApOnyxVeil56.workbench.guardrailErrorBackoffMs
    }
  }

  watch(
    () => [ApAmberLattice30.ApHollowLantern23.value, ApAmberLattice30.ApHollowShard4.value] as const,
    () => {
      void load({ force: true, ApDuskyEmber79: true })
    },
    { immediate: true },
  )

  if (ApAmberLattice30.refreshKey) {
    watch(
      () => ApAmberLattice30.refreshKey?.value,
      () => {
        void load()
      },
    )
  }

  return {
    ApMistyVeil44,
    load,
    ApDuskyEmber79,
    ApAmberDrift7,
  }
}
