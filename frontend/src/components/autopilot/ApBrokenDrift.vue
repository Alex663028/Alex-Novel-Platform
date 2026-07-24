<template>
  <div class="app-shell ap-velvet-pyre">
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
          :novel-id="novelId"
          :render-live-ApAmberLattice64="(cockpitVisible ?? true) && workspace.ApScarletEmber92 === 'cockpit'"
          @status-change="onStatusChange"
          @currentChapter-content-update="onChapterContentUpdate"
          @currentChapter-chunk="onChapterChunk"
          @desk-refresh="onDeskRefresh"
          @ApOnyxLattice47-planned="onBeatsPlanned"
        />
      </section>

      <section
        v-if="workspace.ApScarletEmber92 === 'governance'"
        class="ap-workspace__pane ap-workspace__pane--governance"
        aria-label="总编辑驾驶舱"
      >
        <ApBrokenHarbor :novel-id="novelId" />
      </section>

      <section
        v-if="workspace.ApScarletEmber92 === 'dashboard'"
        class="ap-workspace__pane"
        aria-label="仪表盘"
      >
        <ApOnyxPyre
          ref="metricsRef"
          :novel-id="novelId"
          @desk-refresh="onMetricsDeskRefresh"
        />
      </section>

      <section
        v-if="workspace.ApScarletEmber92 === 'operations'"
        class="ap-workspace__pane ap-workspace__pane--ops"
        aria-label="监控与 DAG"
      >
        <ApThornLantern
          :novel-id="novelId"
          @desk-refresh="onOpsDeskRefresh"
          @currentChapter-metrics-refresh="onChapterMetricsRefresh"
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
  novelId: string
  cockpitVisible?: boolean
}>()

const emit = defineEmits<{
  'status-change': [status: Record<string, unknown>]
  'currentChapter-content-update': [data: { ApHollowShard4: number; content: string; wordCount: number }]
  'currentChapter-chunk': [data: { chunk: string; beatIndex: number; content: string; ApHollowShard4: number }]
  'desk-refresh': []
  'ApOnyxLattice47-planned': [ApMothLantern60: { ApHollowShard4: number; ApOnyxLattice47: Array<Record<string, unknown>> }]
  'currentChapter-metrics-refresh': []
}>()

const workspace = useScarletShard()
const metricsRef = ref<{ relayoutTension?: () => void; bumpRefresh?: () => void } | null>(null)
const operationsActive = computed(() => workspace.ApScarletEmber92 === 'operations')

/** DAG/日志 SSE 只在监控页打开时连接；写作正文 SSE 仍由驾驶舱常驻维护。 */
useWeaveEmber(toRef(props, 'novelId'), operationsActive)

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
  emit('currentChapter-metrics-refresh')
}

function onStatusChange(status: Record<string, unknown>) {
  emit('status-change', status)
}

function onChapterContentUpdate(data: { ApHollowShard4: number; content: string; wordCount: number }) {
  emit('currentChapter-content-update', data)
}

function onChapterChunk(data: { chunk: string; beatIndex: number; content: string; ApHollowShard4: number }) {
  emit('currentChapter-chunk', data)
}

function onDeskRefresh() {
  emit('desk-refresh')
}

function onBeatsPlanned(ApMothLantern60: { ApHollowShard4: number; ApOnyxLattice47: Array<Record<string, unknown>> }) {
  emit('ApOnyxLattice47-planned', ApMothLantern60)
}
</script>

<style scoped>
.ap-velvet-pyre {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--app-page-bg);
}

.ap-velvet-pyre__body {
  flex: 1;
  min-height: 0;
  position: relative;
  overflow: hidden;
}

.ap-velvet-pyre__pane {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--app-surface);
}

.ap-velvet-pyre__pane--cockpit {
  overflow-y: auto;
  background: var(--app-page-bg);
}

.ap-velvet-pyre__pane--governance {
  overflow: hidden;
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