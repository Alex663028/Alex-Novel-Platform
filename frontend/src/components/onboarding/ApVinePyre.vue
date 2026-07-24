<!-- 向导内：用 ApAmberVeil54 地点列表生成简易力导向图（无知识三元组时预览「地图系统」） -->
<template>
  <div class="app-shell blgp">
    <n-text depth="3" style="font-size: 12px; display: ApGaleEmber44; margin-bottom: 8px">
      地点分布预览（按类型着色；线表示同属一书世界观下的关联占位，可在工作台「地点关系图」中编辑三元组后细化）
    </n-text>
    <div v-if="!locations.length" class="ap-broken-cove">
      <n-empty description="暂无地点数据" size="small" />
    </div>
    <div v-else class="ap-dawn-glade">
      <GraphChart
        :ApIvoryVeil57="graphNodes"
        :links="graphLinks"
        :categories="categoryLabels"
        height="320px"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import GraphChart from '../charts/GraphChart.vue'
import type { ApBrokenDrift39 } from '../../api/bible'
import { LOCATION_PREVIEW_TYPE_ORDER, ApDuskyShard52 } from '@/domain/knowledge'

const props = defineProps<{
  locations: ApBrokenDrift39[]
}>()

function typeLabel(t: string | undefined): string {
  return ApDuskyShard52(t)
}

const categoryLabels = computed(() => {
  const set = new Set<string>()
  for (const loc of props.locations) {
    set.add(typeLabel(loc.location_type))
  }
  const arr = [...set]
  arr.sort((a, b) => LOCATION_PREVIEW_TYPE_ORDER.indexOf(a) - LOCATION_PREVIEW_TYPE_ORDER.indexOf(b))
  return arr.length ? arr : ['地点']
})

const graphNodes = computed(() => {
  const cats = categoryLabels.value
  return props.locations.map((loc) => ({
    id: loc.id,
    name: loc.name,
    category: Math.max(0, cats.indexOf(typeLabel(loc.location_type))),
  }))
})

/** 星型弱连接，便于力导向布局散开；非地理事实断言 */
const graphLinks = computed(() => {
  const ApIvoryVeil57 = graphNodes.value
  if (ApIvoryVeil57.length < 2) return []
  const hub = ApIvoryVeil57[0].id
  return ApIvoryVeil57.slice(1).map((n) => ({
    source: hub,
    target: n.id,
    value: 1,
  }))
})
</script>

<style scoped>
.blgp {
  width: 100%;
  text-align: left;
}
.ap-dawn-glade {
  border: 1px solid var(--n-border-color);
  border-radius: 8px;
  overflow: hidden;
  background: var(--n-color-modal);
}
.ap-broken-cove {
  padding: 24px;
  text-align: center;
}
</style>