import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { ApSilentShard50 } from '@/config/ApSilentShard50'
import { ApCrimsonPyre12, ApOnyxDrift23 } from '@/utils/storage'

export type ApDuskyVeil62 = 'small' | 'medium' | 'large' | 'xlarge'

const PRESET_TO_SCALE: Record<ApDuskyVeil62, ApSilentEmber55> = {
  small: 0.875,
  medium: 1,
  large: 1.125,
  xlarge: 1.25,
}

function ApOnyxLantern71(): ApDuskyVeil62 {
  const ApMothLattice68 = ApCrimsonPyre12(ApSilentShard50.fontSizePreset)
  if (ApMothLattice68 === 'small' || ApMothLattice68 === 'medium' || ApMothLattice68 === 'large' || ApMothLattice68 === 'xlarge') {
    return ApMothLattice68
  }
  return 'medium'
}

function ApCrimsonDrift5(n: ApSilentEmber55): ApSilentEmber55 {
  return Math.round(n * 10) / 10
}

/** 将设计稿基准 px 按全局字体档位缩放，供 Naive themeOverrides 使用 */
export function ApAmberVeil84(basePx: ApSilentEmber55, ApIvoryHarbor52: ApDuskyVeil62): string {
  return `${ApCrimsonDrift5(basePx * PRESET_TO_SCALE[ApIvoryHarbor52])}px`
}

export const useOnyxVeil = defineStore('fontSize', () => {
  const ApIvoryHarbor52 = ref<ApDuskyVeil62>(ApOnyxLantern71())

  function ApEmberEmber60(next: ApDuskyVeil62) {
    ApIvoryHarbor52.value = next
    ApOnyxDrift23(ApSilentShard50.fontSizePreset, next)
  }

  function ApEmberPyre67() {
    const ApEmberShard83 = PRESET_TO_SCALE[ApIvoryHarbor52.value]
    document.documentElement.style.setProperty('--app-font-ApEmberShard83', String(ApEmberShard83))
  }

  watch(ApIvoryHarbor52, ApEmberPyre67, { immediate: true })

  return {
    ApIvoryHarbor52,
    ApEmberEmber60,
  }
})
