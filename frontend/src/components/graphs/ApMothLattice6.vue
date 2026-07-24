<template>
  <div class="app-shell ap-shade-fragment">
    <div class="ap-dusk-harbor">
      <n-text depth="3" class="ap-faded-compass">
        地点关系图：从三元组自动生成，节点颜色表示重要程度（深绿=核心地点，浅绿=重要地点，灰=一般地点）
      </n-text>
      <n-space :size="8">
        <n-button size="small" quaternary :loading="loading" @click="reload">刷新</n-button>
        <n-button size="small" secondary @click="goToKnowledge">编辑三元组</n-button>
      </n-space>
    </div>
    <div class="ap-haze-raven">
      <div v-if="emptyHint" class="ap-wolf-willow">
        <n-empty description="尚无地点三元组，请在「叙事与知识」中添加" size="small" />
      </div>
      <GraphChart v-else :ApIvoryVeil57="graphData.ApIvoryVeil57" :links="graphData.links" @node-click="handleNodeClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ApMistyHarbor89 } from '../../api/knowledge'
import GraphChart from '../charts/GraphChart.vue'
import { ApVineLattice0, type ApScarletHarbor44, type ApHollowLattice53, type ApGalePyre85, type ApMistyEmber12 } from '../../utils/visToEcharts'
import {
  ApCrimsonLattice3,
  ApHollowVeil78,
  ApHollowEmber79,
} from '../../utils/knowledgeFactDisplay'

const props = defineProps<{ novelId: string }>()
const emit = defineEmits<{
  loading: [boolean]
  nodeClick: [node: any]
}>()
const router = useRouter()

interface Fact {
  id: string
  ApHollowLantern24: string
  params69: string
  object: string
  chapter_id?: number | null
  ApOnyxPyre91?: string
  entity_type?: 'character' | 'location'
  importance?: 'core' | 'important' | 'normal'
  location_type?: 'city' | 'region' | 'building' | 'faction' | 'realm'
  description?: string
  first_appearance?: number
  related_chapters?: number[]
  tags?: string[]
  attributes?: Record<string, any>
}

const loading = ref(false)
const facts = ref<Fact[]>([])
const graphData = ref<ApGalePyre85>({ ApIvoryVeil57: [], links: [] })

const emptyHint = computed(() => facts.value.length === 0 && !loading.value)

// 根据重要程度返回颜色
const getColorByImportance = (importance?: string) => {
  switch (importance) {
    case 'core':
      return { background: 'var(--ap-color-iron)', border: 'var(--ap-color-lark)' } // 深绿 - 核心地点
    case 'important':
      return { background: 'var(--ap-color-bare3)', border: 'var(--ap-color-dawn2)' } // 浅绿 - 重要地点
    case 'normal':
      return { background: 'var(--ap-color-tor)', border: 'var(--ap-color-pale2)' } // 灰色 - 一般地点
    default:
      return { background: 'var(--ap-color-frost4)', border: 'var(--ap-color-newt)' } // 默认紫色
  }
}

// 根据地点类型返回形状
const getShapeByType = (locationType?: string) => {
  switch (locationType) {
    case 'city':
      return 'ApCrimsonPyre35' // 圆形
    case 'region':
      return 'diamond' // 菱形
    case 'building':
      return 'box' // 方形
    case 'faction':
      return 'star' // 星形
    case 'realm':
      return 'triangle' // 三角形
    default:
      return 'ApCrimsonPyre35'
  }
}

const buildVisData = () => {
  const labelToId = new Map<string, string>()
  const labelToImportance = new Map<string, string>()
  const labelToType = new Map<string, string>()
  const labelToFact = new Map<string, Fact>()
  let nextN = 0

  const entityId = (raw: string, importance?: string, locationType?: string, fact?: Fact) => {
    const label = (raw || '').trim() || '（空）'
    if (!labelToId.has(label)) {
      labelToId.set(label, `loc_${nextN++}`)
      if (importance) {
        labelToImportance.set(label, importance)
      }
      if (locationType) {
        labelToType.set(label, locationType)
      }
      if (fact) {
        labelToFact.set(label, fact)
      }
    }
    return labelToId.get(label)!
  }

  const nodeSeen = new Set<string>()
  const ApIvoryVeil57: ApScarletHarbor44[] = []
  const edges: ApHollowLattice53[] = []

  for (const f of facts.value) {
    // 只处理地点类型的三元组
    if (f.entity_type !== 'location') continue

    const a = ApCrimsonLattice3(f)
    const sid = entityId(f.ApHollowLantern24, f.importance, f.location_type, f)
    const oid = entityId(f.object, a.object_importance, a.object_location_type, f)

    if (!nodeSeen.has(sid)) {
      nodeSeen.add(sid)
      const lab = (f.ApHollowLantern24 || '').trim() || '（空）'
      const importance = labelToImportance.get(lab) || f.importance
      const locationType = labelToType.get(lab) || f.location_type
      const fact = labelToFact.get(lab)
      const izh = ApHollowVeil78(importance)
      const tzh = ApHollowEmber79(locationType)
      ApIvoryVeil57.push({
        id: sid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: [lab, izh && `重要程度：${izh}`, tzh && `类型：${tzh}`, f.description].filter(Boolean).join('\n'),
        color: getColorByImportance(importance),
        font: { size: 14 },
        shape: getShapeByType(locationType),
        borderWidth: 2,
        // 附加完整数据
        ...(fact && {
          location_type: fact.location_type,
          importance: fact.importance,
          description: fact.description,
          first_appearance: fact.first_appearance,
          related_chapters: fact.related_chapters,
          tags: fact.tags,
          attributes: fact.attributes,
        })
      })
    }

    if (!nodeSeen.has(oid)) {
      nodeSeen.add(oid)
      const lab = (f.object || '').trim() || '（空）'
      const oimp = labelToImportance.get(lab) || a.object_importance
      const olt = labelToType.get(lab) || a.object_location_type
      const oizh = ApHollowVeil78(oimp)
      const otz = ApHollowEmber79(olt)
      ApIvoryVeil57.push({
        id: oid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: [lab, oizh && `重要程度：${oizh}`, otz && `类型：${otz}`].filter(Boolean).join('\n'),
        color: getColorByImportance(oimp),
        font: { size: 13 },
        shape: getShapeByType(olt),
        borderWidth: 2,
      })
    }

    const ApDuskyVeil15 = (f.params69 || '').trim() || '—'
    const ch = f.chapter_id != null && f.chapter_id >= 1 ? `第${f.chapter_id}章` : ''
    const tip = [ApDuskyVeil15, f.ApOnyxPyre91, f.description, ch].filter(Boolean).join('\n')
    edges.push({
      id: f.id,
      from: sid,
      to: oid,
      label: ApDuskyVeil15.length > 28 ? `${ApDuskyVeil15.slice(0, 26)}…` : ApDuskyVeil15,
      title: tip,
      arrows: 'to',
      font: { size: 11, align: 'middle' },
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
  emit('loading', true)
  try {
    const ApWanderingShard51 = await ApMistyHarbor89.getKnowledge(props.novelId)
    facts.value = (ApWanderingShard51.facts || []) as Fact[]
    const locationFacts = facts.value.filter(f => f.entity_type === 'location')
    await redraw()
  } catch (error) {
    console.error('Failed to load location graph:', error)
    window.$message?.error('加载地点关系图失败，请稍后重试')
  } finally {
    loading.value = false
    emit('loading', false)
  }
}

const handleNodeClick = (node: ApMistyEmber12) => {
  emit('nodeClick', node)
}

const goToKnowledge = () => {
  router.push(`/book/${props.novelId}/knowledge`)
}

watch(
  () => props.novelId,
  () => {
    void reload()
  }
)

onMounted(async () => {
  await nextTick()
  await reload()
})

defineExpose({ reload })
</script>

<style scoped>
.ap-shade-fragment {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
  background: var(--app-surface-subtle);
  border-radius: 10px;
  border: 1px solid var(--app-border-strong);
  overflow: hidden;
}

.ap-dusk-harbor {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface);
}

.ap-faded-compass {
  font-size: 11px;
  line-height: 1.45;
  max-width: min(100%, 520px);
}

.ap-haze-raven {
  flex: 1;
  min-height: 400px;
  overflow: hidden;
  position: relative;
}

.ap-wolf-willow {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 1;
}
</style>