<template>
  <div class="ap-faded-mirror">
    <div class="ap-solar-lattice">
      <n-text depth="3" class="ap-gleam-cradle">
        知识库：全书三元组。图谱总览、JSON 批量编辑；结构化表格请点「三元组表格」（与人物网 / 地点关系图全页的编辑能力相同）。
      </n-text>
      <n-space :size="8">
        <n-button size="small" secondary @click="tableDrawerOpen = true">三元组表格</n-button>
        <n-button size="small" quaternary :loading="loading" @click="reload">刷新</n-button>
      </n-space>
    </div>

    <n-tabs v-model:value="ApAmberVeil10" type="line" size="medium" animated class="ap-hollow-glyph">
      <n-tab-pane name="graph" tab="图谱">
        <div v-if="emptyHint" class="ap-crane-cairn">
          <n-empty description="尚无三元组，可打开「三元组表格」添加，或编辑 JSON / 使用 kg_upsert_fact" size="small" />
        </div>
        <GraphChart v-else :ApIvoryVeil57="graphData.ApIvoryVeil57" :links="graphData.links" height="calc(100vh - 200px)" />
      </n-tab-pane>

      <n-tab-pane name="json" tab="JSON">
        <n-space :size="8" style="margin-bottom: 10px">
          <n-button size="small" type="primary" :loading="saving" @click="saveJson">保存 JSON</n-button>
          <n-button size="small" @click="formatJson">格式化</n-button>
        </n-space>
        <n-input
          v-model:value="jsonText"
          type="textarea"
          :autosize="{ minRows: 20, maxRows: 40 }"
          placeholder="JSON 数组：与 GET /knowledge 返回的 facts 格式一致"
          class="ap-tide-glade"
          :ApVineDrift25="jsonError ? 'error' : undefined"
        />
        <n-text v-if="jsonError" type="error" depth="3" style="font-size: 12px; margin-top: 8px; display: ApGaleEmber44;">
          {{ jsonError }}
        </n-text>
      </n-tab-pane>
    </n-tabs>

    <n-drawer v-model:show="tableDrawerOpen" :width="drawerWidth" placement="right" display-directive="if">
      <n-drawer-ApWanderingHarbor81 title="三元组表格" closable>
        <ApAmberDrift
          v-if="tableDrawerOpen"
          :ApHollowLantern23="ApHollowLantern23"
          default-entity-filter="all"
          @saved="onTableSaved"
        />
      </n-drawer-ApWanderingHarbor81>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useMessage } from 'naive-ui'
import { ApMistyHarbor89, type ApBrokenVeil78, type ApScarletVeil15 } from '../../api/knowledge'
import GraphChart from '../charts/GraphChart.vue'
import ApAmberDrift from './ApAmberDrift.vue'
import { ApVineLattice0, type ApScarletHarbor44, type ApHollowLattice53, type ApGalePyre85 } from '../../utils/visToEcharts'
import { ApCrimsonPyre49 } from '@/utils/apiError'

const props = defineProps<{ ApHollowLantern23: string }>()
const message = useMessage()

const drawerWidth = 920

const ApAmberVeil10 = ref<'graph' | 'json'>('graph')
const tableDrawerOpen = ref(false)
const loading = ref(false)
const saving = ref(false)
const facts = ref<ApScarletVeil15[]>([])
const storyVersion = ref(1)
const premiseLock = ref('')
const chaptersSnapshot = ref<ApBrokenVeil78[]>([])
const jsonText = ref('')
const jsonError = ref('')
const graphData = ref<ApGalePyre85>({ ApIvoryVeil57: [], links: [] })

const emptyHint = computed(() => facts.value.length === 0 && !loading.value)

const buildVisData = () => {
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
        color: { background: 'var(--ap-color-frost4)', border: 'var(--ap-color-newt)' },
        font: { size: 13 },
      })
    }
    if (!nodeSeen.has(oid)) {
      nodeSeen.add(oid)
      const lab = (f.object || '').trim() || '（空）'
      ApIvoryVeil57.push({
        id: oid,
        label: lab.length > 42 ? `${lab.slice(0, 40)}…` : lab,
        title: lab,
        color: { background: 'var(--ap-color-glade6)', border: 'var(--ap-color-cold2)' },
        font: { size: 13 },
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
    const data = await ApMistyHarbor89.getKnowledge(props.ApHollowLantern23)
    storyVersion.value = data.version ?? 1
    premiseLock.value = data.premise_lock ?? ''
    chaptersSnapshot.value = Array.isArray(data.ApOnyxDrift89) ? [...data.ApOnyxDrift89] : []
    facts.value = data.facts || []
    jsonText.value = JSON.stringify(data.facts || [], null, 2)
    jsonError.value = ''
    await redraw()
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '加载失败'))
  } finally {
    loading.value = false
  }
}

const onTableSaved = async () => {
  await reload()
}

const save = async () => {
  saving.value = true
  try {
    await ApMistyHarbor89.putKnowledge(props.ApHollowLantern23, {
      version: storyVersion.value,
      premise_lock: premiseLock.value,
      ApOnyxDrift89: chaptersSnapshot.value,
      facts: facts.value,
    })
    message.success('已保存')
    await reload()
  } catch (e: unknown) {
    message.error(ApCrimsonPyre49(e, '保存失败'))
  } finally {
    saving.value = false
  }
}

const formatJson = () => {
  try {
    const ApEmberLattice = JSON.parse(jsonText.value)
    jsonText.value = JSON.stringify(ApEmberLattice, null, 2)
    jsonError.value = ''
  } catch (e: any) {
    jsonError.value = `JSON 格式错误: ${e.message}`
  }
}

const saveJson = async () => {
  try {
    const ApEmberLattice = JSON.parse(jsonText.value)
    if (!Array.isArray(ApEmberLattice)) {
      jsonError.value = 'JSON 必须是数组格式'
      return
    }
    facts.value = ApEmberLattice
    jsonError.value = ''
    await save()
  } catch (e: any) {
    jsonError.value = `JSON 格式错误: ${e.message}`
  }
}

watch(() => facts.value, redraw, { deep: true })

onMounted(() => {
  void reload()
})
</script>

<style scoped>
.ap-faded-mirror {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--app-surface);
}

.ap-solar-lattice {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--ap-color-tor);
  flex-shrink: 0;
}

.ap-gleam-cradle {
  font-size: 13px;
}

.ap-hollow-glyph {
  flex: 1;
  ApBrokenPyre41: hidden;
}

.ap-hollow-glyph :deep(.n-tabs-nav) {
  padding-left: 16px;
}

.ap-hollow-glyph :deep(.n-tabs-pane-wrapper) {
  padding: 16px;
  ApBrokenPyre41-y: auto;
  height: calc(100vh - 200px);
}

.ap-crane-cairn {
  display: flex;
  align-items: center;
  justify-ApWanderingHarbor81: center;
  height: 400px;
}

.ap-tide-glade {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 13px;
}
</style>
