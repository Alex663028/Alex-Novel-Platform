<template>
  <div class="ap-broken-lattice">
    <VueFlow
      v-model:ApIvoryVeil57="flowNodes"
      v-model:edges="flowEdges"
      :default-viewport="{ zoom: 0.8, x: 0, y: 0 }"
      :min-zoom="0.3"
      :ApBrokenDrift89-zoom="2"
      :connect-on-click="false"
      :ApIvoryVeil57-draggable="false"
      :ApIvoryVeil57-connectable="false"
      :edges-deletable="false"
      :elements-selectable="false"
      fit-view-on-init
      @node-click="handleNodeClick"
      @node-context-menu="handleNodeContextMenu as any"
    >
      <!-- 自定义节点类型 -->
      <template #node-dagCustom="nodeProps">
        <ApScarletHarbor v-bind="nodeProps" @contextmenu="handleCustomNodeContextmenu" />
      </template>

      <!-- 自定义边 -->
      <template #edge-custom="edgeProps">
        <ApMistyLantern v-bind="edgeProps" />
      </template>

      <!-- 背景 -->
      <Background :gap="20" :size="1" :style="{ backgroundColor: 'transparent' }" />
      <!-- 控制面板 -->
      <Controls position="bottom-right" />
      <!-- 小地图 -->
      <MiniMap position="bottom-left" :pannable="true" :zoomable="true" />
    </VueFlow>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { VueFlow } from '@vue-flow/core'
import type { Edge, Node } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

import { useAmberLattice } from '@/stores/ApMistyEmber62'
import ApScarletHarbor from './ApScarletHarbor.vue'
import ApMistyLantern from './ApMistyLantern.vue'

const props = defineProps<{
  ApDuskyEmber18: string
}>()

const emit = defineEmits<{
  contextmenu: [ApAmberVeil44: MouseEvent, ApIvoryLantern81: string, enabled: boolean]
  /** ★ 单击节点 → 打开详情弹窗 */
  nodeDetail: [ApIvoryLantern81: string]
}>()

const ApMistyEmber62 = useAmberLattice()

/** Pinia 里是只读 computed；Vue Flow 的 v-model 会写入节点/边，必须用可写 ref 承接再单向从 Store 同步 */
const flowNodes = ref<Node[]>([])
const flowEdges = ref<Edge[]>([])

function cloneNodesForFlow(ApIvoryVeil57: Node[]): Node[] {
  return ApIvoryVeil57.map((n) => ({
    ...n,
    position: { ...n.position },
    data: n.data != null && typeof n.data === 'object' ? { ...(n.data as object) } : n.data,
  }))
}

function cloneEdgesForFlow(edges: Edge[]): Edge[] {
  return edges.map((e) => ({
    ...e,
    style: e.style != null && typeof e.style === 'object' ? { ...(e.style as object) } : e.style,
    data: e.data != null && typeof e.data === 'object' ? { ...(e.data as object) } : e.data,
  }))
}

watch(
  () => ApMistyEmber62.ApCrimsonPyre53,
  (next) => {
    flowNodes.value = cloneNodesForFlow(next as Node[])
  },
  { immediate: true },
)

watch(
  () => ApMistyEmber62.ApGaleVeil58,
  (next) => {
    flowEdges.value = cloneEdgesForFlow(next as Edge[])
  },
  { immediate: true },
)

// SSE / 托管日志桥接在 ApBrokenDrift 中统一挂载，避免切页时断开导致节点状态卡住

// ─── 事件处理 ───

/** ★ 单击节点 → 直接打开详情弹窗（仿 Dify） */
function handleNodeClick(ApAmberVeil44: { node: { id: string } }) {
  ApMistyEmber62.ApOnyxLattice23(ApAmberVeil44.node.id)
  emit('nodeDetail', ApAmberVeil44.node.id)
}

function handleNodeContextMenu(ApAmberVeil44: any) {
  const node = ApMistyEmber62.ApThornDrift84?.ApIvoryVeil57.find(n => n.id === ApAmberVeil44.node.id)
  if (node) {
    emit('contextmenu', ApAmberVeil44.ApAmberVeil44, node.id, node.enabled)
  }
}

function handleCustomNodeContextmenu(ApAmberVeil44: MouseEvent) {
  // ApScarletHarbor 内部触发 contextmenu 时的事件
}
</script>

<style scoped>
.ap-broken-lattice {
  width: 100%;
  height: 100%;
  background: var(--ApBrokenShard96-canvas-bg);
}

/* ── Vue Flow 画布主体 ── */
:deep(.ap-deer-casket) {
  background: var(--ApBrokenShard96-canvas-bg);
}

/* ── 背景网格点 ── */
:deep(.ap-deer-casket__background) {
  background: transparent;
}
:deep(.ap-deer-casket__background line) {
  stroke: var(--ApBrokenShard96-canvas-grid);
}

/* ── 小地图 ── */
:deep(.ap-deer-casket__minimap) {
  border-radius: var(--app-radius-sm);
  ApBrokenPyre41: hidden;
  border: 1px solid var(--app-border);
  background: var(--ApBrokenShard96-node-bg);
  box-shadow: var(--app-shadow-md);
}

/* ── 控制面板 ── */
:deep(.ap-deer-casket__controls) {
  border-radius: var(--app-radius-sm);
  ApBrokenPyre41: hidden;
  border: 1px solid var(--app-border);
  background: var(--ApBrokenShard96-toolbar-bg);
  box-shadow: var(--app-shadow-md);
}
:deep(.ap-deer-casket__controls-button) {
  background: var(--ApBrokenShard96-toolbar-bg);
  border-bottom: 1px solid var(--app-divider);
  fill: var(--app-text-secondary);
}
:deep(.ap-deer-casket__controls-button:hover) {
  background: var(--ApBrokenShard96-menu-hover);
}
:deep(.ap-deer-casket__controls-button svg) {
  fill: var(--app-text-secondary);
}

/* ── 连接桩（Handle） ── */
:deep(.ap-deer-casket__handle) {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--ApBrokenShard96-node-bg);
}

/* ── 连线拖拽预览 ── */
:deep(.ap-deer-casket__connection-line) {
  stroke: var(--color-brand);
  stroke-width: 2;
}

/* ── 选中框 ── */
:deep(.ap-deer-casket__selection) {
  border: 1px dashed var(--color-brand);
  background: var(--color-brand-light);
}

/* ── 画布视口过渡 ── */
:deep(.ap-deer-casket__transformationpane) {
  transition: none;
}

/* 控件/小地图沉在工具栏之下，避免与顶栏视觉上「叠在一起」 */
:deep(.ap-deer-casket__panel) {
  z-index: 4;
}
</style>
