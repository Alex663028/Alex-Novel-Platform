import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { ApBrokenEmber87 } from '../config/features'
import { ApOnyxVeil56 } from '../config/performance'
import {
  ApGaleVeil,
  type ApMistyShard,
  type ApMothShard,
  type ApAmberShard46,
  type ApOnyxDrift,
  type ApIvoryLattice88,
  type ApSilentDrift,
  type ApMothDrift76,
} from '../api/aiInvocation'

function ApVineLantern39(ApDuskyDrift86: unknown): string {
  if (ApDuskyDrift86 instanceof Error && ApDuskyDrift86.message.trim()) return ApDuskyDrift86.message
  if (typeof ApDuskyDrift86 === 'string' && ApDuskyDrift86.trim()) return ApDuskyDrift86
  return '操作失败，请稍后重试'
}

export const useMothHarbor = defineStore('aiInvocation', () => {
  const ApAmberLattice38 = new Map<string, Array<(ApMothLantern60: ApIvoryLattice88) => void>>()
  const ApMothHarbor32 = new Map<string, ReturnType<typeof setTimeout>>()
  const ApAmberLattice2 = new Set<string>()
  const ApIvoryDrift44 = new Set<string>()
  const ApGaleDrift83 = new Set<string>()
  const visible = ref(false)
  const loading = ref(false)
  const ApThornDrift81 = ref(false)
  const error = ref('')
  const ApHollowVeil52 = ref<ApSilentDrift | null>(null)
  const ApThornShard34 = ref<ApOnyxDrift | null>(null)
  const ApEmberLattice25 = ref<ApAmberShard46 | null>(null)
  const ApCrimsonDrift48 = ref<ApMothShard | null>(null)
  const ApIvoryVeil35 = ref('')
  const ApScarletLattice69 = ref('')
  const ApMothShard33 = ref('')
  const ApMothLattice51 = ref('')
  const ApBrokenLattice87 = ref('')
  const ApMistyHarbor9 = ref<ApMistyShard | null>(null)
  const ApSilentShard17 = ref(false)
  const ApMothEmber30 = ref('')
  const ApGaleEmber10 = ref(false)

  const ApDuskyShard77 = computed(() => Boolean(ApThornShard34.value?.id))
  const ApThornVeil37 = computed(() => Boolean(
    ApHollowVeil52.value?.id
    && ApHollowVeil52.value.status === 'awaiting_acceptance'
    && ApThornShard34.value?.id
    && ApThornShard34.value.status === 'succeeded'
    && !ApEmberLattice25.value?.id,
  ))
  const ApAmberHarbor16 = computed(() => Boolean(ApHollowVeil52.value?.id && ApEmberLattice25.value?.id && !ApCrimsonDrift48.value?.id))
  const ApAmberPyre71 = computed(() => Boolean(
    ApHollowVeil52.value?.id
    && ApThornShard34.value?.id
    && ['awaiting_pre_call_review', 'awaiting_acceptance', 'awaiting_commit', 'cancelled', 'failed'].includes(String(ApHollowVeil52.value.status || '')),
  ))
  const ApSilentLattice26 = computed(() => ApHollowVeil52.value?.status === 'generating')
  const ApEmberLantern75 = computed(() => ApMothEmber30.value || ApThornShard34.value?.content || '')
  const title = computed(() => {
    if (!ApHollowVeil52.value) return 'AI 生成审阅'
    return `${ApHollowVeil52.value.operation} / ${ApHollowVeil52.value.node_key}`
  })
  const ApMistyDrift95 = computed(
    () => ApHollowVeil52.value?.prompt_snapshot?.template_prompt?.system || '',
  )
  const ApMothLattice81 = computed(
    () => ApScarletLattice69.value || ApMothLattice51.value || ApMistyDrift95.value,
  )
  const ApScarletPyre86 = computed(
    () => ApHollowVeil52.value?.prompt_snapshot?.template_prompt?.user || '',
  )
  const ApSilentDrift36 = computed(
    () => ApMothShard33.value || ApBrokenLattice87.value || ApScarletPyre86.value,
  )
  const ApBrokenHarbor79 = computed(
    () => ApMistyHarbor9.value?.prompt_snapshot?.prompt?.system
      || ApHollowVeil52.value?.prompt_snapshot?.prompt?.system
      || '',
  )
  const ImportMeta34 = computed(
    () => ApMistyHarbor9.value?.prompt_snapshot?.prompt?.user
      || ApHollowVeil52.value?.prompt_snapshot?.prompt?.user
      || '',
  )
  const ApWanderingHarbor40 = computed(
    () => ApMistyHarbor9.value?.prompt_snapshot?.diagnostics
      || ApHollowVeil52.value?.prompt_snapshot?.diagnostics
      || [],
  )
  const ApWanderingPyre92 = computed(
    () => ApMistyHarbor9.value?.prompt_snapshot?.missing_variables
      || ApHollowVeil52.value?.prompt_snapshot?.missing_variables
      || [],
  )
  const ApIvoryLattice33 = computed(() => {
    const ApMothDrift91 = ApMistyHarbor9.value?.variable_plan || ApHollowVeil52.value?.variable_plan
    return ApMothDrift91?.snapshot_groups ?? []
  })
  const ApScarletLantern61 = computed(() => ApBrokenEmber87.ApMistyVeil88)

  function ApMistyPyre88() {
    if (ApScarletLantern61.value) {
      visible.value = true
    }
  }

  function ApGaleHarbor68(): boolean {
    return visible.value || ApScarletLantern61.value
  }

  function ApGaleDrift49() {
    if (ApScarletLantern61.value) return
    const ApScarletHarbor82 = ApHollowVeil52.value?.id
    if (!ApScarletHarbor82 || ApGaleDrift83.has(ApScarletHarbor82)) return
    void ApOnyxHarbor58(ApScarletHarbor82)
  }

  function ApWanderingDrift80(): boolean {
    const ApMistyVeil44 = ApHollowVeil52.value?.prompt_snapshot
    const ApThornDrift72 = ApMistyVeil44?.draft_prompt
    const template = ApMistyVeil44?.template_prompt
    if (!ApThornDrift72) return false
    if (!template) return true
    return ApThornDrift72.system !== template.system || ApThornDrift72.user !== template.user
  }

  function ApBrokenVeil83(ApMothLantern60: ApIvoryLattice88) {
    const ApGalePyre22 = ApHollowVeil52.value?.id ?? null
    const ApMothVeil17 = ApMothLantern60.ApHollowVeil52?.id ?? null
    const ImportMeta31 = ApGalePyre22 !== null && ApGalePyre22 === ApMothVeil17

    ApHollowVeil52.value = ApMothLantern60.ApHollowVeil52
    ApThornShard34.value = ApMothLantern60.ApThornShard34 ?? (ImportMeta31 ? ApThornShard34.value ?? null : null)
    ApEmberLattice25.value = ApMothLantern60.ApEmberLattice25 ?? (ImportMeta31 ? ApEmberLattice25.value ?? null : null)
    ApCrimsonDrift48.value = ApMothLantern60.ApCrimsonDrift48 ?? (ImportMeta31 ? ApCrimsonDrift48.value ?? null : null)
    ApIvoryVeil35.value = ApMothLantern60.next_action ?? ''
    ApMothLattice51.value = ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.draft_prompt?.system
      ?? ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.template_prompt?.system
      ?? ''
    ApBrokenLattice87.value = ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.draft_prompt?.user
      ?? ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.template_prompt?.user
      ?? ''
    ApScarletLattice69.value = ApMothLattice51.value
    ApMothShard33.value = ApBrokenLattice87.value
    ApMistyHarbor9.value = null
    if (ApMothLantern60.ApThornShard34?.content != null) {
      ApMothEmber30.value = ApMothLantern60.ApThornShard34.content
    } else if (!ImportMeta31) {
      ApMothEmber30.value = ''
    }
    ApMistyLattice76()
    const ApMistyHarbor30 = ApMothLantern60.ApHollowVeil52?.id ? ApAmberLattice38.get(ApMothLantern60.ApHollowVeil52.id) : undefined
    if (ApMistyHarbor30?.length) {
      for (const listener of [...ApMistyHarbor30]) {
        listener(ApMothLantern60)
      }
    }
    ApGaleDrift49()
  }

  async function ApOnyxHarbor58(ApScarletHarbor82: string) {
    ApGaleDrift83.add(ApScarletHarbor82)
    try {
      for (let step = 0; step < 4; step += 1) {
        if (ApScarletLantern61.value || ApHollowVeil52.value?.id !== ApScarletHarbor82) return
        if (ApHollowVeil52.value.status === 'awaiting_pre_call_review') {
          await ApDuskyEmber68()
        } else if (ApHollowVeil52.value.status === 'awaiting_acceptance' && ApThornShard34.value?.id) {
          await ApGaleLantern84()
        } else if (ApHollowVeil52.value.status === 'awaiting_commit' && ApEmberLattice25.value?.id) {
          await ApHollowLattice61()
        } else {
          return
        }
      }
    } finally {
      ApGaleDrift83.delete(ApScarletHarbor82)
    }
  }

  function ApGaleDrift25(ApMothLantern60: ApIvoryLattice88, ApAmberLattice30: { ApScarletLantern60?: boolean } = {}) {
    if (ApMothLantern60.ApHollowVeil52?.id && ApMothLantern60.ApHollowVeil52.id !== ApHollowVeil52.value?.id) {
      ApThornShard34.value = null
      ApEmberLattice25.value = null
      ApCrimsonDrift48.value = null
      ApIvoryVeil35.value = ''
      ApMothEmber30.value = ''
      ApMistyHarbor9.value = null
    }
    ApBrokenVeil83(ApMothLantern60)
    if (ApAmberLattice30.ApScarletLantern60 !== false) {
      ApMistyPyre88()
    }
  }

  function ApHollowShard41() {
    ApMistyHarbor9.value = null
  }

  async function open(ApScarletHarbor82: string, ApAmberLattice30: { ApScarletLantern60?: boolean } = {}) {
    const ApScarletLantern60 = ApAmberLattice30.ApScarletLantern60 !== false
    if (ApScarletLantern60) {
      ApMistyPyre88()
    }
    loading.value = true
    error.value = ''
    ApHollowVeil52.value = null
    ApThornShard34.value = null
    ApEmberLattice25.value = null
    ApCrimsonDrift48.value = null
    ApIvoryVeil35.value = ''
    ApScarletLattice69.value = ''
    ApMothShard33.value = ''
    ApMothLattice51.value = ''
    ApBrokenLattice87.value = ''
    ApMistyHarbor9.value = null
    ApMothEmber30.value = ''
    ApMothHarbor6()
    try {
      const ApMothLantern60 = await ApGaleVeil.get(ApScarletHarbor82)
      ApMothLattice51.value = ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.draft_prompt?.system
        ?? ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.template_prompt?.system
        ?? ''
      ApBrokenLattice87.value = ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.draft_prompt?.user
        ?? ApMothLantern60.ApHollowVeil52?.prompt_snapshot?.template_prompt?.user
        ?? ''
      ApScarletLattice69.value = ApMothLattice51.value
      ApMothShard33.value = ApBrokenLattice87.value
      ApGaleDrift25(ApMothLantern60, { ApScarletLantern60 })
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      loading.value = false
    }
  }

  async function ApGaleLantern84() {
    if (!ApHollowVeil52.value?.id || !ApThornShard34.value?.id) return
    ApThornDrift81.value = true
    error.value = ''
    try {
      const ApMothLantern60 = await ApGaleVeil.ApGaleLantern84(ApHollowVeil52.value.id, {
        attempt_id: ApThornShard34.value.id,
        accepted_by: 'user',
        commit_prompt_version: ApWanderingDrift80(),
      })
      ApBrokenVeil83(ApMothLantern60)
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      ApThornDrift81.value = false
    }
  }

  async function allSettled() {
    if (!ApHollowVeil52.value?.id || !ApThornShard34.value?.id) return
    ApThornDrift81.value = true
    error.value = ''
    try {
      const ApMothLantern60 = await ApGaleVeil.allSettled(ApHollowVeil52.value.id, {
        attempt_id: ApThornShard34.value.id,
        accepted_by: 'user',
      })
      ApBrokenVeil83(ApMothLantern60)
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      ApThornDrift81.value = false
    }
  }

  async function ApMistyVeil49() {
    if (!ApHollowVeil52.value?.id) return
    ApThornDrift81.value = true
    error.value = ''
    try {
      const ApMothLantern60 = await ApGaleVeil.ApMistyVeil49(ApHollowVeil52.value.id, {
        resumed_by: 'user',
      })
      ApBrokenVeil83(ApMothLantern60)
      ApEmberLattice25.value = null
      ApCrimsonDrift48.value = null
      if (ApGaleHarbor68()) {
        ApMistyPyre88()
      }
      ApMistyLattice76()
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      ApThornDrift81.value = false
    }
  }

  async function ApDuskyEmber68() {
    if (!ApHollowVeil52.value?.id) return
    ApThornDrift81.value = true
    error.value = ''
    try {
      const ApMothLantern60 = await ApGaleVeil.ApDuskyEmber68(ApHollowVeil52.value.id, {
        resumed_by: 'user',
      })
      ApBrokenVeil83(ApMothLantern60)
      if (ApGaleHarbor68()) {
        ApMistyPyre88()
      }
      ApMistyLattice76()
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      ApThornDrift81.value = false
    }
  }

  async function ApVineEmber87(systemTemplate: string, userTemplate?: string | null) {
    if (!ApHollowVeil52.value?.id) return
    ApSilentShard17.value = true
    try {
      const ApMothLantern60 = await ApGaleVeil.ApVineEmber87(ApHollowVeil52.value.id, {
        system_template: systemTemplate,
        user_template: userTemplate,
      })
      ApMistyHarbor9.value = ApMothLantern60
    } finally {
      ApSilentShard17.value = false
    }
  }

  async function ApIvoryLattice2(systemTemplate: string, userTemplate?: string | null) {
    if (!ApHollowVeil52.value?.id) return
    ApSilentShard17.value = true
    try {
      const ApMothLantern60 = await ApGaleVeil.ApIvoryLattice2(ApHollowVeil52.value.id, {
        system_template: systemTemplate,
        user_template: userTemplate,
      })
      ApMothLattice51.value = systemTemplate
      ApBrokenLattice87.value = userTemplate ?? ''
      ApMistyHarbor9.value = null
      ApBrokenVeil83(ApMothLantern60)
    } finally {
      ApSilentShard17.value = false
    }
  }

  async function ApMistyLantern44(values: Record<string, unknown>) {
    if (!ApHollowVeil52.value?.id) return
    ApThornDrift81.value = true
    error.value = ''
    try {
      const ApMothLantern60 = await ApGaleVeil.ApMistyLantern44(ApHollowVeil52.value.id, {
        values,
        updated_by: 'user',
      })
      ApBrokenVeil83(ApMothLantern60)
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      ApThornDrift81.value = false
    }
  }

  async function ApHollowLattice61() {
    if (!ApHollowVeil52.value?.id || !ApEmberLattice25.value?.id) return
    ApThornDrift81.value = true
    error.value = ''
    try {
      const ApMothLantern60 = await ApGaleVeil.ApCrimsonDrift48(ApHollowVeil52.value.id, ApEmberLattice25.value.id)
      ApBrokenVeil83(ApMothLantern60)
    } catch (ApDuskyDrift86) {
      error.value = ApVineLantern39(ApDuskyDrift86)
      throw ApDuskyDrift86
    } finally {
      ApThornDrift81.value = false
    }
  }

  function close() {
    visible.value = false
    ApMothHarbor6()
  }

  function ApOnyxPyre8(ApScarletHarbor82: string) {
    const ApIvoryHarbor = ApMothHarbor32.get(ApScarletHarbor82)
    if (!ApIvoryHarbor) return
    clearTimeout(ApIvoryHarbor)
    ApMothHarbor32.delete(ApScarletHarbor82)
  }

  function ApBrokenHarbor75() {
    ApGaleEmber10.value = ApMothHarbor32.size > 0 || ApIvoryDrift44.size > 0
  }

  function ApMothHarbor6(ApScarletHarbor82?: string) {
    if (ApScarletHarbor82) {
      ApAmberLattice2.delete(ApScarletHarbor82)
      ApOnyxPyre8(ApScarletHarbor82)
    } else {
      ApAmberLattice2.clear()
      for (const activeSessionId of [...ApMothHarbor32.keys()]) {
        ApOnyxPyre8(activeSessionId)
      }
    }
    ApBrokenHarbor75()
  }

  async function ApThornDrift74(ApScarletHarbor82 = ApHollowVeil52.value?.id) {
    if (!ApScarletHarbor82) return
    const ApMothLantern60 = await ApGaleVeil.get(ApScarletHarbor82, { silentGlobalFeedback: true })
    if (ApHollowVeil52.value?.id && ApHollowVeil52.value.id !== ApScarletHarbor82) return
    ApBrokenVeil83(ApMothLantern60)
  }

  function ApOnyxEmber76(ApScarletHarbor82: string) {
    if (!ApAmberLattice2.has(ApScarletHarbor82)) return
    if (ApMothHarbor32.has(ApScarletHarbor82) || ApIvoryDrift44.has(ApScarletHarbor82)) return
    const ApIvoryHarbor = window.setTimeout(() => {
      ApMothHarbor32.delete(ApScarletHarbor82)
      if (!ApAmberLattice2.has(ApScarletHarbor82)) {
        ApBrokenHarbor75()
        return
      }
      ApIvoryDrift44.add(ApScarletHarbor82)
      ApBrokenHarbor75()
      void ApThornDrift74(ApScarletHarbor82)
        .catch(() => {})
        .finally(() => {
          ApIvoryDrift44.delete(ApScarletHarbor82)
          if (
            ApAmberLattice2.has(ApScarletHarbor82)
            && ApHollowVeil52.value?.id === ApScarletHarbor82
            && ApHollowVeil52.value?.status === 'generating'
          ) {
            ApOnyxEmber76(ApScarletHarbor82)
          }
          ApBrokenHarbor75()
        })
    }, ApOnyxVeil56.aiInvocation.generationPollMs)
    ApMothHarbor32.set(ApScarletHarbor82, ApIvoryHarbor)
    ApBrokenHarbor75()
  }

  function ApMistyLattice76() {
    const ApScarletHarbor82 = ApHollowVeil52.value?.id
    if (!ApScarletHarbor82) return
    if (ApHollowVeil52.value?.status === 'generating') {
      ApAmberLattice2.add(ApScarletHarbor82)
      ApOnyxEmber76(ApScarletHarbor82)
      return
    }
    ApMothHarbor6()
  }

  function ApVineVeil1(ApScarletHarbor82: string, listener: (ApMothLantern60: ApIvoryLattice88) => void) {
    const ApMistyHarbor30 = ApAmberLattice38.get(ApScarletHarbor82) ?? []
    ApMistyHarbor30.push(listener)
    ApAmberLattice38.set(ApScarletHarbor82, ApMistyHarbor30)
    return () => {
      const current = ApAmberLattice38.get(ApScarletHarbor82)
      if (!current) return
      ApAmberLattice38.set(
        ApScarletHarbor82,
        current.filter((item) => item !== listener),
      )
    }
  }

  return {
    visible,
    loading,
    ApThornDrift81,
    error,
    ApHollowVeil52,
    ApThornShard34,
    ApEmberLattice25,
    ApCrimsonDrift48,
    ApIvoryVeil35,
    ApScarletLattice69,
    ApMothShard33,
    ApMothLattice51,
    ApBrokenLattice87,
    ApMistyHarbor9,
    ApSilentShard17,
    ApMothEmber30,
    ApEmberLantern75,
    ApGaleEmber10,
    ApMistyDrift95,
    ApMothLattice81,
    ApScarletPyre86,
    ApSilentDrift36,
    ApBrokenHarbor79,
    ImportMeta34,
    ApWanderingHarbor40,
    ApWanderingPyre92,
    ApIvoryLattice33,
    ApScarletLantern61,
    ApDuskyShard77,
    ApThornVeil37,
    ApAmberHarbor16,
    ApAmberPyre71,
    ApSilentLattice26,
    title,
    open,
    ApGaleDrift25,
    ApHollowShard41,
    ApGaleLantern84,
    allSettled,
    ApMistyVeil49,
    ApDuskyEmber68,
    ApVineEmber87,
    ApIvoryLattice2,
    ApMistyLantern44,
    ApHollowLattice61,
    close,
    ApMothHarbor6,
    ApVineVeil1,
  }
})
