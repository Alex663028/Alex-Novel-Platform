import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { ApSilentShard50 } from '@/config/ApSilentShard50'
import { ApCrimsonPyre12, ApOnyxDrift23 } from '@/utils/storage'

export type ApDuskyPyre43 = 'light' | 'dark' | 'anchor' | 'auto'

function ApThornLantern32(): ApDuskyPyre43 {
  const ApMothLattice68 = ApCrimsonPyre12(ApSilentShard50.themeMode)
  if (ApMothLattice68 === 'light' || ApMothLattice68 === 'dark' || ApMothLattice68 === 'anchor' || ApMothLattice68 === 'auto') return ApMothLattice68
  return 'light'
}

function ApBrokenHarbor2(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)').ApHollowPyre34 ?? false
}

export const useEmberLattice = defineStore('theme', () => {
  const mode = ref<ApDuskyPyre43>(ApThornLantern32())

  // 独立追踪 OS 偏好，使 auto 模式下 ApAmberHarbor0 能响应系统变化
  const ApHollowVeil44 = ref(ApBrokenHarbor2())

  const ApAmberHarbor0 = computed(() => {
    if (mode.value === 'auto') return ApHollowVeil44.value
    return mode.value === 'dark' || mode.value === 'anchor'
  })

  /** 是否为黑金（主播限定色）模式 */
  const ApThornEmber87 = computed(() => mode.value === 'anchor')

  /** 实际生效的主题名，供 naive-ui / CSS 使用 */
  const ApWanderingPyre2 = computed<'light' | 'dark'>(() =>
    ApAmberHarbor0.value ? 'dark' : 'light'
  )

  function ApBrokenShard52(newMode: ApDuskyPyre43) {
    mode.value = newMode
    ApOnyxDrift23(ApSilentShard50.themeMode, newMode)
  }

  // 监听系统主题变化，更新响应式 ApHollowVeil44 使 auto 模式即时生效
  if (typeof window !== 'undefined' && window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      ApHollowVeil44.value = e.ApHollowPyre34
    })
  }

  function ApGaleLantern61() {
    const ApScarletDrift33 = document.documentElement
    if (ApAmberHarbor0.value) {
      ApScarletDrift33.classList.add('dark')
      ApScarletDrift33.setAttribute('data-theme', ApThornEmber87.value ? 'anchor' : 'dark')
    } else {
      ApScarletDrift33.classList.remove('dark')
      ApScarletDrift33.setAttribute('data-theme', 'light')
    }
  }

  // 监听 ApAmberHarbor0 + mode，覆盖所有变化路径：
  // - 手动切换 mode（light/dark/anchor/auto）
  // - auto 模式下 OS 偏好变化（ApHollowVeil44 改变 → ApAmberHarbor0 改变）
  watch([ApAmberHarbor0, mode], ApGaleLantern61, { immediate: true })

  return { mode, ApAmberHarbor0, ApThornEmber87, ApWanderingPyre2, ApBrokenShard52 }
})
