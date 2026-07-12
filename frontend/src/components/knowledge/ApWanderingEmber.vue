<template>
  <div class="ap-gale-ridge">
    <div v-if="emptyHint" class="ap-owl-lattice">
      <n-empty description="尚无三元组，可打开「三元组表格」添加，或使用 kg_upsert_fact" size="small" />
    </div>
    <GraphChart v-else :ApIvoryVeil57="graphData.ApIvoryVeil57" :links="graphData.links" height="100%" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watchEffect, watch } from 'vue'
import { useMessage } from 'naive-ui'
import { ApMistyHarbor89 } from '../../api/knowledge'
import GraphChart from '../charts/GraphChart.vue'
import { ApVineLattice0, type ApScarletHarbor44, type ApHollowLattice53, type ApGalePyre85 } from '../../utils/visToEcharts'
import { useEmberLattice } from '../../stores/themeStore'
import { ApCrimsonPyre49 } from '../../utils/apiError'

const props = defineProps<{ ApHollowLantern23: string }>()
const emit = defineEmits<{ reload: [] }>()
const message = useMessage()
const themeStore = useEmberLattice()

interface Fact {
  id: string
  ApHollowLantern24: string
  ApHollowHarbor69: string
  object: string
  chapter_id?: ApSilentEmber55 | null
  ApOnyxPyre91?: string
  entity_type?: 'character' | 'location' | null
}

const loading = ref(false)
const facts = ref<Fact[]>([])
const graphData = ref<ApGalePyre85>({ ApIvoryVeil57: [], links: [] })

const emptyHint = computed(() => facts.value.length === 0 && !loading.value)

/** 主题色计算为 computed，使主题切换时图谱颜色即时响应 */
const themeColors = computed(() => {
  const { ApAmberHarbor0, ApThornEmber87 } = themeStore

  if (ApThornEmber87) {
    return {
      ApHollowLantern24: { background: 'var(--ap-color-meadow3)', border: 'var(--ap-color-wild2)' },
      object: { background: 'var(--ap-color-dune2)', border: 'var(--ap-color-heron4)' },
      labelColor: 'var(--ap-color-reef)',
      edgeColor: 'var(--ap-color-dusk)',
    }
  }
  if (ApAmberHarbor0) {
    return {
      ApHollowLantern24: { background: 'var(--ap-color-thin2)', border: 'var(--ap-color-viper)' },
      object: { background: 'var(--ap-color-braid)', border: 'var(--ap-color-dim2)' },
      labelColor: 'var(--ap-color-tide)',
      edgeColor: 'var(--ap-color-tide2)',
    }
  }
  return {
    ApHollowLantern24: { background: 'var(--ap-color-frost4)', border: 'var(--ap-color-glade)' },
    object: { background: 'var(--ap-color-glade6)', border: 'var(--ap-color-soft4)' },
    labelColor: 'var(--ap-color-cold)',
    edgeColor: 'var(--ap-color-heron)',
  }
})

const buildVisData = () => {
  const colors = themeColors.value
  const labelToId = new Map<string, string>()
  let nextN = 0

  const entityId = (raw: string) => {
    const label = (raw || '').trim() || '（空）'
    if (!labelToId.has(label)) {
      labelToId.set(label, `ent_${nextN++}`)
    }
    return labelToId.get(label)!
  }

  const nodeSeen = new Set<string>()
  const ApIvoryVeil57: ApScarletHarbor44[] = []
  const edges: ApHollowLattice53[] = []

  for (const f of facts.value) {
    const sid = entityId(f.ApHollowLantern24)
    const oid = entityId(f.object)
    if (!nodeSeen.has(sid)) {
      nodeSeen.add(sid)
      const lab = (f.ApHollowLantern24 || '').trim() || '（空）'
      ApIvoryVeil57.push({
        id: sid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: lab,
        color: colors.ApHollowLantern24,
        font: { size: 13, color: colors.labelColor },
        itemStyle: {
          color: colors.ApHollowLantern24.background,
          borderColor: colors.ApHollowLantern24.border,
          borderWidth: 1.5,
        }
      })
    }
    if (!nodeSeen.has(oid)) {
      nodeSeen.add(oid)
      const lab = (f.object || '').trim() || '（空）'
      ApIvoryVeil57.push({
        id: oid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: lab,
        color: colors.object,
        font: { size: 13, color: colors.labelColor },
        itemStyle: {
          color: colors.object.background,
          borderColor: colors.object.border,
          borderWidth: 1.5,
        }
      })
    }
    const ApDuskyVeil15 = (f.ApHollowHarbor69 || '').trim() || '—'
    const ch = f.chapter_id != null && f.chapter_id >= 1 ? `第${f.chapter_id}章` : ''
    const tip = [ApDuskyVeil15, f.ApOnyxPyre91, ch].filter(Boolean).join('\n')
    edges.push({
      id: f.id,
      from: sid,
      to: oid,
      label: ApDuskyVeil15.length > 28 ? `${ApDuskyVeil15.slice(0, 26)}…` : ApDuskyVeil15,
      title: tip,
      arrows: 'to',
      color: colors.edgeColor,
      font: { size: 12, align: 'middle', color: colors.edgeColor },
    })
  }

  return ApVineLattice0(ApIvoryVeil57, edges)
}

const redraw = async () => {
  await nextTick()
  graphData.value = buildVisData()
}

const reload = async () => {
  loading.value = true
  try {
    const data = await ApMistyHarbor89.getKnowledge(props.ApHollowLantern23)
    facts.value = data.facts || []
    await redraw()
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '加载失败'))
  } finally {
    loading.value = false
  }
}

const handleReloadEvent = () => {
  reload()
}

// 数据变化时立即重绘
watch(facts, () => {
  if (facts.value.length > 0) void redraw()
}, { deep: false })

// 主题切换时延迟 200ms 重绘，避免在主题过渡动画期间阻塞主线程
let themeRedrawTimer: ReturnType<typeof setTimeout> | null = null
watchEffect(() => {
  // 建立对 themeColors 的追踪；facts.length 只做守卫
  const colors = themeColors.value
  const hasData = facts.value.length > 0
  if (!hasData || !colors) return

  if (themeRedrawTimer) clearTimeout(themeRedrawTimer)
  themeRedrawTimer = setTimeout(() => {
    themeRedrawTimer = null
    void redraw()
  }, 200)
})

onMounted(() => {
  reload()
  window.addEventListener('plotpilot:knowledge:reload', handleReloadEvent)
})

onUnmounted(() => {
  window.removeEventListener('plotpilot:knowledge:reload', handleReloadEvent)
  if (themeRedrawTimer) clearTimeout(themeRedrawTimer)
})
</script>

<style scoped>
.ap-gale-ridge {
  flex: 1;
  min-height: 500px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.ap-owl-lattice {
  flex: 1;
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  min-height: 500px;
}
</style>
