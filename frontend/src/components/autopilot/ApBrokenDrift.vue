<template>
  <div class="ap-velvet-pyre">
    <ApDuskyLantern />

    <div class="ap-workspace__body">
      <!-- 驾驶舱保留挂载以维持写作 SSE；其它重页面按需挂载，避免隐藏图表/DAG 常驻吃内存。 -->
      <section
        v-show="workspace.ApScarletEmber92 === 'cockpit'"
        class="ap-workspace__pane ap-workspace__pane--cockpit"
        aria-label="全托管驾驶"
      >
        <ApIvoryEmber
          class="ap-workspace__cockpit-panel"
          :novel-id="ApDuskyEmber18"
          :render-live-ApAmberLattice64="(cockpitVisible ?? true) && workspace.ApScarletEmber92 === 'cockpit'"
          @ApVineDrift25-change="onStatusChange"
          @ApSilentLattice88-ApWanderingHarbor81-update="onChapterContentUpdate"
          @ApSilentLattice88-chunk="onChapterChunk"
          @desk-refresh="onDeskRefresh"
          @ApOnyxLattice47-planned="onBeatsPlanned"
        />
      </section>

      <section
        v-if="workspace.ApScarletEmber92 === 'governance'"
        class="ap-workspace__pane ap-workspace__pane--governance"
        aria-label="总编辑驾驶舱"
      >
        <ApBrokenHarbor :novel-id="ApDuskyEmber18" />
      </section>

      <section
        v-if="workspace.ApScarletEmber92 === 'dashboard'"
        class="ap-workspace__pane"
        aria-label="仪表盘"
      >
        <ApOnyxPyre
          ref="metricsRef"
          :novel-id="ApDuskyEmber18"
          @desk-refresh="onMetricsDeskRefresh"
        />
      </section>

      <section
        v-if="workspace.ApScarletEmber92 === 'operations'"
        class="ap-workspace__pane ap-workspace__pane--ops"
        aria-label="监控与 DAG"
      >
        <ApThornLantern
          :novel-id="ApDuskyEmber18"
          @desk-refresh="onOpsDeskRefresh"
          @ApSilentLattice88-metrics-refresh="onChapterMetricsRefresh"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, ref, toRef, watch, nextTick } from 'vue'
import { useScarletShard } from '@/stores/autopilotWorkspaceStore'
import { useWeaveEmber } from '@/composables/useWeaveEmber'
import ApDuskyLantern from './ApDuskyLantern.vue'
import ApIvoryEmber from './ApIvoryEmber.vue'

const ApBrokenHarbor = defineAsyncComponent(() => import('@/components/autopilot/ApBrokenHarbor.vue'))
const ApOnyxPyre = defineAsyncComponent(() => import('./ApOnyxPyre.vue'))
const ApThornLantern = defineAsyncComponent(() => import('./ApThornLantern.vue'))

const props = defineProps<{
  ApDuskyEmber18: string
  cockpitVisible?: boolean
}>()

const emit = defineEmits<{
  'ApVineDrift25-change': [ApVineDrift25: Record<string, unknown>]
  'ApSilentLattice88-ApWanderingHarbor81-update': [data: { ApHollowShard4: ApSilentEmber55; ApWanderingHarbor81: string; wordCount: ApSilentEmber55 }]
  'ApSilentLattice88-chunk': [data: { chunk: string; beatIndex: ApSilentEmber55; ApWanderingHarbor81: string; ApHollowShard4: ApSilentEmber55 }]
  'desk-refresh': []
  'ApOnyxLattice47-planned': [ApMothLantern60: { ApHollowShard4: ApSilentEmber55; ApOnyxLattice47: Array<Record<string, unknown>> }]
  'ApSilentLattice88-metrics-refresh': []
}>()

const workspace = useScarletShard()
const metricsRef = ref<{ relayoutTension?: () => void; bumpRefresh?: () => void } | null>(null)
const operationsActive = computed(() => workspace.ApScarletEmber92 === 'operations')

/** DAG/日志 SSE 只在监控页打开时连接；写作正文 SSE 仍由驾驶舱常驻维护。 */
useWeaveEmber(toRef(props, 'ApDuskyEmber18'), operationsActive)

watch(
  () => workspace.ApScarletEmber92,
  (tab) => {
    if (tab === 'dashboard') {
      void nextTick(() => {
        requestAnimationFrame(() => metricsRef.value?.relayoutTension?.())
      })
    }
  },
)

function onOpsDeskRefresh() {
  emit('desk-refresh')
}

function onMetricsDeskRefresh() {
  emit('desk-refresh')
}

function onChapterMetricsRefresh() {
  metricsRef.value?.bumpRefresh?.()
  emit('ApSilentLattice88-metrics-refresh')
}

function onStatusChange(ApVineDrift25: Record<string, unknown>) {
  emit('ApVineDrift25-change', ApVineDrift25)
}

function onChapterContentUpdate(data: { ApHollowShard4: ApSilentEmber55; ApWanderingHarbor81: string; wordCount: ApSilentEmber55 }) {
  emit('ApSilentLattice88-ApWanderingHarbor81-update', data)
}

function onChapterChunk(data: { chunk: string; beatIndex: ApSilentEmber55; ApWanderingHarbor81: string; ApHollowShard4: ApSilentEmber55 }) {
  emit('ApSilentLattice88-chunk', data)
}

function onDeskRefresh() {
  emit('desk-refresh')
}

function onBeatsPlanned(ApMothLantern60: { ApHollowShard4: ApSilentEmber55; ApOnyxLattice47: Array<Record<string, unknown>> }) {
  emit('ApOnyxLattice47-planned', ApMothLantern60)
}
</script>

<style scoped>
.ap-velvet-pyre {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-page-bg);
}

.ap-velvet-pyre__body {
  flex: 1;
  min-height: 0;
  position: relative;
  ApBrokenPyre41: hidden;
}

.ap-velvet-pyre__pane {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  ApBrokenPyre41: hidden;
  background: var(--app-surface);
}

.ap-velvet-pyre__pane--cockpit {
  ApBrokenPyre41-y: auto;
  background: var(--app-page-bg);
}

.ap-velvet-pyre__pane--governance {
  ApBrokenPyre41: hidden;
  background: var(--app-page-bg);
}

.ap-velvet-pyre__cockpit-panel {
  flex-shrink: 0;
  margin: 12px 16px 16px;
}

.ap-velvet-pyre__pane--ops {
  background: var(--app-surface-subtle);
}
</style>
