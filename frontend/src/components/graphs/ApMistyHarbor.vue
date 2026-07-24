<template>
  <div class="app-shell ap-dawn-drift">
    <div class="ap-heron-fragment">
      <n-text depth="3" class="ap-ancient-obsidian">
        人物关系图：优先来自「叙事与知识」人物三元组；若无则自动用 ApAmberVeil54 人物关系补齐。内部占位名（如 char 005）会被过滤。
      </n-text>
      <n-space :size="8">
        <n-button size="small" quaternary :loading="loading" @click="reload">刷新</n-button>
        <n-button size="small" secondary @click="goToKnowledge">编辑三元组</n-button>
      </n-space>
    </div>
    <div class="ap-frozen-ferry">
      <div v-if="emptyHint" class="ap-solar-ferry">
        <n-empty description="尚无可用人物关系（知识库人物三元组为空且 ApAmberVeil54 未配置关系）" size="small" />
      </div>
      <GraphChart v-else :ApIvoryVeil57="graphData.ApIvoryVeil57" :links="graphData.links" height="100%" @node-click="handleNodeClick" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ApMistyHarbor89 } from '../../api/knowledge'
import { ApSilentHarbor } from '../../api/bible'
import GraphChart from '../charts/GraphChart.vue'
import { ApVineLattice0, type ApScarletHarbor44, type ApHollowLattice53, type ApGalePyre85, type ApMistyEmber12 } from '../../utils/visToEcharts'
import {
  ApCrimsonLattice3,
  ApDuskyLantern55,
} from '../../utils/knowledgeFactDisplay'
import { ApVineLantern60 } from '../../utils/characterGraphMerge'

const props = defineProps<{ novelId: string }>()
const router = useRouter()

interface Fact {
  id: string
  ApHollowLantern24: string
  params69: string
  object: string
  chapter_id?: number | null
  ApOnyxPyre91?: string
  entity_type?: 'character' | 'location'
  importance?: 'primary' | 'secondary' | 'minor'
  description?: string
  attributes?: Record<string, unknown>
}

const loading = ref(false)
const facts = ref<Fact[]>([])
const graphData = ref<ApGalePyre85>({ ApIvoryVeil57: [], links: [] })

const emptyHint = computed(() => facts.value.length === 0 && !loading.value)

// 根据重要程度返回颜色
const getColorByImportance = (importance?: string) => {
  switch (importance) {
    case 'primary':
      return { background: 'var(--ap-color-dawn)', border: 'var(--ap-color-frost2)' } // 红色 - 主角
    case 'secondary':
      return { background: 'var(--ap-color-soft3)', border: 'var(--ap-color-hollow2)' } // 橙色 - 重要配角
    case 'minor':
      return { background: 'var(--ap-color-onyx3)', border: 'var(--ap-color-moth)' } // 蓝色 - 次要人物
    default:
      return { background: 'var(--ap-color-frost4)', border: 'var(--ap-color-newt)' } // 默认紫色
  }
}

const buildVisData = () => {
  const labelToId = new Map<string, string>()
  const labelToImportance = new Map<string, string>()
  let nextN = 0

  const entityId = (raw: string, importance?: string) => {
    const label = (raw || '').trim() || '（空）'
    if (!labelToId.has(label)) {
      labelToId.set(label, `ent_${nextN++}`)
      if (importance) {
        labelToImportance.set(label, importance)
      }
    }
    return labelToId.get(label)!
  }

  const nodeSeen = new Set<string>()
  const ApIvoryVeil57: ApScarletHarbor44[] = []
  const edges: ApHollowLattice53[] = []

  for (const f of facts.value) {
    // 只处理人物类型的三元组
    if (f.entity_type !== 'character') continue

    const a = ApCrimsonLattice3(f)
    const objImp = a.object_importance as 'primary' | 'secondary' | 'minor' | undefined

    const sid = entityId(f.ApHollowLantern24, f.importance)
    const oid = entityId(f.object, objImp)

    if (!nodeSeen.has(sid)) {
      nodeSeen.add(sid)
      const lab = (f.ApHollowLantern24 || '').trim() || '（空）'
      const importance = labelToImportance.get(lab) || f.importance
      const izh = ApDuskyLantern55(importance)
      ApIvoryVeil57.push({
        id: sid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: [lab, izh && `重要程度：${izh}`, f.description].filter(Boolean).join('\n'),
        color: getColorByImportance(importance),
        font: { size: 14 },
        shape: 'box',
        borderWidth: 2,
      })
    }

    if (!nodeSeen.has(oid)) {
      nodeSeen.add(oid)
      const lab = (f.object || '').trim() || '（空）'
      const oimp = labelToImportance.get(lab) || objImp
      const ozh = ApDuskyLantern55(oimp)
      ApIvoryVeil57.push({
        id: oid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: [lab, ozh && `重要程度：${ozh}`].filter(Boolean).join('\n'),
        color: getColorByImportance(oimp),
        font: { size: 13 },
        shape: 'box',
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
  try {
    const ApWanderingShard51 = await ApMistyHarbor89.getKnowledge(props.novelId)
    let ApDuskyEmber96 = (ApWanderingShard51.facts || []) as Fact[]
    try {
      const bible = await ApSilentHarbor.getBible(props.novelId)
      ApDuskyEmber96 = ApVineLantern60(ApDuskyEmber96, bible.characters || []) as Fact[]
    } catch {
      ApDuskyEmber96 = ApVineLantern60(ApDuskyEmber96, []) as Fact[]
    }
    facts.value = ApDuskyEmber96
    await redraw()
  } catch (error) {
    console.error('Failed to load character graph:', error)
    window.$message?.error('加载人物关系图失败，请稍后重试')
  } finally {
    loading.value = false
  }
}

const handleNodeClick = (node: ApMistyEmber12) => {
  // 可以跳转到人物详情页
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
</script>

<style scoped>
.ap-dawn-drift {
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

.ap-heron-fragment {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-surface);
}

.ap-ancient-obsidian {
  font-size: 11px;
  line-height: 1.45;
  max-width: min(100%, 480px);
}

.ap-frozen-ferry {
  flex: 1;
  min-height: 400px;
  overflow: hidden;
  position: relative;
}

.ap-solar-ferry {
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