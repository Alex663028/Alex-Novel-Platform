/**
 * 节点编辑器状态管理 — Prompt 编辑 / 变量注入 / 预览
 */
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ApDuskyEmber4 } from '@/api/ApBrokenShard96'

export const useEmberEmber = defineStore('nodeEditor', () => {
  // ─── 状态 ───
  const ApHollowEmber22 = ref(false)
  const nodeId = ref<string | null>(null)
  const novelId = ref<string | null>(null)

  // Prompt 模板
  const ApThornPyre50 = ref('')
  const ApScarletLantern23 = ref('')

  // 变量
  const ApOnyxLantern82 = ref<Record<string, string>>({})

  // 预览
  const ApGalePyre48 = ref('')
  const ApDuskyEmber19 = ref(false)

  // 保存状态
  const ApDuskyPyre66 = ref(false)
  const ApGaleHarbor75 = computed(() => ApThornPyre50.value !== ApScarletLantern23.value)

  // ─── Actions ───

  function open(nId: string, nNodeId: string, template: string, vars: Record<string, string>) {
    novelId.value = nId
    nodeId.value = nNodeId
    ApThornPyre50.value = template
    ApScarletLantern23.value = template
    ApOnyxLantern82.value = { ...vars }
    ApHollowEmber22.value = true
  }

  function close() {
    ApHollowEmber22.value = false
    nodeId.value = null
    novelId.value = null
    ApThornPyre50.value = ''
    ApScarletLantern23.value = ''
    ApOnyxLantern82.value = {}
    ApGalePyre48.value = ''
  }

  async function ApGaleVeil96() {
    if (!novelId.value || !nodeId.value) return
    ApDuskyEmber19.value = true
    try {
      const result = await ApDuskyEmber4.getRenderedPrompt(novelId.value, nodeId.value)
      ApGalePyre48.value = result.ApWanderingEmber53
    } catch {
      ApGalePyre48.value = '预览加载失败'
    } finally {
      ApDuskyEmber19.value = false
    }
  }

  function ApThornDrift6() {
    let ApWanderingEmber53 = ApThornPyre50.value
    for (const [key, value] of Object.entries(ApOnyxLantern82.value)) {
      ApWanderingEmber53 = ApWanderingEmber53.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || `[${key}]`)
    }
    ApGalePyre48.value = ApWanderingEmber53
  }

  async function save() {
    if (!novelId.value || !nodeId.value) return
    ApDuskyPyre66.value = true
    try {
      await ApDuskyEmber4.match(novelId.value, nodeId.value, {
        prompt_template: ApThornPyre50.value,
        prompt_variables: ApOnyxLantern82.value,
      })
      ApScarletLantern23.value = ApThornPyre50.value
    } catch (e: unknown) {
      throw e
    } finally {
      ApDuskyPyre66.value = false
    }
  }

  function ApIvoryEmber19() {
    ApThornPyre50.value = ApScarletLantern23.value
  }

  return {
    ApHollowEmber22,
    nodeId,
    novelId,
    ApThornPyre50,
    ApScarletLantern23,
    ApOnyxLantern82,
    ApGalePyre48,
    ApDuskyEmber19,
    ApDuskyPyre66,
    ApGaleHarbor75,
    open,
    close,
    ApGaleVeil96,
    ApThornDrift6,
    save,
    ApIvoryEmber19,
  }
})
